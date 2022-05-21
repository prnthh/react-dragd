import { useState, useEffect, useContext } from "react";
import { Input } from '../../utils/helpers';
import ColorPicker from '../../utils/ui/ColorPicker';
import SiteContext from '../../pageContext';

export default function PanelControls({ elemData, setPanelControls }) {
    const siteData = useContext(SiteContext);
    const { setSelected: onSelect, onUpdateDiv: onUpdated, mode, setModal } = siteData;

    function onLocalUpdate(newProps) {
        var updatedProps = {
            ...newProps,
        };
        onUpdated(elemData.id, updatedProps);
    }

    const [colorPickerActive, setColorPickerActive] = useState(false);
    useEffect(() => {
        if (!colorPickerActive) {
            setPanelControls(null);
        }
    }, [colorPickerActive]);

    return (
        <>
            <div
                onClick={() => {
                    if (!colorPickerActive) {
                        setColorPickerActive(true);
                        setPanelControls(
                            <ColorPicker
                                color={
                                    elemData.style &&elemData.style.backgroundColor ||
                                    'black'
                                }
                                onChange={(color) => {
                                    onLocalUpdate({...{style:{backgroundColor: color}}});
                                }}
                                onClose={() => {
                                }}
                            />,
                        );
                    } else {
                        setColorPickerActive(false);
                    }
                }}
                style={{
                    borderRadius: 5,
                    width: 25,
                    height: 25,
                    backgroundColor: elemData.style && elemData.style.backgroundColor,
                    border: '1px solid black',
                    marginRight: '10px',
                }}
            ></div>
            <Input
                placeholder={'Button Label'}
                defaultValue={elemData.label}
                key={elemData.id + '-input'}
                onChange={(value) => {
                    onLocalUpdate({ label: value });
                }}
            />
        </>
    );
}