"use client"; // required for client components
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext"; // Adjust the path as necessary
import { useEffect, useState } from "react";

export default function LoginPage() {
  const router = useRouter(); // ✅ Next.js Router
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Correct role check
        if (data.user && data.user.role_type == 4) {
          setSuccess("Login successful!");
          login(data.token, data.user.name);
          window.location.href = "/customer-dashboard";
          //router.replace("/customer-dashboard");
        } else {
          setError("Invalid login — not allowed.");
        }
      } else {
        setError(data.message || "Invalid login credentials.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <div className="ps-page--my-account">
      <div className="ps-breadcrumb">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>My account</li>
          </ul>
        </div>
      </div>
      <div className="ps-my-account">
        <div className="container">
          <form
            className="ps-form--account ps-tab-root"
            onSubmit={handleSubmit}
          >
            <ul className="ps-tab-list">
              <li className="active">
                <a href="#sign-in">Login</a>
              </li>
            </ul>

            <div className="ps-tabs">
              <div className="ps-tab active" id="sign-in">
                <div className="ps-form__content">
                  <h5>Log In Your Account</h5>

                  {/* Email */}
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="email"
                      placeholder="Username or email address"
                      value={email}
                      onChange={(e) => setemail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="form-group form-forgot">
                    <input
                      className="form-control"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <a href="#">Forgot?</a>
                  </div>

                  {/* Submit */}
                  <div className="form-group submtit">
                    <button
                      type="submit"
                      className="ps-btn ps-btn--fullwidth"
                      disabled={loading}
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                  </div>
                  <br />
                  <div className="mt-3 text-center">
                    Already have an account?{" "}
                    <Link href="/register" className="text-primary">
                      Register
                    </Link>
                  </div>
                  <br />
                  {/* Status Messages */}
                  <center>
                    {error && <p className="text-danger mt-3">{error}</p>}
                    {success && <p className="text-success mt-3">{success}</p>}
                  </center>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
