import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTodoForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:8000/api/addtodo/', { title, description })
      .then(res => {
        console.log(res);
        console.log(res.data);
        navigate("/")
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
};
  
export default AddTodoForm;
  