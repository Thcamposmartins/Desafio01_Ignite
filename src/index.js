const express = require('express')
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const app = express()

app.use(cors());
app.use(express.json())
const users = []

app.post('/users',(request, response)=>{
    const {name, username} = request.body   

    try{
        const userAlreadyExists = users.find(
            user=>user.username===username
        ) 

        if(userAlreadyExists)
            return response.status(400).json({error: "User already exists! 🤦‍♂️"})
        const user = {      
            id:uuidv4(),
            name,
            username,
            todo:[]
        }
        users.push(user)

        return response.status(201).json(user)   

    }catch(err){
        return response.status(400).json({error: "Is not possible save the User 🤷‍♀️"})
    }
})

app.get('/todo',VerifyIfExistsUser,(request, response)=>{
    const {user} = request
    return response.status(201).json(user.todo)
})

app.post('/todo',VerifyIfExistsUser,(request, response)=>{
    const {title, deadline} = request.body   
    const {user} = request

    try{
        const todo = {      
            id:uuidv4(),
            title,
            done: false, 
            deadline: new Date(deadline), 
            created_at: new Date()
        }
        user.todo.push(todo)

        return response.status(201).json(user.todo)   

    }catch(err){
        return response.status(400).json({error: "Is not possible save the task 🤷‍♀️"})
    }
})

app.put('/todo/:id',VerifyIfExistsUser,(request, response)=>{
    const {title, deadline} = request.body   
    const {user} = request
    const {id} = request.params

    const checkID = user.todo.find(todo =>todo.id === id)
    
    if(!checkID) 
    return response.status(400).json({error: "Is not possible find task 🤷‍♀️"}) 

    try{
       checkID.title = title
       checkID.deadline = new Date(deadline)

        return response.status(201).json(checkID)   

    }catch(err){
        return response.status(400).json({error: "Is not possible update task 🤷‍♀️"})
    }
})

app.patch('/todo/:id/done',VerifyIfExistsUser,(request, response)=>{
    const {user} = request
    const {id} = request.params

    const checkID = user.todo.find(todo =>todo.id === id)
    
    if(!checkID) 
    return response.status(400).json({error: "Is not possible find task 🤷‍♀️"}) 

    try{
        user.todos.push({      
            done: true, 
        })

        return response.status(201).json(" Congratulations for completing your task ✨")   

    }catch(err){
        return response.status(400).json({error: "Is not possible update task 🤷‍♀️"})
    }
})

app.delete('/todo/:id',VerifyIfExistsUser,(request, response)=>{
   const {user} = request
   const {id} = request.params

    const checkID = user.todo.find(todo =>todo.id === id)
    
    if(checkID === -1) {
        return response.status(400).json({error: "Is not possible find task 🤷‍♀️"}) 
s    }

    user.todo.splice(checkID,1)

    return response.status(200).json(user)
})

function VerifyIfExistsUser(request, response, next){
    const {username} = request.headers

    const user = users.find((users)=> users.username===username)
    if(!user){
        return response.status(400).json({error: "User not found 👀"})
    }
    request.user = user
    return next()
}


module.exports = app;