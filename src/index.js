import React from 'react'
import DragDrop from './DragDrop'

const MyComponent = props => {
  return <>
      <DragDrop mode={"edit"} {...props}/>
    </>
}
export default MyComponent
