# Smart TextArea Component Guide

## Overview

The `SmartTextAreaComponent` is a wrapper around Syncfusion's Smart TextArea component, providing an intelligent textarea with AI-powered suggestions, customizable features, and enhanced user experience. It supports float labels, resize modes, and AI integration for contextual suggestions.

## Installation

The Smart TextArea component is part of the Syncfusion inputs package and is already included in the `SyncfusionModule`. No additional installation is required.

## Basic Usage

```typescript
import { SmartTextAreaComponent } from '@shared/components/smart-textarea/smart-textarea.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [SmartTextAreaComponent],
  template: `
    <app-smart-textarea
      [placeholder]="'Type your message...'"
      [floatLabelType]="'Auto'"
      [rows]="5"
      (change)="onChange($event)">
    </app-smart-textarea>
  `
})
export class ExampleComponent {
  onChange(event: any): void {
    console.log('Value changed:', event);
  }
}
```

## Inputs

### Basic Inputs

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `placeholder` | `string` | `'Type your message...'` | Placeholder text |
| `floatLabelType` | `'Auto' \| 'Always' \| 'Never'` | `'Auto'` | Float label behavior |
| `rows` | `number` | `5` | Number of rows |
| `cols` | `number` | `50` | Number of columns |
| `value` | `string` | `''` | Initial value |
| `enabled` | `boolean` | `true` | Enable/disable the component |
| `readonly` | `boolean` | `false` | Make the textarea readonly |
| `resizeMode` | `'None' \| 'Both' \| 'Horizontal' \| 'Vertical'` | `'None'` | Resize behavior |
| `width` | `string \| number` | `'100%'` | Width of the textarea |
| `height` | `string \| number` | `'auto'` | Height of the textarea |
| `customClass` | `string` | `undefined` | Custom CSS class for the container |
| `config` | `SmartTextAreaConfig` | `undefined` | Configuration object to set multiple properties at once |

### AI Features

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `userRole` | `string` | `undefined` | User role for AI context (e.g., 'Employee', 'Manager') |
| `userPhrases` | `string[]` | `undefined` | Array of user-specific phrases for AI suggestions |
| `aiSuggestionHandler` | `(options: any) => void` | `undefined` | Handler function for AI suggestions |

## Outputs

| Event | Type | Description |
|-------|------|-------------|
| `change` | `EventEmitter<any>` | Emitted when value changes |
| `focus` | `EventEmitter<any>` | Emitted when component receives focus |
| `blur` | `EventEmitter<any>` | Emitted when component loses focus |
| `created` | `EventEmitter<any>` | Emitted when smart textarea is created |

## Methods

### Value Methods

```typescript
// Get current value
getValue(): string

// Set value
setValue(value: string): void

// Clear value
clear(): void
```

### Focus Methods

```typescript
// Focus the textarea
focusIn(): void

// Blur the textarea
focusOut(): void
```

### Utility Methods

```typescript
// Refresh the component
refresh(): void

// Get Smart TextArea instance
getSmartTextAreaInstance(): SyncfusionSmartTextAreaComponent | null
```

## Examples

### Basic Smart TextArea

```html
<app-smart-textarea
  [placeholder]="'Type your message...'"
  [floatLabelType]="'Auto'"
  [rows]="5"
  [value]="message"
  (change)="onChange($event)">
</app-smart-textarea>
```

### Smart TextArea with AI Suggestions

```html
<app-smart-textarea
  [placeholder]="'Type your message...'"
  [userRole]="'Employee communicating with internal team'"
  [userPhrases]="['Thank you', 'Please let me know']"
  [aiSuggestionHandler]="aiSuggestionHandler"
  [rows]="5"
  (change)="onChange($event)">
</app-smart-textarea>
```

```typescript
export class ExampleComponent {
  aiSuggestionHandler = (options: any): void => {
    // Call your AI service here
    console.log('AI Suggestion requested:', options);
    // In a real implementation, this would call an AI service
    // and return suggestions based on the context
  };

  onChange(event: any): void {
    console.log('Value changed:', event);
  }
}
```

### Smart TextArea with Custom Resize

```html
<app-smart-textarea
  [placeholder]="'Type your message...'"
  [resizeMode]="'Both'"
  [rows]="5"
  [cols]="50"
  (change)="onChange($event)">
</app-smart-textarea>
```

### Smart TextArea with Configuration Object

```typescript
export class ExampleComponent {
  textareaConfig: SmartTextAreaConfig = {
    placeholder: 'Type your message...',
    floatLabelType: 'Auto',
    rows: 5,
    resizeMode: 'Both',
    userRole: 'Employee',
    userPhrases: ['Thank you', 'Please let me know'],
    aiSuggestionHandler: this.handleAISuggestions.bind(this)
  };

  handleAISuggestions(options: any): void {
    // Handle AI suggestions
    console.log('AI Suggestions:', options);
  }
}
```

```html
<app-smart-textarea
  [config]="textareaConfig"
  (change)="onChange($event)">
</app-smart-textarea>
```

## Styling

The component uses Glass Morphism styling by default and supports dark mode. You can customize the appearance using the `customClass` input or by overriding the SCSS styles.

### Custom Styling

```html
<app-smart-textarea
  [customClass]="'my-custom-textarea'"
  [placeholder]="'Type your message...'">
</app-smart-textarea>
```

```scss
.my-custom-textarea {
  ::ng-deep {
    .e-smarttextarea {
      .e-input-group {
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
}
```

## AI Integration

The Smart TextArea component supports AI-powered suggestions through the `aiSuggestionHandler` property. This handler receives options containing the current text and context, allowing you to integrate with AI services for contextual suggestions.

### AI Suggestion Handler Example

```typescript
export class ExampleComponent {
  aiSuggestionHandler = async (options: any): Promise<void> => {
    try {
      // Call your AI service
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: options.text,
          userRole: this.userRole,
          context: options.context
        })
      });

      const suggestions = await response.json();
      // Process suggestions
      console.log('AI Suggestions:', suggestions);
    } catch (error) {
      console.error('AI Suggestion error:', error);
    }
  };
}
```

## Best Practices

1. **Use Float Labels**: Use `floatLabelType="Auto"` for better UX when space is limited
2. **AI Integration**: Implement proper error handling in `aiSuggestionHandler`
3. **Resize Mode**: Use `resizeMode="Both"` for better user experience on desktop
4. **User Role**: Provide meaningful `userRole` values for better AI context
5. **User Phrases**: Include common phrases in `userPhrases` for better AI suggestions

## Notes

- The AI suggestion handler is optional and only works when `userRole` and `aiSuggestionHandler` are provided
- The component requires a server-side AI service for actual AI suggestions
- Float labels work best with `placeholder` text
- The component supports all standard textarea features from Syncfusion

## Related Components

- `TextAreaComponent` - Standard textarea component
- `SpeechToTextComponent` - Speech to text conversion component
- `RichTextEditorComponent` - Rich text editor component

