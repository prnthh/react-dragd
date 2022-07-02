import React, {useState, useEffect, useCallback} from 'react';
import GenericModal from './utils/ui/GenericModal';
import { Column, debounce, getMobileScaleRatio, guidGenerator, mergeDeep } from './utils/helpers';
import SiteContext from './pageContext';
import MobileBoundary from './utils/ui/MobileBoundary';
import Menu from './EditMenu/EditMenu';
import ComponentSelector from './Components/ComponentSelector';

export var EditorModes = {
  EDIT: 'edit',
  VIEW: 'view',
}

function DragDrop({
  immutable= false,
  saveCallback,
  onChangedCallback,
  initialState,
  pending,
}) {
  const [items, setItems] = useState(initialState || {});
  const [selected, setSelected] = useState([]);
  const [mode, setMode] = useState(EditorModes.VIEW);
  const [modal, setModal] = useState(null);

  const [pastItems, setPastItems] = useState([initialState || {}]);
  const [undoCount, setUndoCount] = useState(0);

  const [pageHeight, setPageHeight] = useState(0);
  const [pageWidth, setPageWidth] = useState(0);

  function deleteItemFromList(key) {
    var newItems = items;
    newItems[key] && delete newItems[key];
    setItems(newItems);
    debounceElemdataHistoryUpdate(pastItems, newItems, undoCount);
    setSelected([]);
  }

  function onUpdateDiv(divId, newProps) {
    var oldItems = items[divId] || {};
    const updatedItems = {
        ...items,
        [divId]: {...mergeDeep(oldItems, newProps)},
    };
    debounceElemdataHistoryUpdate(pastItems, updatedItems, undoCount);
    setItems(updatedItems);
}

  function undo(e) {
    setItems(pastItems[pastItems.length - 1 - (undoCount + 1)]);
    setUndoCount(undoCount + 1);

    e.stopPropagation();
  }

  function redo(e) {
      setItems(pastItems[pastItems.length - 1 - (undoCount - 1)]);
      setUndoCount(undoCount - 1);

      e.stopPropagation();
  }

  function onSaveClicked() {
      if (!immutable) {
          setMode(EditorModes.VIEW);
          saveCallback && saveCallback(items);
      }
  }

  function onEditClicked() {
      setMode(EditorModes.EDIT);
  }

  function addItemToList(data, id) {
    var newItem = {
        id: id || guidGenerator(),
        pos: { x: 200, y: 200 },
        rot: { deg: 0 },
        zIndex: 10000 + Object.keys(items).length,
        type: 'text',
        ...data,
    };
    const updatedItems = { ...items, [newItem.id]: newItem };
    setItems(updatedItems);
    debounceElemdataHistoryUpdate(pastItems, updatedItems, undoCount);
    setSelected([newItem.id]);
}

  const debounceElemdataHistoryUpdate = useCallback(
    debounce((oldItemsList, newItem, undoCount) => {
        if (undoCount > 0) {
            setPastItems([...oldItemsList.slice(0, -undoCount), newItem]);
            setUndoCount(0);
        } else {
            setPastItems([...oldItemsList, newItem]);
        }
        onChangedCallback && onChangedCallback(newItem);
    }, 1000),
    [],
);


  const providerValues = {
    items: items,
    selected: selected,
    setSelected: (item) => {
        setSelected([item]);
        // setSelected([...selected, item])
    },
    deleteItemFromList: deleteItemFromList,
    addItemToList: addItemToList,
    onUpdateDiv: onUpdateDiv,
    mode: mode,
    setModal: setModal,
  };

  return (
    <>
    <link href="//use.fontawesome.com/releases/v5.10.1/css/all.css" rel="stylesheet"></link>
    <SiteContext.Provider value={providerValues}>
    <div
                style={{
                    width: '100vw',
                    maxWidth: '100vw',
                    overflow: 'hidden',
                    minHeight: '100vh',
                    height: pageWidth ? (pageHeight * getMobileScaleRatio()) : undefined,
                }}
                onClick={(e) => {
                    console.log('bg got clicked now');
                    setSelected(['bg']);
                    console.log(e);
                }}
            >
                <div style={{ transform:`scale(${pageWidth? getMobileScaleRatio(): 1})` }}>
                    <div
                        style={{
                            transform:
                            pageWidth
                                    ? `translateX(${
                                        typeof window !== "undefined" && window.innerWidth / 2
                                      }px)`
                                    : `translateX(50%)`,
                        }}
                    >
          {Object.keys(items).map((key) => {
              var elem = items[key];
              if (
                  elem.pos.y + elem.size.height / 2 >
                  pageHeight
              ) {
                  setPageHeight(
                      elem.pos.y + elem.size.height / 2,
                  );
              }
              return (
                  <ComponentSelector
                      elem={elem}
                      key={elem.id + '_component'}
                      selected={selected}
                  />
              );
          })}
          </div>
          </div>
          </div>

            {modal && <>
                <GenericModal
                    content={modal}
                    onDone={() => {
                        setModal(null);
                    }}
                />
            </>}






            <aside>
                    {/* <BCLogo pending={pending} /> */}

                    {mode == EditorModes.EDIT && selected[0] && selected[0].length > 20 && (
                        <MobileBoundary />
                    )}
                    {mode == EditorModes.EDIT && pastItems.length > 1 && (
                        <div
                            style={{
                                position: 'fixed',
                                bottom: '10px',
                                left: '100px',
                                padding: '10px',
                                zIndex: 999999,
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            {pastItems.length - undoCount - 1 > 0 ? (
                                <div
                                    className={
                                        'cbutton cbuttonmain hovershadow'
                                    }
                                    onClick={undo}
                                >
                                    <i className="fas fa-undo"></i>
                                </div>
                            ) : (
                                <div style={{ width: 52 }} />
                            )}
                            <div style={{ padding: '6px' }} />
                            {undoCount > 0 && (
                                <div
                                    className={
                                        'cbutton cbuttonmain hovershadow'
                                    }
                                    onClick={redo}
                                >
                                    <i className="fas fa-redo"></i>
                                </div>
                            )}
                        </div>
                    )}

                    {!immutable && (
                        <div
                            style={{
                                position: 'fixed',
                                bottom: '10px',
                                right: '10px',
                                padding: '10px',
                                zIndex: 999999,
                            }}
                        >
                            <Column style={{ alignItems: 'flex-end' }}>
                                {mode == EditorModes.EDIT && (
                                    <Menu
                                        selected={selected}
                                        addItemToList={undefined}
                                    />
                                )}

                                <div style={{ padding: 5 }}></div>

                                {mode == EditorModes.VIEW ? (
                                    <div
                                        className={
                                            'cbutton cbuttonmain hovershadow'
                                        }
                                        onClick={onEditClicked}
                                    >
                                        <i className="fas fa-pen"></i>
                                    </div>
                                ) : (
                                    <div
                                        className={
                                            'cbutton cbuttonmain hovershadow'
                                        }
                                        onClick={onSaveClicked}
                                    >
                                        <i className="fas fa-save"></i>
                                    </div>
                                )}
                            </Column>
                        </div>
                    )}
                </aside>



    </SiteContext.Provider>
    </>
  );
}

export default DragDrop;
