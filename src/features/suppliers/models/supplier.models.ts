export interface Supplier {
	id: number | string;
	name: string;
	code?: string;
	logo?: string;
	apiUrl?: string;
	isActive: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface ListSuppliersParams {
	page?: number;
	pageSize?: number;
}

export interface ListSuppliersResponse {
	suppliers: Supplier[];
	total: number;
	page: number;
	pageSize: number;
}

export interface CreateSupplierRequest {
	name: string;
	code?: string;
	logo?: string;
	apiUrl?: string;
	isActive: boolean;
}

export interface CreateSupplierResponse {
	supplier: Supplier;
}

export type UpdateSupplierRequest = CreateSupplierRequest;

export interface UpdateSupplierResponse {
	supplier: Supplier;
}

export interface UploadSupplierLogoResponse {
	supplier: Supplier;
}
