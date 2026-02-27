import React, { useState, useMemo } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const STATUS = ["Pending", "In Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];

function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString();
  } catch {
    return d;
  }
}

export default function TaskListPage() {
  const { tasks, addTask, editTask, updateStatus, deleteTask } = useTasks();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("none");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  const openAdd = () => {
    setEditing(null);
    setForm({
      title: "",
      description: "",
      status: "Pending",
      priority: "Medium",
      dueDate: "",
    });
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditing(task);
    setForm(task);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    if (editing) {
      editTask(editing.id, form);
    } else {
      addTask(form);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this task?")) return;
    deleteTask(id);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const filtered = useMemo(() => {
    let list = tasks.filter((t) =>
      filterStatus === "All" ? true : t.status === filterStatus
    );

    if (search) {
      list = list.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "dueDate") {
      list = [...list].sort(
        (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
      );
    }

    if (sortBy === "priority") {
      const order = { High: 0, Medium: 1, Low: 2 };
      list = [...list].sort((a, b) => order[a.priority] - order[b.priority]);
    }

    return list;
  }, [tasks, filterStatus, search, sortBy]);

  return (
    <div className="min-h-screen flex bg-gray-50">

{/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:flex flex-col">
        {user && (
          <div className="flex flex-col items-start mb-10 w-full">
            
            {/* User Info */}
            <div className="flex items-center gap-3 w-full mb-4">
              <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold">
                {user.email.charAt(0).toUpperCase()}
              </div>
              
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">Logged in as</p>
                <p className="font-medium text-gray-600 break-all">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex flex-col gap-4 text-gray-600">
          <span className="font-semibold text-indigo-600">Dashboard</span>
          <span className="cursor-pointer hover:text-indigo-600 transition">
            Tasks
          </span>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">

        {/* Top Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">My Tasks</h1>

          {/* Logout Button (Top Right) */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Search + Filters */}
        <div className="mb-8 max-w-md space-y-4">
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-200 outline-none"
          />

          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 p-3 rounded-xl border"
            >
              <option value="All">All Status</option>
              {STATUS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 p-3 rounded-xl border"
            >
              <option value="none">Sort</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        {/* Board */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Add Task Card */}
          <div
            onClick={openAdd}
            className="cursor-pointer border-2 border-dashed border-indigo-300 rounded-2xl p-8 flex flex-col items-center justify-center text-indigo-500 hover:bg-indigo-50 transition"
          >
            <span className="text-4xl mb-2">+</span>
            <span className="font-medium">Add New Task</span>
          </div>

          {filtered.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition"
            >
              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                {task.title}
              </h3>

              <p className="text-gray-600 text-sm mb-3">
                {task.description}
              </p>

              <div className="text-sm text-gray-500 mb-4">
                Due: {formatDate(task.dueDate)}
              </div>

              <div className="flex justify-between items-center">
                <select
                  value={task.status}
                  onChange={(e) =>
                    updateStatus(task.id, e.target.value)
                  }
                  className="border rounded-lg p-1 text-sm"
                >
                  {STATUS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <div className="flex gap-3 text-gray-500">
                  <button onClick={() => openEdit(task)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(task.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-6 rounded-2xl w-full max-w-lg"
            >
              <h2 className="text-xl font-semibold mb-4">
                {editing ? "Edit Task" : "Add Task"}
              </h2>

              <input
                className="w-full p-2 border rounded mb-3"
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <textarea
                className="w-full p-2 border rounded mb-3"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <div className="flex gap-2 mb-4">
                <select
                  value={form.priority}
                  onChange={(e) =>
                    setForm({ ...form, priority: e.target.value })
                  }
                  className="border p-2 rounded"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                  className="border p-2 rounded"
                >
                  {STATUS.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) =>
                    setForm({ ...form, dueDate: e.target.value })
                  }
                  className="border p-2 rounded"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  {editing ? "Save" : "Add"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}