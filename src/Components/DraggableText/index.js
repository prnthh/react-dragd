import React, { useState, useRef, useContext, useEffect } from 'react';
import EditItem from '../DDEditor/EditItem';
import SiteContext from '../../pageContext';
import PanelControls from './PanelControls'

const defaultTextSize = 24;

const fontList = ['Arial', 'Times New Roman', 'Courier New'];

function DraggableText(props) {
    const { elemData, mode, selected } = props;
    const siteData = useContext(SiteContext);

    const fontSource = !fontList.includes(elemData.style &&elemData.style.fontFamily)
        ? 'google'
        : '';

    function onLocalUpdate(newProps) {
        var updatedProps = {
            ...newProps,
        };
        console.log(updatedProps)
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
                {fontSource == 'google' && (
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
                            href={`https://fonts.googleapis.com/css2?family=${elemData.style &&elemData.style.fontFamily
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

export default DraggableText;

function EditableDiv(props) {
    const { value, contentEditable, onChange, style } = props;
    const [text, setText] = useState(value);
    const [mobileEditing, setMobileEditing] = useState(false);
    const [cursor, setCursor] = useState(null);
    const [dragMove, setDragMove] = useState(false);
    const inputRef = useRef();
    const inputFakeRef = useRef(null);

    useEffect(()=>{
        if(mobileEditing) {
            inputFakeRef.current.focus();
        }
    }, [mobileEditing])

    function emitChange() {
        var value = inputRef.current.innerHTML;
        onChange && onChange(value);
    }

    function onPaste(e) {
        e.preventDefault();
        var text = e.clipboardData.getData('text/plain');
        document.execCommand('insertHtml', false, text);
    }

    return (<>
        {!mobileEditing && <div
            ref={inputRef}
            onPaste={onPaste}
            onInput={emitChange}
            onBlur={emitChange}
            contentEditable={contentEditable}
            onTouchStart={() => {
                !contentEditable && setDragMove(true);
            }}
            onTouchMove={()=> {
                setDragMove(true);
            }}
            onTouchEndCapture={()=>{
                contentEditable && !dragMove && setMobileEditing(true);
                setDragMove(false);
            }}
            onFocus={() => {
                setCursor('pointer');
            }}
            // onBlur={() => {
            //     setCursor(undefined);
            // }}
            style={{ cursor: cursor, ...style }}
        >
            {text}
        </div>}
        {mobileEditing && <div>
            <textarea             
                style={{ cursor: cursor, border: 'none', background: "rgba(0,0,0,0)", width: '100%', height: '100%', ...style }}
                defaultValue={text} 
                ref={inputFakeRef}
                onInput={(e)=> {onChange(value)}}
                onBlur={()=>{setMobileEditing(false)}}></textarea>
        </div>}
        </>
    );
}
