import React from 'react'
import todoContext from './todoContext'

function ContextProvider(props) {
  
    const url = "https://todo-mern-stack-4k5p.onrender.com";


  return (
    <todoContext.Provider value={url}>
        {props.children}
    </todoContext.Provider>
  )
}

export default ContextProvider;