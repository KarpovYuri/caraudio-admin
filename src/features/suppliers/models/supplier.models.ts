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

export interface ListSuppliersResponse {
	suppliers: Supplier[];
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

export interface UploadSupplierLogoResponse {
	supplier: Supplier;
}
