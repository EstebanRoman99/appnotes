import React, { useState } from "react";
import Swal from "sweetalert2";
import { login } from "../services/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (username: string, password: string) => {
    try {
      const { token } = await login(username, password);
      localStorage.setItem("token", token);
      window.location.href = "/";
    } catch {
      Swal.fire({
        title: "Error",
        text: "Invalid username or password",
        icon: "error",
        confirmButtonColor: "#F44336",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(username, password);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded shadow max-w-md w-full"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
