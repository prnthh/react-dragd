import React, { useState } from 'react';

function GenericModal(props) {
    return (
        <div className="dragd-modal" style={{ zIndex: 999999999999 }}>
            <div className="dragd-modal-background" onClick={() => props.onDone()} />
            <div className="modal-content">
                <div className="card-content">
                    {props.content && props.content}
                </div>
            </div>
        </div>
    );
}

export default GenericModal;
