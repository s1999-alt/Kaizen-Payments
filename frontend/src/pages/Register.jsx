import { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import api from "../api/axios";

export default function Register() {
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/mail/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
        password2: form.password2,
      });

      login(res.data.access, res.data.refresh, res.data.user);

      window.location.href = "/mail-plans";
    } catch (err) {
      if (err.response?.data) {
        setError(Object.values(err.response.data).join(", "));
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-lg w-90 max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>

        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}

        <input
          className="border p-2 w-full mb-3 rounded"
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full mb-3 rounded"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <input
          className="border p-2 w-full mb-4 rounded"
          type="password"
          name="password2"
          placeholder="Confirm Password"
          value={form.password2}
          onChange={handleChange}
        />

        <button className="bg-blue-600 text-white py-2 rounded w-full">
          Register
        </button>

        <div className="text-center mt-3 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </div>
      </form>
    </div>
  );
}
