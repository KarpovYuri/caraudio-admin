import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
	selector: 'app-page-title',
	imports: [TranslatePipe],
	templateUrl: './page-title.html',
	styleUrl: './page-title.scss',
	standalone: true,
})
export class PageTitle {
	titleKey = input.required<string>();
}
