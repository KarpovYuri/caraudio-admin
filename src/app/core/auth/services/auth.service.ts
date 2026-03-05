import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { finalize, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RefreshResponse } from '@core/auth';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private http = inject(HttpClient);
	private apiUrl = environment.apiUrl;

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
			.post<LoginResponse>(`${this.apiUrl}/auth/login`, data)
			.pipe(
				tap((res) => {
					this.accessToken = res.accessToken;
					this._isAuthenticated.set(true);
					const storage = data.rememberMe ? localStorage : sessionStorage;
					storage.setItem('token', res.accessToken);
				})
			);
	}

	refresh() {
		return this.http
			.post<RefreshResponse>(
				`${this.apiUrl}/auth/refresh`,
				{},
				{ withCredentials: true }
			)
			.pipe(
				tap((res) => {
					this.accessToken = res.accessToken;
					this._isAuthenticated.set(true);
					const storage = localStorage.getItem('token')
						? localStorage
						: sessionStorage;
					storage.setItem('token', res.accessToken);
				})
			);
	}

	logout() {
		return this.http
			.post(`${this.apiUrl}/auth/logout`, {}, { withCredentials: true })
			.pipe(
				finalize(() => {
					this.clear();
				})
			);
	}

	getToken() {
		return this.accessToken;
	}

	clear() {
		localStorage.removeItem('token');
		sessionStorage.removeItem('token');
		this.accessToken = null;
		this._isAuthenticated.set(false);
	}
}
