import { useRef, useState } from "react";
import { FaCheckCircle, FaRegCircle, FaTimes } from "react-icons/fa";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const taskRef = useRef();

  const handleAddTask = () => {
    const text = taskRef.current.value.trim();
    if (!text) return;

    setTasks([
      ...tasks,
      { id: Date.now(), text, completed: false },
    ]);

    taskRef.current.value = "";
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };



  return (
    <div className="App">
      <div className="todo-container">
        <h1>To-Do List</h1>

        <ul className="todo-list">
          {tasks.length === 0 && (
            <p className="empty">✨ Add your first task</p>
          )}

          {tasks.map((task) => (
            <li key={task.id} className="task">
              <button
                className="check-btn"
                onClick={() => toggleTask(task.id)}
                aria-label="Mark task as done"
              >
                {task.completed ? (
                  <FaCheckCircle />
                ) : (
                  <FaRegCircle />
                )}
              </button>

              <span className={task.completed ? "done" : ""}>
                {task.text}
              </span>

              <button
                className="delete"
                onClick={() => deleteTask(task.id)}
                aria-label="Delete task"
              >
                <FaTimes />
              </button>
            </li>
          ))}
        </ul>

        <div className="todo-input">
          <input
            ref={taskRef}
            placeholder="What needs to be done?"
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
          <button onClick={handleAddTask}>Add</button>
        </div>
      </div>
    </div>
  );
}

export default App;
