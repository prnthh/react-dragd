import React from 'react';
import { styles, mergeStyles } from '../../styles';

function GenericModal(props) {
    return (
        <div 
            style={mergeStyles(styles.dragdModal, { zIndex: 999999999999 })}
            onClick={() => props.onDone()}
        >
            <div 
                style={styles.dragdModalContent}
                onClick={(e) => e.stopPropagation()}
            >
                <div>
                    {props.content && props.content}
                </div>
            </div>
        </div>
    );
}

export default GenericModal;
