import React, { useContext, useEffect, useRef, useState } from 'react';
import EditItem from '../DDEditor/EditItem';
import SiteContext from '../../pageContext';
import PanelControls from './PanelControls';
import { isDarkColor } from '../../utils/helpers';

function DraggableButton(props) {
    const { elemData, selected } = props;

    const siteData = useContext(SiteContext);
    const {
        setSelected: onSelect,
        onUpdateDiv: onUpdated,
        mode,
        setModal,
    } = siteData;

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
                        className={'button'}
                        style={{
                            width: '100%',
                            height: '100%',
                            color: isDarkColor(elemData.style &&elemData.style.backgroundColor) ? 'black' : 'black',
                            ...elemData.style,
                        }}
                        onClick={() => {
                            if (mode != 'edit' && elemData.url)
                                window.location.href = elemData.url;
                        }}
                    >
                        {elemData.label}
                    </button>
                }
            </EditItem>
        </>
    );
}

export default DraggableButton;
