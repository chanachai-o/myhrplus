import { Component, ViewChild } from '@angular/core';
import { NgbCarouselConfig, NgbCarousel, NgbSlideEvent, NgbSlideEventSource, NgbCarouselModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-ngbd-buttons-radio',
	templateUrl: './carousel.component.html',
	providers: [NgbCarouselConfig],
  standalone: true,
  imports: [NgbCarouselModule, CommonModule, TranslateModule, FormsModule, NgbPaginationModule]
})
export class NgbdCarouselBasicComponent {
	showNavigationArrows = false;
	showNavigationIndicators = false;

	constructor(config: NgbCarouselConfig) {
		// customize default values of carousels used by this component tree
		config.interval = 10000;
		config.wrap = false;
		config.keyboard = false;

		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;
	}
	paused = false;
	unpauseOnArrow = false;
	pauseOnIndicator = false;
	pauseOnHover = true;

	@ViewChild('carousel', { static: true }) carousel: NgbCarousel = Object.create(null);

	togglePaused() {
		if (this.paused) {
			this.carousel.cycle();
		} else {
			this.carousel.pause();
		}
		this.paused = !this.paused;
	}

	onSlide(slideEvent: NgbSlideEvent) {
		if (this.unpauseOnArrow && slideEvent.paused &&
			(slideEvent.source === NgbSlideEventSource.ARROW_LEFT || slideEvent.source === NgbSlideEventSource.ARROW_RIGHT)) {
			this.togglePaused();
		}
		if (this.pauseOnIndicator && !slideEvent.paused && slideEvent.source === NgbSlideEventSource.INDICATOR) {
			this.togglePaused();
		}
	}
}
