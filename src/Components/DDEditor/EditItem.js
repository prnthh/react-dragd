import React, { useState, useEffect, useRef, useContext } from 'react';
import {
    usePrevious,
    getElementOffset,
    getAngle,
    getLength,
    degToRadian,
    Input,
    isMobile,
    getMobileScaleRatio,
    isMobileViewport,
} from '../../utils/helpers';
import SiteContext from '../../pageContext';
import ControlPanel from '../../EditMenu/ControlPanel';
import DragCoincideLines from './dragCoincideLines';
// const ControlPanel = dynamic(() => import('../EditMenu/ControlPanel'));
// const DragCoincideLines = dynamic(() => import('./dragCoincideLines.js'));

const dragHandleOffset = 5;
const pageCenterSnapDistance = 20;
const itemAlignSnapDistance = 10;

const dragCornerOffsets = [
    { top: -dragHandleOffset, left: -dragHandleOffset },
    { top: -dragHandleOffset, right: -dragHandleOffset },
    { bottom: -dragHandleOffset, left: -dragHandleOffset },
    { bottom: -dragHandleOffset, right: -dragHandleOffset },
];

const maxWidthDragCornerOffsets = [
    { top: -dragHandleOffset, left: '50%' },
    { bottom: -dragHandleOffset, left: '50%' },
];

function EditItem(props) {
    const { elemData, selected } = props;
    const x = typeof window !== 'undefined' ? window.innerWidth / 2 : 200;
    const siteData = useContext(SiteContext);
    const {
        setSelected: onSelect,
        onUpdateDiv: onUpdated,
        mode,
        setModal,
    } = siteData;

    const [state, setState] = useState({});
    const divRef = useRef();

    function saveElemJson(newProps) {
        var updatedProps = {
            ...newProps,
        };
        onUpdated(elemData.id, updatedProps);
    }

    var movementTypes = {
        NOOP : 0,
        DRAGGING : 1,
        ROTATING : 2,
        RESIZING : 3,
    }

    const [movementType, setMovementType] = useState(movementTypes.NOOP);
    const prevMovementType = usePrevious(movementType);

    useEffect(() => {
        if (
            (movementType === movementTypes.DRAGGING ||
                movementType === movementTypes.RESIZING ||
                movementType === movementTypes.ROTATING) &&
            prevMovementType !== movementType
        ) {
            typeof window !== "undefined" && document.addEventListener('mousemove', onMouseMove);
            typeof window !== "undefined" && document.addEventListener('mouseup', onMouseUp);
            typeof window !== "undefined" && document.addEventListener('touchmove', onMouseMove, {
                passive: false,
            });
            typeof window !== "undefined" && document.addEventListener('touchend', onMouseUp);
        }
    }, [movementType]);

    // calculate relative position to the mouse and set dragging=true
    function onMouseDown(e) {
        // only left mouse button
        if (mode != 'edit') return;
        var pos = getElementOffset(divRef.current);

        var startX = e.pageX ? e.pageX : e.changedTouches[0].pageX;
        var startY = e.pageY ? e.pageY : e.changedTouches[0].pageY;

        var newState = {
            rel: {
                x: startX - pos.left - pos.width / 2,
                y: startY - pos.top - pos.height / 2,
                startX: pos.left,
                startY: pos.top,
            },
        };
        setState(newState);
        onSelect(elemData.id);

        if (isMobile() && !selected) {
            return;
        }

        setMovementType(movementTypes.DRAGGING);
        // e.stopPropagation();
        // e.preventDefault();
    }

    function onMouseDownRot(e) {
        var pos = getElementOffset(divRef.current);
        const rect = getElementOffset(divRef.current);

        var startX = e.pageX ? e.pageX : e.changedTouches[0].pageX;
        var startY = e.pageY ? e.pageY : e.changedTouches[0].pageY;

        const startVector = {
            x: startX - pos.left - pos.width / 2,
            y: startY - pos.top - pos.height / 2,
        };

        setState({ ...state, rot: { startVector, center: rect.center } });
        setMovementType(movementTypes.ROTATING);
        e.stopPropagation();
        e.preventDefault();
    }

    function onMouseDownRes(e) {
        const rect = getElementOffset(divRef.current);

        var startX = e.pageX ? e.pageX : e.changedTouches[0].pageX;
        var startY = e.pageY ? e.pageY : e.changedTouches[0].pageY;
        setState({ ...state, res: { startX, startY, rect } });
        setMovementType(movementTypes.RESIZING);
        e.stopPropagation();
        e.preventDefault();
    }

    const [coincides, setCoincides] = useState([]);

    function SnapToGrid(toPosition) {
        if (toPosition.pos.x > -7 && toPosition.pos.x < 7) {
            toPosition.pos.x = 0;
        }

        var coincidingItems = [];
        Object.values(siteData.items).forEach((item) => {
            if (item.id == elemData.id) return;

            var xDel = toPosition.pos.x - item.pos.x,
                yDel = toPosition.pos.y - item.pos.y;
            if (xDel < itemAlignSnapDistance && xDel > -itemAlignSnapDistance) {
                coincidingItems.push(item);
                toPosition.pos.x = item.pos.x;
            }
            if (yDel < itemAlignSnapDistance && yDel > -itemAlignSnapDistance) {
                coincidingItems.push(item);
                toPosition.pos.y = item.pos.y;
            }
        });
        setCoincides(coincidingItems);
        return toPosition;
    }

    function SnapToAngle(angle) {
        angle = angle % 360;
        let angleExcess = angle % 90;
        if (angleExcess > -10 && angleExcess < 10) angle -= angleExcess;
        return angle;
    }

    function onMouseMove(e) {
        e.stopPropagation();
        e.preventDefault();

        var clientX = e.pageX ? e.pageX : e.changedTouches[0].pageX;
        var clientY = e.pageY ? e.pageY : e.changedTouches[0].pageY;

        if (movementType == movementTypes.DRAGGING) {
            var toPosition = {
                pos: {
                    x:
                        (clientX - state.rel.x - x) *
                        (1 / getMobileScaleRatio()),
                    y: (clientY - state.rel.y) * (1 / getMobileScaleRatio()),
                },
            };
            saveElemJson(SnapToGrid(toPosition));
        } else if (movementType == movementTypes.ROTATING) {
            const rotateVector = {
                x: clientX - state.rot.center.x,
                y: clientY - state.rot.center.y,
            };
            let angle =
                elemData.rot.deg +
                getAngle(state.rot.startVector, rotateVector);
            saveElemJson({ rot: { deg: SnapToAngle(angle) } });
        } else if (movementType == movementTypes.RESIZING) {
            var deltaX = clientX - state.res.startX;
            var deltaY = clientY - state.res.startY;

            if (state.res.startX < state.res.rect.center.x) deltaX *= -1;
            if (state.res.startY < state.res.rect.center.y) deltaY *= -1;

            const alpha = Math.atan2(deltaY, deltaX);
            const length = getLength(deltaX, deltaY) * 2;

            const beta = alpha - degToRadian(elemData.rot.deg);
            const deltaW = length * Math.cos(beta);
            const deltaH = length * Math.sin(beta);

            saveElemJson({
                size: {
                    width: state.res.rect.width + deltaW,
                    height: state.res.rect.height + deltaH,
                },
                pos: { x: elemData.pos.x, y: elemData.pos.y },
            });
        } else return;
    }

    function onMouseUp(e) {
        setMovementType(movementTypes.NOOP);

        typeof window !== "undefined" &&  document.removeEventListener('mousemove', onMouseMove);
        typeof window !== "undefined" &&  document.removeEventListener('mouseup', onMouseUp);
        typeof window !== "undefined" &&  document.removeEventListener('touchmove', onMouseMove);
        typeof window !== "undefined" &&  document.removeEventListener('touchend', onMouseUp);

        e.stopPropagation();
        e.preventDefault();
    }

    return (
        <>
            {/* SECTION: ALIGNMENT GRIDS */}
            {selected && (
                <DragCoincideLines
                    elemData={elemData}
                    dragging={movementType == movementTypes.DRAGGING}
                    coincides={coincides}
                />
            )}

            {/* SECTION: CONTROL PANEL */}
            {selected && (
                <>
                    <ControlPanel
                        elemData={elemData}
                        saveElemJson={saveElemJson}
                        setModal={setModal}
                        CustomPanel={props.renderPanel}
                        onLocalUpdate={props.onLocalUpdate}
                    ></ControlPanel>
                </>
            )}

            {/* SECTION: DRAGGABLE RECT */}
            {mode == 'edit' ? (
                <Rect
                    ref={divRef}
                    className={mode == 'edit' ? 'draggable' : ''}
                    elemData={elemData}
                    selected={selected}
                    onMouseDownDrag={onMouseDown}
                    onMouseDownRes={onMouseDownRes}
                    onMouseDownRot={onMouseDownRot}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            pointerEvents:
                                selected && elemData.type != 'text'
                                    ? 'none'
                                    : undefined,
                            zIndex: elemData.zIndex,
                        }}
                    >
                        {props.children}
                    </div>
                </Rect>
            ) : (
                <LinkWrapper link={elemData.href}>
                    <Rect elemData={elemData}>{props.children}</Rect>
                </LinkWrapper>
            )}
        </>
    );
}

