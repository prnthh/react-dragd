import React, { useState, useContext } from 'react';
import { guidGenerator } from '../utils/helpers';
import SiteContext from '../pageContext';

function DefaultControlPanel({
    saveElemJson,
    elemData,
    setModal,
    CustomPanel,
    onLocalUpdate,
}) {
    const {deleteItemFromList, addItemToList} = useContext(SiteContext);
    const [secondaryPanel, setSecondaryPanel] = useState(null);

    const handleEvent = (e) => {
        e.stopPropagation();
    };

    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: elemData.pos.y - elemData.size.height / 2,
                    left: elemData.pos.x,
                    zIndex: 99999999999,
                    display: 'flex',
                    justifyContent: 'center',
                }}
                onClick={handleEvent}
                onMouseDown={handleEvent}
                onTouchStart={handleEvent}
            >
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(0, calc(-100% - 20px))`,
                    }}
                >
                    {secondaryPanel && (
                        <div
                            onClick={(e)=>{e.stopPropagation();}}
                            className={'cpanel cpanel-shadow'}
                            style={{
                                padding: 10,
                                marginBottom: 5,
                                width: 'fit-content',
                                position: 'relative',
                            }}
                        >
                            {secondaryPanel}
                        </div>
                    )}
                    <div
                        className={'cpanel cpanel-shadow'}
                        style={{
                            padding: 10,
                            position: 'relative',
                        }}
                    >
                        <div className={'flexRow'}>
                            {CustomPanel && (
                                <CustomPanel
                                    setPanelControls={setSecondaryPanel}
                                    setModal={setModal}
                                    onLocalUpdate={onLocalUpdate}
                                    elemData={elemData}
                                />
                            )}
                            {CustomPanel && (
                                <div
                                    style={{
                                        height: 20,
                                        margin: '2px 6px 2px 6px',
                                        width: 1,
                                        backgroundColor: 'lightgrey',
                                    }}
                                />
                            )}
                            <div
                                className={'cbutton cbuttoninner'}
                                onClick={() => {
                                    setModal(
                                        <UriInputModal
                                            prefill={elemData.href}
                                            onComplete={(data) => {
                                                saveElemJson({ href: data });
                                                setModal(null);
                                            }}
                                        />,
                                    );
                                }}
                            >
                                <i className="fas fa-link"></i>
                            </div>
                            <div
                                className={'cbutton cbuttoninner'}
                                onClick={() => {
                                    saveElemJson({
                                        zIndex: elemData.zIndex + 1000,
                                    });
                                }}
                            >
                                <i className="fas fa-arrow-circle-up"></i>
                            </div>
                            <div
                                className={'cbutton cbuttoninner'}
                                onClick={() => {
                                    saveElemJson({
                                        zIndex: elemData.zIndex - 1000,
                                    });
                                }}
                            >
                                <i className="fas fa-arrow-circle-down"></i>
                            </div>
                            <div
                                className={'cbutton cbuttoninner'}
                                onClick={() => {
                                    addItemToList({...elemData, 
                                        pos: {x: elemData.pos.x + 10, y: elemData.pos.y + 10}, 
                                        id: new guidGenerator()
                                    });
                                }}
                            >
                                <i className="fas fa-copy"></i>
                            </div>
                            <div
                                className={'cbutton cbuttoninner'}
                                onClick={() => {
                                    deleteItemFromList(elemData.id);
                                }}
                            >
                                <i
                                    className="fas fa-trash-alt"
                                    style={{ color: 'red' }}
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function UriInputModal(props) {
    console.log(props);
    const [value, setValue] = useState(props.prefill || 'https://');
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <input
                className={'minimal-input'}
                style={{ display: 'flex', flexGrow: 1 }}
                autoFocus={true}
                defaultValue={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            ></input>
            <button
                className={'button'}
                onClick={() => {
                    props.onComplete(value);
                }}
            >
                Set
            </button>
            <div className="is-divider" data-content="OR"></div>
        </div>
    );
}

export default DefaultControlPanel;
