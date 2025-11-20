# Smart TextArea Component Summary

## Component Information

- **Component Name**: `SmartTextAreaComponent`
- **Selector**: `app-smart-textarea`
- **Location**: `src/app/shared/components/smart-textarea/`
- **Module**: Standalone Component
- **Dependencies**: `@syncfusion/ej2-angular-inputs` (SmartTextAreaModule)

## Quick Start

```html
<app-smart-textarea
  [placeholder]="'Type your message...'"
  [floatLabelType]="'Auto'"
  [rows]="5"
  (change)="onChange($event)">
</app-smart-textarea>
```

## Key Features

- ✅ AI-powered suggestions
- ✅ Float label support (Auto, Always, Never)
- ✅ Customizable resize modes
- ✅ Glass Morphism styling
- ✅ Dark mode support
- ✅ Readonly and disabled states
- ✅ Event handling (change, focus, blur)

## Input Properties

### Basic Properties
- `placeholder`: Placeholder text
- `floatLabelType`: Float label behavior ('Auto' | 'Always' | 'Never')
- `rows`: Number of rows
- `cols`: Number of columns
- `value`: Initial value
- `enabled`: Enable/disable state
- `readonly`: Readonly state
- `resizeMode`: Resize behavior ('None' | 'Both' | 'Horizontal' | 'Vertical')
- `width`: Width of the textarea
- `height`: Height of the textarea
- `customClass`: Custom CSS class

### AI Properties
- `userRole`: User role for AI context
- `userPhrases`: Array of user-specific phrases
- `aiSuggestionHandler`: Handler function for AI suggestions

## Output Events

- `change`: Emitted when value changes
- `focus`: Emitted when component receives focus
- `blur`: Emitted when component loses focus
- `created`: Emitted when component is created

## Methods

- `getValue()`: Get current value
- `setValue(value: string)`: Set value
- `clear()`: Clear value
- `focusIn()`: Focus the textarea
- `focusOut()`: Blur the textarea
- `refresh()`: Refresh the component
- `getSmartTextAreaInstance()`: Get Syncfusion instance

## Usage Examples

### Basic Usage
```html
<app-smart-textarea
  [placeholder]="'Type your message...'"
  [rows]="5">
</app-smart-textarea>
```

### With AI Suggestions
```html
<app-smart-textarea
  [placeholder]="'Type your message...'"
  [userRole]="'Employee'"
  [userPhrases]="['Thank you', 'Please let me know']"
  [aiSuggestionHandler]="aiSuggestionHandler">
</app-smart-textarea>
```

### With Configuration
```html
<app-smart-textarea
  [config]="textareaConfig">
</app-smart-textarea>
```

## Demo

See the demo at `/demo/smart-textarea` for interactive examples and usage patterns.

## Documentation

For detailed documentation, see `SMART_TEXTAREA_COMPONENT_GUIDE.md`.

