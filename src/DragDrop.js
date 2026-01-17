import React, {useState, useEffect, useCallback, useRef} from 'react';
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

    const selectionRef = useRef({
        active: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        justSelected: false,
        baseSelection: [],
        shiftKey: false,
    });
    const [selectionBox, setSelectionBox] = useState(null);

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

    function onUpdateItemsBulk(itemUpdates) {
        if (!itemUpdates || Object.keys(itemUpdates).length === 0) return;
        const updatedItems = { ...items };
        Object.keys(itemUpdates).forEach((id) => {
            if (!updatedItems[id]) return;
            updatedItems[id] = {
                ...updatedItems[id],
                ...mergeDeep(updatedItems[id], itemUpdates[id]),
            };
        });
        setItems(updatedItems);
        debounceElemdataHistoryUpdate(pastItems, updatedItems, undoCount);
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
        if (Array.isArray(item)) {
            setSelected(item);
            return;
        }
        setSelected([item]);
    },
    deleteItemFromList: deleteItemFromList,
    addItemToList: addItemToList,
    onUpdateDiv: onUpdateDiv,
    onUpdateItemsBulk: onUpdateItemsBulk,
    mode: mode,
    setModal: setModal,
  };

    function getPointerPosition(e) {
        const point = e.touches && e.touches.length ? e.touches[0] : e;
        return { x: point.clientX, y: point.clientY };
    }

    function getSelectionRect() {
        const { startX, startY, currentX, currentY } = selectionRef.current;
        const left = Math.min(startX, currentX);
        const top = Math.min(startY, currentY);
        const width = Math.abs(currentX - startX);
        const height = Math.abs(currentY - startY);
        return { left, top, width, height, right: left + width, bottom: top + height };
    }

    function rectsIntersect(a, b) {
        return !(b.left > a.right ||
            b.right < a.left ||
            b.top > a.bottom ||
            b.bottom < a.top);
    }

    function handleSelectionStart(e) {
        if (mode !== EditorModes.EDIT) return;
        if (e.button !== undefined && e.button !== 0) return;
        if (e.target && e.target.closest && e.target.closest('[data-dd-item="true"]')) return;

        const { x, y } = getPointerPosition(e);
        const shiftKey = !!e.shiftKey;
        const baseSelection = shiftKey ? selected.slice() : [];
        selectionRef.current = {
            active: true,
            startX: x,
            startY: y,
            currentX: x,
            currentY: y,
            justSelected: false,
            baseSelection,
            shiftKey,
        };
        setSelectionBox({ left: x, top: y, width: 0, height: 0 });

        const moveListener = (ev) => {
            if (!selectionRef.current.active) return;
            const pos = getPointerPosition(ev);
            selectionRef.current.currentX = pos.x;
            selectionRef.current.currentY = pos.y;
            const rect = getSelectionRect();
            setSelectionBox({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
            if (rect.width > 2 && rect.height > 2) {
                const nodes = typeof document !== 'undefined'
                    ? document.querySelectorAll('[data-dd-item="true"]')
                    : [];
                const hoveredIds = [];
                nodes.forEach((node) => {
                    const bounds = node.getBoundingClientRect();
                    const nodeRect = {
                        left: bounds.left,
                        right: bounds.right,
                        top: bounds.top,
                        bottom: bounds.bottom,
                    };
                    if (rectsIntersect(rect, nodeRect)) {
                        const id = node.getAttribute('data-dd-id');
                        if (id) hoveredIds.push(id);
                    }
                });
                const nextSelection = selectionRef.current.shiftKey
                    ? Array.from(new Set([...selectionRef.current.baseSelection, ...hoveredIds]))
                    : hoveredIds;
                setSelected(nextSelection);
            }
            ev.preventDefault();
        };

        const upListener = (ev) => {
            if (!selectionRef.current.active) return;
            selectionRef.current.active = false;
            const rect = getSelectionRect();
            const selectedIds = [];
            if (rect.width > 2 && rect.height > 2) {
                const nodes = typeof document !== 'undefined'
                    ? document.querySelectorAll('[data-dd-item="true"]')
                    : [];
                nodes.forEach((node) => {
                    const bounds = node.getBoundingClientRect();
                    const nodeRect = {
                        left: bounds.left,
                        right: bounds.right,
                        top: bounds.top,
                        bottom: bounds.bottom,
                    };
                    if (rectsIntersect(rect, nodeRect)) {
                        const id = node.getAttribute('data-dd-id');
                        if (id) selectedIds.push(id);
                    }
                });
            }

            const finalSelection = selectionRef.current.shiftKey
                ? Array.from(new Set([...selectionRef.current.baseSelection, ...selectedIds]))
                : selectedIds;
            setSelected(finalSelection);
            if (selectedIds.length > 0) {
                selectionRef.current.justSelected = true;
            }
            setSelectionBox(null);

            typeof window !== 'undefined' && window.removeEventListener('mousemove', moveListener);
            typeof window !== 'undefined' && window.removeEventListener('mouseup', upListener);
            typeof window !== 'undefined' && window.removeEventListener('touchmove', moveListener);
            typeof window !== 'undefined' && window.removeEventListener('touchend', upListener);

            ev.preventDefault();
        };

        typeof window !== 'undefined' && window.addEventListener('mousemove', moveListener);
        typeof window !== 'undefined' && window.addEventListener('mouseup', upListener);
        typeof window !== 'undefined' && window.addEventListener('touchmove', moveListener, { passive: false });
        typeof window !== 'undefined' && window.addEventListener('touchend', upListener);

        e.preventDefault();
    }

  return (
    <>
    <link href="//use.fontawesome.com/releases/v5.10.1/css/all.css" rel="stylesheet"></link>
    <SiteContext.Provider value={providerValues}>
    <div
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '100%',
                    overflow: 'hidden',
                    minHeight: '100vh',
                    height: pageWidth ? (pageHeight * getMobileScaleRatio()) : undefined,
                }}
                onMouseDown={handleSelectionStart}
                onTouchStart={handleSelectionStart}
                onClick={(e) => {
                    if (e.target && e.target.closest && e.target.closest('[data-dd-item="true"]')) return;
                    if (selectionRef.current.justSelected) {
                        selectionRef.current.justSelected = false;
                        return;
                    }
                    if (!e.shiftKey) {
                        setSelected([]);
                    }
                }}
            >
                {selectionBox && (
                    <div
                        style={{
                            position: 'fixed',
                            left: selectionBox.left,
                            top: selectionBox.top,
                            width: selectionBox.width,
                            height: selectionBox.height,
                            border: '1px dashed #4a90e2',
                            background: 'rgba(74, 144, 226, 0.15)',
                            zIndex: 999998,
                            pointerEvents: 'none',
                        }}
                    />
                )}
                {mode == EditorModes.EDIT && selected[0] && selected[0].length > 20 && (
                    <MobileBoundary />
                )}
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
                  elem.pos.y + elem.size.height >
                  pageHeight
              ) {
                  setPageHeight(
                      elem.pos.y + elem.size.height,
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
