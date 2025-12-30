import { Component, computed, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { AuthService } from '@core/services';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'app-auth.page',
	imports: [
		MatButton,
		MatCard,
		MatFormField,
		MatLabel,
		FormsModule,
		MatInput,
		MatCheckbox,
		TranslatePipe,
	],
	templateUrl: './auth.page.html',
	styleUrl: './auth.page.scss',
})
export class AuthPage {
	private auth = inject(AuthService);
	private router = inject(Router);

	login = signal('');
	password = signal('');
	remember = signal(false);

	loginValid = computed(() => this.login().length > 0);
	passwordValid = computed(() => this.password().length > 0);
	formValid = computed(() => this.loginValid() && this.passwordValid());

	async onLogin() {
		if (this.formValid()) {
			console.log('Форма отправлена:', {
				login: this.login(),
				password: this.password(),
				remember: this.remember(),
			});

			this.auth.login();
			await this.router.navigate(['/catalog']);
		}
	}
}
