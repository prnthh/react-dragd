import React, { useRef, useState } from 'react';

export default function DropDownMenu({ options, selectedOption, onSelect, type }) {
    const [selected, setSelected] = useState(false);
    const [scrollLimit, setScrollLimit] = useState(20);
    const listInnerRef = useRef();

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div class="dropdown is-active" >
                <div class="dropdown-trigger">
                    <button
                        class="button"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                        onClick={() => {
                            setSelected(!selected);
                        }}
                    >
                        {type && type == "font" && <>
                            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
                            <link href={`https://fonts.googleapis.com/css2?family=${selectedOption && selectedOption.split(" ").join("+")}&display=swap`} rel="stylesheet"></link>
                        </>}
                        <span style={type && type == "font" ? {fontFamily: selectedOption} : {}}>{selectedOption}</span>
                        <span class="icon is-small">
                            <i class="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                    </button>
                </div>
                {selected && (
                    <div class="dropdown-menu" id="dropdown-menu" role="menu" onBlur={()=>{ setSelected(false)}}>
                        <div ref={listInnerRef} class="dropdown-content" style={{maxHeight: '400px', overflowY: 'scroll'}}
                            onScroll={() => {
                                if (listInnerRef.current) {
                                  const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
                                  if (scrollTop + clientHeight === scrollHeight) {
                                    setScrollLimit(scrollLimit + 10);
                                  }
                                }
                              }}>
                            {options.slice(0,scrollLimit).map((elem) => {
                                return (
                                    <a
                                        href="#"
                                        onClick={(e) => {
                                            onSelect(elem);
                                            setSelected(false);
                                        }}
                                        style={{fontFamily: elem }}
                                        class={`dropdown-item ${
                                            elem == selectedOption &&
                                            'is-active'
                                        }`}
                                    >
                                        {type && type == "font" && <>
                                            <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
                                            <link href={`https://fonts.googleapis.com/css2?family=${elem.split(" ").join("+")}&display=swap`} rel="stylesheet"></link>
                                        </>}
                                        
                                        {elem}
                                    </a>
                                );
                            })}
                            {/* <hr class="dropdown-divider" /> */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
