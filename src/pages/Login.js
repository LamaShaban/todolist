import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail } from "lucide-react";

export default function Login() {
  const ref = useRef();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = (e) => {
    e.preventDefault();
    const email = ref.current.value.trim();

    if (!email) return setError("Please enter your email");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return setError("Enter a valid email");

    setError("");
    setLoading(true);

    setTimeout(() => {
      login(email);
      navigate("/tasks", { replace: true });
    }, 1200);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50 px-6">

      {/* 🔵 Animated Gradient Background Shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-40 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-sky-300 rounded-full blur-3xl opacity-40 animate-pulse"></div>

      <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md border border-gray-100">

        {/* 🖼 Illustration Side */}
        {/* <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-500 to-sky-500 p-10">
          <img
            src="https://undraw.co/api/illustrations/login.svg"
            alt="Login Illustration"
            className="w-80"
          />
        </div> */}

        {/* 🔐 Form Side */}
        <div className="p-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome Back 👋
          </h1>
          <p className="text-gray-500 mb-8">
            Sign in to access your task dashboard
          </p>

          <form onSubmit={handle}>

            {/* 📧 Input with Icon */}
            <div className="relative mb-5">
              <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                ref={ref}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-300"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            {/* 🚀 Button with Spinner */}
            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg hover:bg-indigo-700 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

          <p className="mt-6 text-sm text-gray-400 text-center">
            Smart Task Management Dashboard
          </p>
        </div>

      </div>
    </div>
  );
}