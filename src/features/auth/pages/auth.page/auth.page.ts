import { Component, inject } from '@angular/core';
import { AuthService } from '@core/services';
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';

@Component({
	selector: 'app-auth.page',
	imports: [MatButton],
	templateUrl: './auth.page.html',
})
export class AuthPage {
	private auth = inject(AuthService);
	private router = inject(Router);

	login() {
		this.auth.login();
		this.router.navigateByUrl('/catalog');
	}
}
