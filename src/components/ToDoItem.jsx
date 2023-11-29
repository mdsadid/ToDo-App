import style from "./ToDoItem.module.css"
import tick from "../assets/tick.png"
import not_tick from "../assets/not_tick.png"
import cross from "../assets/cross.png"
import PropTypes from 'prop-types'

const ToDoItem = (props) => {
  const { todo, setTodos } = props

  const handleTodoClick = async (todoId) => {
    try {
      // fetch todos
      const response = await fetch("http://localhost:3001/todos")
      const todos = await response.json()

      // find the specific todo by its id and toggle the 'display' property
      const updatedTodos = todos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            display: todo.display === "" ? "line-through" : "",
          }
        }

        return todo
      })

      const filteredTodo = updatedTodos.find(todo => todo.id === todoId)

      // update the todos
      await fetch(`http://localhost:3001/todos/${filteredTodo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredTodo)
      })

      setTodos(updatedTodos)
    } catch (error) {
      console.error("Error updating data: ", error)
    }
  }

  const handleRemoveTodo = async (todoId) => {
    try {
      // fetch todos
      const response = await fetch("http://localhost:3001/todos")
      const todos = await response.json()

      const filteredTodos = todos.filter(todo => todo.id !== todoId)

      // delete the todo
      await fetch(`http://localhost:3001/todos/${todoId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      })

      setTodos(filteredTodos)
    } catch (error) {
      console.error("Error deleting data: ", error)
    }
  }

  return (
    <>
      <div className={style["todo-items"]}>
        <div className={style["todo-items-container"]} onClick={() => handleTodoClick(todo.id)}>
          {
            todo.display === "" ?
              <img src={not_tick} alt="not tick" className={style["not-tick-icon"]}/>
              :
              <img src={tick} alt="tick" className={style["tick-icon"]}/>
          }
          <div className={`${style["todo-item-text"]} ${todo.display === "line-through" ? style["done-todo"] : ""}`}>
            {todo.text}
          </div>
        </div>

        <img src={cross} alt="cross" className={style["cross-icon"]} onClick={() => handleRemoveTodo(todo.id)}/>
      </div>
    </>
  )
}

ToDoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string,
    text: PropTypes.string,
    display: PropTypes.string,
  }),
  setTodos: PropTypes.func
}

export default ToDoItem
