// Import all components to trigger their self-registration
import './DraggableText';
import './DraggableButton';
import './DraggableImage';
import './DraggableDiv';

// Re-export the registry functions
export { registerComponent, getComponentForType, getAllComponents, getRegisteredButtons } from './registry';
