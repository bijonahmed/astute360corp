"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; // adjust path
import toast, { Toaster } from "react-hot-toast";

import Link from "next/link";

export default function permissionAddPage() {
  const { token, permissions } = useAuth();
  const [data, setPermissions] = useState([]);
  const [rulesType, setRoleTypes] = useState([]);
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const title = "Permissions"; //pathname ? pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2) : "";

  const checkRolePermissions = async (roleId) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/permission/check-permissions/${roleId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = await res.json();
    console.log("API Response:", result); // Check actual structure

    // Try for both possible structures: result.data or result.permissions
    const permsData = result.data || result.permissions || [];

    const perms = permsData
      .filter((p) => p && (p.id || p.permission_id))
      .map((p) => ({
        id: p.id || p.permission_id,
        name: p.name || p.permission_name,
      }));

    setSelectedPermissions(perms);
    } catch (error) {
      console.error("❌ Error checking permissions", error);
    }
  };

  const handlePermissionChange = (perm) => {
    setSelectedPermissions((prev) => {
      const exists = prev.find((p) => p.id === perm.id);
      if (exists) {
        return prev.filter((p) => p.id !== perm.id);
      } else {
        return [...prev, { id: perm.id, name: perm.name }];
      }
    });
  };
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const fetchUser = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/roles/getRolesType`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setRoleTypes(data.data);
      } else {
        console.error("Auth error:", data.message);
      }
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    role_type: "",
    status: 1,
  });

  const handleRoleTypeChange = async (e) => {
    const selectedValue = e.target.value;

    // Update role in form data
    setFormData((prevData) => ({
      ...prevData,
      role_type: selectedValue,
    }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/roles/checkRoleType`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            role_type: selectedValue, // Ensure latest value is sent
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        console.log("Data: " + data);
        setPermissions(data.data);
        //toast.success("Add successfully ✅");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanPermissions = selectedPermissions.filter(
        (perm) => perm && perm.id
      );

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/permission/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role_type: formData.role_type,
            permissions: cleanPermissions,
          }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Permissions assigned successfully ✅");
      } else if (data.errors) {
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

  const capitalizeFirstLetter = (string) => {
    if (!string) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (!permissions.includes("create permission")) {
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
                  {/*begin::Body*/}
                  <div className="card-body">
                    <div className="mb-3">
                      <label className="form-label">Role Types</label>
                      <select
                        className={`form-control ${
                          errors.role_type ? "is-invalid" : ""
                        }`}
                        name="role_type"
                        value={formData.role_type}
                        onChange={(e) => {
                          handleRoleTypeChange(e); // Custom function
                          checkRolePermissions(e.target.value); // Check permissions from DB
                        }}
                      >
                        <option value="">-- Select Rule --</option>
                        {rulesType.map((rule, index) => (
                          <option key={rule.id} value={rule.id}>
                            {rule.name}
                          </option>
                        ))}
                      </select>

                      {errors.role_type && errors.role_type.length > 0 && (
                        <div className="invalid-feedback">
                          {errors.role_type[0]}
                        </div>
                      )}
                    </div>
                  </div>
                  {/*end::Body*/}
                  <table className="table table-bordered table table-xs table-striped display mb-0">
                    <thead>
                      <tr>
                        <th>Permission Group</th>
                        {data.length > 0 &&
                          data[0].permissions.map((perm, idx) => (
                            <th key={idx} className="text-center">
                              {capitalizeFirstLetter(perm.name)}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((group, groupIdx) => (
                        <tr key={`group-${groupIdx}-${group.group_name}`}>
                          <td>{group.group_name}</td>
                          {group.permissions.map((perm, permIdx) => (
                            <td
                              key={`perm-${groupIdx}-${permIdx}`}
                              className="text-center"
                            >
                              <input
                                type="checkbox"
                                  
                                checked={selectedPermissions.some(
                                  (p) => p.id === perm.id
                                )}
                                onChange={() => handlePermissionChange(perm)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {/*begin::Footer*/}
                  <div className="card-footer text-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                  {/*end::Footer*/}
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
