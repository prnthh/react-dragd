import React, { useState } from 'react';
import EditItem from '../DDEditor/EditItem';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { useAsync } from 'react-async-hook';

const giphyFetch = new GiphyFetch(
    process.env.GIPHY_API_KEY
        ? process.env.GIPHY_API_KEY
        : '6s6dfi1SuYlcbne91afF4rsD1b2DFDfQ',
);

const mediaGiphyRegex = /media\d+.giphy.com/;

function DraggableGiphy(props) {
    const { elemData, onSelect, onUpdated, selected, mode } = props;

    const [gif, setGif] = useState(null);
    useAsync(async () => {
        const { data } = await giphyFetch.gif(elemData.giphyUri);
        const tempGif = data.images.preview_gif;
        const finalGif = { ...tempGif };
        finalGif['url'] = tempGif.url.replace(mediaGiphyRegex, 'i.giphy.com');
        console.log('giphyUri', finalGif);
        setGif(finalGif);
    }, []);
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
                    <img
                        style={{ width: '100%', height: '100%' }}
                        src={gif.url}
                    />
                )}
            </EditItem>
        </>
    );
}
export default DraggableGiphy;
