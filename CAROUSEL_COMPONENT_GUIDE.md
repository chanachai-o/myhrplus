# Carousel Component Guide

## Overview

The `CarouselComponent` is a wrapper around Syncfusion's Carousel component, providing a responsive carousel for displaying slides with navigation controls, indicators, and autoplay functionality. It supports various animation effects, touch gestures, and keyboard navigation.

## Installation

The Carousel component is part of the Syncfusion navigations package and is already included in the `SyncfusionModule`. No additional installation is required.

## Basic Usage

```typescript
import { CarouselComponent, CarouselItem } from '@shared/components/carousel/carousel.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CarouselComponent],
  template: `
    <app-carousel
      [items]="carouselItems"
      [interval]="3000"
      [autoPlay]="true"
      [loop]="true"
      [showIndicators]="true"
      [height]="'500px'"
      [width]="'100%'">
    </app-carousel>
  `
})
export class ExampleComponent {
  carouselItems: CarouselItem[] = [
    {
      id: '1',
      title: 'Slide 1',
      description: 'Description for slide 1',
      imageUrl: 'https://example.com/image1.jpg'
    },
    {
      id: '2',
      title: 'Slide 2',
      description: 'Description for slide 2',
      imageUrl: 'https://example.com/image2.jpg'
    }
  ];
}
```

## Inputs

### Data Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `items` | `CarouselItem[]` | `[]` | Array of carousel items to display |
| `config` | `CarouselConfig` | `undefined` | Configuration object to set multiple properties at once |

### Behavior Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `interval` | `number` | `3000` | Time interval in milliseconds between slides (autoplay) |
| `autoPlay` | `boolean` | `true` | Enable/disable autoplay |
| `loop` | `boolean` | `true` | Enable/disable looping (restart from first slide after last) |
| `animationEffect` | `'Slide' \| 'Fade' \| 'None'` | `'Slide'` | Animation effect for slide transitions |
| `slideTransition` | `'Slide' \| 'Fade'` | `'Slide'` | Transition effect for slides |
| `partialVisible` | `boolean` | `false` | Show partial slides (multiple slides visible at once) |
| `itemsCount` | `number` | `1` | Number of items to show when `partialVisible` is true |

### UI Control Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showIndicators` | `boolean` | `true` | Show/hide slide indicators (dots) |
| `showPlayButton` | `boolean` | `true` | Show/hide play/pause button |
| `showPreviousButton` | `boolean` | `true` | Show/hide previous button |
| `showNextButton` | `boolean` | `true` | Show/hide next button |

### Interaction Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `enableTouchSwipe` | `boolean` | `true` | Enable/disable touch swipe gestures |
| `enableKeyboardNavigation` | `boolean` | `true` | Enable/disable keyboard navigation (arrow keys) |
| `enableRtl` | `boolean` | `false` | Enable/disable right-to-left layout |

### Appearance Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cssClass` | `string` | `undefined` | Custom CSS class for Syncfusion carousel |
| `height` | `string \| number` | `'400px'` | Height of the carousel |
| `width` | `string \| number` | `'100%'` | Width of the carousel |
| `customClass` | `string` | `undefined` | Custom CSS class for the container |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `slideChanged` | `EventEmitter<any>` | Emitted when slide changes |
| `play` | `EventEmitter<any>` | Emitted when carousel starts playing |
| `pause` | `EventEmitter<any>` | Emitted when carousel is paused |
| `created` | `EventEmitter<any>` | Emitted when carousel is created |

## Methods

### Navigation Methods

```typescript
// Navigate to next slide
next(): void

// Navigate to previous slide
previous(): void

// Navigate to specific slide by index
goTo(index: number): void
```

### Playback Methods

```typescript
// Start playing carousel
playCarousel(): void

// Pause carousel
pauseCarousel(): void

// Toggle play/pause
togglePlayPause(): void
```

### Information Methods

```typescript
// Get current slide index
getCurrentIndex(): number

// Get total number of slides
getTotalSlides(): number

// Check if carousel is playing
isPlaying(): boolean
```

### Utility Methods

```typescript
// Refresh carousel (re-render)
refresh(): void

// Get Syncfusion carousel instance
getCarouselInstance(): SyncfusionCarouselComponent | null
```

## CarouselItem Interface

```typescript
interface CarouselItem {
  id?: string;              // Unique identifier
  template?: string;        // Custom template reference
  content?: string;         // HTML content
  imageUrl?: string;        // Image URL
  title?: string;          // Slide title
  description?: string;     // Slide description
  cssClass?: string;       // Custom CSS class for item
  [key: string]: any;      // Additional properties
}
```

## CarouselConfig Interface

```typescript
interface CarouselConfig {
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
```

## Examples

### Basic Carousel with Images

```typescript
export class MyComponent {
  items: CarouselItem[] = [
    {
      id: '1',
      imageUrl: 'https://example.com/slide1.jpg',
      title: 'Welcome',
      description: 'Welcome to our application'
    },
    {
      id: '2',
      imageUrl: 'https://example.com/slide2.jpg',
      title: 'Features',
      description: 'Discover our features'
    }
  ];
}
```

