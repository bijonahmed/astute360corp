"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import CustomDataTable from "../../context/CustomDataTable";
import useCategories from "../../hooks/useCategories";
import getSupllierList from "../../hooks/supplierList";
export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, permissions } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const title = "Product List";
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierId, setSupplierFilter] = useState("");
  const [selectedCategory, setMainCategory] = useState("");
  const [subcategoryId, setSubCategoryFilter] = useState("");
  const [insubcategoryId, setInSubCategoryFilter] = useState("");
  const [subcategoryList, setSubCategories] = useState([]);
  const [responseInSubCategory, setResponseInSubCategory] = useState([]);
  const [total_records, setTotalRecords] = useState(0);
  const { categoryData } = useCategories();
  const { suppliderData } = getSupllierList();
  /* ---------------- RESTORE FILTERS FROM URL ---------------- */
  useEffect(() => {
    const cat = searchParams.get("categoryId") || "";
    const sub = searchParams.get("subcategoryId") || "";
    const sup = searchParams.get("supplierId") || "";
    setMainCategory(cat);
    setSubCategoryFilter(sub);
    setSupplierFilter(sup);
    if (cat) {
      fetchSubcategories(cat);
    }
  }, []);
  /* ---------------- FETCH SUBCATEGORIES ---------------- */
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
      if (data?.data) {
        setSubCategories(data.data);
      }
    } catch (err) {
      console.error("Subcategory fetch error:", err);
    }
  };
  const handleInSubCategoryChange = (e) => {
    const selectedId = e.target.value;
    setSubCategoryFilter(selectedId);
    localStorage.setItem("subcategoryId", selectedId);
    fetchInSubCategories(selectedId);
  };
  const fetchInSubCategories = async (subcategoryId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/product-category/insubcategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ subcategory_id: subcategoryId }),
        },
      );
      const data = await res.json();
      if (data?.inSubCatAll) {
        setResponseInSubCategory(data.inSubCatAll);
      }
    } catch (err) {
      console.error("Fetch insubcategory failed:", err);
    }
  };
  useEffect(() => {
    const savedCategory = localStorage.getItem("categoryId") || "";
    const savedSubcategory = localStorage.getItem("subcategoryId") || "";
    const savedSupplier = localStorage.getItem("supplierId") || "";
    setMainCategory(savedCategory);
    setSubCategoryFilter(savedSubcategory);
    setSupplierFilter(savedSupplier);
    if (savedCategory) {
      fetchSubcategories(savedCategory);
    }
  }, []);
  /* ---------------- CATEGORY CHANGE ---------------- */
  const handleMainCategoryChange = (e) => {
    const selectedId = e.target.value;
    setMainCategory(selectedId);
    setSubCategoryFilter("");
    setSubCategories([]);
    // ✅ Save to localStorage
    localStorage.setItem("categoryId", selectedId);
    localStorage.removeItem("subcategoryId");
    if (!selectedId) return;
    fetchSubcategories(selectedId);
  };
  /* ---------------- FETCH PRODUCTS ---------------- */
  const fetchProducts = async (
    page = 1,
    perPageSize = 100,
    searchQuery = "",
  ) => {
    try {
      const encodedQuery = encodeURIComponent(searchQuery);
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/product/index?page=${page}&pageSize=${perPageSize}&searchQuery=${encodedQuery}&supplierId=${supplierId}&status=${statusFilter}&categoryId=${selectedCategory}&subcategoryId=${subcategoryId}&inSubcategoryId=${insubcategoryId}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      setTotalRecords(json.total_records || 0);
      return { data: json.data || [], total: json.total_records || 0 };
    } catch (err) {
      console.error(err);
      return { data: [], total: 0 };
    }
  };
  // DataTable columns
  const columns = [
    {
      name: "ID:",
      selector: (row) => row.id,
      sortable: true,
      width: "60px", // ✅ fixed width
      wrap: true, // text wrap allow
      cell: (row) => (
        <div
          style={{
            width: "60px",
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={row.id} // hover full name
        >
          {row.id}
        </div>
      ),
    },
    {
      name: "Product Name",
      selector: (row) => row.name,
      sortable: true,
      width: "650px", // ✅ fixed width
      wrap: true, // text wrap allow
      cell: (row) => (
        <div
          style={{
            width: "650px",
            whiteSpace: "normal",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          title={row.name} // hover full name
        >
          {row.name}
        </div>
      ),
    },
   {
  name: "Category Name",
  selector: (row) => {
    let fullName = row.category_name || "";
    if (row.sub_name) fullName += " => " + row.sub_name;
    if (row.inSub_name) fullName += " => " + row.inSub_name;
    return fullName;
  },
  sortable: true,
}
,
    {
      name: "Thumbnail Image",
      selector: (row) => row.thumbanil_img, // your field name
      sortable: false,
      cell: (row) =>
        row.thumbanil_img ? (
          <img
            src={row.thumbanil_img}
            alt={row.name || "Thumbnail"}
            style={{
              width: "50px",
              height: "50px",
              objectFit: "cover",
              padding: "8px",
            }} // add padding all sides }}
            className="border rounded"
          />
        ) : null,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          {perms.includes("edit product") && (
            <button
              className="btn btn-sm btn-primary"
              onClick={() => router.push(`/product/edit/${row.id}`)}
            >
              <i className="bi bi-pencil"></i> Edit
            </button>
          )}
          {perms.includes("delete product") && (
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(row.id)}
            >
              <i className="bi bi-trash"></i> Delete
            </button>
          )}
          <button
            className={`btn btn-sm ${
              row.status === 1 ? "btn-success" : "btn-danger"
            }`}
          >
            {row.status === 1 ? (
              <>
                <i className="bi bi-check"></i> Active
              </>
            ) : (
              <>Inactive</>
            )}
          </button>
        </div>
      ),
      ignoreRowClick: true,
    },
  ];
  const customStyles = {
    headCells: {
      style: {
        fontSize: "16px", // font size for header cells
        fontWeight: "600",
      },
    },
    cells: {
      style: {
        fontSize: "16px", // font size for normal cells
      },
    },
  };
  useEffect(() => {
  // Trigger the fetch automatically on component mount
  setSearch((prev) => prev + " "); // same as button click
}, []);
  /* ---------------- PERMISSION ---------------- */
  if (!perms.includes("view posts")) {
    router.replace("/dashboard");
    return null;
  }
  useEffect(() => {
    document.title = title;
  }, []);
  return (
    <main className="app-main" id="main" tabIndex={-1}>
      <Toaster position="top-right" />
      <div className="app-content-header">
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h3 className="mb-0">{title}&nbsp;</h3>
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
      <div className="app-content">
        <div className="container-fluid">
          <div className="card card-primary card-outline mb-4">
            <div className="card-header">
              <div className="card-title w-100">
                <div className="row g-2 align-items-center">
                  <div className="col-12 col-md-3 col-lg-2">
                    <input
                      type="text"
                      placeholder="Search name..."
                      className="form-control"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-4 col-md-2 col-lg-2">
                    <select
                      className="form-select"
                      value={selectedCategory}
                      onChange={handleMainCategoryChange}
                    >
                      <option value="">-- Main Category --</option>
                      {categoryData.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-4 col-md-2 col-lg-2">
                    <select
                      className="form-select"
                      value={subcategoryId}
                      onChange={(e) => handleInSubCategoryChange(e)}
                    >
                      <option value="">-- Subcatgory Category --</option>
                      {subcategoryList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-3 col-md-2 col-lg-2">
                    <select
                      className="form-select"
                      value={insubcategoryId}
                      onChange={(e) => {
                        setInSubCategoryFilter(e.target.value);
                      }}
                    >
                      <option value="">-- In Subcatgory Category --</option>
                      {responseInSubCategory.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-4 col-md-2 col-lg-2 d-none">
                    <select
                      className="form-select"
                      value={supplierId}
                      onChange={(e) => setSupplierFilter(e.target.value)}
                    >
                      <option value="">-- Supplier --</option>
                      {suppliderData.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-2 col-md-1 col-lg-1">
                    <select
                      className="form-control"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">-- Status --</option>
                      <option value="1">Active</option>
                      <option value="0">Inactive</option>
                    </select>
                  </div>
                  <div className="col-6 col-md-2 col-lg-1">
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100"
                      onClick={() => setSearch(search + " ")}
                    >
                      Fetch
                    </button>
                  </div>
                  <div className="col-6 col-md-3 col-lg-1 ms-auto">
                    {perms.includes("create product") && (
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => router.push(`/product/add`)}
                      >
                        Add New
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="card-body p-0 mt-2">
              <CustomDataTable
                columns={columns}
                fetchFunction={fetchProducts}
                searchValue={search}
                defaultPerPage={10}
                perPageOptions={[10, 25, 50]}
                customStyles={customStyles}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
