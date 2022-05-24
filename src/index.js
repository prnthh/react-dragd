import React, {useState} from 'react'

import DragDrop from './DragDrop'

import "./index.css";

const MyComponent = props => {
  return <>
      <DragDrop mode={"edit"} {...props}/>
    </>
}
export default MyComponent
