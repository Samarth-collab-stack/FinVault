import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function VaultMark() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      className="shrink-0"
      aria-hidden="true"
    >
      <circle
        cx="17"
        cy="17"
        r="16"
        stroke="#B8925A"
        strokeWidth="1.2"
      />
      <circle
        cx="17"
        cy="17"
        r="11.5"
        stroke="#B8925A"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="17" cy="17" r="3.2" fill="#B8925A" />
      <rect
        x="16.3"
        y="16.4"
        width="1.4"
        height="7"
        rx="0.7"
        fill="#B8925A"
        transform="rotate(35 17 17)"
      />
    </svg>
  );
}

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please provide all required fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
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
    <div className="min-h-screen bg-[#fffefc] text-[#171B22]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-5 py-10 sm:px-8 lg:px-10">

        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 flex justify-center">
            <img
              src="/FinVault-logo.png"
              alt="FinVault"
              className="h-20 w-auto"
            />
          </div>

          {/* Header */}
          <div className="border-b border-[#E4E1D8] pb-7 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#171B22]/45">
              FinVault-Know where you stand.
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#171B22] sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#171B22]/60">
              Sign in to review your financial activity.
            </p>
          </div>

          {/* Login Form */}
          <div className="mt-8 border border-[#E4E1D8] bg-white p-6 sm:p-8">

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#171B22]/50"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#171B22] placeholder:text-[#171B22]/35 focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-[#171B22]/50"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#171B22] placeholder:text-[#171B22]/35 focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="border border-[#B23B3B]/25 bg-[#B23B3B]/5 px-4 py-3">
                  <p className="text-sm leading-5 text-[#B23B3B]">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full border border-[#171B22] bg-[#171B22] px-6 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-white hover:bg-[#2A2F37] disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-[#B8925A]/25"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            {/* Signup */}
            <div className="mt-7 border-t border-[#E4E1D8] pt-6 text-center">
              <p className="text-sm text-[#171B22]/50">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[#B8925A] hover:text-[#967541] focus:outline-none"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-5 text-center text-xs text-[#171B22]/35">
            Secure access to your financial dashboard
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;