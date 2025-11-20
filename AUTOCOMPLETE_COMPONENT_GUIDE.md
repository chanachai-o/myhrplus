# Autocomplete Component Guide

## Overview

The `AutocompleteComponent` is a wrapper around Syncfusion's Autocomplete component, providing an autocomplete input with filtering, highlighting, and customizable suggestions. It supports various filter types, sorting, and virtual scrolling for large datasets.

## Installation

The Autocomplete component is part of the Syncfusion dropdowns package and is already included in the `SyncfusionModule`. No additional installation is required.

## Basic Usage

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
    { value: '2', text: 'Option 2' },
    { value: '3', text: 'Option 3' }
  ];

  fields: any = {
    value: 'value',
    text: 'text'
  };
}
```

## Inputs

### Data Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `dataSource` | `AutocompleteItem[]` | `[]` | Array of items to display in autocomplete |
| `fields` | `any` | `{ value: 'value', text: 'text' }` | Field mappings for item properties |
| `value` | `string \| number \| AutocompleteItem` | `undefined` | Initial value |
| `config` | `AutocompleteConfig` | `undefined` | Configuration object to set multiple properties at once |

### Appearance Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | `string` | `'Type to search...'` | Placeholder text |
| `width` | `string \| number` | `'100%'` | Width of the autocomplete |
| `height` | `string \| number` | `'auto'` | Height of the autocomplete |
| `customClass` | `string` | `undefined` | Custom CSS class for the container |

### Behavior Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `allowFiltering` | `boolean` | `true` | Enable/disable filtering |
| `caseSensitive` | `boolean` | `false` | Enable/disable case-sensitive filtering |
| `filterType` | `'Contains' \| 'StartsWith' \| 'EndsWith'` | `'Contains'` | Filter type |
| `minLength` | `number` | `1` | Minimum characters to trigger filtering |
| `showClearButton` | `boolean` | `true` | Show/hide clear button |
| `enableVirtualization` | `boolean` | `false` | Enable/disable virtual scrolling |
| `allowCustom` | `boolean` | `false` | Allow custom values (not in dataSource) |
| `autofill` | `boolean` | `true` | Enable/disable autofill |
| `highlight` | `boolean` | `true` | Highlight matching text |
| `ignoreAccent` | `boolean` | `false` | Ignore accent characters in filtering |
| `sortOrder` | `'None' \| 'Ascending' \| 'Descending'` | `'None'` | Sort order for suggestions |
| `suggestionCount` | `number` | `20` | Maximum number of suggestions to show |
| `enabled` | `boolean` | `true` | Enable/disable the component |
| `readonly` | `boolean` | `false` | Make the input readonly |
| `enableRtl` | `boolean` | `false` | Enable/disable right-to-left layout |
| `locale` | `string` | `'en'` | Locale for localization |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `change` | `EventEmitter<any>` | Emitted when value changes |
| `select` | `EventEmitter<any>` | Emitted when an item is selected |
| `focus` | `EventEmitter<any>` | Emitted when component receives focus |
| `blur` | `EventEmitter<any>` | Emitted when component loses focus |
| `filtering` | `EventEmitter<FilteringEventArgs>` | Emitted during filtering |
| `open` | `EventEmitter<PopupEventArgs>` | Emitted when popup opens |
| `close` | `EventEmitter<PopupEventArgs>` | Emitted when popup closes |
| `created` | `EventEmitter<any>` | Emitted when autocomplete is created |

## Methods

### Value Methods

```typescript
// Get current value
getValue(): string | number | AutocompleteItem | undefined

// Set value
setValue(value: string | number | AutocompleteItem): void

// Get text
getText(): string

// Get data item
getDataItem(): AutocompleteItem | null
```

### Popup Methods

```typescript
// Show popup
showPopup(): void

// Hide popup
hidePopup(): void
```

### Focus Methods

```typescript
// Focus
focusIn(): void

// Blur
focusOut(): void
```

### Utility Methods

```typescript
// Clear value
clear(): void

// Refresh component
refresh(): void

// Get Autocomplete instance
getAutocompleteInstance(): SyncfusionAutoCompleteComponent | null
```

## AutocompleteItem Interface

```typescript
interface AutocompleteItem {
  [key: string]: any;  // Any properties, typically includes value and text
}
```

## Examples

### Basic Autocomplete

```typescript
export class MyComponent {
  dataSource: AutocompleteItem[] = [
    { value: '1', text: 'Apple' },
    { value: '2', text: 'Banana' },
    { value: '3', text: 'Cherry' }
  ];

