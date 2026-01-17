import React, { useState, useContext } from 'react';
import { guidGenerator } from '../utils/helpers';
import SiteContext from '../pageContext';
import { styles, mergeStyles } from '../styles';

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
                    top: elemData.pos.y,
                    left: elemData.pos.x,
                    transform: 'translateX(-50%)',
                    zIndex: 99999999999,
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: `translateX(-50%) translateY(calc(-100% - 20px))`,
                        pointerEvents: 'auto',
                    }}
                    onClick={handleEvent}
                    onMouseDown={handleEvent}
                    onTouchStart={handleEvent}
                >
                    {secondaryPanel && (
                        <div
                            onClick={(e)=>{e.stopPropagation();}}
                            style={mergeStyles(styles.cpanel, styles.cpanelShadow, {
                                padding: 10,
                                marginBottom: 5,
                                width: 'fit-content',
                                position: 'relative',
                            })}
                        >
                            {secondaryPanel}
                        </div>
                    )}
                    <div
                        style={mergeStyles(styles.cpanel, styles.cpanelShadow, {
                            padding: 10,
                            position: 'relative',
                        })}
                    >
                        <div style={styles.flexRow}>
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
                                style={mergeStyles(styles.cbutton, styles.cbuttoninner)}
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
                                style={mergeStyles(styles.cbutton, styles.cbuttoninner)}
                                onClick={() => {
                                    saveElemJson({
                                        zIndex: elemData.zIndex + 1000,
                                    });
                                }}
                            >
                                <i className="fas fa-arrow-circle-up"></i>
                            </div>
                            <div
                                style={mergeStyles(styles.cbutton, styles.cbuttoninner)}
                                onClick={() => {
                                    saveElemJson({
                                        zIndex: elemData.zIndex - 1000,
                                    });
                                }}
                            >
                                <i className="fas fa-arrow-circle-down"></i>
                            </div>
                            <div
                                style={mergeStyles(styles.cbutton, styles.cbuttoninner)}
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
                                style={mergeStyles(styles.cbutton, styles.cbuttoninner)}
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
                style={mergeStyles(styles.minimalInput, { display: 'flex', flexGrow: 1 })}
                autoFocus={true}
                defaultValue={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            />
            <button
                onClick={() => {
                    props.onComplete(value);
                }}
            >
                Set
            </button>
        </div>
    );
}

export default DefaultControlPanel;
