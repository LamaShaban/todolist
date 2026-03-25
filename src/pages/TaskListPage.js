import React, { useState, useMemo } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useTasks } from "../context/TasksContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

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
  const { tasks, addTask, editTask, updateStatus, deleteTask, setTasks } = useTasks();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("none");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draggingTaskId, setDraggingTaskId] = useState(null);
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

  const handleDragStart = (id, e) => {
    setDraggingTaskId(id);
    if (e && e.dataTransfer && e.currentTarget) {
      const node = e.currentTarget.cloneNode(true);
      node.style.position = 'absolute';
      node.style.top = '-9999px';
      node.style.left = '-9999px';
      node.style.opacity = '1';
      document.body.appendChild(node);
      e.dataTransfer.setDragImage(node, 20, 20);
      window.requestAnimationFrame(() => document.body.removeChild(node));
    }
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (targetId) => {
    if (!draggingTaskId || draggingTaskId === targetId) return;
    setTasks((prev) => {
      const sourceIndex = prev.findIndex((t) => t.id === draggingTaskId);
      const targetIndex = prev.findIndex((t) => t.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggingTaskId(null);
  };

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

  const getStatusStyle = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

  return (
    <div className="min-h-screen flex bg-gray-50">

    {/* Sidebar */}
    <aside className="w-64 bg-white border-r border-gray-200 h-screen p-6 hidden md:flex flex-col">

      {user && (
        <div className="mb-10">

          {/* User Section */}
          <div className="flex items-center gap-3 w-full mb-6">
            <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-semibold shadow-md">
              {user.email.charAt(0).toUpperCase()}
            </div>

            <div className="flex flex-col min-w-0 flex-1">
              <p className="text-xs text-gray-400">Logged in as</p>
              <p
                className="font-medium text-gray-700 truncate"
                title={user.email}
              >
                {user.email}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex flex-col gap-2">

        <a
          href="#"
          className="group flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200"
        >
          Dashboard
        </a>

        <a
          href="#"
          className="group flex items-center gap-3 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 font-medium border-indigo-600"
        >
          <span className="text-lg">📝</span>
          Tasks
        </a>

        <button
          className="group flex items-center gap-3 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full text-left"
        >
          <LogOut size={18} />
          Logout
        </button>
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
    draggable
    onDragStart={(e) => handleDragStart(task.id, e)}
    onDragOver={handleDragOver}
    onDrop={() => handleDrop(task.id)}
    className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 ${
      task.status === "Completed" ? "opacity-70" : ""
    }`}
  >
    <div className="flex justify-between items-start">

      {/* Left Content */}
      <div className="flex-1">

        <h3
          className={`font-semibold text-lg mb-2 ${
            task.status === "Completed"
              ? "line-through text-gray-400"
              : "text-gray-800"
          }`}
        >
          {task.title}
        </h3>

        <p className="text-gray-600 text-sm mb-3">
          {task.description}
        </p>

        <div className="text-xs text-gray-400 mb-3">
          📅 {formatDate(task.dueDate)}
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
            task.status
          )}`}
        >
          {task.status}
        </span>

      </div>

      {/* Right Actions */}
      <div className="flex flex-col items-center gap-3 ml-4">

        {/* Check Button */}
        {task.status !== "Completed" && (
          <button
            onClick={() => updateStatus(task.id, "Completed")}
            className="w-9 h-9 rounded-full bg-white text-emerald-600 hover:bg-emerald-50 border border-emerald-300 shadow-sm hover:shadow-md transition-all duration-150 inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-200"
            aria-label="Mark task completed"
          >
            {'\u2714'}
          </button>
        )}

        <button
          onClick={() => openEdit(task)}
          className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
        >
          <FaEdit />
        </button>

        <button
          onClick={() => handleDelete(task.id)}
          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition text-gray-500"
        >
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