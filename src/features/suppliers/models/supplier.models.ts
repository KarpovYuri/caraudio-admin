export interface Supplier {
	id: number;
	name: string;
	code?: string;
	logo?: string;
	apiUrl?: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface ListSuppliersResponse {
	suppliers: Supplier[];
}
