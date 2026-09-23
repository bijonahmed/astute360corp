"use client";
import { useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter(); // ✅ Next.js Router
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone_number: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Password match check
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Passwords do not match",
        text: "Please confirm your password correctly.",
      });
      return;
    }

    try {
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we register your account.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password,
            password_confirmation: formData.confirmPassword, // Laravel expects this
          }),
        }
      );

      let data = {};
      try {
        data = await response.json();
      } catch {
        data = { message: "Invalid JSON response from server" };
      }

      if (response.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: data.message || "Your account has been created successfully.",
          timer: 2000,
          showConfirmButton: false,
        });

        setFormData({
          name: "",
          email: "",
          password: "",
          phone_number: "",
          confirmPassword: "",
        });
         router.replace("/my-account");

        return;
      }
      if (response.status === 422 && data.errors) {
        const errorMessages = Object.values(data.errors).flat().join("\n");

        Swal.fire({
          icon: "error",
          title: "Validation Error",
          html: `<div style="font-size:16px; line-height:1.6; text-align:left;">
          ${Object.values(data.errors).flat().join("<br>")}
        </div>`,
          customClass: {
            title: "swal-title-lg", // optional (if you want a bigger title too)
          },
        });
        return;
      }
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: data.message || "Something went wrong. Please try again.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to register. Please check your network connection.",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <form
                className="ps-form--account ps-tab-root"
                onSubmit={handleSubmit}
              >
                <ul className="ps-tab-list mb-4">
                  <li className="active">
                    <a href="#register" className="fw-bold">
                      Register
                    </a>
                  </li>
                </ul>

                <div className="ps-tabs">
                  <div className="ps-tab active" id="register">
                    <div className="ps-form__content">
                      <h5 className="text-center mb-4">Create Your Account</h5>

                      <div className="form-group mb-3">
                        <input
                          className="form-control"
                          type="text"
                          id="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <input
                          className="form-control"
                          type="text"
                          id="phone_number"
                          placeholder="Phone"
                          value={formData.phone_number}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <input
                          className="form-control"
                          type="email"
                          id="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group mb-3">
                        <input
                          className="form-control"
                          type="password"
                          id="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group mb-4">
                        <input
                          className="form-control"
                          type="password"
                          id="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="form-group submtit">
                        <button
                          type="submit"
                          className="ps-btn ps-btn--fullwidth btn-success w-100"
                        >
                          Register
                        </button>
                      </div>

                      <div className="mt-3 text-center">
                        Already have an account?{" "}
                        <Link href="/my-account" className="text-primary">
                          Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
