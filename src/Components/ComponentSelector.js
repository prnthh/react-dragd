import React from 'react';
import { getComponentForType } from './index';

function ComponentSelector({ elem, selected }) {
    const isSelected = selected && selected.includes(elem.id);
    const Component = getComponentForType(elem.type);
    if (!Component) return <></>;
    return <Component elemData={elem} selected={isSelected} />;
}

export default ComponentSelector;
