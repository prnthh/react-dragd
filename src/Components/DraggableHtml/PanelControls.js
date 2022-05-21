import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function PanelControls({ onLocalUpdate, elemData, setModal }) {
    function CodeEditor() {
        const [fileType, setFileType] = useState(elemData.subtype || 'md');
        const [html, setHtml] = useState('');
        const [js, setJs] = useState('');

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
                                        className={'button'}
                                        disabled={fileType === 'html'}
                                        onClick={() => {
                                            setFileType('html');
                                        }}
                                    >
                                        HTML
                                    </button>

                                    <span style={{ marginLeft: '10px' }} />

                                    <button
                                        className={'button'}
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
                                    className={'button'}
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
                            <div className="select">
                                <select
                                    defaultValue={fileType}
                                    onChange={(e) => {
                                        setFileType(e.currentTarget.value);
                                        onLocalUpdate({
                                            subtype: e.currentTarget.value,
                                        });
                                        if (e.currentTarget.value === 'md') {
                                            // analytics.track(
                                            //     'editor_markdown_selected',
                                            // );
                                        } else if (
                                            e.currentTarget.value === 'html'
                                        ) {
                                            // analytics.track(
                                            //     'editor_html_selected',
                                            // );
                                        }
                                    }}
                                >
                                    <option value={'md'}>Markdown</option>
                                    <option value={'html'}>HTML + JS</option>
                                </select>
                            </div>
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
                            console.log(data);
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
                                // saveElemJson({ href: data });
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
                className={'cbutton cbuttoninner'}
                onClick={() => {
                    onLocalUpdate({ maxWidth: !elemData.maxWidth });
                }}
            >
                <i className="fas fa-arrows-alt-h" />
            </div>
        </>
    );
}
