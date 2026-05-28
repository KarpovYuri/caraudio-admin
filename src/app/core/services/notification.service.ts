import { Injectable, inject, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root',
})
export class NotificationService {
	private snackBar = inject(MatSnackBar);
	private injector = inject(Injector);

	showError(message: string): void {
		const translate = this.injector.get(TranslateService);
		this.snackBar.open(message, translate.instant('common.close'), {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
		});
	}

	showSuccess(message: string): void {
		const translate = this.injector.get(TranslateService);
		this.snackBar.open(message, translate.instant('common.ok'), {
			duration: 3000,
			horizontalPosition: 'end',
			verticalPosition: 'top',
		});
	}
}
