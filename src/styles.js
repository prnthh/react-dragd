// Inline styles to replace CSS classes
// Note: Hover/active states need to be handled with React state in components

export const styles = {
  // Drag handle styles
  dragHandle: {
    position: 'absolute',
    border: '1px solid black',
    borderRadius: '2px',
    backgroundColor: 'white',
    padding: '3px',
    cursor: 'nesw-resize',
    zIndex: 9999999,
  },

  dragHandle2: {
    position: 'absolute',
    padding: '3px',
    border: '1px solid black',
    backgroundColor: 'white',
    zIndex: 9999999,
    cursor: 'sw-resize',
  },

  // Control panel styles
  cpanel: {
    minWidth: '10px',
    border: '1px solid black',
    backgroundColor: 'rgba(255, 255, 255, 0.64)',
    backdropFilter: 'blur(8px)',
    borderRadius: '3px',
    zIndex: 9999999999,
  },

  cpanelShadow: {
    boxShadow: '4px 4px 0px rgb(0 0 0 / 16%)',
  },

  // Button styles
  cbutton: {
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '3px',
    cursor: 'pointer',
  },

  cbuttoninner: {
    width: '25px',
    height: '25px',
  },

  cbuttoninnerSelected: {
    backgroundColor: 'rgba(1, 1, 1, 0.3)',
  },

  cbuttonmain: {
    border: '1px solid black',
    color: 'black',
    backgroundColor: 'white',
    width: '52px',
    height: '52px',
  },

  // Layout styles
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Input styles
  minimalInput: {
    border: 'none',
    outline: 'none',
  },

  // Label styles
  clabel: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'black',
    padding: '5px',
  },

  // Tooltip styles (visibility handled via React state)
  tooltip: {
    position: 'relative',
  },

  tooltiptext: {
    visibility: 'hidden',
    width: '120px',
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '5px 0',
    borderRadius: '6px',
    marginRight: '200px',
    position: 'absolute',
    zIndex: 1,
  },

  tooltiptextVisible: {
    visibility: 'visible',
  },

  tooltipbottom: {
    marginTop: '80px',
    marginRight: '0px',
    marginLeft: '0px',
  },

  // Alignment guide styles
  pageAlignGuide: {
    height: '100vh',
    position: 'fixed',
    width: '1px',
    borderRight: '1px solid red',
    zIndex: 99999999,
    top: 0,
    touchAction: 'none',
    pointerEvents: 'none',
  },

  pageAlignGuideHidden: {
    opacity: 0,
  },

  mobileAlignGuide: {
    borderRight: '1px solid grey',
    touchAction: 'none',
    pointerEvents: 'none',
  },

  mobileAlignBg: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 99999999,
    touchAction: 'none',
    pointerEvents: 'none',
  },

  // Interthing guide styles
  interthingLine: {
    width: '1px',
    height: '1rem',
    background: 'lightblue',
    position: 'absolute',
    zIndex: 9999999,
    touchAction: 'none',
    pointerEvents: 'none',
  },

  interthingLineNub: {
    position: 'absolute',
    height: '4px',
    width: '4px',
    backgroundColor: 'red',
    transform: 'translate(-50%, -50%)',
    display: 'block',
    zIndex: 999999999,
    touchAction: 'none',
    pointerEvents: 'none',
  },

  // Modal styles
  dragdModal: {
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  dragdModalContent: {
    backgroundColor: '#fefefe',
    margin: '15% auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
  },

  // Dropdown styles
  dropdown: {
    position: 'relative',
    display: 'inline-block',
  },

  dropdownContent: {
    position: 'absolute',
    backgroundColor: '#f9f9f9',
    minWidth: '160px',
    boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
    padding: '12px 16px',
    zIndex: 1,
  },
};

// Helper to merge styles
export const mergeStyles = (...styleObjects) => {
  return Object.assign({}, ...styleObjects);
};