```html
<app-carousel
  [items]="items"
  [interval]="5000"
  [autoPlay]="true"
  [height]="'600px'">
</app-carousel>
```

### Carousel with HTML Content

```typescript
export class MyComponent {
  items: CarouselItem[] = [
    {
      id: '1',
      content: '<div class="custom-slide"><h2>Custom Content</h2><p>This is custom HTML</p></div>'
    },
    {
      id: '2',
      content: '<div class="custom-slide"><h2>Another Slide</h2><p>More custom content</p></div>'
    }
  ];
}
```

### Carousel with Fade Animation

```html
<app-carousel
  [items]="items"
  [animationEffect]="'Fade'"
  [slideTransition]="'Fade'"
  [interval]="4000">
</app-carousel>
```

### Multiple Slides Visible

```html
<app-carousel
  [items]="items"
  [partialVisible]="true"
  [itemsCount]="3"
  [interval]="3000">
</app-carousel>
```

### Programmatic Control

```typescript
export class MyComponent {
  @ViewChild('carousel') carousel!: CarouselComponent;

  goToSlide(index: number): void {
    this.carousel.goTo(index);
  }

  togglePlayback(): void {
    this.carousel.togglePlayPause();
  }

  onSlideChanged(event: any): void {
    console.log('Current slide:', this.carousel.getCurrentIndex());
  }
}
```

```html
<app-carousel
  #carousel
  [items]="items"
  (slideChanged)="onSlideChanged($event)">
</app-carousel>

<button (click)="goToSlide(0)">Go to First</button>
<button (click)="togglePlayback()">Toggle Play/Pause</button>
```

### Using Configuration Object

```typescript
export class MyComponent {
  carouselConfig: CarouselConfig = {
    items: [
      { id: '1', imageUrl: 'slide1.jpg', title: 'Slide 1' },
      { id: '2', imageUrl: 'slide2.jpg', title: 'Slide 2' }
    ],
    interval: 3000,
    autoPlay: true,
    loop: true,
    showIndicators: true,
    animationEffect: 'Slide',
    height: '500px',
    width: '100%'
  };
}
```

```html
<app-carousel [config]="carouselConfig"></app-carousel>
```

## Styling

The component uses Glass Morphism styling by default and supports dark mode. You can customize the appearance using:

1. **Custom CSS Classes**: Use `customClass` for container styling and `cssClass` for Syncfusion carousel styling
2. **Item CSS Classes**: Add `cssClass` to individual `CarouselItem` objects
3. **SCSS Variables**: Override design tokens in `src/styles/_design-tokens.scss`

### Custom Styling Example

```scss
// component.scss
.my-carousel {
  ::ng-deep {
    .e-carousel {
      border-radius: 2rem;
      
      .e-carousel-navigators {
        .e-carousel-nav-btn {
          background: rgba(79, 70, 229, 0.8);
        }
      }
    }
  }
}
```

```html
<app-carousel
  [items]="items"
  customClass="my-carousel">
</app-carousel>
```

## Keyboard Navigation

When `enableKeyboardNavigation` is `true` (default), users can navigate using:
- **Left Arrow**: Previous slide
- **Right Arrow**: Next slide
- **Space**: Toggle play/pause

## Touch Gestures

When `enableTouchSwipe` is `true` (default), users can:
- **Swipe Left**: Next slide
- **Swipe Right**: Previous slide

## Best Practices

1. **Image Optimization**: Use optimized images for better performance
2. **Lazy Loading**: Consider lazy loading images for large carousels
3. **Accessibility**: Always provide `title` and `description` for screen readers
4. **Performance**: Limit the number of slides for better performance
5. **Responsive Design**: Use percentage-based widths and responsive heights
6. **Animation**: Use `'Fade'` for subtle transitions, `'Slide'` for standard carousels
7. **Autoplay**: Consider disabling autoplay on mobile devices to save battery

## Troubleshooting

### Carousel Not Displaying

- Ensure `items` array is not empty
- Check that `height` and `width` are set correctly
- Verify `CarouselModule` is imported in your module

### Slides Not Transitioning

- Check `interval` value (should be >= 1000ms)
- Verify `autoPlay` is set to `true`
- Ensure `loop` is enabled if you want continuous playback

### Touch Gestures Not Working

- Verify `enableTouchSwipe` is `true`
- Check that touch events are not being prevented by parent elements

### Keyboard Navigation Not Working

- Ensure `enableKeyboardNavigation` is `true`
- Check that carousel has focus (click on carousel first)

## Related Components

- **Image Upload**: For uploading carousel images
- **Modal**: For displaying carousel in modal
- **Tabs**: Alternative navigation component

## API Reference

For complete API reference, see [Syncfusion Carousel Documentation](https://ej2.syncfusion.com/angular/documentation/carousel/getting-started/).

