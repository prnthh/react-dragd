import ReactGiphySearchbox from 'react-giphy-searchbox';
import React from 'react'

export function GiphySelector({ addItemToList }) {
    return (
        <ReactGiphySearchbox
            apiKey={
                process.env.GIPHY_API_KEY
                    ? process.env.GIPHY_API_KEY
                    : '6s6dfi1SuYlcbne91afF4rsD1b2DFDfQ'
            }
            library={'stickers'}
            onSelect={(item) => {
                addItemToList({
                    type: 'giphy',
                    size: {
                        width: 100,
                        height: 100,
                    },
                    giphyUri: item.id,
                });
            }}
            masonryConfig={[
                { columns: 2, imageWidth: 110, gutter: 5 },
                { mq: '700px', columns: 3, imageWidth: 110, gutter: 5 },
            ]}
        />
    );
}
