import React, { useEffect, useRef, useState } from 'react';
import { styles, mergeStyles } from '../../styles';

export default function DropDownMenu({ options, selectedOption, onSelect, type }) {
    const [selected, setSelected] = useState(false);
    const [scrollLimit, setScrollLimit] = useState(20);
    const listInnerRef = useRef();
    const wrapperRef = useRef();

    const displayOption =
        selectedOption !== undefined && selectedOption !== null
            ? selectedOption
            : 'Select';

    return (
        <div 
            style={{ display: 'flex', flexDirection: 'column' }}
            onMouseLeave={() => {
                if (selected) {
                    setSelected(false);
                }
            }}
        >
            <div 
                ref={wrapperRef} 
                style={styles.dropdown}
            >
                <button
                    type="button"
                    aria-haspopup="true"
                    aria-controls="dropdown-menu"
                    onClick={() => {
                        setSelected(!selected);
                    }}
                    style={mergeStyles(
                        {
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                        },
                    )}
                >
                    <span
                        style={
                            type && type == 'font'
                                ? { fontFamily: selectedOption }
                                : {}
                        }
                    >
                        {displayOption}
                    </span>
                    <span>
                        <i aria-hidden="true">▼</i>
                    </span>
                </button>
                {selected && (
                    <div
                        id="dropdown-menu"
                        role="menu"
                        style={mergeStyles(styles.dropdownContent, {
                            minWidth: 200,
                            zIndex: 999999,
                        })}
                    >
                        <div
                            ref={listInnerRef}
                            style={{ maxHeight: '400px', overflowY: 'auto' }}
                            onScroll={() => {
                                if (listInnerRef.current) {
                                    const {
                                        scrollTop,
                                        scrollHeight,
                                        clientHeight,
                                    } = listInnerRef.current;
                                    if (scrollTop + clientHeight >= scrollHeight) {
                                        setScrollLimit((prev) => prev + 10);
                                    }
                                }
                            }}
                        >
                            {options.slice(0, scrollLimit).map((elem, index) => {
                                return (
                                    <button
                                        key={`${elem}-${index}`}
                                        type="button"
                                        onClick={() => {
                                            onSelect(elem);
                                            setSelected(false);
                                        }}
                                        style={mergeStyles(
                                            {
                                                display: 'block',
                                                width: '100%',
                                                textAlign: 'left',
                                                padding: '6px 8px',
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontWeight:
                                                    elem == selectedOption
                                                        ? 'bold'
                                                        : 'normal',
                                            },
                                            type && type == 'font'
                                                ? { fontFamily: elem }
                                                : {},
                                        )}
                                    >
                                        {elem}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
