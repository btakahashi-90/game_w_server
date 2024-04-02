import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MobsList from '../ui/mobsList';
import '../../css/mobsList.css'

function HelloWorld() {
    const [message, setMessage] = useState('')
    const [server_mobs, setMobs] = useState([])

    useEffect(() => {
        axios.get('http://localhost:8000/api/mobs')
        .then(response => {
            setMessage(response.data.message)
            setMobs(response.data.mobs)
        })
        .catch(error => {
            console.log(error)
        })
    }, [])

    return (
        <>
            <div>
                <h1>Hello, World!</h1>
                <p>{message}</p>
                <div id="mob_list">
                    <div>Name</div>
                    <div>Health</div>
                    <div>Base Damage</div>
                    <div>Damage Modifier</div>
                    <div>Damage Reduction</div>
                    {server_mobs.map((mob) => (
                        <MobsList key={mob.id} mob={mob} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default HelloWorld;