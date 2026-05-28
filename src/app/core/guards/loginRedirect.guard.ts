import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services';

export const loginRedirectGuard: CanActivateFn = (): boolean | UrlTree => {
	const auth = inject(AuthService);
	const router = inject(Router);

	if (auth.isAuthenticated()) {
		return router.createUrlTree(['/catalog']);
	}

	return true;
};
