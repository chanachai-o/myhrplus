import { Component, Input, OnInit, ViewChild, OnDestroy, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from '@syncfusion/ej2-angular-navigations';
import {
  CarouselComponent as SyncfusionCarouselComponent
} from '@syncfusion/ej2-angular-navigations';

export interface CarouselItem {
  id?: string;
  template?: string;
  content?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

export interface CarouselConfig {
  items?: CarouselItem[];
  interval?: number;
  showIndicators?: boolean;
  showPlayButton?: boolean;
  showPreviousButton?: boolean;
  showNextButton?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  animationEffect?: 'Slide' | 'Fade' | 'None';
  slideTransition?: 'Slide' | 'Fade';
  partialVisible?: boolean;
  itemsCount?: number;
  cssClass?: string;
  enableTouchSwipe?: boolean;
  enableKeyboardNavigation?: boolean;
  enableRtl?: boolean;
  height?: string | number;
  width?: string | number;
  customClass?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, CarouselModule],
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('carousel', { static: false }) carousel!: SyncfusionCarouselComponent;

  // Data
  @Input() items: CarouselItem[] = [];
  @Input() config?: CarouselConfig;

  // Behavior
  @Input() interval: number = 3000;
  @Input() autoPlay: boolean = true;
  @Input() loop: boolean = true;
  @Input() animationEffect: 'Slide' | 'Fade' | 'None' = 'Slide';
  @Input() slideTransition: 'Slide' | 'Fade' = 'Slide';
  @Input() partialVisible: boolean = false;
  @Input() itemsCount: number = 1;

  // UI Controls
  @Input() showIndicators: boolean = true;
  @Input() showPlayButton: boolean = true;
  @Input() showPreviousButton: boolean = true;
  @Input() showNextButton: boolean = true;

  // Interaction
  @Input() enableTouchSwipe: boolean = true;
  @Input() enableKeyboardNavigation: boolean = true;
  @Input() enableRtl: boolean = false;

  // Appearance
  @Input() cssClass?: string;
  @Input() height: string | number = '400px';
  @Input() width: string | number = '100%';
  @Input() customClass?: string;

  // Events
  @Output() slideChanged = new EventEmitter<any>();
  @Output() play = new EventEmitter<any>();
  @Output() pause = new EventEmitter<any>();
  @Output() created = new EventEmitter<any>();

  private _currentIndex: number = 0;
  private _isPlaying: boolean = false;

  ngOnInit(): void {
    // Apply config if provided
    if (this.config) {
      this.items = this.config.items || this.items;
      this.interval = this.config.interval ?? this.interval;
      this.showIndicators = this.config.showIndicators ?? this.showIndicators;
      this.showPlayButton = this.config.showPlayButton ?? this.showPlayButton;
      this.showPreviousButton = this.config.showPreviousButton ?? this.showPreviousButton;
      this.showNextButton = this.config.showNextButton ?? this.showNextButton;
      this.autoPlay = this.config.autoPlay ?? this.autoPlay;
      this.loop = this.config.loop ?? this.loop;
      this.animationEffect = this.config.animationEffect ?? this.animationEffect;
      this.partialVisible = this.config.partialVisible ?? this.partialVisible;
      this.cssClass = this.config.cssClass ?? this.cssClass;
      this.enableTouchSwipe = this.config.enableTouchSwipe ?? this.enableTouchSwipe;
      this.enableRtl = this.config.enableRtl ?? this.enableRtl;
      this.height = this.config.height ?? this.height;
      this.width = this.config.width ?? this.width;
    }
  }

  ngAfterViewInit(): void {
    if (this.carousel) {
      this._isPlaying = this.autoPlay;
      this.created.emit({ carousel: this.carousel });
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Get carousel instance
   */
  getCarouselInstance(): SyncfusionCarouselComponent | null {
    return this.carousel || null;
  }

  /**
   * Navigate to next slide
   */
  next(): void {
    if (this.carousel) {
      this.carousel.next();
    }
  }

  /**
   * Navigate to previous slide
   */
  previous(): void {
    if (this.carousel) {
      this.carousel.prev();
    }
  }

  /**
   * Navigate to specific slide
   */
  goTo(index: number): void {
    if (this.carousel && index >= 0 && index < this.items.length) {
      this.carousel.selectedIndex = index;
      this._currentIndex = index;
    }
  }

  /**
   * Play carousel
   */
  playCarousel(): void {
    if (this.carousel) {
      this.carousel.play();
      this._isPlaying = true;
      this.play.emit({ carousel: this.carousel });
    }
  }

  /**
   * Pause carousel
   */
  pauseCarousel(): void {
    if (this.carousel) {
      this.carousel.pause();
      this._isPlaying = false;
      this.pause.emit({ carousel: this.carousel });
    }
  }

  /**
   * Toggle play/pause
   */
  togglePlayPause(): void {
    if (this._isPlaying) {
      this.pauseCarousel();
    } else {
      this.playCarousel();
    }
  }

  /**
   * Get current slide index
   */
  getCurrentIndex(): number {
    if (this.carousel) {
      return this.carousel.selectedIndex || 0;
    }
    return this._currentIndex;
  }

  /**
   * Get total slides count
   */
  getTotalSlides(): number {
    return this.items.length;
  }

  /**
   * Refresh carousel
   */
  refresh(): void {
    if (this.carousel) {
      this.carousel.refresh();
    }
  }

  /**
   * Event handlers
   */
  onSlideChanged(event: any): void {
    if (event && event.selectedIndex !== undefined) {
      this._currentIndex = event.selectedIndex;
    }
    this.slideChanged.emit(event);
  }

  onPlay(event: any): void {
    this._isPlaying = true;
    this.play.emit(event);
  }

  onPause(event: any): void {
    this._isPlaying = false;
    this.pause.emit(event);
  }

  onCreated(event: any): void {
    this.created.emit(event);
  }

  /**
   * Check if carousel is playing
   */
  isPlaying(): boolean {
    return this._isPlaying;
  }
}

