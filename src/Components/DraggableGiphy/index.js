import React, { useState, useEffect } from 'react';
import EditItem from '../DDEditor/EditItem';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

const giphyFetch = new GiphyFetch(
    process.env.GIPHY_API_KEY
        ? process.env.GIPHY_API_KEY
        : '6s6dfi1SuYlcbne91afF4rsD1b2DFDfQ',
);

function DraggableGiphy(props) {
    const { elemData, onSelect, onUpdated, selected, mode } = props;

    const [gif, setGif] = useState(null);

    useEffect(() => {
        async function getGiphy () {
            const { data } = await giphyFetch.gif(elemData.giphyUri);
            setGif(data);
        }
        getGiphy();
    }, [elemData.giphyUri]);

    return (
        <>
            <EditItem
                elemData={elemData}
                onSelect={onSelect}
                onUpdated={onUpdated}
                selected={props.selected}
                // renderPanel={PanelControls}
                mode={mode}
            >
                {gif && (
                    <Gif
                        gif={gif}
                        style={{ width: '100%', height: '100%' }}
                        onGifClick={(gif, e) => {
                            e.preventDefault();
                        }}
                        backgroundColor={'transparent'}
                        noLink={true}
                    />
                )}
            </EditItem>
        </>
    );
}
export default DraggableGiphy;
