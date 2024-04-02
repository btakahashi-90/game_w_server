import axios from 'axios';
import React from 'react';

class GetTodo extends React.Component {
    state = {
        todos: []
    }

    componentDidMount() {
        axios.get('http://localhost:8000/api/todos/')
        .then(result => {
            const todos = result.data
            this.setState({ todos })
        })
    }

    render(){
        return(
            <div>
                {this.state.todos.map(todo => (
                    <p key={todo.id}>{todo.title}</p>
                ))}
            </div>
        )
    }
}

export default GetTodo;