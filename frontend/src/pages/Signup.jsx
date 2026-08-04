import { useState } from "react";
import axios from "axios";
function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch =
    formData.password.length > 0 &&
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!passwordsMatch) {
    setError("Passwords do not match.");
    return;
  }

  setLoading(true);
  setError("");
  setSuccess("");

  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
      }
    );

    setSuccess(response.data.message);

    // We will use this token on Day 4
    localStorage.setItem("token", response.data.token);

    setFormData({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    // Later we will redirect to Login page
    // navigate("/login");

  } catch (err) {
    if (err.response) {
      setError(err.response.data.message);
    } else {
      setError("Could not connect to the server.");
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Create your FinVault account
        </h1>
        <br />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <br />
          </div>
            <br />
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <br />

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <br />
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-red-600 mt-1">
                Passwords do not match.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            disabled={!passwordsMatch || loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default Signup;