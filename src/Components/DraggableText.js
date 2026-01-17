import React, { useState, useRef, useContext, useEffect } from 'react';
import EditItem from './DDEditor/EditItem';
import SiteContext from '../pageContext';
import DropDownMenu from '../utils/ui/DropDownMenu';
import { styles, mergeStyles } from '../styles';
import { registerComponent } from './registry';

const fallbackGoogleFonts = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Source Sans 3',
    'Nunito',
    'Merriweather',
    'Playfair Display',
    'Raleway',
];

function DraggableText(props) {
    const { elemData, mode } = props;
    const siteData = useContext(SiteContext);

    const [fontOptions, setFontOptions] = useState(fallbackGoogleFonts);
    const selectedFont = elemData.style && elemData.style.fontFamily;
    const selectedFontEncoded = selectedFont
        ? selectedFont.split(' ').join('+')
        : null;

    useEffect(() => {
        let cancelled = false;

        async function loadGoogleFonts() {
            try {
                const response = await fetch(
                    'https://fonts.google.com/metadata/fonts',
                );
                const text = await response.text();
                const parsed = JSON.parse(text.replace(/^\)\]\}'\n/, ''));
                const families = parsed.familyMetadataList
                    .map((font) => font.family)
                    .filter(Boolean);
                if (!cancelled && families.length) {
                    setFontOptions(families);
                }
            } catch (err) {
                if (!cancelled) {
                    setFontOptions(fallbackGoogleFonts);
                }
            }
        }

        if (typeof window !== 'undefined') {
            loadGoogleFonts();
        }

        return () => {
            cancelled = true;
        };
    }, []);

    const fontOptionsWithSelection = selectedFont
        ? [selectedFont, ...fontOptions.filter((font) => font !== selectedFont)]
        : fontOptions;

    function PanelControls({
        onLocalUpdate,
        elemData,
        setPanelControls,
    }) {
        let alignDirections = ['left', 'center', 'right'];
        let alignIcon = ['align-left', 'align-center', 'align-right'];
        let currentDirection = alignDirections.indexOf(
            elemData.style && elemData.style.textAlign,
        );
        currentDirection = currentDirection < 0 ? 1 : currentDirection;
        return (
            <>
                <div style={{ padding: 5 }} />
                <DropDownMenu
                    key={elemData.id + '-font'}
                    options={fontOptionsWithSelection}
                    selectedOption={selectedFont}
                    onSelect={(font) => {
                        onLocalUpdate({ style: { fontFamily: font } });
                    }}
                    type={'font'}
                />
                <div style={{ padding: 2 }} />
                <DropDownMenu
                    options={[14, 18, 20, 24, 30, 36, 48, 72, 90]}
                    selectedOption={
                        elemData.style &&
                        elemData.style.fontSize &&
                        elemData.style.fontSize.replace(/[^0-9]/g, '')
                    }
                    onSelect={(selectedValue) => {
                        onLocalUpdate({
                            style: { fontSize: selectedValue + 'px' },
                        });
                    }}
                />
                <div style={{ padding: 5 }} />

                <div
                    style={mergeStyles(
                        styles.cbutton,
                        styles.cbuttoninner,
                        elemData.style &&
                            elemData.style.fontWeight === 'bold' &&
                            styles.cbuttoninnerSelected,
                    )}
                >
                    <i
                        className={`fas fa-bold`}
                        onClick={() => {
                            elemData.style &&
                            elemData.style.fontWeight === 'bold'
                                ? onLocalUpdate({
                                      style: { fontWeight: 'normal' },
                                  })
                                : onLocalUpdate({
                                      style: { fontWeight: 'bold' },
                                  });
                        }}
                    />
                </div>
                <div style={{ padding: 5 }} />

                <div
                    style={mergeStyles(
                        styles.cbutton,
                        styles.cbuttoninner,
                        elemData.style &&
                            elemData.style.fontStyle === 'italic' &&
                            styles.cbuttoninnerSelected,
                    )}
                >
                    <i
                        className={`fas fa-italic`}
                        onClick={() => {
                            elemData.style &&
                            elemData.style.fontStyle === 'italic'
                                ? onLocalUpdate({
                                      style: { fontStyle: 'normal' },
                                  })
                                : onLocalUpdate({
                                      style: { fontStyle: 'italic' },
                                  });
                        }}
                    />
                </div>
                <div style={{ padding: 5 }} />

                <div style={mergeStyles(styles.cbutton, styles.cbuttoninner)}>
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
                    />
                </div>
                <div style={{ padding: 2 }} />
            </>
        );
    }

    function onLocalUpdate(newProps) {
        var updatedProps = {
            ...newProps,
        };
        console.log(updatedProps);
        siteData.onUpdateDiv(elemData.id, updatedProps);
    }

    return (
        <>
            <EditItem
                elemData={elemData}
                selected={props.selected}
                renderPanel={props.selected && PanelControls}
                onLocalUpdate={onLocalUpdate}
                mode={mode}
            >
                {selectedFontEncoded && (
                    <>
                        <link
                            rel="preconnect"
                            href="https://fonts.googleapis.com"
                        ></link>
                        <link
                            rel="preconnect"
                            href="https://fonts.gstatic.com"
                        ></link>
                        <link
                            href={`https://fonts.googleapis.com/css2?family=${elemData.style &&
                                elemData.style.fontFamily &&
                                elemData.style.fontFamily
                                    .split(' ')
                                    .join('+')}&display=swap`}
                            rel="stylesheet"
                        ></link>
                    </>
                )}
                <EditableDiv
                    value={elemData.text}
                    contentEditable={props.selected}
                    key={elemData.id + '-' + elemData.fontSize}
                    onChange={(text) => {
                        onLocalUpdate({ text: text });
                    }}
                    style={{
                        ...elemData.style,
                    }}
                />
            </EditItem>
        </>
    );
}

