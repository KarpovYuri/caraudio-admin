import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);
	const token = authService.getToken();

	const isAuthRequest = req.url === '/login' || req.url.includes('/refresh');

	if (isAuthRequest) {
		return next(req);
	}

	let authReq = req;

	if (token) {
		authReq = req.clone({
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
