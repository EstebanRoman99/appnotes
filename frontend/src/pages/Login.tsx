import React, { useState } from "react";
import Swal from "sweetalert2";
import { login } from "../services/api";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (user: string, pass: string) => {
    try {
      setLoading(true);
      const { token } = await login(user, pass);
      localStorage.setItem("token", token);
      window.location.href = "/";
    } catch {
      Swal.fire({
        title: "Error",
        text: "Invalid username or password",
        icon: "error",
        confirmButtonColor: "#F44336",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-400 to-blue-500 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Welcome
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please log in using the only available credentials to access the app:
          <br />
          <strong>username: user</strong>, <strong>password: password</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Ingresa tu username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
