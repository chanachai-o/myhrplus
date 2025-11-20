import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent, CarouselItem } from '../../../../shared/components/carousel/carousel.component';
import { GlassCardComponent } from '../../../../shared/components/glass-card/glass-card.component';

@Component({
  selector: 'app-carousel-demo',
  standalone: true,
  imports: [CommonModule, CarouselComponent, GlassCardComponent],
  templateUrl: './carousel-demo.component.html',
  styleUrls: ['./carousel-demo.component.scss']
})
export class CarouselDemoComponent {
  @ViewChild('carousel') carousel!: CarouselComponent;

  // Sample carousel items
  carouselItems: CarouselItem[] = [
    {
      id: '1',
      title: 'Welcome to HR System',
      description: 'Manage your workforce efficiently with our comprehensive HR management system.',
      imageUrl: 'https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Slide+1',
      cssClass: 'slide-1'
    },
    {
      id: '2',
      title: 'Employee Management',
      description: 'Track employee information, attendance, and performance all in one place.',
      imageUrl: 'https://via.placeholder.com/800x400/10B981/FFFFFF?text=Slide+2',
      cssClass: 'slide-2'
    },
    {
      id: '3',
      title: 'Payroll Processing',
      description: 'Automate payroll calculations and generate reports with ease.',
      imageUrl: 'https://via.placeholder.com/800x400/F59E0B/FFFFFF?text=Slide+3',
      cssClass: 'slide-3'
    },
    {
      id: '4',
      title: 'Analytics & Reports',
      description: 'Get insights into your workforce with comprehensive analytics and reporting tools.',
      imageUrl: 'https://via.placeholder.com/800x400/EF4444/FFFFFF?text=Slide+4',
      cssClass: 'slide-4'
    },
    {
      id: '5',
      title: 'Training & Development',
      description: 'Manage employee training programs and track skill development progress.',
      imageUrl: 'https://via.placeholder.com/800x400/8B5CF6/FFFFFF?text=Slide+5',
      cssClass: 'slide-5'
    }
  ];

  // Configuration
  interval: number = 3000;
  autoPlay: boolean = true;
  loop: boolean = true;
  showIndicators: boolean = true;
  showPlayButton: boolean = true;
  showPreviousButton: boolean = true;
  showNextButton: boolean = true;
  animationEffect: 'Slide' | 'Fade' | 'None' = 'Slide';
  slideTransition: 'Slide' | 'Fade' = 'Slide';

  // Methods
  next(): void {
    this.carousel?.next();
  }

  previous(): void {
    this.carousel?.previous();
  }

  goTo(index: number): void {
    this.carousel?.goTo(index);
  }

  play(): void {
    this.carousel?.playCarousel();
  }

  pause(): void {
    this.carousel?.pauseCarousel();
  }

  togglePlayPause(): void {
    this.carousel?.togglePlayPause();
  }

  refresh(): void {
    this.carousel?.refresh();
  }

  getCurrentIndex(): number {
    return this.carousel?.getCurrentIndex() || 0;
  }

  getTotalSlides(): number {
    return this.carousel?.getTotalSlides() || 0;
  }

  onSlideChanged(event: any): void {
    console.log('Slide changed:', event);
  }

  onPlay(event: any): void {
    console.log('Carousel playing:', event);
  }

  onPause(event: any): void {
    console.log('Carousel paused:', event);
  }

  onIntervalChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target) {
      this.interval = +target.value;
      this.refresh();
    }
  }

  toggleAutoPlay(): void {
    this.autoPlay = !this.autoPlay;
    if (this.autoPlay) {
      this.play();
    } else {
      this.pause();
    }
  }

  toggleLoop(): void {
    this.loop = !this.loop;
    this.refresh();
  }

  onAnimationEffectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const effect = target.value as 'Slide' | 'Fade' | 'None';
      this.animationEffect = effect;
      this.slideTransition = effect === 'Fade' ? 'Fade' : 'Slide';
      this.refresh();
    }
  }
}

