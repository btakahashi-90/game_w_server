import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Todo from './todo';

const TodoList = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/todos/')
      .then(res => {
        setTodos(res.data);
      });
  }, []);

  return (
    <>
        {todos.map(todo => (
          <div className="todo_wrapper" key={todo.id}>
            <Todo title={todo.title} description={todo.description} id={todo.id}></Todo>
            {/* Add buttons for edit and delete operations here */}
          </div>
        ))}
    </>
  );
};

export default TodoList;
