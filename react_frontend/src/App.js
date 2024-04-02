import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HelloWorld from './components/playground/HelloWorld';
import TodoList from './components/todo/view';
import AddTodoForm from './components/todo/add';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<TodoList />} />
        <Route path="/add-todo" element={<AddTodoForm />} />
      </Routes>
    </Router>
  );
}

export default App;