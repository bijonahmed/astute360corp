// EditEmployeeForm.jsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

function FormSection({ title, children }) {
  return (
    <div className="mb-4">
      <h5 className="border-bottom pb-2 mb-3">{title}</h5>
      <div className="row g-3">{children}</div>
    </div>
  );
}

const initialFormData = {
  id: "",
  employee_code: "",
  name: "",
  father_name: "",
  mother_name: "",
  date_of_birth: "",
  age: "",
  gender: "",
  marital_status: "",
  blood_group: "",
  photo: null,
  mobile: "",
  alternative_mobile: "",
  email: "",
  present_address: "",
  permanent_address: "",
  emergency_contact_name: "",
  emergency_contact_mobile: "",
  emergency_contact_relation: "",
  project_id: "",
  department_id: "",
  designation_id: "",
  joining_date: "",
  employment_type: "",
  employee_status: "Active",
  reporting_to: "",
  work_location: "",
  shift: "",
  basic_salary: "",
  gross_salary: "",
  nid_number: "",
  passport_number: "",
  passport_expiry_date: "",
  birth_certificate_number: "",
  driving_license_number: "",
  bank_name: "",
  bank_account_name: "",
  bank_account_number: "",
  branch_name: "",
  routing_number: "",
  payment_method: "",
  highest_education: "",
  institution_name: "",
  passing_year: "",
  username: "",
  password: "",
  status: 1,
  remarks: "",
};

