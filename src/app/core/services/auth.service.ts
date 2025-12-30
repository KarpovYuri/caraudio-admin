import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private _isAuthenticated = signal(false);

	isAuthenticated() {
		return this._isAuthenticated();
	}

	login() {
		// тут позже будет реальный API
		this._isAuthenticated.set(true);
	}

	logout() {
		this._isAuthenticated.set(false);
	}
}
