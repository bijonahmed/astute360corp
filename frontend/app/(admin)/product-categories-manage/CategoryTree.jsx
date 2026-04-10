"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const CategoryTable = ({ categories, onAdd, reloadCategories }) => {
  const [tree, setTree] = useState([]);
  const [openRows, setOpenRows] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedParent, setSelectedParent] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategorySorting, setNewCategorySorting] = useState(0);
  const [status, setStatus] = useState("");
  //For edit
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  //For images insert
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [subcategoryBannerFile, setSubcategoryBannerFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subPreview, setSubPreview] = useState(null);
  const [error, setError] = useState("");
  const [bannerPreview, setBannerPreview] = useState(null);

  const [activeTab, setActiveTab] = useState("image");
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState("");
  const [selectedChildCategoryId, setSelectedChildCategoryId] = useState("");
  const mainCategories = categories?.filter((c) => c.parent_id === 0) || [];

  //End
  const { token, permissions } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState({});

  //For add thumbanil images
  const handleThumbnailAdd = (category) => {
    setSelectedCategory(category);
    setThumbnailFile(null);

    const modalEl = document.getElementById("thumbnailModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  const handleThumbnailAddSubcategory = (category) => {
    setSelectedCategory(category);
    setSubPreview(null);
    setSelectedMainCategoryId(category.parent_id || "");

    setSelectedChildCategoryId(category.id || "");

    const modalEl = document.getElementById("thumbnailsubcategoryModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  //For add banner images
  const handleBannerAdd = (category) => {
    setSelectedCategory(category);
    setThumbnailFile(null);
    setBannerFile(null);
    setNewCategorySorting(category.sorting || "");
    setBannerPreview(category.category_image_inside_page || null);

    const modalEl = document.getElementById("bannerModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  const handleThumbnailUpload = () => {
    if (!thumbnailFile) {
      alert("Please select an image first!");
      return;
    }
    const img = new Image();
    img.src = URL.createObjectURL(thumbnailFile);

    img.onload = () => {
      if (img.width !== 300 || img.height !== 300) {
        alert("Image must be exactly 300x300 pixels!");
        return;
      }
      // Proceed with upload
      const formData = new FormData();
      formData.append("thumbnail_image", thumbnailFile);
      formData.append("id", selectedCategory.id);

      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/uploadCategoryImage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
        .then((res) => res.json())
        .then((data) => {
          reloadCategories && reloadCategories();
          toast.success("updated successfully ✅");
          const modalEl = document.getElementById("thumbnailModal");
          const modal = bootstrap.Modal.getInstance(modalEl);
          modal.hide();
        })
        .catch((err) => console.error("❌ Upload failed:", err));
    };

    img.onerror = () => {
      alert("Invalid image file!");
    };
  };

  const handleBannerUploadSubCategory = () => {
    console.log("selectedChildCategoryId" + selectedChildCategoryId);
    //  return false;

    if (!subcategoryBannerFile) {
      alert("Please select an valid image first! or dimensions 672x1536");
      return;
    }

    const imgbaner = new Image();
    imgbaner.src = URL.createObjectURL(subcategoryBannerFile);

    imgbaner.onload = () => {
      // if (imgbaner.width !== 672 || imgbaner.height !== 1536) {
      //   alert("Image must be exactly H-1536 × W-672 pixels!");
      //   return;
      // }
      //console.log("subcategory banner upload:" + subcategoryBannerFile);
      //console.log("selectedCategory:" + selectedCategory.id);
      // Proceed with upload
      const formData = new FormData();
      formData.append("banner_sub_cat_image", subcategoryBannerFile);
      formData.append("id", selectedChildCategoryId);

      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/uploadBannerImageSubCategory`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
        .then((res) => res.json())
        .then((data) => {
          reloadCategories && reloadCategories();
          toast.success("Updated successfully ✅");

          // Safely close Bootstrap modal
          if (typeof window !== "undefined" && window.bootstrap) {
            const modalEl_th = document.getElementById("thumbnailModal");
            if (modalEl_th) {
              const modal = bootstrap.Modal.getOrCreateInstance(modalEl_th);
              modal.hide();
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) backdrop.remove();
              document.body.classList.remove("modal-open");
              document.body.style.removeProperty("overflow");
              document.body.style.removeProperty("padding-right");
            }
          }
        })
        .catch((err) => console.error("❌ Upload failed:", err));
    };

    imgbaner.onerror = () => {
      alert("Invalid image file!");
    };
  };

  const handleBannerUpload = () => {
    if (!bannerFile) {
      alert("Please select an image first!");
      return;
    }

    const imgbaner = new Image();
    imgbaner.src = URL.createObjectURL(bannerFile);

    imgbaner.onload = () => {
      if (imgbaner.width !== 672 || imgbaner.height !== 1536) {
        alert("Image must be exactly H-1536 × W-672 pixels!");
        return;
      }

      // Proceed with upload
      const formData = new FormData();
      formData.append("banner_image", bannerFile);
      formData.append("id", selectedCategory.id);

      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/uploadBannerImage`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
        .then((res) => res.json())
        .then((data) => {
          reloadCategories && reloadCategories();
          toast.success("Updated successfully ✅");

          // Safely close Bootstrap modal
          if (typeof window !== "undefined" && window.bootstrap) {
            const modalEl_th = document.getElementById("thumbnailModal");
            if (modalEl_th) {
              const modal = bootstrap.Modal.getOrCreateInstance(modalEl_th);
              modal.hide();
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) backdrop.remove();
              document.body.classList.remove("modal-open");
              document.body.style.removeProperty("overflow");
              document.body.style.removeProperty("padding-right");
            }
          }
        })
        .catch((err) => console.error("❌ Upload failed:", err));
    };

    imgbaner.onerror = () => {
      alert("Invalid image file!");
    };
  };

  //end

  const handleBannerUploadInsideCategory = () => {
    if (!bannerFile) {
      alert("Please select an image first!");
      return;
    }

    const imgbaner = new Image();
    imgbaner.src = URL.createObjectURL(bannerFile);

    imgbaner.onload = () => {
      if (imgbaner.width !== 1622 || imgbaner.height !== 450) {
        alert("Image must be exactly H-450 × W-1622 pixels!");
        return;
      }
      //1622x450
      // Proceed with upload
      const formData = new FormData();
      formData.append("category_image_inside_page", bannerFile);
      formData.append("id", selectedCategory.id);
      fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/uploadBannerImageCategoryInside`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )
        .then((res) => res.json())
        .then((data) => {
          reloadCategories && reloadCategories();
          toast.success("Updated successfully ✅");

          // Safely close Bootstrap modal
          if (typeof window !== "undefined" && window.bootstrap) {
            const modalEl_th = document.getElementById("thumbnailModal");
            if (modalEl_th) {
              const modal = bootstrap.Modal.getOrCreateInstance(modalEl_th);
              modal.hide();
              const backdrop = document.querySelector(".modal-backdrop");
              if (backdrop) backdrop.remove();
              document.body.classList.remove("modal-open");
              document.body.style.removeProperty("overflow");
              document.body.style.removeProperty("padding-right");
            }
          }
        })
        .catch((err) => console.error("❌ Upload failed:", err));
    };

    imgbaner.onerror = () => {
      alert("Invalid image file!");
    };
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditedName(category.name ?? "");
    setEditedStatus(category.status ?? "");
    setNewCategorySorting(category.sorting ?? 0);
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || editedName.trim() === "") return;

    if (newCategorySorting === "") {
      toast.error("Sorting number is required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/update/${editingCategory.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: editedName,
            status: editedStatus,
            sorting: newCategorySorting,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Category updated successfully");
        setEditModalOpen(false);
        reloadCategories && reloadCategories(); // refresh list
      } else {
        toast.error(data.message || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network or server error!");
    }
  };

  const buildCategoryTree = (categories) => {
    const map = {};
    const tree = [];

    categories.forEach((cat) => {
      map[cat.id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parent_id === 0) {
        tree.push(map[cat.id]);
      } else if (map[cat.parent_id]) {
        map[cat.parent_id].children.push(map[cat.id]);
      }
    });

    return tree;
  };

  useEffect(() => {
    if (categories?.length) {
      setTree(buildCategoryTree(categories));
    }
  }, [categories]);

  const countSubcategories = (category) => {
    if (!category.children || category.children.length === 0) return 0;
    return (
      category.children.length +
      category.children.reduce((acc, c) => acc + countSubcategories(c), 0)
    );
  };

  const toggleRow = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Open modal
  const handleOpenModal = (category) => {
    setSelectedParent(category);
    setStatus(category.status);
    //console.log("===" + category.status);
    setNewCategoryName("");
    setModalOpen(true);
  };

  // Submit new subcategory
  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "" || !selectedParent) return;
    onAdd && onAdd({ parentId: selectedParent.id, name: newCategoryName });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/create-subcategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // make sure token is defined
          },
          body: JSON.stringify({
            parent_id: selectedParent.id,
            name: newCategoryName,
            status: status,
          }),
        },
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Added successfully ✅");
        reloadCategories && reloadCategories();
        // router.push("/product-categories-manage"); // reload or redirect
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

    setModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError("");
    setSubPreview(null);
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const requiredWidth = 672;
      const requiredHeight = 1536;

      if (img.width !== requiredWidth || img.height !== requiredHeight) {
        setError(
          `Image size must be ${requiredWidth}px (W) × ${requiredHeight}px (H)`,
        );
        URL.revokeObjectURL(objectUrl);
        return;
      }
      setSubcategoryBannerFile(file);
      setSubPreview(objectUrl);
    };
    img.onerror = () => {
      setError("Invalid image file");
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  //////////////////////////////////////
  const showSubCategoryImages = (category) => {
    setSubcategoryBannerFile(null);
    //setSubPreview(null);
    setSelectedMainCategoryId(category.parent_id || "");
    setSelectedChildCategoryId(category.id || "");
    console.log("category ID: " + category.id);
    console.log("show images called" + category.banner_sub_cat_image);
    //  setSelectedCategory(category);
    setSubcategoryBannerFile(null);

    setSubPreview(category.banner_sub_cat_image);

    const modalEl = document.getElementById("thumbnailsubcategoryModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  const handleUpdateSubCategoryParent = async () => {
    if (!selectedMainCategoryId) {
      toast.error("Please select a main category");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/subcategoryUpdate/${selectedMainCategoryId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            parent_id: selectedMainCategoryId,
            id: selectedChildCategoryId,
          }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Category updated successfully ✅");
        reloadCategories && reloadCategories();

        // close modal safely
        const modalEl = document.getElementById("thumbnailsubcategoryModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal?.hide();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const renderRows = (category, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isOpen = !!openRows[category.id];
    const isMain = category.parent_id === 0;

    return (
      <React.Fragment key={category.id}>
        <tr>
          <td style={{ paddingLeft: `${level * 30}px` }}>
            {isMain && hasChildren && (
              <span
                style={{ cursor: "pointer", marginRight: "5px" }}
                onClick={() => toggleRow(category.id)}
              >
                {isOpen ? "−" : "+"}
              </span>
            )}
            {category.name}
          </td>
          <td className="d-flex justify-content-center align-items-center">
            {category.sorting}
          </td>
          <td className="text-center justify-center">{category.slug}</td>
          <td className="text-center">{isMain ? "Main" : "Sub"}</td>

          <td className="text-center">
            {hasChildren && (
              <span className="badge bg-primary">
                {countSubcategories(category)}
              </span>
            )}
          </td>
          <td className="text-center">
            <span
              className={`badge ${
                category.status === 1 ? "bg-primary" : "bg-danger"
              }`}
              style={{ padding: "0.5em 1em", fontSize: "0.9rem" }}
            >
              {category.status === 1 ? "Active" : "Inactive"}
            </span>
          </td>
          <td className="text-center">
            {isMain && (
              <button
                className="btn btn-sm btn-success me-1"
                onClick={() => handleOpenModal(category)}
                title="Add Subcategory"
              >
                ➕
              </button>
            )}
            <button
              className="btn btn-sm btn-primary me-2"
              onClick={() => handleEditClick(category)}
              title="Edit Category"
            >
              ✏️
            </button>

            {!isMain &&
              (category.banner_sub_cat_image ? (
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => showSubCategoryImages(category)}
                  title="Manage Thumbnail Image"
                >
                  🖼️ Show
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleThumbnailAddSubcategory(category)}
                  title="Manage Thumbnail Image"
                >
                  🖼️ Add Sub Cat. Picture
                </button>
              ))}

            {isMain &&
              (category.thumbnail_image ? (
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleThumbnailAdd(category)}
                  title="Manage Thumbnail Image"
                >
                  🖼️ Show Thumbnail
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleThumbnailAdd(category)}
                  title="Manage Thumbnail Image"
                >
                  🖼️ Add Images
                </button>
              ))}

            {/* Banner button */}
            {isMain &&
              (category.banner_image ? (
                <>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleBannerAdd(category)}
                    title="Manage Banner Image"
                  >
                    🏞️ Show Banner
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleBannerAdd(category)}
                    title="Manage Banner Image"
                  >
                    🏞️ Add Banner
                  </button>
                </>
              ))}
          </td>
        </tr>

        {hasChildren &&
          isOpen &&
          category.children.map((child) => renderRows(child, level + 1))}
      </React.Fragment>
    );
  };
  const isMain = selectedParent?.parent_id === 0;
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Category Name</th>
            <th>Sort</th>
            <th>Slug</th>
            <th className="text-center">Type</th>
            <th className="text-center">Subcategories</th>
            <th className="text-center">Status</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>{tree.map((cat) => renderRows(cat))}</tbody>
      </table>

      {/* Add Subcategory Modal */}
      {modalOpen && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Add Subcategory to "{selectedParent.name}"
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                {isMain ? (
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Subcategory Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                  />
                ) : (
                  // If not main, set default value 0
                  <input type="hidden" value="0" />
                )}

                <select
                  className="form-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-success" onClick={handleAddCategory}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Category</h5>
                <button
                  className="btn-close"
                  onClick={() => setEditModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-3"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Sorting Number"
                  value={newCategorySorting}
                  onChange={(e) => setNewCategorySorting(e.target.value)}
                />

                <select
                  className="form-control"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="0">Inactive</option>
                </select>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateCategory}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="modal fade"
        id="thumbnailsubcategoryModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title">Subcategory Banner Management</h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>

            <div className="modal-body">
              {/* 🔹 Tabs */}
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "image" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("image")}
                    type="button"
                  >
                    🖼️ Image Upload
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "category" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("category")}
                    type="button"
                  >
                    📂 Select Category
                  </button>
                </li>
              </ul>

              {/* 🔹 TAB 1: Image Upload */}
              {activeTab === "image" && (
                <>
                  {error && <div className="text-danger mb-2">{error}</div>}

                  {subPreview && (
                    <div className="mb-3 text-center">
                      <img
                        src={subPreview}
                        alt="Preview"
                        style={{
                          maxWidth: "100%",
                          borderRadius: "6px",
                          border: "1px solid #ddd",
                        }}
                      />
                      <div className="small text-muted mt-1">672 × 1536 px</div>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={handleImageChange}
                  />

                  <div className="text-end">
                    <button
                      className="btn btn-primary"
                      onClick={handleBannerUploadSubCategory}
                    >
                      Upload Image
                    </button>
                  </div>
                </>
              )}

              {/* 🔹 TAB 2: Category Select */}
              {activeTab === "category" && (
                <>
                  <label className="form-label">Select Main Category</label>

                  <select
                    className="form-control mb-3"
                    value={selectedMainCategoryId}
                    onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                  >
                    <option value="">-- Select Main Category --</option>
                    {mainCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>

                  {selectedMainCategoryId && (
                    <div className="alert alert-info p-2">
                      Selected Category ID: <b>{selectedMainCategoryId}</b>
                    </div>
                  )}

                  {/* ✅ SUBMIT BUTTON */}
                  <div className="text-end">
                    <button
                      className="btn btn-success"
                      onClick={handleUpdateSubCategoryParent}
                      disabled={!selectedMainCategoryId}
                    >
                      Update Category
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* add images Thumbnail */}
      <div
        className="modal fade"
        id="thumbnailModal"
        data-bs-target="#thumbnailModal"
        tabIndex="-1"
        aria-labelledby="thumbnailModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="thumbnailModalLabel">
                Upload Thumbnail Image (Image must be upload 300x300px)
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {selectedCategory?.thumbnail_image ? (
                <center>
                  <img
                    src={selectedCategory.thumbnail_image}
                    alt={selectedCategory.name}
                    className="img-fluid text-center"
                    style={{ maxWidth: "300px", maxHeight: "300px" }}
                  />
                </center>
              ) : null}
              <br />
              <input
                type="file"
                accept="image/*"
                className="form-control mb-3"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
              />
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleThumbnailUpload}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* add banner main category Thumbnail */}
      <div
        className="modal fade"
        id="bannerModal"
        data-bs-target="#bannerModal"
        tabIndex="-1"
        aria-labelledby="bannerModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="bannerModalLabel">
                Banner Image
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              {/* 🔹 Tabs */}
              <ul className="nav nav-tabs mb-3">
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "image" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("image")}
                    type="button"
                  >
                    🖼️ Banner Image
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "category" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("category")}
                    type="button"
                  >
                    🖼️ Inside Category Pages Banner
                  </button>
                </li>
              </ul>

              {/* 🔹 TAB 1: Image Upload */}
              {activeTab === "image" && (
                <>
                  {/* Start */}
                  <p>Image must be upload H-1536 x W-672px For Home Pages</p>
                  {selectedCategory?.banner_image ? (
                    <center>
                      <img
                        src={selectedCategory.banner_image}
                        alt={selectedCategory.name}
                        className="img-fluid text-center"
                        style={{ maxWidth: "100%", maxHeight: "1536px" }}
                      />
                    </center>
                  ) : null}

                  <br />

                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={(e) => setBannerFile(e.target.files[0])}
                  />
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleBannerUpload}
                    >
                      Upload
                    </button>
                  </div>
                  {/* END */}
                </>
              )}

              {/* 🔹 TAB 2: Category Select */}
              {activeTab === "category" && (
                <>
                  <p>H-450 × W-1622px for category pages</p>
                  {bannerPreview && (
                    <center>
                      <img
                        src={bannerPreview}
                        alt={selectedCategory?.name}
                        className="img-fluid"
                        style={{ maxWidth: "100%", maxHeight: "450px" }}
                      />
                    </center>
                  )}
                  <br />

                  <input
                    type="file"
                    accept="image/*"
                    className="form-control mb-3"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      setBannerFile(file);
                      setBannerPreview(URL.createObjectURL(file)); // 👈 preview
                    }}
                  />

                  {/* ✅ SUBMIT BUTTON */}
                  <div className="text-end">
                    <button
                      className="btn btn-success"
                      onClick={handleBannerUploadInsideCategory}
                    >
                      Udpate
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop */}
      {modalOpen && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default CategoryTable;
