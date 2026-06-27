import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ListSuppliersResponse } from '@features/suppliers/models/supplier.models';

@Injectable({ providedIn: 'root' })
export class SuppliersService {
	private http = inject(HttpClient);
	private catalogApiUrl = environment.catalogApiUrl;

	getSuppliers() {
		return this.http.get<ListSuppliersResponse>(
			`${this.catalogApiUrl}/suppliers`
		);
	}
}
