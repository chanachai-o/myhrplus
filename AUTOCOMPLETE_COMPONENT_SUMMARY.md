# Autocomplete Component Summary

## Component Information

- **Component Name**: `AutocompleteComponent`
- **Selector**: `app-autocomplete`
- **Location**: `src/app/shared/components/autocomplete/`
- **Type**: Standalone Component
- **Dependencies**: `@syncfusion/ej2-angular-dropdowns` (AutoCompleteModule)

## Quick Start

```typescript
import { AutocompleteComponent, AutocompleteItem } from '@shared/components/autocomplete/autocomplete.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [AutocompleteComponent],
  template: `
    <app-autocomplete
      [dataSource]="dataSource"
      [fields]="fields"
      [placeholder]="'Type to search...'">
    </app-autocomplete>
  `
})
export class ExampleComponent {
  dataSource: AutocompleteItem[] = [
    { value: '1', text: 'Option 1' },
    { value: '2', text: 'Option 2' }
  ];

  fields: any = {
    value: 'value',
    text: 'text'
  };
}
```

## Key Features

✅ **Filtering**: Real-time filtering as you type  
✅ **Multiple Filter Types**: Contains, StartsWith, EndsWith  
✅ **Highlighting**: Highlight matching text in suggestions  
✅ **Sorting**: Sort suggestions (None, Ascending, Descending)  
✅ **Case Sensitivity**: Case-sensitive or case-insensitive filtering  
✅ **Min Length**: Minimum characters to trigger filtering  
✅ **Clear Button**: Clear input with one click  
✅ **Virtual Scrolling**: Handle large datasets efficiently  
✅ **Custom Values**: Allow values not in dataSource  
✅ **Autofill**: Auto-fill matching value  
✅ **Accent Ignore**: Ignore accent characters in filtering  
✅ **Glass Morphism Styling**: Modern glass effect design  
✅ **Dark Mode Support**: Automatic dark mode styling  
✅ **Event Handling**: Change, select, filtering, open, close events  
✅ **Programmatic Control**: Get/set value, show/hide popup via methods  

## Input Properties

### Required
- `dataSource` (AutocompleteItem[]): Array of items

### Optional
- `fields` (any): Field mappings (default: { value: 'value', text: 'text' })
- `placeholder` (string): Placeholder text (default: 'Type to search...')
- `allowFiltering` (boolean): Enable filtering (default: true)
- `filterType` ('Contains' | 'StartsWith' | 'EndsWith'): Filter type (default: 'Contains')
- `minLength` (number): Min characters for filtering (default: 1)
- `showClearButton` (boolean): Show clear button (default: true)
- `highlight` (boolean): Highlight matching text (default: true)
- `sortOrder` ('None' | 'Ascending' | 'Descending'): Sort order (default: 'None')
- `enabled` (boolean): Enable component (default: true)
- `readonly` (boolean): Readonly mode (default: false)
- `width` (string | number): Component width (default: '100%')
- `height` (string | number): Component height (default: 'auto')
- `config` (AutocompleteConfig): Configuration object

## Output Events

- `change`: Emitted when value changes
- `select`: Emitted when item is selected
- `focus`: Emitted when component receives focus
- `blur`: Emitted when component loses focus
- `filtering`: Emitted during filtering
- `open`: Emitted when popup opens
- `close`: Emitted when popup closes
- `created`: Emitted when autocomplete is created

## Methods

- `getValue()`: Get current value
- `setValue(value)`: Set value
- `getText()`: Get text
- `getDataItem()`: Get selected data item
- `showPopup()`: Show suggestions popup
- `hidePopup()`: Hide suggestions popup
- `focusIn()`: Focus the input
- `focusOut()`: Blur the input
- `clear()`: Clear value
- `refresh()`: Refresh component
- `getAutocompleteInstance()`: Get Syncfusion instance

## AutocompleteItem Structure

```typescript
interface AutocompleteItem {
  [key: string]: any;  // Any properties
  // Typically includes:
  // value: string | number
  // text: string
}
```

## Common Use Cases

1. **Search Input**: Search with autocomplete suggestions
2. **Form Input**: Autocomplete form fields
3. **Address Input**: Address autocomplete
4. **Product Search**: Product search with suggestions
5. **Tag Input**: Tag autocomplete
6. **Country/City Selection**: Location autocomplete

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

## Performance Considerations

- Use `enableVirtualization` for datasets > 1000 items
- Set appropriate `minLength` to reduce filtering overhead
- Use `suggestionCount` to limit displayed suggestions
- Consider server-side filtering for very large datasets

## Demo

See the live demo at `/demo/autocomplete` for examples and interactive controls.

## Related Documentation

- [Full Guide](./AUTOCOMPLETE_COMPONENT_GUIDE.md)
- [Syncfusion Autocomplete Docs](https://ej2.syncfusion.com/angular/documentation/auto-complete/getting-started/)