const Rect = React.forwardRef((props, ref) => {
    const {
        elemData,
        selected,
        onMouseDownDrag,
        onMouseDownRes,
        onMouseDownRot,
    } = props;
    const { pos, size, rot, zIndex } = elemData;
    var x = typeof window !== 'undefined' ? window.innerWidth / 2 : 200;

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
            }}
            ref={ref}
            onMouseDown={onMouseDownDrag}
            onTouchStart={onMouseDownDrag}
            key={elemData.id + '-rect'}
            style={{
                zIndex: zIndex,
                position: 'absolute',
                transform: `translate(-50%, -50%) ${
                    rot && rot.deg ? `rotate(${rot.deg}deg)` : ``
                }`,
                left: pos.x + 'px',
                top: pos.y + 'px',
                width: (size.width || 50) + 'px',
                height: (size.height || 50) + 'px',
                textAlign: 'center',
            }}
            {...props}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    overflow: 'hidden',
                    border: selected
                        ? '1px solid black'
                        : '1px solid transparent',
                }}
            >
                {props.children}
            </div>

            {/* RESIZE AND ROTATE HANDLES */}
            {selected && (
                <>
                    {!elemData.maxWidth && (
                        <div
                            onMouseDown={onMouseDownRot}
                            onTouchStart={onMouseDownRot}
                            className={'dragHandle'}
                            style={{
                                top: elemData.size.height + 20,
                                left: elemData.size.width / 2,
                            }}
                        />
                    )}
                    {(elemData.maxWidth
                        ? maxWidthDragCornerOffsets
                        : dragCornerOffsets
                    ).map((elem, id) => {
                        return (
                            <div
                                key={'rot-' + id}
                                onMouseDown={onMouseDownRes}
                                onTouchStart={onMouseDownRes}
                                className={'dragHandle'}
                                style={{ ...elem }}
                            />
                        );
                    })}
                </>
            )}
        </div>
    );
});

function LinkWrapper({ children, link }) {
    return link ? <a href={link}>{children}</a> : <>{children}</>;
}

export default EditItem;
