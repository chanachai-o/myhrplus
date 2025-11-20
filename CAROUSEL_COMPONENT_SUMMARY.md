# Carousel Component Summary

## Component Information

- **Component Name**: `CarouselComponent`
- **Selector**: `app-carousel`
- **Location**: `src/app/shared/components/carousel/`
- **Type**: Standalone Component
- **Dependencies**: `@syncfusion/ej2-angular-navigations` (CarouselModule)

## Quick Start

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
      [height]="'500px'">
    </app-carousel>
  `
})
export class ExampleComponent {
  carouselItems: CarouselItem[] = [
    {
      id: '1',
      imageUrl: 'https://example.com/slide1.jpg',
      title: 'Slide 1',
      description: 'Description'
    }
  ];
}
```

## Key Features

✅ **Responsive Design**: Works on all screen sizes  
✅ **Autoplay Support**: Automatic slide transitions  
✅ **Multiple Animation Effects**: Slide, Fade, None  
✅ **Touch Gestures**: Swipe navigation on mobile  
✅ **Keyboard Navigation**: Arrow keys and spacebar support  
✅ **Customizable Controls**: Show/hide indicators, buttons, play button  
✅ **Loop Support**: Continuous playback  
✅ **Partial Visible**: Show multiple slides at once  
✅ **Glass Morphism Styling**: Modern glass effect design  
✅ **Dark Mode Support**: Automatic dark mode styling  
✅ **Event Handling**: Slide change, play, pause events  
✅ **Programmatic Control**: Navigate, play, pause via methods  

## Input Properties

### Required
- `items` (CarouselItem[]): Array of carousel items

### Optional
- `interval` (number): Autoplay interval in ms (default: 3000)
- `autoPlay` (boolean): Enable autoplay (default: true)
- `loop` (boolean): Enable looping (default: true)
- `showIndicators` (boolean): Show slide indicators (default: true)
- `showPlayButton` (boolean): Show play/pause button (default: true)
- `showPreviousButton` (boolean): Show previous button (default: true)
- `showNextButton` (boolean): Show next button (default: true)
- `animationEffect` ('Slide' | 'Fade' | 'None'): Animation type (default: 'Slide')
- `height` (string | number): Carousel height (default: '400px')
- `width` (string | number): Carousel width (default: '100%')
- `config` (CarouselConfig): Configuration object

## Output Events

- `slideChanged`: Emitted when slide changes
- `play`: Emitted when carousel starts playing
- `pause`: Emitted when carousel is paused
- `created`: Emitted when carousel is created

## Methods

- `next()`: Navigate to next slide
- `previous()`: Navigate to previous slide
- `goTo(index)`: Navigate to specific slide
- `playCarousel()`: Start playing
- `pauseCarousel()`: Pause carousel
- `togglePlayPause()`: Toggle play/pause
- `getCurrentIndex()`: Get current slide index
- `getTotalSlides()`: Get total slides count
- `isPlaying()`: Check if playing
- `refresh()`: Refresh carousel
- `getCarouselInstance()`: Get Syncfusion instance

## CarouselItem Structure

```typescript
interface CarouselItem {
  id?: string;              // Unique identifier
  template?: string;         // Custom template
  content?: string;          // HTML content
  imageUrl?: string;         // Image URL
  title?: string;            // Slide title
  description?: string;      // Slide description
  cssClass?: string;         // Custom CSS class
  [key: string]: any;       // Additional properties
}
```

## Common Use Cases

1. **Image Gallery**: Display product images or photos
2. **Hero Section**: Showcase featured content on homepage
3. **Testimonials**: Rotate customer testimonials
4. **Announcements**: Display important announcements
5. **Feature Highlights**: Showcase product features
6. **Banner Ads**: Rotate promotional banners

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support with touch gestures

## Performance Considerations

- Limit slides to 10-15 for optimal performance
- Optimize images before adding to carousel
- Use lazy loading for large carousels
- Consider disabling autoplay on mobile devices

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Focus management
- High contrast support

## Demo

See the live demo at `/demo/carousel` for examples and interactive controls.

## Related Documentation

- [Full Guide](./CAROUSEL_COMPONENT_GUIDE.md)
- [Syncfusion Carousel Docs](https://ej2.syncfusion.com/angular/documentation/carousel/getting-started/)

