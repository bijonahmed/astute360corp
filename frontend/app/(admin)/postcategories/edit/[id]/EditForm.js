// EditUserForm.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext"; // adjust path
import { usePathname } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function EditUserForm({ id }) {
  console.log("EditUserForm id:", id);
  const { token, permissions } = useAuth(); // client-side token
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const [formData, setFormData] = useState({
    id: id || "",
    name: user?.name || "",
    status: user?.status || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/posts-category/update`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ pass token
          },
          body: JSON.stringify({ ...formData }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setUser(data);
        toast.success("Post category updated successfully ✅"); // ✅ success toast
        router.push("/postcategories");
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join(" ")); // show backend validation errors
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/posts-category/postrow/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const user = data?.data || {};
        setFormData({
          id: user.id, // ✅ now id will be included
          name: user.name ?? "",
          status: user.status ?? "",
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id,token]);

  const pathname = usePathname();
  const title = "Post Category Edit";
  //const title = pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  if (!permissions.includes("edit posts category")) {
    router.replace("/dashboard");
    return false;
  }

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      {/*begin::App Content Header*/}
      <div className="app-content-header">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">{title}</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    ← Back
                  </a>
                </li>
              </ol>
            </div>
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>

      {/*begin::App Content*/}
      <div className="app-content">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="row g-4">
            {/*begin::Col*/}
            <div className="col-md-12">
              {/*begin::Quick Example*/}
              <div className="card card-primary card-outline mb-4">
                {/*begin::Form*/}
                <Toaster position="top-right" />
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name?.length > 0 && (
                        <div className="invalid-feedback">{errors.name[0]}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className={`form-control ${
                          errors.status ? "is-invalid" : ""
                        }`}
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="">-- Select Status --</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>

                      {errors.status && errors.status.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.status[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>

                {/*end::Form*/}
              </div>
              {/*end::Quick Example*/}
            </div>
            {/*end::Col*/}
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>
      {/*end::App Content*/}
    </main>
  );
}
