import { styles, mergeStyles } from '../../styles';

export default function MobileBoundary ({mobileWidth = 600}) {
    return window.innerWidth > mobileWidth && <>
        <Boundary mobileWidth={mobileWidth} />
        <Boundary mobileWidth={mobileWidth} right/>
    </>
}

function Boundary({mobileWidth, right}) {
    return <>
    <div
        style={mergeStyles(styles.mobileAlignBg, {
            position: 'fixed',
            left: right? undefined: `0px`,
            right: right? `0px`: undefined,
            width: `calc((100vw - ${mobileWidth}px)/2)`,
            height: '100vh',
        })}
    >
        <div
            style={mergeStyles(styles.pageAlignGuide, styles.mobileAlignGuide, {
                position: "absolute",
                right: right? undefined: "0px",
                left: right? "0px": undefined,
            })}
        />
        <div
            style={{
                position: 'absolute',
                width: '100%',
                top: '50vh',
                textAlign: 'center',
            }}
        >
            ««« Not visible on phone »»»
        </div>
    </div>
    </>
}