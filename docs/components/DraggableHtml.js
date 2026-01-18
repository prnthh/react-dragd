/**
 * DraggableHtml - Example custom component for react-dragd
 *
 * This component demonstrates how to create a custom draggable component
 * with Monaco editor for HTML/Markdown editing.
 *
 * Dependencies required in your project:
 * - @monaco-editor/react
 * - react-markdown
 * - rehype-raw
 */

import React, { useState, useContext } from 'react';
import EditItem from '../../src/Components/DDEditor/EditItem';
import SiteContext from '../../src/pageContext';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import Editor from '@monaco-editor/react';
import { styles, mergeStyles } from '../../src/styles';
import { registerComponent } from '../../src/Components/registry';

function PanelControls({ onLocalUpdate, elemData, setModal }) {
    function CodeEditor() {
        const [fileType, setFileType] = useState(elemData.subtype || 'md');

        const languages = { md: 'markdown', html: 'html', js: 'javascript' };

        return (
            <>
                <div style={{ width: '70vw', maxWidth: '50rem' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            {fileType !== 'md' && (
                                <>
                                    <button
                                        disabled={fileType === 'html'}
                                        onClick={() => {
                                            setFileType('html');
                                        }}
                                    >
                                        HTML
                                    </button>

                                    <span style={{ marginLeft: '10px' }} />

                                    <button
                                        disabled={fileType === 'js'}
                                        onClick={() => {
                                            setFileType('js');
                                        }}
                                    >
                                        JS
                                    </button>
                                </>
                            )}
                            {fileType === 'md' && (
                                <button
                                    disabled={fileType === 'md'}
                                    onClick={() => {
                                        setFileType('md');
                                    }}
                                >
                                    Markdown
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <select
                                defaultValue={fileType}
                                onChange={(e) => {
                                    setFileType(e.currentTarget.value);
                                    onLocalUpdate({
                                        subtype: e.currentTarget.value,
                                    });
                                }}
                            >
                                <option value={'md'}>Markdown</option>
                                <option value={'html'}>HTML + JS</option>
                            </select>
                            <span style={{ marginLeft: '10px' }} />
                            <div
                                style={{
                                    fontSize: '1.6rem',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    setModal(null);
                                }}
                            >
                                <i className="fas fa-times"></i>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '10px' }} />

                    <Editor
                        key={fileType}
                        height="70vh"
                        defaultLanguage={languages[fileType]}
                        defaultValue={
                            fileType == 'js' ? elemData.js : elemData.text
                        }
                        theme="vs-dark"
                        options={{
                            minimap: {
                                enabled: false,
                            },
                        }}
                        onChange={(v, e) => {
                            let data = {};
                            if (fileType === 'md') {
                                data = { text: v, subtype: 'md' };
                            } else if (fileType === 'html') {
                                data = { text: v, subtype: 'html' };
                            } else if (fileType === 'js') {
                                data = { js: v, subtype: 'html' };
                            }
                            onLocalUpdate(data);
                        }}
                    />
                </div>
            </>
        );
    }

    return (
        <>
            <button
                onClick={() => {
                    setModal(
                        <CodeEditor
                            prefill={elemData.href}
                            onComplete={(data) => {
                                setModal(null);
                            }}
                        />,
                    );
                }}
            >
                Edit Code
            </button>

            <div style={{ padding: 5 }} />
            <div
                style={mergeStyles(styles.cbutton, styles.cbuttoninner)}
                onClick={() => {
                    onLocalUpdate({ maxWidth: !elemData.maxWidth });
                }}
            >
                <i className="fas fa-arrows-alt-h" />
            </div>
        </>
    );
}

function DraggableHtml(props) {
    const { elemData, selected } = props;

    const siteData = useContext(SiteContext);
    const { setSelected: onSelect, onUpdateDiv: onUpdated, mode } = siteData;

    function onLocalUpdate(newProps) {
        var updatedProps = {
            ...newProps,
        };
        siteData.onUpdateDiv(elemData.id, updatedProps);
    }

    return (
        <>
            <EditItem
                elemData={elemData}
                onSelect={onSelect}
                onUpdated={onUpdated}
                selected={selected}
                onLocalUpdate={onLocalUpdate}
                renderPanel={selected && PanelControls}
                mode={mode}
            >
                {elemData.subtype == 'html' && (
                    <div
                        dangerouslySetInnerHTML={{ __html: elemData.text }}
                    ></div>
                )}
                {elemData.subtype == 'md' && (
                    <div>
                        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                            {elemData.text}
                        </ReactMarkdown>
                    </div>
                )}
            </EditItem>
        </>
    );
}

// Register this component - this adds it to the editor toolbar
registerComponent({
    type: ['markdown', 'code'],
    Component: DraggableHtml,
    button: {
        icon: 'fas fa-code',
        label: 'Add HTML/Markdown',
        action: 'add',
        object: {
            type: 'code',
            size: { width: 300, height: 200 },
            text: '# Hello World\n\nEdit this markdown!',
            subtype: 'md',
        },
    },
});

export default DraggableHtml;
