import React, { useState, useEffect, useContext, useRef } from 'react';
import EditItem from './DDEditor/EditItem';
import SiteContext from '../pageContext';
import { Input, Row } from '../utils/helpers';
import ColorPicker from '../utils/ui/ColorPicker';
import { isDarkColor } from '../utils/helpers';
import { styles, mergeStyles } from '../styles';
import { registerComponent } from './registry';

const linkRegEx = new RegExp(
    /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i,
);

export function ButtonSelector(props) {
    const inputRef = useRef(null);
    const [value, setValue] = useState('https://');
    const [buttonType, setButtonType] = useState('link'); // 'link' or 'javascript'
    const [buttonLabel, setButtonLabel] = useState('Click me');

    const isValidUrl = buttonType === 'link' ? linkRegEx.test(value) : true;
    const canAdd = buttonType === 'link' ? isValidUrl : value.trim().length > 0;

    return (
        <>
            <div style={styles.clabel}>ADD A BUTTON</div>
            
            {/* Button type selector */}
            <div style={{ marginBottom: '15px' }}>
                <button
                    style={{
                        padding: '8px 16px',
                        marginRight: '8px',
                        backgroundColor: buttonType === 'link' ? '#007acc' : '#ddd',
                        color: buttonType === 'link' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        setButtonType('link');
                        setValue('https://');
                    }}
                >
                    Link Button
                </button>
                <button
                    style={{
                        padding: '8px 16px',
                        backgroundColor: buttonType === 'javascript' ? '#007acc' : '#ddd',
                        color: buttonType === 'javascript' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        setButtonType('javascript');
                        setValue('alert("Hello!");');
                    }}
                >
                    JavaScript Button
                </button>
            </div>

            {/* Button label input */}
            <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '0.9em', marginBottom: '5px', opacity: 0.7 }}>
                    Button Label:
                </div>
                <input
                    style={mergeStyles(styles.minimalInput, {
                        display: 'flex',
                        width: '100%',
                        maxWidth: '500px',
                        fontFamily: 'Courier New',
                        fontSize: '1em',
                    })}
                    value={buttonLabel}
                    onChange={(e) => {
                        setButtonLabel(e.target.value);
                    }}
                    placeholder="Button text"
                />
            </div>

            {/* Input for URL or JavaScript */}
            <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '0.9em', marginBottom: '5px', opacity: 0.7 }}>
                    {buttonType === 'link' ? 'URL:' : 'JavaScript Code:'}
                </div>
                <textarea
                    style={mergeStyles(styles.minimalInput, {
                        display: 'flex',
                        width: '100%',
                        maxWidth: '500px',
                        fontFamily: 'Courier New',
                        fontSize: '1em',
                        color: canAdd ? 'green' : 'red',
                        minHeight: buttonType === 'javascript' ? '100px' : '40px',
                        resize: 'vertical',
                    })}
                    ref={inputRef}
                    autoFocus={true}
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    placeholder={
                        buttonType === 'link'
                            ? 'https://example.com'
                            : 'console.log("Clicked!")'
                    }
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                    style={{
                        padding: '8px 20px',
                        backgroundColor: '#ddd',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                    onClick={() => {
                        props.close();
                    }}
                >
                    Cancel
                </button>
                <button
                    disabled={!canAdd}
                    style={{
                        padding: '8px 20px',
                        backgroundColor: canAdd ? '#007acc' : '#ccc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: canAdd ? 'pointer' : 'not-allowed',
                    }}
                    onClick={() => {
                        if (canAdd) {
                            props.addItemToList({
                                type: 'button',
                                size: {
                                    width: 200,
                                    height: 50,
                                },
                                label: buttonLabel,
                                buttonType: buttonType,
                                url: buttonType === 'link' ? value : undefined,
                                jsCode: buttonType === 'javascript' ? value : undefined,
                                style: {
                                    backgroundColor: '#007acc',
                                    color: 'white',
                                },
                            });
                            props.close();
                        }
                    }}
                >
                    Add Button
                </button>
            </div>
            
            {/* Social media shortcuts - only for link buttons */}
            {buttonType === 'link' && (
                <>
                    <div
                        style={{
                            width: '100%',
                            height: 1,
                            backgroundColor: `rgba(0,0,0,0.3)`,
                            margin: '15px 0px 15px',
                        }}
                    />
                    <div style={{ fontSize: '0.9em', marginBottom: '10px', opacity: 0.7 }}>
                        Quick Links:
                    </div>
                    <Row style={{ overflow: 'scroll', width: '100%', fontSize: 30 }}>
                        {[
                            ['https://', 'fas fa-link', 'Any Link'],
                            ['https://instagram.com/', 'fab fa-instagram', 'Instagram'],
                            ['https://twitter.com/', 'fab fa-twitter', 'Twitter'],
                            ['https://discord.gg/', 'fab fa-discord', 'Discord'],
                            ['https://www.youtube.com/channel/', 'fab fa-youtube', 'Youtube'],
                            ['https://paypal.me/', 'fab fa-paypal', 'Paypal'],
                            ['https://linkedin.com/', 'fab fa-linkedin', 'LinkedIn'],
                        ].map((elem, idx) => {
                            return (
                                <div
                                    key={idx}
                                    style={mergeStyles(
                                        styles.cbutton,
                                        styles.cbuttoninner,
                                        { width: '50px', height: '40px' },
                                    )}
                                    onClick={() => {
                                        setValue(elem[0]);
                                        inputRef.current.focus();
                                    }}
                                >
                                    <i className={elem[1]}></i>
                                </div>
                            );
                        })}
                    </Row>
                </>
            )}
        </>
    );
}

