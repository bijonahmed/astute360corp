"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import useCategories from "../../../hooks/useCategories";
import getSupllierList from "../../../hooks/supplierList";
export default function AddProductForm({}) {
  const { token, permissions } = useAuth();
  const { categoryData } = useCategories();
  const router = useRouter();
  const pathname = usePathname();
  const { suppliderData } = getSupllierList();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [subcategoryList, setSubCategories] = useState([]);
  const [insubCateAll, setInSubCatAll] = useState([]);
  const [productdata, setProductData] = useState({});
  const [attributes, setAttributes] = useState([
    { attributeName: "", quantity: "", sellingPrice: "" },
  ]);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    meta_title: "",
    meta_description: "",
    meta_keyword: "",
    categoryId: "",
    subcategoryId: "",
    inSubcategoryId: "",
    supplierId: "",
    price: "",
    discount_price: "",
    stock_qty: "",
    supplier_name: "",
    status: 1,
    description_full: "",
    files: null,
    gallery: [],
  });
  // Fetch product data
  // Update document title
  useEffect(() => {
    document.title = `Product Add]`;
  }, []);
  // Handle main category change
  const selectedAllInSubCategory = async (selectedinsubcategory) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/insubcategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subcategory_id: selectedinsubcategory }),
        },
      );
      const data = await res.json();
      if (data) setInSubCatAll(data.inSubCatAll || []);
    } catch (err) {
      console.error("Fetch subcategories error:", err);
    }
  };
  // Handle main category change
  const handleMainCategoryChange = async (e) => {
    const selectedId = e.target.value;
    setFormData({ ...formData, categoryId: selectedId, subcategoryId: "" });
    if (!selectedId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/checkSubcategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ category_id: selectedId }),
        },
      );
      const data = await res.json();
      if (data) setSubCategories(data.data || []);
    } catch (err) {
      console.error("Fetch subcategories error:", err);
    }
  };
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      if (name === "files") {
        const file = files[0];
        const img = new Image();
        img.src = URL.createObjectURL(file);
        // img.onload = () => {
        //   if (img.width !== 1000 || img.height !== 1000) {
        //     alert("Thumbnail image must be exactly 1000px by 1000px!");
        //     e.target.value = "";
        //     return;
        //   }
        //   setFormData((prev) => ({ ...prev, files: file }));
        // };
      } else if (name === "gallery") {
        const validFiles = [];
        let allValid = true;
        Array.from(files).forEach((file) => {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          img.onload = () => {
            if (img.width !== 600 || img.height !== 600) {
              // allValid = false;
              // alert(`Gallery image "${file.name}" must be 600x600px`);
            } else {
              validFiles.push(file);
            }
            if (validFiles.length === files.length && allValid) {
              setFormData((prev) => ({
                ...prev,
                gallery: [...prev.gallery, ...validFiles],
              }));
            }
          };
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "gallery") {
        Array.from(value).forEach((file) => payload.append("gallery[]", file));
      } else if (value !== null) {
        payload.append(key, value);
      }
    });
    payload.append("id", "");
    payload.append("attributes", JSON.stringify(attributes));
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product/create`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: payload,
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Product updated successfully ✅");
        router.push("/product");
      } else if (data.errors) {
        setErrors(data.errors);
        toast.error(Object.values(data.errors).flat().join("\n"), {
          style: { whiteSpace: "pre-line" },
        });
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };
  // if (!permissions.includes("create product")) {
  //   router.replace("/dashboard");
  //   return null;
  // }
  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col-sm-8">
            <h3 className="mb-0">Product &nbsp;</h3>
          </div>
          <div className="col-sm-3">
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
                  className="text-blue-600 hover:underline"
                >
                  ← Back
                </a>
              </li>
            </ol>
          </div>
        </div>
        <div className="card card-primary card-outline mb-4">
          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="row g-3">
                {/* Left column */}
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleChange}
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Meta Title</label>
                    <input
                      type="text"
                      name="meta_title"
                      value={formData.meta_title || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Meta Keyword</label>
                    <input
                      type="text"
                      name="meta_keyword"
                      value={formData.meta_keyword || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Meta Description</label>
                    <textarea
                      name="meta_description"
                      rows={3}
                      value={formData.meta_description || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
                {/* Right column */}
                <div className="col-md-6">
                  <div className="mb-2">
                    <label className="form-label">
                      <b>Category</b>
                    </label>
                    <select
                      className="form-select"
                      value={formData.categoryId || ""}
                      onChange={handleMainCategoryChange}
                    >
                      <option value="">-- Select Category --</option>
                      {categoryData.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">
                      <b>Subcategory</b>
                    </label>
                    <select
                      className="form-select"
                      value={formData.subcategoryId || ""}
                      onChange={(e) => {
                        const selectedSubId = e.target.value;
                        // Update formData
                        setFormData({
                          ...formData,
                          subcategoryId: selectedSubId,
                        });
                        // Call your function to load all inSubcategories
                        selectedAllInSubCategory(selectedSubId);
                      }}
                    >
                      <option value="">-- Select Subcategory --</option>
                      {subcategoryList.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">
                      <b>In Subcategory</b>
                    </label>
                    <select
                      className="form-select"
                      value={formData.inSubcategoryId || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          inSubcategoryId: e.target.value,
                        })
                      }
                    >
                      <option value="">-- Select Subcategory --</option>
                      {insubCateAll.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status ?? 1}
                      onChange={handleChange}
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </select>
                  </div>
                  <div className="mb-2 mt-2">
                    <label className="form-label">
                      Thumbnail Image 
                      
                    </label>
                    <input
                      type="file"
                      name="files"
                      accept="image/*"
                      onChange={handleChange}
                      className="form-control"
                    />
                    {formData.files &&
                      (typeof formData.files === "string" ||
                      formData.files instanceof File ? (
                        <img
                          src={
                            typeof formData.files === "string"
                              ? formData.files
                              : URL.createObjectURL(formData.files)
                          }
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          style={{ maxHeight: "150px" }}
                        />
                      ) : null)}
                  </div>
                  <div className="mb-3 mt-4 d-none">
                    Gallery Images <span className="text-danger">*</span>{" "}
                    (1000px x 1000px)
                    <input
                      type="file"
                      name="gallery"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const filesArray = Array.from(e.target.files);
                        const validFiles = [];
                        let allValid = true;
                        filesArray.forEach((file, idx) => {
                          const img = new Image();
                          img.src = URL.createObjectURL(file);
                          img.onload = () => {
                            validFiles.push(file);
                            if (img.width !== 1000 || img.height !== 1000) {
                              alert(
                                `"${file.name}" must be exactly 1000px x 1000px!`,
                              );
                              allValid = false;
                            } else {
                              validFiles.push(file);
                            }
                            if (idx === filesArray.length - 1) {
                              if (allValid) {
                                setFormData((prev) => ({
                                  ...prev,
                                  gallery: [...prev.gallery, ...validFiles],
                                }));
                              } else {
                                e.target.value = "";
                              }
                            }
                          };
                        });
                      }}
                      className="form-control"
                    />
                    <div className="d-flex flex-wrap gap-2 mt-2">
                      {formData.gallery.map((file, index) => (
                        <div
                          key={index}
                          className="position-relative me-2 mb-2"
                        >
                          <img
                            src={
                              file.gallery_image_url // existing DB image
                                ? file.gallery_image_url
                                : URL.createObjectURL(file) // newly uploaded file
                            }
                            alt={`preview-${index}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            className="border rounded"
                          />
                          {/* Remove Button */}
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute"
                            style={{
                              top: "-5px",
                              right: "-5px",
                              borderRadius: "50%",
                              padding: "0 6px",
                              lineHeight: "1",
                            }}
                            onClick={async () => {
                              const isFromDatabase = file.id !== undefined;
                              if (isFromDatabase) {
                                if (
                                  confirm(
                                    "Are you sure you want to delete this image from server?",
                                  )
                                ) {
                                  try {
                                    const response = await fetch(
                                      `${process.env.NEXT_PUBLIC_API_BASE}/product/gallery-delete`,
                                      {
                                        method: "POST",
                                        headers: {
                                          "Content-Type": "application/json",
                                          Authorization: `Bearer ${token}`,
                                        },
                                        body: JSON.stringify({
                                          image_id: file.id, // send ID to delete
                                          product_id: file.product_id,
                                        }),
                                      },
                                    );
                                    const resData = await response.json();
                                    if (resData.status) {
                                      alert("Image deleted successfully!");
                                      setFormData((prev) => ({
                                        ...prev,
                                        gallery: prev.gallery.filter(
                                          (_, i) => i !== index,
                                        ),
                                      }));
                                    } else {
                                      alert("Failed to delete image!");
                                    }
                                  } catch (err) {
                                    console.error("Delete failed:", err);
                                  }
                                }
                              } else {
                                // Remove locally for newly uploaded files
                                setFormData((prev) => ({
                                  ...prev,
                                  gallery: prev.gallery.filter(
                                    (_, i) => i !== index,
                                  ),
                                }));
                              }
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Thumbnail & Gallery */}
                  {/* ... Same logic as your previous code */}
                </div>
                {/* CKEditor for description */}
                <div className="mb-2">
                  <label className="form-label">Full Description</label>
                  <CKEditor
                    editor={ClassicEditor}
                    data={formData.description_full || ""}
                    onChange={(event, editor) =>
                      setFormData((prev) => ({
                        ...prev,
                        description_full: editor.getData(),
                      }))
                    }
                  />
                </div>
                {/* Product attributes */}
                {/* ... Same as your previous code */}
              </div>
              <div className="mb-2 mt-4">
                <button type="submit" className="btn btn-primary w-100">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
