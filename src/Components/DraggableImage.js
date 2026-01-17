import React, { useState, useEffect, useContext } from 'react';
import { Input } from '../utils/helpers';
import SiteContext from '../pageContext';
import EditItem from './DDEditor/EditItem';
import { styles, mergeStyles } from '../styles';
import { registerComponent } from './registry';

function DraggableImage(props) {
    const { elemData, selected } = props;
    const siteData = useContext(SiteContext);
    const { setSelected: onSelect, onUpdateDiv: onUpdated, mode, setModal } = siteData;

    function onLocalUpdate(newProps) {
        var updatedProps = {
            ...newProps,
        };
        onUpdated(elemData.id, updatedProps);
    }

    function setImageUri(uri) {
        onLocalUpdate({ imageUri: uri });
    }

    function toDataURL(src, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = typeof window !== "undefined" && document.createElement('CANVAS');
            // @ts-expect-error TODO: getContext exists on canvas, investigate
            var ctx = canvas.getContext('2d');
            var dataURL;
            // @ts-expect-error TODO: naturalHeight exists on canvas, investigate
            canvas.height = this.naturalHeight;
            // @ts-expect-error TODO: naturalWidth exists on canvas, investigate
            canvas.width = this.naturalWidth;
            ctx.drawImage(this, 0, 0);
            // @ts-expect-error TODO: toDateURL exists on canvas, investigate
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            return dataURL;
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src =
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            img.src = src;
        }
    }

    async function loadImageToUri() {
        // @ts-expect-error TODO: window fs access not allowed in strict
        const [file] = await window.showOpenFilePicker();
        const locFile = await file.getFile();
        console.log(locFile);
        const stream = await locFile.arrayBuffer();
        console.log(stream);
        var blob = new Blob([stream], { type: locFile.type });
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);

        toDataURL(
            imageUrl,
            (dataUrl) => {
                console.log(dataUrl);
                setImageUri(dataUrl);
            },
            locFile.type,
        );
    }

    function PanelControls() {
        return (
            <>
                <Input
                    placeholder={'src'}
                    value={elemData.imageUri}
                    onChange={(value) => {
                        setImageUri(value);
                    }}
                />

                <div
                    style={mergeStyles(styles.cbutton, styles.cbuttoninner)}
                    onClick={() => {
                        loadImageToUri();
                    }}
                >
                    <img
                        style={{
                            width: '18px',
                            height: '18px',
                            marginLeft: '8px',
                        }}
                        src="https://i.imgur.com/rFn3Kjx.png"
                    />
                </div>

                <div
                    style={mergeStyles(styles.cbutton, styles.cbuttoninner, { marginLeft: '8px' })}
                    onClick={() => {
                        onLocalUpdate({ maxWidth: !elemData.maxWidth });
                    }}
                >
                    <i className="fas fa-arrows-alt-h" />
                </div>
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
                renderPanel={PanelControls}
                mode={mode}
            >
                {!elemData.imageUri ? (
                    <center>Set an image URL</center>
                ) : (
                    <img
                        style={{ width: '100%', height: '100%' }}
                        src={elemData.imageUri}
                    />
                )}
            </EditItem>
        </>
    );
}

// Register this component
registerComponent({
    type: 'image',
    Component: DraggableImage,
    button: {
        icon: 'fas fa-image',
        label: 'Add Image',
        action: 'add',
        object: {
            type: 'image',
            size: { width: 100, height: 100 },
            imageUri: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
        },
    },
});

export default DraggableImage;
