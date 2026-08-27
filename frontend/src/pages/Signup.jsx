import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VaultMark() {
  return (
    <svg
      width="38"
      height="38"
      viewBox="0 0 34 34"
      fill="none"
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

function Signup() {
  const navigate = useNavigate();

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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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

      localStorage.setItem("token", response.data.token);

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

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
    <div className="min-h-screen bg-[#fffefc] px-5 py-10 text-[#171B22] sm:px-6">
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="w-full max-w-md">

          {/* Brand */}
          <div className="mb-8 text-center">
            <div className="flex justify-center">
              {/* Brand */}
              <img
                src="/FinVault-logo.png"
                alt="FinVault"
                className="h-15 w-auto"
              />
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#171B22]/45">
              FinVault
            </p>
          </div>

          {/* Signup Card */}
          <div className="border border-[#E4E1D8] bg-white p-7 sm:p-9">

            <div className="border-b border-[#E4E1D8] pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8925A]">
                Get started
              </p>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#171B22] sm:text-3xl">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#171B22]/55">
                Set up your FinVault account to start managing your
                financial activity.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/55"
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
                  placeholder="Enter your full name"
                  className="w-full border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#171B22] placeholder:text-[#171B22]/30 focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/55"
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
                  placeholder="Enter your email"
                  className="w-full border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#171B22] placeholder:text-[#171B22]/30 focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/55"
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
                  placeholder="Create a password"
                  className="w-full border border-[#D8D5CC] bg-white px-4 py-3 text-sm text-[#171B22] placeholder:text-[#171B22]/30 focus:border-[#B8925A] focus:outline-none focus:ring-2 focus:ring-[#B8925A]/20"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#171B22]/55"
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
                  placeholder="Confirm your password"
                  className={`w-full border bg-white px-4 py-3 text-sm text-[#171B22] placeholder:text-[#171B22]/30 focus:outline-none focus:ring-2 ${formData.confirmPassword.length > 0 &&
                      !passwordsMatch
                      ? "border-[#B23B3B] focus:border-[#B23B3B] focus:ring-[#B23B3B]/15"
                      : "border-[#D8D5CC] focus:border-[#B8925A] focus:ring-[#B8925A]/20"
                    }`}
                />

                {formData.confirmPassword.length > 0 &&
                  !passwordsMatch && (
                    <p className="mt-2 text-xs text-[#B23B3B]">
                      Passwords do not match.
                    </p>
                  )}

                {passwordsMatch && (
                  <p className="mt-2 text-xs text-[#1F6F54]">
                    Passwords match.
                  </p>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="border border-[#B23B3B]/20 bg-[#B23B3B]/5 px-4 py-3">
                  <p className="text-sm text-[#B23B3B]">
                    {error}
                  </p>
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="border border-[#1F6F54]/20 bg-[#1F6F54]/5 px-4 py-3">
                  <p className="text-sm text-[#1F6F54]">
                    {success}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!passwordsMatch || loading}
                className="w-full border border-[#171B22] bg-[#171B22] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#2a2f37] disabled:cursor-not-allowed disabled:border-[#D8D5CC] disabled:bg-[#E8E6E0] disabled:text-[#171B22]/35"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-7 border-t border-[#E4E1D8] pt-6 text-center">
              <p className="text-sm text-[#171B22]/50">
                Already have an account?
              </p>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-2 text-sm font-medium text-[#B8925A] hover:text-[#987744]"
              >
                Sign in
              </button>
            </div>
          </div>

          {/* Bottom note */}
          <p className="mt-6 text-center text-[11px] leading-5 text-[#171B22]/35">
            Your financial information is handled securely.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;