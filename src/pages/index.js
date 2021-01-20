import React, { useEffect, useState } from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import "./style.css";

// This query is executed at run time by Apollo.
const GET_TODOS = gql`
{
    todos {
        task,
        id,
        status
    }
}
`;
const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }
`
const DELETE=gql`
mutation delete_Todo($id:String){
  delete_Todo(id:$id)
}`
const UPDATE=gql`
mutation update_Todo($task:String,$id:String){
  update_Todo(task:$task,id:$id){
      task,
      id
  }
}`
export default function Home() {
    let inputText;

    const [addTodo] = useMutation(ADD_TODO);
    const [delete_Todo] = useMutation(DELETE);
    const [update_Todo] = useMutation(UPDATE);
    const delTask=(p_id)=>{
      console.log(p_id,"pid>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      delete_Todo({
        variables:{
          id:p_id
        },
        refetchQueries:[{ query: GET_TODOS }]

      })

    }
    const addTask = () => {
        addTodo({
            variables: {
                task: inputText.value
            },
            refetchQueries:[{ query: GET_TODOS }]
        })
        inputText.value = "";
    }

    const UPDATE_TODO=(id_para)=>{
        const update_task_alert=prompt("")
        // console.log(UPDATE_TODO,"update_todo")
        update_Todo({variables:{
            task:update_task_alert,
            id:id_para
        },
        
            refetchQueries:[{ query: GET_TODOS }]
    
    })

    }

    const { loading, error, data } = useQuery(GET_TODOS);
    // console.log(data,"datatatatat")

    if (loading)
        return <h2>Loading..</h2>

    if (error) {
        console.log(error)
        return <h2>Error</h2>
    }

    return (
      <div className="main">
            <div className="container">
            <label>
                <h1 style={{color:"yellow"}}> TODO APP </h1> 
                <input type="text" ref={node => {
                    inputText = node;
                }} />
            </label>
            <button onClick={addTask}>Add Task</button>

            <br /> <br />

            <h3>My TODO LIST</h3>

         <div >
         {data.todos.map(todo => {
                        // console.log(todo)
                        return (
                            <div style={{display:"flex",justifyContent:"center"}}>
                        
                    <div style={{border:"2px solid yellow",width:"90px",
                backgroundColor:"pink",marginLeft:"5px",marginTop:"7px"}}>
                   <h4>TASK : <span>  <h4> {todo.task}</h4></span></h4>

                    </div>
                    <div style={{marginLeft:"10px"}}>
                        {todo.status}
                        </div>
        <div style={{marginLeft:"10px",height:"60px"}}><button 
    style={{height:"50px"}}    onClick={()=>{console.log(todo.id,"id")

delTask(todo.id)}}>DELETE TASK</button></div>

<div style={{marginLeft:"10px",height:"60px"}}><button 
  style={{height:"50px"}}   onClick={()=>{console.log(todo.id,"id")
UPDATE_TODO(todo.id)}}>UPDATE TODO TASK</button></div>


                        </div>
                        )




                    })}
         </div>

        </div>
      </div>
    );

}