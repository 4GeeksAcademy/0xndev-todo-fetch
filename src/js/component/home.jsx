import React, { useEffect, useState } from 'react';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  // Fetch Todos initially
  useEffect(() => {
    fetch("https://playground.4geeks.com/apis/fake/todos/user/derekguijt")
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) { // Ensure the data is an array
          setTodos(data);
        }
      })
      .catch(error => console.error("Fetching error", error));
  }, []);

  const addTodo = (e) => {
    e.preventDefault(); // Prevent form submission
    const todoText = newTodo.trim();
    if (todoText) {
      let userTodo = [...todos, { label: todoText, done: false }];
      fetch("https://playground.4geeks.com/apis/fake/todos/user/0xndev", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userTodo)
      })
      .then(response => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then(() => {
        setTodos(userTodo); // Update local todos
        setNewTodo(''); // Reset input field
      })
      .catch(error => console.log(error));
    }
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    if (index >= 0 && index < todos.length) {
      // Update the 'done' property of the item at the specified index
      todos[index].done = true;
    } else {
      // Handle the case where the index is out of bounds
      console.error('Index is out of bounds');
    }
    fetch("https://playground.4geeks.com/apis/fake/todos/user/0xndev", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todos)
    })
    .then(response => {
      if (!response.ok) throw Error(response.statusText);
      return response.json();
    })
    .then(() => {
      setTodos(updatedTodos); // Update local todos
    })
    .catch(error => console.log(error));
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      {todos.length === 0 ? (
        <p>No tasks, add a task</p>
      ) : (
        <ul>
          {todos.map((todo, index) => (
            <li key={index}>
              {todo.label}
              <button onClick={() => removeTodo(index)}>X</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;