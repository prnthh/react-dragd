import React from 'react'

export default function DrawCoincides({ elemData, coincides, dragging }) {
    return (
        <>
            {dragging && elemData.pos.x == 0 && (
                <div
                    className={
                        'page-align-guide active page-center-align-guide'
                    }
                    style={{
                        left: elemData.pos.x,
                    }}
                />
            )}
            {dragging && elemData.pos.x == 0 && (
                <div
                    className={'interthing-line-nub'}
                    style={{
                        left: elemData.pos.x,
                        top: elemData.pos.y,
                        transform: 'translateX(calc(50vw - 50%))',
                    }}
                />
            )}

            {dragging &&
                coincides.length > 0 &&
                coincides.map((coincide) => {
                    return (
                        <>
                            <div
                                className={'interthing-line-nub'}
                                style={{
                                    left: coincide.pos.x,
                                    top: coincide.pos.y,
                                }}
                            />
                            <div
                                className={'interthing-line-nub'}
                                style={{
                                    left: elemData.pos.x,
                                    top: elemData.pos.y,
                                }}
                            />
                            {coincide.pos.y == elemData.pos.y && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: coincide.pos.y,
                                        left: Math.min(
                                            coincide.pos.x,
                                            elemData.pos.x,
                                        ),
                                        width: Math.abs(
                                            elemData.pos.x - coincide.pos.x,
                                        ),
                                        height: 1,
                                        zIndex: 99999998,
                                        transform: 'translateY(calc(-0.5px))',
                                        borderTop: '1px solid red',
                                    }}
                                />
                            )}
                            {coincide.pos.x == elemData.pos.x && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: Math.min(
                                            coincide.pos.y,
                                            elemData.pos.y,
                                        ),
                                        left: coincide.pos.x,
                                        height: Math.abs(
                                            elemData.pos.y - coincide.pos.y,
                                        ),
                                        width: 1,
                                        zIndex: 99999998,
                                        transform: 'translateX(calc(-0.5px))',
                                        borderRight: '1px solid red',
                                    }}
                                />
                            )}
                        </>
                    );
                })}
        </>
    );
}
