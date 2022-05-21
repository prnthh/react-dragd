import React, { useContext, useState } from 'react';
import EditItem from './DDEditor/EditItem';
import ColorPicker from '../utils/ui/ColorPicker';
import SiteContext from '../pageContext';

function DraggableImage(props) {
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

    function setBgColor(color) {
        onLocalUpdate({
            style: {
                ...elemData.style,
                backgroundColor: color,
            },
        });
    }

    function setBorderColor(color) {
        onLocalUpdate({
            style: {
                ...elemData.style,
                borderColor: color,
            },
        });
    }

    function PanelControls({ setPanelControls }) {
        const [active, setActive] = useState(false);
        return (
            <>
                <div
                    onClick={() => {
                        if (!active) {
                            setActive(true);
                            setPanelControls(
                                <>
                                    <div>
                                        <ColorPicker
                                            color={
                                                elemData.style
                                                    .backgroundColor || 'black'
                                            }
                                            onChange={(color) => {
                                                setBgColor(color);
                                            }}
                                            onClose={() => {
                                                setActive(false);
                                                setPanelControls(null);
                                            }}
                                        />
                                    </div>
                                </>,
                            );
                        } else {
                            setActive(false);
                            setPanelControls();
                        }
                    }}
                    style={{
                        borderRadius: 5,
                        width: 25,
                        height: 25,
                        backgroundColor: elemData.style &&elemData.style.backgroundColor,
                        border: '2px solid black',
                    }}
                ></div>
                <div style={{ padding: 5 }} />
                <div
                    onClick={() => {
                        if (!active) {
                            setActive(true);
                            setPanelControls(
                                <>
                                    <div>
                                        <ColorPicker
                                            color={
                                                elemData.style
                                                    .backgroundColor || 'black'
                                            }
                                            onChange={(color) => {
                                                setBorderColor(color);
                                            }}
                                            onClose={() => {
                                                setActive(false);
                                                setPanelControls(null);
                                            }}
                                        />
                                    </div>
                                </>,
                            );
                        } else {
                            setActive(false);
                            setPanelControls();
                        }
                    }}
                    style={{
                        borderRadius: 5,
                        width: 25,
                        height: 25,
                        borderStyle: 'solid',
                        borderColor: elemData.style && elemData.style.borderColor,
                        borderWidth: 2,
                    }}
                ></div>
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
                mode={mode}
            >
                <div
                    style={{ width: '100%', height: '100%', ...elemData.style }}
                />
            </EditItem>
        </>
    );
}

export default DraggableImage;
