import React, { createContext, useContext, useState } from 'react'

export const ChatContext=createContext(null)

const ChatContextProvider = (props) => {

    const [todos, setTodos] = useState([]);
    const [response, setResponse] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [answer, setAnswer] = useState(null);


    const addTodo = (todo) => {
      setTodos([...todos, todo]);
    };
  
    const deleteTodo = () => {
      setTodos(todos.slice(0, -1));
    };

    // const addAnswer = (answer) => {
    //     setTodos([...answers, answer]);
    //   };
  
    return (
      <ChatContext.Provider value={{ todos, addTodo, deleteTodo,response,setResponse,fileName,setFileName,answer,setAnswer}}>
        {props.children}
      </ChatContext.Provider>
    );
}

export default ChatContextProvider