// Register this component
registerComponent({
    type: 'text',
    Component: DraggableText,
    button: {
        icon: 'fas fa-font',
        label: 'Add Text',
        action: 'add',
        object: {
            type: 'text',
            text: 'click to edit!',
            fontSize: '48px',
            color: 'black',
            size: { width: 200, height: 100 },
        },
    },
});

export default DraggableText;

function EditableDiv(props) {
    const { value, contentEditable, onChange, style } = props;
    const [text, setText] = useState(value);
    const [mobileEditing, setMobileEditing] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [dragMove, setDragMove] = useState(false);
    const inputRef = useRef();
    const inputFakeRef = useRef(null);

    useEffect(() => {
        if (mobileEditing) {
            inputFakeRef.current.focus();
        }
    }, [mobileEditing]);

    function emitChange() {
        var value = inputRef.current.innerHTML;
        onChange && onChange(value);
    }

    function onPaste(e) {
        e.preventDefault();
        var text = e.clipboardData.getData('text/plain');
        document.execCommand('insertHtml', false, text);
    }

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {!mobileEditing && (
                <div
                    ref={inputRef}
                    onPaste={onPaste}
                    onInput={emitChange}
                    onBlur={emitChange}
                    contentEditable={contentEditable}
                    onTouchStart={() => {
                        !contentEditable && setDragMove(true);
                    }}
                    onTouchMove={() => {
                        setDragMove(true);
                    }}
                    onTouchEndCapture={() => {
                        contentEditable && !dragMove && setMobileEditing(true);
                        setDragMove(false);
                    }}
                    onFocus={() => {
                        setCursor('pointer');
                    }}
                    style={{ cursor: cursor, width: '100%', height: '100%', ...style }}
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            )}
            {mobileEditing && (
                <textarea
                    style={{
                        cursor: cursor,
                        boxSizing: 'border-box',
                        border: 'none',
                        background: 'rgba(0,0,0,0)',
                        width: '100%',
                        height: '100%',
                        display: 'block',
                        resize: 'none',
                        padding: 0,
                        margin: 0,
                        outline: 'none',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        ...style,
                    }}
                    defaultValue={text}
                    ref={inputFakeRef}
                    onInput={(e) => {
                        const newValue = e.target.value;
                        setText(newValue);
                        onChange(newValue);
                    }}
                    onBlur={() => {
                        setMobileEditing(false);
                    }}
                ></textarea>
            )}
        </div>
    );
}