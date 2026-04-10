"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import CategoryTree from "./CategoryTree";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import useCategories from "../../hooks/useCategories";
import { createServerSearchParamsForServerPage } from "next/dist/server/request/search-params";

export default function UserPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Product Categories List";

  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [statusFilter, setStatusFilter] = useState("");
  const [data, setData] = useState([]);
  const [responseInSubCategory, setInsubCateogry] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  const { categoryData } = useCategories();
  const [subcategoryId, setSubCategoryFilter] = useState("");
  const [insubCategoryid, setId] = useState("");
  const [subcategoryList, setSubCategories] = useState([]);
  const [selectedCategory, setMainCategory] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [statusFilters, setStatusFilters] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  // Sample static subcategory data

  const [filterMainCategory, setFilterMainCategory] = useState("");
  const [filterParentSub, setFilterParentSub] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch subcategories when main category changes
  const handleMainCategoryChange = (e) => {
    const selectedId = e.target.value;
    setMainCategory(selectedId);
    setSubCategoryFilter("");
    setSubCategories([]);
    fetchSubcategories(selectedId);
  };

  const fetchSubcategories = async (categoryId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/checkSubcategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ category_id: categoryId }),
        },
      );

      const data = await res.json();
      if (data?.data) setSubCategories(data.data);
    } catch (err) {
      console.error("Subcategory fetch error:", err);
    }
  };

  const fetchProCategory = async () => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/product-category/index`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || `HTTP ${res.status}`);
      setData(result.data || []);
      setInsubCateogry(result.insubCateogry || []);
    } catch (err) {
      console.error("Fetch users failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  const getFetchProInSubCategory = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        selectedCategory,
        subcategoryId,
        filterStatus,
      });

      const url = `${process.env.NEXT_PUBLIC_API_BASE}/product-category/getinSubCategory?${params.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || `HTTP ${res.status}`);

      setInsubCateogry(result.insubCateogry || []);
    } catch (err) {
      console.error("Fetch failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProCategory();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      // Check dimensions
      if (
        (img.width === 300 && img.height === 300) ||
        (img.width === 1000 && img.height === 1000)
      ) {
        setImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImageFile(null);
        setImagePreview(null);
        toast.error("Image must be 300x300px or 1000x1000px");
      }

      URL.revokeObjectURL(objectUrl); // free memory
    };

    img.src = objectUrl;
  };

  const handleAddSubcategory = async () => {
    if (!insubCategoryid) {
      // Insert: require everything
      if (!subcategoryName || !selectedCategory) {
        toast.error(
          "Please enter subcategory name, select main category, and choose an image",
        );
        return;
      }
    } else {
      if (!subcategoryName || !selectedCategory) {
        toast.error("Please enter subcategory name and select main category");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.append("id", insubCategoryid ?? "");
      formData.append("name", subcategoryName);
      formData.append("category_id", selectedCategory);
      formData.append("status", statusFilters);
      if (subcategoryId) formData.append("subcategoryId", subcategoryId); // optional parent
      if (imageFile) formData.append("insubCategoryImage", imageFile);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/add-insubcategory`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add subcategory");
      }
      toast.success(`Subcategory added: ${result.category}`);
      setSubcategoryName("");
      setImageFile(null);
      setImagePreview(null);
      setImageFile(null);
      // setMainCategory("");
      setSubCategoryFilter("");
      setId("");

      fetchSubcategories(selectedCategory);
      getFetchProInSubCategory();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      // console.error(err);
      toast.error(err.message || "Something went wrong!");
    }
  };
  const handleEditClick = (item) => {
    setMainCategory(item.pid);
    fetchSubcategories(item.pid);
    setSubCategoryFilter(item.parent_child_id);
    setSubcategoryName(item.name);
    setId(item.id);
    setImagePreview(item.insubCategoryImage);
    setStatusFilters(item.status);
  };

  if (!perms.includes("view product category")) {
    router.replace("/dashboard");
    return null;
  }

  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />

      {/* App Header */}
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
                <li className="breadcrumb-item active">{title}</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* App Content */}
      <div className="app-content">
        <div className="container-fluid">
          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "general" ? "active" : ""}`}
                onClick={() => setActiveTab("general")}
              >
                General
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "subcategory" ? "active" : ""}`}
                onClick={() => {
                  setActiveTab("subcategory");
                  getFetchProInSubCategory();
                }}
              >
                In Subcategory
              </button>
            </li>
          </ul>

          <div>
            {/* General Tab */}
            {activeTab === "general" && (
              <div className="card card-primary card-outline mb-4">
                <div className="card-header">
                  <div className="card-title w-100">
                    <div className="row g-2 align-items-center">
                      <div className="col-6 col-md-3 col-lg-2">
                        <button
                          className="btn btn-outline-secondary w-100"
                          onClick={fetchProCategory}
                        >
                          Fetch
                        </button>
                      </div>
                      <div className="col-6 col-md-3 col-lg-1 ms-auto">
                        {perms.includes("create product category") && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-primary flex-fill"
                              onClick={() =>
                                router.push(`/product-categories-manage/add`)
                              }
                            >
                              Add
                            </button>

                            <button
                              className="btn btn-danger flex-fill"
                              onClick={() =>
                                router.push(
                                  `/product-categories-manage/restore`,
                                )
                              }
                            >
                              Restore
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-body p-0">
                  {loading ? (
                    <div className="text-center py-5">
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <CategoryTree
                      categories={data}
                      reloadCategories={fetchProCategory}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Subcategory Tab */}
            {activeTab === "subcategory" && (
              <div className="row g-4">
                {/* Left Form */}
                <div className="col-md-4">
                  <div className="card card-outline card-primary">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Add In Subcategory</h5>
                    </div>
                    <div className="card-body">
                      {/* Main Category */}
                      <div className="mb-3">
                        <label className="form-label">Main Category</label>
                        <select
                          className="form-select"
                          value={selectedCategory}
                          onChange={handleMainCategoryChange}
                        >
                          <option value="">-- Select Main Category --</option>
                          {categoryData.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Parent Subcategory */}
                      <div className="mb-3">
                        <label className="form-label">Parent Subcategory</label>
                        <select
                          className="form-select"
                          value={subcategoryId}
                          onChange={(e) => setSubCategoryFilter(e.target.value)}
                        >
                          <option value="">-- Select Subcategory --</option>
                          {subcategoryList.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Subcategory Name */}
                      <div className="mb-3">
                        <label className="form-label">
                          In Subcategory Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={subcategoryName}
                          onChange={(e) => setSubcategoryName(e.target.value)}
                          placeholder="Enter in subcategory name"
                        />
                      </div>

                      {statusFilters !== null &&
                        statusFilters !== undefined && (
                          <>
                            <div className="mb-3">
                              <label className="form-label">Status</label>
                              <select
                                className="form-control"
                                value={statusFilters}
                                onChange={(e) =>
                                  setStatusFilters(e.target.value)
                                }
                              >
                                <option value="">-- Status --</option>
                                <option value="1">Active</option>
                                <option value="0">Inactive</option>
                              </select>
                            </div>
                          </>
                        )}

                      {/* Image Upload */}
                      <div className="mb-3">
                        <label className="form-label">
                          Upload Image (300x300px or 1000x1000px)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          onChange={handleImageChange}
                          ref={fileInputRef}
                        />
                      </div>

                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mb-3 text-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: "100%", maxHeight: "150px" }}
                            className="img-thumbnail"
                          />
                        </div>
                      )}

                      <button
                        className="btn btn-primary w-100"
                        onClick={handleAddSubcategory}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Table */}
                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-4">
                      <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                      >
                        <option value="">All Status</option>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <button
                        className="btn btn-outline-secondary w-100"
                        onClick={getFetchProInSubCategory}
                      >
                        Fetch
                      </button>
                    </div>
                  </div>

                  <div className="card card-outline card-secondary mt-3">
                    <div className="card-header">
                      <h5 className="card-title mb-0">In Subcategory List</h5>
                    </div>
                    {loading ? (
                      <div className="text-center py-5">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="card-body p-0"
                        style={{
                          maxHeight: "550px", // 👈 change height as needed
                          overflowY: "auto",
                        }}
                      >
                        <table className="table table-striped mb-0">
                          <thead
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 1,
                              background: "#fff",
                            }}
                          >
                            <tr>
                              <th>ID</th>
                              <th>Category</th>
                              <th>SubCategory</th>
                              <th>InSubCategory</th>
                              <th className="d-none">Image</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {responseInSubCategory.map((item) => (
                              <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.parentName}</td>
                                <td>{item.childName}</td>
                                <td>{item.name}</td>
                                <td className="text-center d-none">
                                  <img
                                    src={item.insubCategoryImage}
                                    width="50"
                                    height="50"
                                    className="img-fluid rounded object-fit-cover"
                                  />
                                </td>
                                <td>
                                  <span
                                    className={`badge ${
                                      item.status == 1
                                        ? "bg-primary"
                                        : "bg-danger"
                                    }`}
                                  >
                                    {item.status == 1 ? "Active" : "Inactive"}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() => handleEditClick(item)}
                                  >
                                    Edit
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