  fields: any = {
    value: 'value',
    text: 'text'
  };
}
```

```html
<app-autocomplete
  [dataSource]="dataSource"
  [fields]="fields"
  [placeholder]="'Search fruits...'">
</app-autocomplete>
```

### Autocomplete with Custom Fields

```typescript
export class MyComponent {
  products: AutocompleteItem[] = [
    { id: 1, name: 'Laptop', category: 'Electronics' },
    { id: 2, name: 'Smartphone', category: 'Electronics' },
    { id: 3, name: 'Tablet', category: 'Electronics' }
  ];

  fields: any = {
    value: 'id',
    text: 'name'
  };
}
```

```html
<app-autocomplete
  [dataSource]="products"
  [fields]="fields"
  [placeholder]="'Search products...'">
</app-autocomplete>
```

### Autocomplete with Filter Type

```html
<app-autocomplete
  [dataSource]="dataSource"
  [fields]="fields"
  [filterType]="'StartsWith'"
  [minLength]="2">
</app-autocomplete>
```

### Autocomplete with Sorting

```html
<app-autocomplete
  [dataSource]="dataSource"
  [fields]="fields"
  [sortOrder]="'Ascending'">
</app-autocomplete>
```

### Programmatic Control

```typescript
export class MyComponent {
  @ViewChild('autocomplete') autocomplete!: AutocompleteComponent;

  selectItem(value: string): void {
    this.autocomplete.setValue(value);
  }

  onSelect(event: any): void {
    console.log('Selected:', event);
  }
}
```

```html
<app-autocomplete
  #autocomplete
  [dataSource]="dataSource"
  [fields]="fields"
  (select)="onSelect($event)">
</app-autocomplete>

<button (click)="selectItem('1')">Select First Item</button>
```

### Using Configuration Object

```typescript
export class MyComponent {
  autocompleteConfig: AutocompleteConfig = {
    dataSource: [
      { value: '1', text: 'Option 1' },
      { value: '2', text: 'Option 2' }
    ],
    fields: {
      value: 'value',
      text: 'text'
    },
    placeholder: 'Type to search...',
    allowFiltering: true,
    filterType: 'Contains',
    highlight: true,
    width: '100%'
  };
}
```

```html
<app-autocomplete [config]="autocompleteConfig"></app-autocomplete>
```

## Styling

The component uses Glass Morphism styling by default and supports dark mode. You can customize the appearance using:

1. **Custom CSS Classes**: Use `customClass` for container styling
2. **SCSS Variables**: Override design tokens in `src/styles/_design-tokens.scss`

### Custom Styling Example

```scss
// component.scss
.my-autocomplete {
  ::ng-deep {
    .e-autocomplete {
      .e-input-group {
        border-color: rgba(79, 70, 229, 0.5);
      }
    }
  }
}
```

```html
<app-autocomplete
  [dataSource]="dataSource"
  [fields]="fields"
  customClass="my-autocomplete">
</app-autocomplete>
```

## Best Practices

1. **Data Structure**: Ensure items have consistent structure
2. **Performance**: Use `enableVirtualization` for large datasets (>1000 items)
3. **Filtering**: Set appropriate `minLength` to reduce filtering overhead
4. **User Experience**: Use `highlight` for better visibility
5. **Accessibility**: Provide meaningful `placeholder` text
6. **Validation**: Validate selected values on form submission

## Troubleshooting

### Autocomplete Not Showing Suggestions

- Ensure `dataSource` array is not empty
- Check that `fields` match your data structure
- Verify `allowFiltering` is `true`
- Check `minLength` value

### Filtering Not Working

- Verify `allowFiltering` is `true`
- Check `filterType` setting
- Ensure `minLength` is appropriate
- Check `caseSensitive` setting

### Value Not Updating

- Use `setValue()` method for programmatic updates
- Check that value exists in `dataSource`
- Verify `fields.value` mapping

## Related Components

- **Dropdown**: For simple dropdown selection
- **ComboBox**: For editable dropdown
- **MultiSelect**: For multiple selection

## API Reference

For complete API reference, see [Syncfusion Autocomplete Documentation](https://ej2.syncfusion.com/angular/documentation/auto-complete/getting-started/).

