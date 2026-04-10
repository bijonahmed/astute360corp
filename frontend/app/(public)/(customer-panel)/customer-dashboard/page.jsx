"use client"; // required for client components
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Sidebar from "../customer-dashboard/sidebar";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function customerDhasboardPage() {
  const router = useRouter(); //
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [userdata, setUserdata] = useState(null);
  const { token, permissions } = useAuth();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const base = "Customer Dashboard";
    if (userdata && userdata.name) {
      document.title = `${base} — ${userdata.name}`;
    } else {
      document.title = base;
    }
  }, [userdata]);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUserdata(data.user);
        } else {
          console.error("Auth error:", data.message);
        }
      } catch (err) {
        console.error("API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/updateCustomerProfile`,
        {
          method: "PUT", // or PATCH depending on your API
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userdata),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated successfully!");
        //  setUserdata(data); // update local state
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      toast.error("API error: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "", // frontend confirm
    newPassword_confirmation: "", // required for Laravel
  });

  const handleSubmitChatPassword = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    setUpdating(true);

    try {
      // 🔹 Make API call to update password
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/customerChangePassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            newPassword_confirmation: formData.confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully!");
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(data.message || "Failed to update password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <main className="ps-page--my-account">
      <div className="ps-breadcrumb">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>User Information</li>
          </ul>
        </div>
      </div>
      <section className="ps-section--account">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="ps-section__left">
                <Sidebar />
              </div>
            </div>
            <div className="col-lg-8">
              <div className="ps-section__right">
                <form
                  className="ps-form--account-setting"
                  onSubmit={handleSubmit}
                >
                  <Toaster position="top-right" />
                  <div className="ps-form__header">
                    <h3>User Information</h3>
                  </div>
                  <div className="ps-form__content">
                    <div className="form-group">
                      <label>Name</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Please enter your name..."
                        value={userdata?.name || ""}
                        onChange={(e) =>
                          setUserdata({ ...userdata, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Phone Number</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Please enter phone number..."
                            value={userdata?.phone_number || ""}
                            onChange={(e) =>
                              setUserdata({
                                ...userdata,
                                phone_number: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Please enter your email..."
                            value={userdata?.email || ""}
                            onChange={(e) =>
                              setUserdata({
                                ...userdata,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group submit">
                    <button
                      className="ps-btn"
                      type="submit"
                      disabled={updating}
                    >
                      {updating ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>

                <hr />

                <form
                  className="ps-form--account-setting"
                  onSubmit={handleSubmitChatPassword}
                >
                  <Toaster position="top-right" />
                  <div className="ps-form__header">
                    <h3>Change Password</h3>
                  </div>

                  <div className="ps-form__content">
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Enter current password"
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            currentPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Enter new password"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input
                        className="form-control"
                        type="password"
                        placeholder="Confirm new password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                            newPassword_confirmation: e.target.value, // <-- important
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group submit">
                    <button
                      className="ps-btn"
                      type="submit"
                      disabled={updating}
                    >
                      {updating ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
