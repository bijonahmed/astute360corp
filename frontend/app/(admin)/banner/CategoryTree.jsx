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

  //For add banner images
  const handleBannerAdd = (category) => {
    setSelectedCategory(category);
    setThumbnailFile(null);
    setBannerFile(null);

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
        }
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
        }
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

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditedName(category.name);
    setEditedStatus(category.status);
    setEditModalOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || editedName.trim() === "") return;

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
          body: JSON.stringify({ name: editedName, status: editedStatus }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Category updated successfully ✅");
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
        }
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
          <td>{category.slug}</td>
          <td className="text-center">{isMain ? "Main" : "Sub"}</td>

          <td className="text-center">
            {hasChildren && (
              <span className="badge bg-primary">
                {countSubcategories(category)}
              </span>
            )}
          </td>
          <td className="text-center">
            {category.status == 1 ? "Active" : "Inactive"}
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
              className="btn btn-sm btn-primary  me-2"
              onClick={() => handleEditClick(category)}
              title="Edit Category"
            >
              ✏️
            </button>

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

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Category Name</th>
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
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Subcategory Name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />

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

      {/* add banner Thumbnail */}
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
                Upload Banner Image (Image must be upload H-1536 x W-672px)
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
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
