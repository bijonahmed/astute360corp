"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Image from "next/image";

export default function EditUserForm({ id }) {
  const { token, permissions } = useAuth();
  const [formData, setFormData] = useState({
    id: id,
    name: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
    categoryId: "",
    description_full: "",
    files: null,
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [postCategory, setPostCategorys] = useState([]);
  const router = useRouter();
  const pathname = usePathname();
  const title = "Post Edit";

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();

    payload.append("id", formData.id);
    payload.append("name", formData.name);
    payload.append("meta_title", formData.meta_title);
    payload.append("meta_description", formData.meta_description);
    payload.append("meta_keyword", formData.meta_keyword);
    payload.append("categoryId", formData.categoryId);
    payload.append("description_full", formData.description_full);
    payload.append("status", formData.status);

    if (formData.files instanceof File) {
      payload.append("files", formData.files);
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/posts/update`,
        {
          method: "POST",
          body: payload,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Post update successfully ✅");
        router.push("/post");
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
        setErrors(data.errors);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  // Fetch post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/posts/postrow/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const datarow = data?.data || {};

        setFormData({
          id: datarow.id ?? "",
          name: datarow.name ?? "",
          meta_title: datarow.meta_title ?? "",
          meta_description: datarow.meta_description ?? "",
          meta_keyword: datarow.meta_keyword ?? "",
          categoryId: datarow.categoryId ?? "",
          description_full: datarow.description_full ?? "",
          status: datarow.status ?? "",
          files: data?.images ?? "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, token]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/posts/postCategorysearch`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (res.ok) setPostCategorys(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, [id, token]);

  if (loading) return <p>Loading...</p>;

  if (!permissions.includes("edit posts")) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />

      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">{title}</h3>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item">
                  <Link href="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      router.back();
                    }}
                  >
                    ← Back
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="app-content">
        <div className="container-fluid">
          <div className="row g-4">
            <div className="col-md-12">
              <div className="card card-primary card-outline mb-4">
                <form onSubmit={handleSubmit}>
                  <div className="card-body">
                    {/* NAME */}
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
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name[0]}</div>
                      )}
                    </div>

                    {/* META FIELDS */}
                    <div className="mb-3">
                      <label className="form-label">Meta Title</label>
                      <input
                        type="text"
                        name="meta_title"
                        className="form-control"
                        value={formData.meta_title}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Keyword</label>
                      <input
                        type="text"
                        name="meta_keyword"
                        className="form-control"
                        value={formData.meta_keyword}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Description</label>
                      <textarea
                        name="meta_description"
                        className="form-control"
                        rows={5}
                        value={formData.meta_description}
                        onChange={handleChange}
                      />
                    </div>

                    {/* CATEGORY */}
                    <div className="mb-3">
                      <label className="form-label">Post Category</label>
                      <select
                        name="categoryId"
                        className={`form-control ${
                          errors.categoryId ? "is-invalid" : ""
                        }`}
                        value={formData.categoryId}
                        onChange={handleChange}
                      >
                        <option value="">-- Select --</option>
                        {postCategory.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mb-3">
                      <label className="form-label">Full Description</label>
                      <CKEditor
                        editor={ClassicEditor}
                        key={formData.id}
                        data={formData.description_full}
                        onChange={(event, editor) => {
                          const data = editor.getData();
                          setFormData((prev) => ({
                            ...prev,
                            description_full: data,
                          }));
                        }}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select
                        name="status"
                        className="form-control"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                    {/* UPLOAD */}
                    <div className="mb-3">
                      <label className="form-label">Upload Image</label>
                      <input
                        type="file"
                        name="files"
                        accept="image/*"
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>

                    {/* PREVIEW IMAGE – now using NEXT/IMAGE */}
                    {formData.files && (
                      <div className="mb-3">
                        <Image
                          src={
                            typeof formData.files === "string"
                              ? formData.files
                              : URL.createObjectURL(formData.files)
                          }
                          alt="Preview Image"
                          width={150}
                          height={150}
                          className="img-thumbnail"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>

                  <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
