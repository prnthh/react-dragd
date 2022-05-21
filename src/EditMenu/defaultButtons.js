const defaultButtons = {
    text: {
        icon: 'fas fa-font',
        label: 'Add Text',
        action: 'add',
        object: {
            type: 'text',
            text: 'click to edit!',
            fontSize: '48px',
            color: 'black',
            size: {
                width: 200,
                height: 100,
            },
        },
    },
    button: {
        icon: 'fas fa-link',
        action: 'modal',
        selector: 'button',
        label: 'Add Button',
    },
    shapes: {
        icon: 'fas fa-shapes',
        label: 'Add Shape',
        action: 'menu',
        objects: {
            square: {
                icon: 'fas fa-square-full',
                label: 'Rectangle',
                action: 'add',
                object: {
                    type: 'color',
                    size: {
                        width: 100,
                        height: 100,
                    },
                    style: {
                        backgroundColor: 'grey',
                    },
                },
            },
            circle: {
                icon: 'fas fa-circle',
                label: 'Circle',
                action: 'add',
                object: {
                    type: 'color',
                    size: {
                        width: 100,
                        height: 100,
                    },
                    style: {
                        backgroundColor: 'blue',
                        borderRadius: 9999999,
                    },
                },
            },
        },
    },
    media: {
        icon: 'fas fa-photo-video',
        label: 'Add Media',
        action: 'menu',
        objects: {
            image: {
                icon: 'fas fa-image',
                label: 'Add Image',
                action: 'add',
                object: {
                    type: 'image',
                    size: {
                        width: 100,
                        height: 100,
                    },
                    imageUri:
                        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K',
                },
            },
            // video: {
            //     icon: 'fas fa-film',
            //     label: 'Add Video',
            //     action: 'add',
            //     object: {
            //         type: 'video',
            //         size: {
            //             width: 100,
            //             height: 100,
            //         },
            //         videoUri: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            //     },
            // },
            // audio: {
            //     icon: 'fas fa-volume-up',
            //     label: 'Add Audio',
            //     action: 'add',
            //     object: {
            //         type: 'audio',
            //         size: {
            //             width: 200,
            //             height: 100,
            //         },
            //         audioUri:
            //             'https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg',
            //     },
            // },
        },
    },
    // form: {
    //     icon: 'fas fa-poll-h',
    //     label: 'Add Form',
    //     action: 'add',
    //     object: {
    //         type: 'form',
    //         size: {
    //             width: 200,
    //             height: 150,
    //         },
    //         style: { textAlign: 'left' },
    //     },
    // },
    giphy: {
        icon: 'far fa-laugh-beam',
        action: 'selector',
        selector: 'giphy',
        label: 'Add Sticker',
    },
    code: {
        icon: 'fas fa-code',
        label: 'Add Code',
        action: 'add',
        object: {
            type: 'code',
            size: {
                width: 100,
                height: 100,
            },
            text: 'Add your code here!',
        },
    },
    template: {
        icon: 'far fa-object-group',
        action: 'modal',
        selector: 'template',
        label: 'Add Template',
    },
    head: {
        icon: 'fas fa-sliders-h',
        label: 'Add Head',
        selector: 'headconf',
        action: 'selector',
    },
};

export default defaultButtons;
