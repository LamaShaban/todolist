import React, { createContext, useContext, useState, useEffect } from 'react';
import * as tasksApi from '../api/tasks';

const TasksContext = createContext();

export function TasksProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    let mounted = true;
    tasksApi.fetchTasks().then((data) => {
      if (mounted) setTasks(data || []);
    });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    tasksApi.saveTasks(tasks);
  }, [tasks]);

  const addTask = ({ title, description = '', status = 'Pending', priority = 'Medium', dueDate = null }) => {
    const t = {
      id: Date.now(),
      title,
      description,
      status,
      priority,
      dueDate,
    };
    setTasks((s) => [t, ...s]);
    return t;
  };

  const editTask = (id, updates) =>
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, ...updates } : t)));

  const updateStatus = (id, status) =>
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, status } : t)));

  const deleteTask = (id) => setTasks((s) => s.filter((t) => t.id !== id));

  return (
    <TasksContext.Provider value={{ tasks, addTask, editTask, updateStatus, deleteTask, setTasks }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}
