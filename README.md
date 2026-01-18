# react-dragd

A drag-and-drop page builder and viewer library for React. Build dynamic, editable pages with a visual editor that supports text, images, buttons, shapes, and code blocks.

[![npm version](https://img.shields.io/npm/v/react-dragd.svg)](https://www.npmjs.com/package/react-dragd)
[![license](https://img.shields.io/npm/l/react-dragd.svg)](https://github.com/prnthh/react-dragd/blob/main/LICENSE)

[Live Demo on StackBlitz](https://stackblitz.com/edit/react-dragd)

## Features

- **Dual Mode Operation** - Switch between EDIT mode (full editor) and VIEW mode (read-only display)
- **Drag & Drop Positioning** - Move elements freely with smart alignment guides
- **Multiple Component Types** - Text, buttons, images, shapes, HTML/Markdown, and code blocks
- **Rotation & Resize** - Transform elements with corner handles and rotation controls
- **Multi-Select** - Shift+click or drag-to-select multiple elements
- **Layer Management** - Control z-index ordering (bring forward/send backward)
- **Undo/Redo** - Full history tracking with keyboard shortcuts
- **Google Fonts** - Access to all Google Fonts for text elements
- **Code Editor** - Monaco editor integration with syntax highlighting
- **State Persistence** - Save and load page layouts as JSON
- **Mobile Support** - Touch-friendly with responsive scaling

## Installation

```bash
npm install react-dragd
```

## Quick Start

```jsx
import DragDrop from "react-dragd";
import "react-dragd/dist/index.css";

export default function App() {
  return (
    <div className="App">
      <DragDrop
        mode="edit"
        onChangedCallback={(items) => console.log('Changed:', items)}
        saveCallback={(items) => console.log('Saved:', items)}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'edit'` \| `'view'` | `'edit'` | Editor mode - edit for full editor, view for read-only |
| `initialState` | `object` | `{}` | Load existing page state |
| `onChangedCallback` | `function` | - | Called when items are modified (debounced) |
| `saveCallback` | `function` | - | Called when user clicks the Save button |
| `immutable` | `boolean` | `false` | Hide the save button when true |
| `pending` | `boolean` | `false` | Show loading state |

## Usage Examples

### Edit Mode with Auto-Save

```jsx
<DragDrop
  mode="edit"
  onChangedCallback={(items) => {
    // Auto-save as user makes changes
    localStorage.setItem('page-draft', JSON.stringify(items));
  }}
  saveCallback={(items) => {
    // Save to your backend
    api.savePage(items);
  }}
/>
```

### View Mode (Read-Only)

```jsx
<DragDrop
  mode="view"
  initialState={savedPageData}
/>
```

### Load Existing State

```jsx
const savedState = JSON.parse(localStorage.getItem('my-page'));

<DragDrop
  mode="edit"
  initialState={savedState}
  saveCallback={(items) => {
    localStorage.setItem('my-page', JSON.stringify(items));
  }}
/>
```

## Available Components

| Component | Description |
|-----------|-------------|
| **Text** | Rich text with Google Fonts, sizing, and alignment |
| **Button** | Link buttons or JavaScript action buttons |
| **Image** | Upload images or use URLs |
| **Square** | Colored rectangles with customizable borders |
| **Circle** | Circular shapes with color fills |

## Custom Components

You can register custom draggable components using the component registry system.

### Creating a Custom Component

```jsx
import { registerComponent } from "react-dragd/dist/Components";
import EditItem from "react-dragd/dist/Components/DDEditor/EditItem";

function MyCustomComponent(props) {
  const { elemData, selected, mode } = props;

  // Optional: Define custom control panel for editing
  function PanelControls({ onLocalUpdate, elemData }) {
    return (
      <button onClick={() => onLocalUpdate({ customProp: 'new value' })}>
        Update
      </button>
    );
  }

  return (
    <EditItem
      elemData={elemData}
      selected={selected}
      renderPanel={selected && PanelControls}
      mode={mode}
    >
      {/* Your custom component content */}
      <div style={{ width: '100%', height: '100%' }}>
        {elemData.customProp || 'Default content'}
      </div>
    </EditItem>
  );
}

// Register the component with a unique type and menu button
registerComponent({
  type: 'my-custom',
  Component: MyCustomComponent,
  button: {
    icon: 'fas fa-star',
    label: 'Add My Component',
    action: 'add',
    object: {
      type: 'my-custom',
      size: { width: 150, height: 100 },
      customProp: 'initial value',
    },
  },
});

export default MyCustomComponent;
```

### Component Props

Your custom component receives these props:

| Prop | Type | Description |
|------|------|-------------|
| `elemData` | `object` | The item's data (id, pos, size, rot, zIndex, type, and any custom properties) |
| `selected` | `boolean` | Whether this item is currently selected |
| `mode` | `'edit'` \| `'view'` | Current editor mode |

### EditItem Wrapper

Wrap your component in `EditItem` to get drag, resize, and rotation functionality:

| Prop | Type | Description |
|------|------|-------------|
| `elemData` | `object` | Pass through from props |
| `selected` | `boolean` | Pass through from props |
| `mode` | `string` | Pass through from props |
| `renderPanel` | `function` \| `false` | Custom control panel component (shown when selected) |
| `onLocalUpdate` | `function` | Callback to update item properties |

### Button Configuration

The `button` property in `registerComponent` adds your component to the editor toolbar:

| Property | Description |
|----------|-------------|
| `icon` | Font Awesome icon class (e.g., `'fas fa-star'`) |
| `label` | Tooltip text shown on hover |
| `action` | Use `'add'` for simple components |
| `object` | Default properties for new instances (must include `type`) |

### Registering Multiple Types

A single component can handle multiple types:

```jsx
registerComponent({
  type: ['type-a', 'type-b'],
  Component: MyComponent
});
```

### Example: HTML/Markdown Component

See [docs/components/DraggableHtml.js](https://github.com/prnthh/react-dragd/blob/main/docs/components/DraggableHtml.js) for a full example of a custom component with Monaco editor integration for editing HTML and Markdown content.

## State Format

The editor state is a JSON object where each key is an item ID:

```javascript
{
  "item-uuid-123": {
    id: "item-uuid-123",
    type: "text",
    pos: { x: 100, y: 50 },
    size: { width: 200, height: 100 },
    rot: { deg: 0 },
    zIndex: 10000,
    text: "Hello World",
    style: {
      fontFamily: "Arial",
      fontSize: "24px",
      color: "#000000"
    }
  }
}
```

## Development

### Setup

```bash
# Install dependencies
npm install

# Start development (watch mode + demo server)
npm run dev

# Build for production
npm run build
```

### Project Structure

```
react-dragd/
├── src/
│   ├── DragDrop.js          # Main component
│   ├── Components/          # Draggable component types
│   ├── EditMenu/            # Editor toolbar and menus
│   └── index.css            # Styles
├── docs/                    # Next.js demo app
└── dist/                    # Built output
```

## Requirements

- React 16.8.0 or higher
- React DOM 16.8.0 or higher

## License

ISC

## Links

- [NPM Package](https://www.npmjs.com/package/react-dragd)
- [GitHub Repository](https://github.com/prnthh/react-dragd)
- [Report Issues](https://github.com/prnthh/react-dragd/issues)
