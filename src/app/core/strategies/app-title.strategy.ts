import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AppTitleStrategy extends TitleStrategy {
	private title = inject(Title);

	override updateTitle(snapshot: RouterStateSnapshot): void {
		const routTitle = this.buildTitle(snapshot);
		const baseTitle = this.title.getTitle()?.split('|')[0].trim();
		const newTitle = routTitle ? `${baseTitle} | ${routTitle}` : baseTitle;
		this.title.setTitle(newTitle);
	}
}
