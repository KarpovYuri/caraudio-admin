import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/auth';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const authService = inject(AuthService);

	const token = authService.getToken();

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
			if (err.status === 401) {
				return authService.refresh().pipe(
					switchMap(() => {
						const newToken = authService.getToken();

						const retryReq = req.clone({
							setHeaders: {
								Authorization: `Bearer ${newToken}`,
							},
						});

						return next(retryReq);
					}),
					catchError(() => {
						authService.clear();
						return throwError(() => err);
					})
				);
			}

			return throwError(() => err);
		})
	);
};
