import DropDownMenu from '../../utils/ui/DropDownMenu';
// import fonts from '../../helpers/ui/fonts.json';
// import ColorPicker from '../../helpers/ui/ColorPicker';
// import analytics from '../../../../util/analytics';
import React, { useEffect, useState } from 'react';

// const googleFonts = fonts['googleFonts'];
const fontList = ['Arial', 'Times New Roman', 'Courier New',];

export default function PanelControls({
    onLocalUpdate,
    elemData,
    setPanelControls,
}) {
    // const [colorPickerActive, setColorPickerActive] = useState(false);
    // // effect to set panel controls to null
    // useEffect(() => {
    //     if (!colorPickerActive) {
    //         setPanelControls(null);
    //     }
    // }, [colorPickerActive]);

    let alignDirections = ['left', 'center', 'right'];
    let alignIcon = ['align-left', 'align-center', 'align-right'];
    let currentDirection = alignDirections.indexOf(elemData.style && elemData.style.textAlign);
    currentDirection = currentDirection < 0 ? 1 : currentDirection;
    return (
        <>
            {/* <div
                onClick={() => {
                    if(!colorPickerActive){
                        setPanelControls(
                            <>
                                <div>
                                    <ColorPicker
                                        color={
                                            elemData.style && elemData.style.backgroundColor ||
                                            'black'
                                        }
                                        onChange={(color) => {
                                            console.log("color", color);
                                            onLocalUpdate({ style: {...elemData.style, color: color} });
                                        }}
                                        onClose={() => {
                                            // setPanelControls(null);
                                        }}
                                    />
                                </div>
                            </>,
                        );
                        setColorPickerActive(true);
                    } else {
                        setColorPickerActive(false);
                    }
                }}
                style={{
                    borderRadius: 100,
                    width: 25,
                    height: 25,
                    backgroundColor: elemData.style && elemData.style.color,
                    border: '2px solid black',
                    cursor: 'pointer',
                }}
            ></div> */}
            <div style={{ padding: 5 }} />
            <DropDownMenu
                            key={elemData.id+'-color'}
                options={fontList}
                selectedOption={elemData.style && elemData.style.fontFamily}
                onSelect={(font) => {
                    onLocalUpdate({ style: {fontFamily: font} });
                }}
                type={'font'}
            />
            <div style={{ padding: 2 }} />
            <DropDownMenu
                options={[14, 18, 20, 24, 30, 36, 48, 72, 90]}
                selectedOption={elemData.style && elemData.style.fontSize.replace(/[^0-9]/g, '')}
                onSelect={(selectedValue) => {
                    onLocalUpdate({ style: {fontSize: selectedValue + 'px' }});
                }}
            />
            <div style={{ padding: 5 }} />

            <div className={`cbutton cbuttoninner ${elemData.style && elemData.style.fontWeight === 'bold' ? 'cbuttoninner-selected' : ''}`}>
            <i
                className={`fas fa-bold`}
                onClick={() => {
                    elemData.style && elemData.style.fontWeight === 'bold'?
                    onLocalUpdate({style: {fontWeight: 'normal'}}):
                    onLocalUpdate({style: {fontWeight: 'bold'}});
                    
                }}
            />
            </div>
            <div style={{ padding: 5 }} />

            <div className={`cbutton cbuttoninner ${elemData.style && elemData.style.fontStyle === 'italic' ? 'cbuttoninner-selected' : ''}`}>
            <i
                className={`fas fa-italic`}
                onClick={() => {
                    elemData.style && elemData.style.fontStyle === 'italic'?
                    onLocalUpdate({style: {fontStyle: 'normal'}}):
                    onLocalUpdate({style: {fontStyle: 'italic'}});
                    
                }}
            />
            </div>
            <div style={{ padding: 5 }} />

            <div className={`cbutton cbuttoninner`}>
            <i
                className={`fas fa-${alignIcon[currentDirection]}`}
                onClick={() => {
                    onLocalUpdate({
                        style: {
                            textAlign:
                                alignDirections[
                                    (currentDirection + 1) %
                                        alignDirections.length
                                ],
                        },
                    });
                }}
            /></div>
            <div style={{ padding: 2 }} />
        </>
    );
}
