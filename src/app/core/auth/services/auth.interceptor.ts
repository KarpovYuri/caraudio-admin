import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const token = authService.getToken();

	let authReq = req.clone({
		withCredentials: true,
	});

	const isAuthRequest =
		req.url.includes('/login') || req.url.includes('/refresh');

	if (token && !isAuthRequest) {
		authReq = authReq.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	return next(authReq).pipe(
		catchError((err) => {
			if (isAuthRequest) {
				return throwError(() => err);
			}

			if (err.status === 401) {
				return authService.refresh().pipe(
					switchMap((res) => {
						const retryReq = req.clone({
							withCredentials: true,
							setHeaders: {
								Authorization: `Bearer ${res.accessToken}`,
							},
						});
						return next(retryReq);
					}),
					catchError((refreshErr) => {
						authService.clear();
						return throwError(() => refreshErr);
					})
				);
			}

			return throwError(() => err);
		})
	);
};
