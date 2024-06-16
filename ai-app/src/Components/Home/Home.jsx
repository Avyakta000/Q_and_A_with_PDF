import React, { useContext, useEffect, useState } from 'react'
import './Home.css'
import { ChatContext } from '../../context/ChatContextProvider';

import { CSSProperties } from "react";
import BeatLoader from "react-spinners/BeatLoader";

const Home = () => {
  const { todos, deleteTodo, response, answer } = useContext(ChatContext);
  let [loading, setLoading] = useState(true);


  let [color, setColor] = useState("#49557e");


  // setAnswer(null)
    // Set loading to true when there's no answer and todos are not empty
  useEffect(() => {
      if (!answer && todos.length > 0) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, [answer, todos]);
  
  // console.log(answer,'answer')
  return (
    <div className="home-message">
    <h4>{response}</h4>
    <div className="home-conv">
      {todos.map((todo, index) => (
        <div key={index}>
          <h4 className="user">You:</h4>
          <div className="together">
            <p className="query">{todo}</p>
            <button onClick={() => deleteTodo(index)}>Remove</button>
          </div>
          {index === todos.length - 1 && ( // Only show for the last todo
            <>
              <h4 className="user">AI:</h4>
              {!answer && (
                <div className="sweet-loading">
                  <BeatLoader
                    color={color}
                    loading={loading}
                    size={10}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              )}
              {answer && <p className="query">{answer}</p>}
            </>
          )}
        </div>
      ))}
    </div>
  </div>)
};


export default Home
