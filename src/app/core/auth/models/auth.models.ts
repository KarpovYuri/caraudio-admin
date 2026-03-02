export interface LoginRequest {
	login: string;
	password: string;
	rememberMe: boolean;
}

export interface LoginResponse {
	user: {
		id: string;
		role: string;
	};
	accessToken: string;
	refreshToken: string;
}

export interface RefreshResponse {
	accessToken: string;
}
