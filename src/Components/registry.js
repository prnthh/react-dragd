// Central registry for draggable components
const REGISTRY = {};

export function registerComponent(component) {
    const types = Array.isArray(component.type) ? component.type : [component.type];

    types.forEach(type => {
        if (REGISTRY[type]) {
            console.warn(`Component with type '${type}' already registered. Overwriting.`);
        }
        REGISTRY[type] = component;
    });
}

export function getComponentForType(type) {
    return REGISTRY[type]?.Component;
}

export function getAllComponents() {
    return { ...REGISTRY };
}

export function getRegisteredButtons() {
    const buttons = {};
    Object.entries(REGISTRY).forEach(([type, component]) => {
        if (component.button) {
            buttons[type] = component.button;
        }
    });
    return buttons;
}