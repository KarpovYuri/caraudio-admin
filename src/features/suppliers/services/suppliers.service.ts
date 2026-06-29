import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import {
	CreateSupplierRequest,
	CreateSupplierResponse,
	ListSuppliersResponse,
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
}
