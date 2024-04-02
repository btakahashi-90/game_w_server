import React from 'react';
import axios from 'axios';
import '../../css/todo.css'

class Todo extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            editing: false,
            title: this.props.title,
            description: this.props.description,
            id: this.props.id
        }
        this.titleRef = React.createRef();
        this.descriptionRef = React.createRef();
    }

    edit = () => {
        this.setState({editing: true})
    }

    save = () => {
        this.setState({title: this.titleRef.current.value, description: this.descriptionRef.current.value}, () =>{
            this.setState({editing: false})
            this.handleSubmit()
        })
    }

    renderForm = () => {
        return(
            <div className="todo">
                <input ref={this.titleRef} defaultValue={this.state.title} />
                <textarea ref={this.descriptionRef} defaultValue={this.state.description}></textarea>
                <span>
                    <button onClick={this.save}>Save</button>
                </span>
            </div>
        )
    }

    renderDisplay = () => {
        return(
            <div className="todo">
                <p>{this.state.title} : {this.state.description}</p>
                <span>
                    <button onClick={this.edit}>Edit</button>
                </span>
            </div>
        )
    }

    handleSubmit = () => {
        axios.post('http://localhost:8000/api/updatetodo/',
          { title: this.state.title, description: this.state.description, id: this.state.id })
          .then(res => {
            console.log(res);
            console.log(res.data);
        });
    };

    render(){
        return(
            <>
                {(this.state.editing ? this.renderForm() : this.renderDisplay())}
            </>
        )
    }
}

export default Todo