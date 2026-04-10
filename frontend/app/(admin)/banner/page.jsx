"use client"; // Required in Next.js App Router for client-side component

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DataTable from "react-data-table-component";
import Link from "next/link";
import CategoryTree from "./CategoryTree";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";

export default function UserPage() {
  const router = useRouter();
  const { token, permissions } = useAuth();
  const perms = Array.isArray(permissions)
    ? permissions
    : permissions?.split(",") || [];
  const pathname = usePathname();
  const title = "Banner Seeting";
  //const title = pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);
  const [homeSliderFile, setHomeSliderFile] = useState(null);
  const [homeSliderPreview, setHomeSliderPreview] = useState(null);
  const [homeSliderValid, setHomeSliderValid] = useState(false);

  const [bannerFile, setBannerFile] = useState(null);
  const [homeslider, setHomeSliderData] = useState([]);
  const [bannerData, setBannerData] = useState([]);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerValid, setBannerValid] = useState(false);

  const [message, setMessage] = useState("");

  const HOME_SLIDER_DIM = { width: 1903, height: 437 };
  const BANNER_DIM = { width: 1920, height: 80 };

  // Home Slider Preview & Validation
  const handleHomeSliderChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (
        img.width === HOME_SLIDER_DIM.width &&
        img.height === HOME_SLIDER_DIM.height
      ) {
        setHomeSliderFile(file);
        setHomeSliderPreview(img.src);
        setHomeSliderValid(true);
        setMessage("");
      } else {
        setHomeSliderFile(null);
        setHomeSliderPreview(null);
        setHomeSliderValid(false);
        setMessage(
          `Home Slider must be ${HOME_SLIDER_DIM.width}x${HOME_SLIDER_DIM.height}px`
        );
      }
    };
  };

  // Banner Image Preview & Validation
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      if (img.width === BANNER_DIM.width && img.height === BANNER_DIM.height) {
        setBannerFile(file);
        setBannerPreview(img.src);
        setBannerValid(true);
        setMessage("");
      } else {
        setBannerFile(null);
        setBannerPreview(null);
        setBannerValid(false);
        setMessage(
          `Banner Image must be ${BANNER_DIM.width}x${BANNER_DIM.height}px`
        );
      }
    };
  };

  // Upload Handlers
  const handleHomeSliderSubmit = async (e) => {
    e.preventDefault();
    if (!homeSliderValid) return;

    const formData = new FormData();
    formData.append("home_slider", homeSliderFile);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/banner/SliderStore`;

      const res = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHomeSliderPreview(null);
      const data = await res.json();
      fetchData();

      setMessage(
        res.ok
          ? "Home Slider uploaded successfully!"
          : data.error || "Upload failed"
      );
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  const onDelete = async (id) => {
    const formData = new FormData();
    formData.append("id", id);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/banner/deleteHomeSlider`;

      const res = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHomeSliderPreview(null);
      const data = await res.json();
      fetchData();

      setMessage(
        res.ok
          ? "Home Slider uploaded successfully!"
          : data.error || "Upload failed"
      );
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    }
  };

  const handleBannerSubmit = async (e) => {
    e.preventDefault();
    if (!bannerValid) return;

    const formData = new FormData();
    formData.append("banner_image", bannerFile);

    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/banner/bannerStore`;
      const res = await fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchData();

      const data = await res.json();
      setMessage(
        res.ok ? "Banner uploaded successfully!" : data.error || "Upload failed"
      );
    } catch {
      setMessage("Something went wrong");
    }
  };

  const fetchData = async () => {
    //    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_BASE}/banner/index`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      let result;
      try {
        result = await res.json();
      } catch (e) {
        result = null;
      }

      if (!res.ok) {
        if (result && result.message) {
          throw new Error(result.message);
        } else {
          throw new Error(`HTTP Error: ${res.status}`);
        }
      }
      setHomeSliderData(result.data || []);
      setBannerData(result.data || []);
    } catch (err) {
      console.error("Fetch users failed:", err.message);
      toast.error(err.message || "Something went wrong!");
    } finally {
      //  setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!perms.includes("view banner")) {
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
                  {title}
                </li>
              </ol>
            </div>
          </div>
          {/*end::Row*/}
        </div>
        {/*end::Container*/}
      </div>

      {/*begin::App Content*/}
      <Toaster position="top-right" />
      <div className="app-content">
        {/*begin::Container*/}
        <div className="container-fluid">
          {/*begin::Row*/}
          <div className="card card-primary card-outline mb-4">
            {/* Header */}

            {/* start */}

            <div className="container-fluid mt-5">
              <div className="row">
                {/* Sidebar Tabs */}
                <div className="col-3 border-end ps-3">
                  <div
                    className="nav flex-column nav-pills"
                    id="v-tabs"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <button
                      className="nav-link active mb-2"
                      id="tab-home"
                      data-bs-toggle="pill"
                      data-bs-target="#home"
                      type="button"
                      role="tab"
                    >
                      Home Slider
                    </button>
                    <button
                      className="nav-link mb-2"
                      id="tab-profile"
                      data-bs-toggle="pill"
                      data-bs-target="#profile"
                      type="button"
                      role="tab"
                    >
                      Banner Image
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="col-9 ps-4">
                  <div className="tab-content" id="v-tabsContent">
                    {/* Home Slider Tab */}
                    <div
                      className="tab-pane fade show active"
                      id="home"
                      role="tabpanel"
                    >
                      <form onSubmit={handleHomeSliderSubmit}>
                        <div className="mb-3">
                          <label htmlFor="home_slider" className="form-label">
                            Home Slider Image (Width: 1903, Height: 437 px)
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            id="home_slider"
                            name="home_slider"
                            accept="image/*"
                            onChange={handleHomeSliderChange}
                          />
                        </div>
                        {homeSliderPreview && (
                          <div className="mb-3">
                            <p>Preview:</p>
                            <img
                              src={homeSliderPreview}
                              alt="Home Slider Preview"
                              className="img-fluid border"
                            />
                          </div>
                        )}
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={!homeSliderValid}
                        >
                          Upload
                        </button>
                        <br /> <br />
                        <div className="row g-4">
                          {homeslider && homeslider.length > 0 ? (
                            homeslider
                              .filter((item) => item.type === "slider") // ✅ only slider type
                              .map((item) => (
                                <div
                                  className="col-12 col-sm-12 col-md-12 col-lg-12"
                                  key={item.id}
                                  style={{ position: "relative" }}
                                >
                                  <div className="card h-100 shadow-sm">
                                    <div className="position-relative">
                                      <img
                                        src={item.home_slider}
                                        alt={item.name}
                                        className="card-img-top img-fluid"
                                        style={{
                                          objectFit: "cover",
                                          width: "100%",
                                          height: "100%",
                                        }}
                                      />

                                      {/* ❌ Delete Button */}
                                      <button
                                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                                        onClick={() => {
                                          if (
                                            window.confirm(
                                              "Are you sure you want to delete this slider?"
                                            )
                                          ) {
                                            onDelete(item.id);
                                          }
                                        }}
                                      >
                                        &times;
                                      </button>
                                    </div>

                                    <div className="card-body text-center">
                                      <h6 className="card-title mb-0">
                                        {item.name}
                                      </h6>
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-muted text-center">
                              No sliders available.
                            </p>
                          )}
                        </div>
                      </form>
                    </div>

                    {/* Banner Image Tab */}
                    <div className="tab-pane fade" id="profile" role="tabpanel">
                      <form onSubmit={handleBannerSubmit}>
                        <div className="mb-3">
                          <label htmlFor="banner_image" className="form-label">
                            Banner Image (Width: 1920, Height: 80 px)
                          </label>
                          <input
                            type="file"
                            className="form-control"
                            id="banner_image"
                            name="banner_image"
                            accept="image/*"
                            onChange={handleBannerChange}
                          />
                        </div>
                        {bannerPreview && (
                          <div className="mb-3">
                            <p>Preview:</p>
                            <img
                              src={bannerPreview}
                              alt="Banner Preview"
                              className="img-fluid border"
                            />
                          </div>
                        )}
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={!bannerValid}
                        >
                          Upload
                        </button>
                        <br /> <br />
                        <div className="row g-4">
                          {bannerData && bannerData.length > 0 ? (
                            bannerData
                              .filter((item) => item.type === "top_banner") // ✅ only top_banner type
                              .map((item) => (
                                <div
                                  className="col-12 col-sm-12 col-md-12 col-lg-12"
                                  key={item.id}
                                  style={{ position: "relative" }}
                                >
                                  <div className="card h-100 shadow-sm">
                                    <div className="position-relative">
                                      <img
                                        src={item.banner_image}
                                        alt={item.name}
                                        className="card-img-top img-fluid"
                                        style={{
                                          objectFit: "cover",
                                        }}
                                      />
                                    </div>

                                    <div className="card-body text-center">
                                      <h6 className="card-title mb-0">
                                        {item.name}
                                      </h6>
                                    </div>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <p className="text-muted text-center">
                              No banners available.
                            </p>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                  {message && <p className="mt-3 text-danger">{message}</p>}
                </div>
              </div>
            </div>
            {/* end */}
          </div>

          {/*end::Body*/}
        </div>

        {/*end::Row*/}
      </div>
      {/*end::Container*/}
      {/*end::App Content*/}
    </main>
  );
}
