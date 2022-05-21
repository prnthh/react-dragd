import React from 'react';
import DraggableText from './DraggableText';
// import dynamic from 'next/dynamic';
// const EditItem = dynamic(() => import('./DDEditor/EditItem'));
import DraggableImage from './DraggableImage';
import DraggableDiv from './DraggableDiv';
// const DraggableText = dynamic(() => import('./DraggableText'));
import DraggableGiphy from './DraggableGiphy';
// const DraggableVideo = dynamic(() => import('./DraggableVideo'));
// const DraggableAudio = dynamic(() => import('./DraggableAudio'));
import DraggableButton from './DraggableButton';
import DraggableHtml from './DraggableHtml';
// const DraggableForm = dynamic(() => import('./DraggableForm'));
// const DraggableTemplate = dynamic(() => import('./DraggableTemplate'));
// const NextHead = dynamic(() => import('./NextHead.js'));

function ComponentSelector({ elem, selected }) {
    const isSelected = selected && selected.includes(elem.id);
    switch (elem.type) {
        // case 'test':
        //     return (
        //         <EditItem elemData={elem} selected={isSelected}>
        //             Drag Me!
        //         </EditItem>
        //     );
        case 'text':
            return (
                <DraggableText
                    elemData={elem}
                    selected={isSelected}
                />
            );
        case 'button':
            return (
                <DraggableButton
                    elemData={elem}
                    selected={isSelected}
                />
            );
        case 'image':
            return (
                <DraggableImage
                    elemData={elem}
                    selected={isSelected}
                />
            );
        case 'giphy':
            return (
                <DraggableGiphy
                    elemData={elem}
                    selected={isSelected}
                />
            );
        case 'color':
            return (
                <DraggableDiv
                    elemData={elem}
                    selected={isSelected}
                />
            );
        case 'markdown':
        case 'code':
            return (
                <DraggableHtml
                    elemData={elem}
                    selected={isSelected}
                />
            );
        default:
            return <></>;
    }
}

export default ComponentSelector;
