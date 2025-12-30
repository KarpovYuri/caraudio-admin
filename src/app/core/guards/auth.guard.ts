import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '@core/services';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
	const auth = inject(AuthService);
	const router = inject(Router);

	if (!auth.isAuthenticated()) {
		return router.createUrlTree(['/']);
	}

	return true;
};
