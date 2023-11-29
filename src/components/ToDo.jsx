import style from "./ToDo.module.css"
import {useEffect, useState} from "react";
import ToDoItem from "./ToDoItem.jsx";
import { v4 as uuidv4 } from 'uuid';

const ToDo = () => {
  const [todos, setTodos] = useState([])
  const [inputTodo, setInputTodo] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/todos")
        const data = await response.json()

        setTodos(data)
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchData()
  }, [])

  const handleInputTodo = (event) => {
    setInputTodo(event.target.value)
  }

  const handleAddTodo = async () => {
    try {
      const todoId = uuidv4()

      // update state
      setTodos(prevTodos => {
        return [
          ...prevTodos,
          {
            id: todoId,
            text: inputTodo,
            display: "",
          }
        ]
      })

      // add data in server
      await fetch("http://localhost:3001/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: todoId,
          text: inputTodo,
          display: "",
        })
      })

      setInputTodo('')
    } catch (error) {
      console.error("Error adding data: ", error)
    }
  }

  return (
    <>
      <div className={style.todo}>
        <div className={style["todo-header"]}>
          To-Do List
        </div>

        <div className={style["todo-add"]}>
          <input type="text" placeholder="Add Your Task" className={style["todo-input"]} value={inputTodo} onChange={handleInputTodo}/>
          <div className={style["todo-add-btn"]} onClick={handleAddTodo}>
            Add
          </div>
        </div>

        <div className={style["todo-list"]}>
          {
            todos.length > 0 && todos.map((todo, index) => {
              return <ToDoItem key={index} todo={todo} setTodos={setTodos}/>
            })
          }
        </div>
      </div>
    </>
  )
}

export default ToDo
