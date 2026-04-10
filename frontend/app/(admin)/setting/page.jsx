"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

export default function SettingPage() {
  const { token } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState(null);

  const title = pathname
    ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2)
    : "";

  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    whatsApp: "",
    promotional_banner: "0", // default hide
    promotional_banner_content: "",
    fblink: "",
    description: "",
    website: "",
    telegram: "",
    copyright: "",
    devliery_charge_inside_dhk: "",
    devliery_charge_outside_dhk: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/setting/settingrow`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.data);
        setFormData({
          name: data?.data?.name || "",
          email: data?.data?.email || "",
          address: data?.data?.address || "",
          whatsApp: data?.data?.whatsApp || "",
          promotional_banner: data?.data?.promotional_banner ?? "0",
          promotional_banner_content:
            data?.data?.promotional_banner_content || "",
          fblink: data?.data?.fblink || "",
          description: data?.data?.description || "",
          website: data?.data?.website || "",
          telegram: data?.data?.telegram || "",
          copyright: data?.data?.copyright || "",
          devliery_charge_inside_dhk:
            data?.data?.devliery_charge_inside_dhk || "",
          devliery_charge_outside_dhk:
            data?.data?.devliery_charge_outside_dhk || "",
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/setting/upateSetting`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Settings updated successfully");
        setUser(data);

        setTimeout(() => {
          router.push("/dashboard");
        }, 4000); // 5 seconds
      } else if (data.errors) {
        setErrors(data.errors);
        toast.error(Object.values(data.errors).flat().join(" "));
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  if (loading) return <p className="text-center py-5"></p>;

  return (
    <main className="app-main" id="main">
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
          <div className="card card-primary card-outline">
            <form onSubmit={handleSubmit}>
              <div className="card-body">
                {/* BASIC INFO */}
                <Input
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
                <Textarea
                  label="Business Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                <Input
                  label="WhatsApp"
                  name="whatsApp"
                  value={formData.whatsApp}
                  onChange={handleChange}
                />
                <Input
                  label="Facebook Page"
                  name="fblink"
                  value={formData.fblink}
                  onChange={handleChange}
                />
                <Input
                  label="Website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />
                <Input
                  label="Telegram"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                />
                <Input
                  label="Copyright"
                  name="copyright"
                  value={formData.copyright}
                  onChange={handleChange}
                />

                {/* DELIVERY */}
                <Input
                  label="Inside Dhaka"
                  name="devliery_charge_inside_dhk"
                  value={formData.devliery_charge_inside_dhk}
                  onChange={handleChange}
                />
                <Input
                  label="Outside Dhaka"
                  name="devliery_charge_outside_dhk"
                  value={formData.devliery_charge_outside_dhk}
                  onChange={handleChange}
                />

                {/* PROMOTIONAL BANNER */}
                <div className="mb-3">
                  <label className="form-label">Promotional Banner</label>
                  <select
                    className="form-select"
                    name="promotional_banner"
                    value={formData.promotional_banner}
                    onChange={handleChange}
                  >
                    <option value="0">Hide</option>
                    <option value="1">Show</option>
                  </select>
                </div>
              </div>

              <div className="card-footer text-end">
                <button className="btn btn-primary" type="submit">
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ---------- Reusable Inputs ---------- */

const Input = ({ label, ...props }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <input className="form-control" {...props} />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="mb-3">
    <label className="form-label">{label}</label>
    <textarea className="form-control" {...props} />
  </div>
);
