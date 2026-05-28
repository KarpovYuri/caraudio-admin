import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '@core/services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
	const notify = inject(NotificationService);

	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			let message = 'Произошла непредвиденная ошибка';

			if (error.error instanceof ErrorEvent) {
				message = `Ошибка сети: ${error.error.message}`;
			} else {
				message = error.error?.message || `Ошибка сервера: ${error.status}`;

				if (error.status === 401 && !req.url.includes('/login')) {
					return throwError(() => error);
				}
			}

			notify.showError(message);
			return throwError(() => error);
		})
	);
};
