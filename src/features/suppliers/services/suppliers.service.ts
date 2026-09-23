import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import {
	CreateSupplierRequest,
	CreateSupplierResponse,
	ListSuppliersResponse,
	UpdateSupplierRequest,
	UpdateSupplierResponse,
	UploadSupplierLogoResponse,
} from '@features/suppliers/models/supplier.models';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
	private http = inject(HttpClient);
	private catalogApiUrl = environment.catalogApiUrl;

	getSuppliers() {
		return this.http.get<ListSuppliersResponse>(
			`${this.catalogApiUrl}/suppliers`
		);
	}

	createSupplier(data: CreateSupplierRequest) {
		return this.http.post<CreateSupplierResponse>(
			`${this.catalogApiUrl}/suppliers`,
			data
		);
	}

	updateSupplier(supplierId: number | string, data: UpdateSupplierRequest) {
		return this.http.patch<UpdateSupplierResponse>(
			`${this.catalogApiUrl}/suppliers/${supplierId}`,
			data
		);
	}

	uploadLogo(supplierId: number | string, file: File) {
		const formData = new FormData();
		formData.append('logo', file);

		return this.http.post<UploadSupplierLogoResponse>(
			`${this.catalogApiUrl}/suppliers/${supplierId}/logo`,
			formData
		);
	}

	deleteSupplier(supplierId: number | string) {
		return this.http.delete<{ success: boolean }>(
			`${this.catalogApiUrl}/suppliers/${supplierId}`
		);
	}
}
