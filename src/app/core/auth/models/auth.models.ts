export interface LoginRequest {
	login: string;
	password: string;
}

export interface LoginResponse {
	user: {
		id: string;
		role: string;
	};
	accessToken: string;
}

export interface RefreshResponse {
	accessToken: string;
}
