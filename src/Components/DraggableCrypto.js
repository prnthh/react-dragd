import React, { useContext, useState } from 'react';
import EditItem from './DDEditor/EditItem';
import ColorPicker from '../utils/ui/ColorPicker';
import SiteContext from '../pageContext';
import { registerComponent } from './registry';

function DraggableCrypto(props) {
    const { elemData, selected } = props;
    const siteData = useContext(SiteContext);
    const {
        setSelected: onSelect,
        onUpdateDiv: onUpdated,
        mode,
        setModal,
    } = siteData;

    function onLocalUpdate(newProps) {
        var updatedProps = {
            ...newProps,
        };
        onUpdated(elemData.id, updatedProps);
    }

    function setText(text) {
        onLocalUpdate({
            text: text
        });
    }

    function PanelControls({ setPanelControls }) {
        const [active, setActive] = useState(false);
        return (
            <>
               <input defaultValue={elemData.text} onBlur={(e)=>{setText(e.target.value)}} />
            </>
        );
    }

    return (
        <>
            <EditItem
                elemData={elemData}
                onSelect={onSelect}
                onUpdated={onUpdated}
                selected={props.selected}
                key={props.elemData.id + '__item'}
                renderPanel={PanelControls}
                customControls={[{name: "text", type: "string"}, {address: "text2", type: "string"}]}
                mode={mode}
            >
                <div
                    style={{ width: '100%', height: '100%', ...elemData.style }}
                />
            </EditItem>
        </>
    );
}

// Register this component
registerComponent({
    type: 'crypto',
    Component: DraggableCrypto,
    button: {
        icon: 'fas fa-terminal',
        label: 'Add Code Snippet',
        action: 'add',
        object: {
            type: 'crypto',
            size: { width: 100, height: 100 },
            text: 'Add your code here!',
        },
    },
});

export default DraggableCrypto;