export default function EditEmployeeForm({ id }) {
  const { token, permissions } = useAuth(); // client-side token
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const router = useRouter();

  const [formData, setFormData] = useState({ ...initialFormData, id: id || "" });

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const fetchDropdowns = async () => {
    if (!token) return;
    try {
      const [projRes, deptRes, desigRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/project/index?page=1&pageSize=1000&searchQuery=&selectedFilter=1`,
          { headers: authHeaders }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/department/index?page=1&pageSize=1000&searchQuery=&selectedFilter=1`,
          { headers: authHeaders }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE}/designation/index?page=1&pageSize=1000&searchQuery=&selectedFilter=1`,
          { headers: authHeaders }
        ),
      ]);
      const proj = await projRes.json();
      const dept = await deptRes.json();
      const desig = await desigRes.json();
      setProjects(proj.data || []);
      setDepartments(dept.data || []);
      setDesignations(desig.data || []);
    } catch (err) {
      console.error("Fetch dropdowns failed:", err.message);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 0 ? age : "";
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      setPhotoPreview(URL.createObjectURL(file));
      return;
    }

    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "date_of_birth") {
        next.age = calculateAge(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          if (key === "id" || key === "status" || key === "employee_status") {
            payload.append(key, value ?? "");
          }
          return;
        }
        payload.append(key, value);
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employee/updateData`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: payload,
        }
      );

      const data = await res.json();
      if (res.ok) {
        toast.success("Updated successfully ✅");
        router.push("/hrm/employee");
      } else if (data.errors) {
        toast.error(Object.values(data.errors).flat().join(" "), {
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

  useEffect(() => {
    if (!token) return;
    fetchDropdowns();
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/employee/chkrow/${id}`, {
      headers: authHeaders,
    })
      .then((res) => res.json())
      .then((data) => {
        const emp = data?.data || {};
        setFormData({
          ...initialFormData,
          id: emp.id ?? id,
          employee_code: emp.employee_code ?? "",
          name: emp.name ?? "",
          father_name: emp.father_name ?? "",
          mother_name: emp.mother_name ?? "",
          date_of_birth: emp.date_of_birth ?? "",
          age: emp.age ?? "",
          gender: emp.gender ?? "",
          marital_status: emp.marital_status ?? "",
          blood_group: emp.blood_group ?? "",
          photo: null,
          mobile: emp.mobile ?? "",
          alternative_mobile: emp.alternative_mobile ?? "",
          email: emp.email ?? "",
          present_address: emp.present_address ?? "",
          permanent_address: emp.permanent_address ?? "",
          emergency_contact_name: emp.emergency_contact_name ?? "",
          emergency_contact_mobile: emp.emergency_contact_mobile ?? "",
          emergency_contact_relation: emp.emergency_contact_relation ?? "",
          project_id: emp.project_id ?? "",
          department_id: emp.department_id ?? "",
          designation_id: emp.designation_id ?? "",
          joining_date: emp.joining_date ?? "",
          employment_type: emp.employment_type ?? "",
          employee_status: emp.employee_status ?? "Active",
          reporting_to: emp.reporting_to ?? "",
          work_location: emp.work_location ?? "",
          shift: emp.shift ?? "",
          basic_salary: emp.basic_salary ?? "",
          gross_salary: emp.gross_salary ?? "",
          nid_number: emp.nid_number ?? "",
          passport_number: emp.passport_number ?? "",
          passport_expiry_date: emp.passport_expiry_date ?? "",
          birth_certificate_number: emp.birth_certificate_number ?? "",
          driving_license_number: emp.driving_license_number ?? "",
          bank_name: emp.bank_name ?? "",
          bank_account_name: emp.bank_account_name ?? "",
          bank_account_number: emp.bank_account_number ?? "",
          branch_name: emp.branch_name ?? "",
          routing_number: emp.routing_number ?? "",
          payment_method: emp.payment_method ?? "",
          highest_education: emp.highest_education ?? "",
          institution_name: emp.institution_name ?? "",
          passing_year: emp.passing_year ?? "",
          username: emp.username ?? "",
          password: "",
          status: emp.status ?? 1,
          remarks: emp.remarks ?? "",
        });
        setPhotoPreview(emp.photo_url || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, token]);

  const title = "Employee Edit";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  // if (!permissions.includes("edit employee")) {
  //   router.replace("/dashboard");
  //   return false;
  // }

  const err = (field) => (errors[field] ? "is-invalid" : "");

  if (loading) {
    return (
      <main className="app-main" id="main" tabIndex={-1}>
        <div className="app-content">
          <div className="container-fluid">
            <p>Loading...</p>
          </div>
        </div>
      </main>
    );
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
                    {/* Personal Information */}
                    <FormSection title="Personal Information">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Photo</label>
                        <input
                          type="file"
                          name="photo"
                          accept="image/*"
                          className={`form-control ${err("photo")}`}
                          onChange={handleChange}
                        />
                        {errors.photo?.length > 0 && (
                          <div className="invalid-feedback d-block">
                            {errors.photo[0]}
                          </div>
                        )}
                        {photoPreview && (
                          <img
                            src={
                              typeof formData.photo === "string"
                                ? formData.photo
                                : photoPreview
                            }
                            alt="Preview"
                            className="img-thumbnail mt-2"
                            style={{ maxHeight: "150px" }}
                          />
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Employee Code</label>
                        <input
                          type="text"
                          className={`form-control ${err("employee_code")}`}
                          name="employee_code"
                          value={formData.employee_code}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${err("name")}`}
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                        {errors.name?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Father Name</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="father_name"
                          value={formData.father_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Mother Name</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="mother_name"
                          value={formData.mother_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className={`form-control`}
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Age (Auto)</label>
                        <input
                          type="number"
                          className="form-control"
                          name="age"
                          value={formData.age}
                          readOnly
                          placeholder="Auto from DOB"
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Gender</label>
                        <select
                          className={`form-control`}
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Gender --</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Marital Status</label>
                        <select
                          className={`form-control`}
                          name="marital_status"
                          value={formData.marital_status}
                          onChange={handleChange}
                        >
                          <option value="">-- Select --</option>
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Widowed">Widowed</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Blood Group</label>
                        <select
                          className={`form-control`}
                          name="blood_group"
                          value={formData.blood_group}
                          onChange={handleChange}
                        >
                          <option value="">-- Select --</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </FormSection>

                    {/* Contact Information */}
                    <FormSection title="Contact Information">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Mobile <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className={`form-control ${err("mobile")}`}
                          name="mobile"
                          value={formData.mobile}
                          onChange={handleChange}
                        />
                        {errors.mobile?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.mobile[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Alternative Mobile</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="alternative_mobile"
                          value={formData.alternative_mobile}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Email <span className="text-danger">*</span>
                        </label>
                        <input
                          type="email"
                          className={`form-control ${err("email")}`}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {errors.email?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.email[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Present Address</label>
                        <textarea
                          className={`form-control`}
                          name="present_address"
                          rows={2}
                          value={formData.present_address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Permanent Address</label>
                        <textarea
                          className={`form-control`}
                          name="permanent_address"
                          rows={2}
                          value={formData.permanent_address}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Emergency Contact Mobile
                        </label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="emergency_contact_mobile"
                          value={formData.emergency_contact_mobile}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Emergency Contact Relation
                        </label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="emergency_contact_relation"
                          value={formData.emergency_contact_relation}
                          onChange={handleChange}
                        />
                      </div>
                    </FormSection>

                    {/* Job Information */}
                    <FormSection title="Job Information">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Project</label>
                        <select
                          className={`form-control`}
                          name="project_id"
                          value={formData.project_id}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Project --</option>
                          {projects.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Department</label>
                        <select
                          className={`form-control`}
                          name="department_id"
                          value={formData.department_id}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Department --</option>
                          {departments.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Designation</label>
                        <select
                          className={`form-control`}
                          name="designation_id"
                          value={formData.designation_id}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Designation --</option>
                          {designations.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Joining Date</label>
                        <input
                          type="date"
                          className={`form-control`}
                          name="joining_date"
                          value={formData.joining_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Employment Type</label>
                        <select
                          className={`form-control`}
                          name="employment_type"
                          value={formData.employment_type}
                          onChange={handleChange}
                        >
                          <option value="">-- Select --</option>
                          <option value="Permanent">Permanent</option>
                          <option value="Contractual">Contractual</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Intern">Intern</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Employee Status</label>
                        <select
                          className={`form-control`}
                          name="employee_status"
                          value={formData.employee_status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Resigned">Resigned</option>
                          <option value="Terminated">Terminated</option>
                        </select>
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Reporting To</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="reporting_to"
                          value={formData.reporting_to}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Work Location</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="work_location"
                          value={formData.work_location}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Shift</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="shift"
                          value={formData.shift}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Basic Salary</label>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control`}
                          name="basic_salary"
                          value={formData.basic_salary}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Gross Salary</label>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control`}
                          name="gross_salary"
                          value={formData.gross_salary}
                          onChange={handleChange}
                        />
                      </div>
                    </FormSection>

                    {/* Identity & Documents */}
                    <FormSection title="Identity & Documents">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">NID Number</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="nid_number"
                          value={formData.nid_number}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Passport Number</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="passport_number"
                          value={formData.passport_number}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Passport Expiry Date</label>
                        <input
                          type="date"
                          className={`form-control`}
                          name="passport_expiry_date"
                          value={formData.passport_expiry_date}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Birth Certificate Number
                        </label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="birth_certificate_number"
                          value={formData.birth_certificate_number}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Driving License Number
                        </label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="driving_license_number"
                          value={formData.driving_license_number}
                          onChange={handleChange}
                        />
                      </div>
                    </FormSection>

                    {/* Bank / Payment Information */}
                    <FormSection title="Bank & Payment">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Bank Name</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="bank_name"
                          value={formData.bank_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Bank Account Name</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="bank_account_name"
                          value={formData.bank_account_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Bank Account Number</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="bank_account_number"
                          value={formData.bank_account_number}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Branch Name</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="branch_name"
                          value={formData.branch_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Routing Number</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="routing_number"
                          value={formData.routing_number}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Payment Method</label>
                        <select
                          className={`form-control`}
                          name="payment_method"
                          value={formData.payment_method}
                          onChange={handleChange}
                        >
                          <option value="">-- Select --</option>
                          <option value="Bank">Bank</option>
                          <option value="Cash">Cash</option>
                          <option value="Mobile Banking">Mobile Banking</option>
                        </select>
                      </div>
                    </FormSection>

                    {/* Education */}
                    <FormSection title="Education">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Highest Education</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="highest_education"
                          value={formData.highest_education}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Institution Name</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="institution_name"
                          value={formData.institution_name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Passing Year</label>
                        <input
                          type="text"
                          className={`form-control`}
                          name="passing_year"
                          value={formData.passing_year}
                          onChange={handleChange}
                        />
                      </div>
                    </FormSection>

                    {/* System Information */}
                    <FormSection title="System Information">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Password{" "}
                          <small className="text-muted">
                            (leave blank to keep current)
                          </small>
                        </label>
                        <input
                          type="password"
                          className={`form-control ${err("password")}`}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          autoComplete="new-password"
                        />
                        {errors.password?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.password[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Status</label>
                        <select
                          className={`form-control`}
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Remarks</label>
                        <textarea
                          className={`form-control`}
                          name="remarks"
                          rows={2}
                          value={formData.remarks}
                          onChange={handleChange}
                        />
                      </div>
                    </FormSection>
                  </div>
                  {/*end::Body*/}
                  {/*begin::Footer*/}
                  <div className="card-footer text-end">
                    <button type="submit" className="btn btn-primary">
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
