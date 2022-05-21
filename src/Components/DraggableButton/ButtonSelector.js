import React, { useRef, useState } from "react";
import { Row } from "../../utils/helpers";

const linkRegEx = new RegExp(/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i);

export function ButtonSelector(props) {
    const inputRef = useRef(null);
    const [value, setValue] = useState('https://');

    // test value using regex to see if it is a valid url
    const isValidUrl = linkRegEx.test(value);

    return (
        <>
        <div className={"clabel"}>ADD A LINK BUTTON</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <input
                className={'minimal-input'}
                style={{
                    display: 'flex',
                    flexGrow: 1,
                    width: '80vw',
                    maxWidth: '500px',
                    fontFamily: 'Courier New',
                    fontSize: '1.2em',
                    color: isValidUrl ? 'green' : 'red',
                }}
                ref={inputRef}
                autoFocus={true}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
            ></input>
            <button
                className={'button'}
                disabled={isValidUrl ? false : true}
                onClick={() => {
                    props.addItemToList({
                        type: 'button',
                        size: {
                            width: 200,
                            height: 50,
                        },
                        url: value,
                    });
                    props.close();
                }}
            >
                Add
            </button>
            <div class="is-divider" data-content="OR"></div>
        </div>
        <div style={{width: '100%', height: 1, backgroundColor: `rgba(0,0,0,0.3)`, margin: "15px 0px 15px"}}/>
        <Row style={{overflow: 'scroll', width: '100%', fontSize: 30}}>
                {[
            ["https://", "fas fa-link", "Any Link"],
            ["https://instagram.com/", "fab fa-instagram", "Instagram"],
            ["https://twitter.com/", "fab fa-twitter", "Twitter"],
            ["https://discord.gg/", "fab fa-discord", "Discord"],
            ["https://www.youtube.com/channel/", "fab fa-youtube", "Youtube"],
            ["https://paypal.me/", "fab fa-paypal",     "Paypal"],
            ["https://linkedin.com/", "fab fa-linkedin", "LinkedIn"]].map((elem) => {return <>
                    <div className={'cbutton cbuttoninner tooltip'}  style={{width: "50px", height: "40px"}} onClick={()=>{setValue(elem[0]); inputRef.current.focus();}}>
                        <i className={elem[1]}></i>
                        <span style={{fontSize: "14px"}} className={"tooltiptext tooltipbottom"}>{elem[2]}</span>
                    </div>
                </>})}
            </Row>
        </>
    );
}