function PanelControls({ elemData, setPanelControls }) {
    const siteData = useContext(SiteContext);
    const { onUpdateDiv: onUpdated } = siteData;

    function onLocalUpdate(newProps) {
        var updatedProps = {
            ...newProps,
        };
        onUpdated(elemData.id, updatedProps);
    }

    const [colorPickerActive, setColorPickerActive] = useState(false);
    const buttonType = elemData.buttonType || 'link';

    useEffect(() => {
        if (!colorPickerActive) {
            setPanelControls(null);
        }
    }, [colorPickerActive, setPanelControls]);

    return (
        <>
            <div
                onClick={() => {
                    if (!colorPickerActive) {
                        setColorPickerActive(true);
                        setPanelControls(
                            <ColorPicker
                                color={
                                    (elemData.style &&
                                        elemData.style.backgroundColor) ||
                                    'black'
                                }
                                onChange={(color) => {
                                    onLocalUpdate({
                                        ...{ style: { backgroundColor: color } },
                                    });
                                }}
                                onClose={() => {}}
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
                    backgroundColor:
                        elemData.style && elemData.style.backgroundColor,
                    border: '1px solid black',
                    marginRight: '10px',
                }}
            ></div>
            <Input
                placeholder={'Button Label'}
                defaultValue={elemData.label}
                key={elemData.id + '-input-label'}
                onChange={(value) => {
                    onLocalUpdate({ label: value });
                }}
            />
            {buttonType === 'link' ? (
                <Input
                    placeholder={'Button URL'}
                    defaultValue={elemData.url}
                    key={elemData.id + '-input-url'}
                    onChange={(value) => {
                        onLocalUpdate({ url: value });
                    }}
                />
            ) : (
                <Input
                    placeholder={'JavaScript Code'}
                    defaultValue={elemData.jsCode}
                    key={elemData.id + '-input-js'}
                    onChange={(value) => {
                        onLocalUpdate({ jsCode: value });
                    }}
                />
            )}
        </>
    );
}

function DraggableButton(props) {
    const { elemData } = props;

    const siteData = useContext(SiteContext);
    const { setSelected: onSelect, onUpdateDiv: onUpdated, mode } = siteData;

    const handleClick = () => {
        if (mode === 'edit') return;
        
        const buttonType = elemData.buttonType || 'link';
        
        if (buttonType === 'link' && elemData.url) {
            window.location.href = elemData.url;
        } else if (buttonType === 'javascript' && elemData.jsCode) {
            try {
                // Create a function from the JS code and execute it
                const func = new Function(elemData.jsCode);
                func();
            } catch (error) {
                console.error('Error executing button JavaScript:', error);
                alert('Error executing JavaScript: ' + error.message);
            }
        }
    };

    return (
        <>
            <EditItem
                key={elemData.id}
                elemData={elemData}
                onSelect={onSelect}
                onUpdated={onUpdated}
                selected={props.selected}
                renderPanel={PanelControls}
                mode={mode}
            >
                {
                    <button
                        key={elemData.id}
                        style={{
                            width: '100%',
                            height: '100%',
                            color: isDarkColor(
                                elemData.style && elemData.style.backgroundColor,
                            )
                                ? 'white'
                                : 'black',
                            cursor: mode === 'edit' ? 'default' : 'pointer',
                            ...elemData.style,
                        }}
                        onClick={handleClick}
                    >
                        {elemData.label || 'Button'}
                    </button>
                }
            </EditItem>
        </>
    );
}

// Register this component
registerComponent({
    type: 'button',
    Component: DraggableButton,
    Selector: ButtonSelector,
    button: {
        icon: 'fas fa-link',
        label: 'Add Button',
        action: 'modal',
        selector: 'button',
    },
});

export default DraggableButton;