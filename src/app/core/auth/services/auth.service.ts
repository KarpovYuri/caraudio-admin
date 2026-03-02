import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshResponse } from '@core/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);

	private accessToken: string | null = null;
	private _isAuthenticated = signal<boolean>(false);
	public isAuthenticated = this._isAuthenticated.asReadonly();

	constructor() {
		const savedToken =
			localStorage.getItem('token') || sessionStorage.getItem('token');
		if (savedToken) {
			this.accessToken = savedToken;
			this._isAuthenticated.set(true);
		}
	}

	login(data: LoginRequest) {
		return this.http
			.post<LoginResponse>('http://localhost:8080/v1/auth/login', data, {
				withCredentials: true,
			})
			.pipe(
				tap((res) => {
					this.accessToken = res.accessToken;
					this._isAuthenticated.set(true);
					const storage = data.rememberMe ? localStorage : sessionStorage;
					storage.setItem('token', res.accessToken);
					storage.setItem('refreshToken', res.refreshToken);
				})
			);
	}

	refresh() {
		return this.http
			.post<RefreshResponse>(
				'http://localhost:8080/v1/auth/refresh',
				{},
				{ withCredentials: true }
			)
			.pipe(
				tap((res) => {
					this.accessToken = res.accessToken;
					this._isAuthenticated.set(true);
				})
			);
	}

	logout() {
		const refreshToken =
			localStorage.getItem('refreshToken') ||
			sessionStorage.getItem('refreshToken') ||
			'';
		return this.http
			.post(
				'http://localhost:8080/v1/auth/logout',
				{ refresh_token: refreshToken },
				{ withCredentials: true }
			)
			.pipe(finalize(() => this.clear()));
	}

	getToken() {
		return this.accessToken;
	}

	clear() {
		this.accessToken = null;
		this._isAuthenticated.set(false);
		localStorage.removeItem('token');
		sessionStorage.removeItem('token');
	}
}
