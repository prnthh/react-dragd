import React, { useContext, useEffect, useState } from 'react';
import { Column, Row } from '../utils/helpers';
import { getRegisteredButtons, getAllComponents } from '../Components/registry';
import { v4 as uuidv4 } from 'uuid';
import SiteContext from '../pageContext';
import { styles, mergeStyles } from '../styles';

export function AddButton({ item, showMenu, setSelector }) {
    const siteData = useContext(SiteContext);

    // Get selectors dynamically from registered components
    const getModalSelector = (selectorName) => {
        const components = getAllComponents();
        const component = components[selectorName];
        if (component && component.Selector) {
            const SelectorComponent = component.Selector;
            return (
                <SelectorComponent
                    addItemToList={siteData.addItemToList}
                    close={() => siteData.setModal(null)}
                />
            );
        }
        return null;
    };

    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            style={mergeStyles(styles.cbutton, styles.tooltip)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                switch (item[1].action) {
                    case 'add':
                        siteData.addItemToList(item[1].object);
                        showMenu(null);
                        break;
                    case 'menu':
                        showMenu(item[1].objects);
                        break;
                    case 'modal':
                        const modalContent = getModalSelector(item[1].selector);
                        if (modalContent) {
                            siteData.setModal(modalContent);
                        }
                        break;
                }
                e.stopPropagation();
            }}
        >
            {item[1].label && (
                <span style={mergeStyles(
                    styles.tooltiptext,
                    isHovered && styles.tooltiptextVisible
                )}>{item[1].label}</span>
            )}

            <i className={`${item[1].icon}`}></i>
        </div>
    );
}

function Menu({ addItemToList, selected }) {
    const siteData = useContext(SiteContext);
    const buttons = getRegisteredButtons();

    return (
        <div
            style={styles.cpanel}
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <Row>
                <NestedMenu
                    data={buttons}
                    addItemToList={siteData.addItemToList}
                    parentSelected={selected}
                />
            </Row>
        </div>
    );
}

function NestedMenu({ data, addItemToList, parentSelected }) {
    const [selected, setSelected] = useState(null);
    const [selector, setSelector] = useState(null);

    useEffect(() => {
        setSelected(null);
        setSelector(null);
    }, [parentSelected]);

    useEffect(() => {
        setSelector(null);
    }, [selected]);

    return (
        <>
            {selector && <Column style={{ borderRight: '1px solid black' }}>{selector}</Column>}
            {selected != null && (
                <NestedMenu
                    data={selected}
                    addItemToList={addItemToList}
                    parentSelected={selected}
                />
            )}
            <Column style={{ borderRight: '1px solid black' }}>
                {Object.entries(data).map((item) => {
                    return (
                        <AddButton
                            key={uuidv4()}
                            item={item}
                            showMenu={setSelected}
                            setSelector={setSelector}
                        />
                    );
                })}
            </Column>
        </>
    );
}

export default Menu;
