"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

function FormSection({ title, children }) {
  return (
    <div className="mb-4">
      <h5 className="border-bottom pb-2 mb-3">{title}</h5>
      <div className="row g-3">{children}</div>
    </div>
  );
}

const initialFormData = {
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

export default function EmployeeAddPage() {
  const { token, permissions } = useAuth();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const title = "Employee Add";
  // update document title
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  const [formData, setFormData] = useState(initialFormData);

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

  useEffect(() => {
    fetchDropdowns();
  }, [token]);

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
          if (key === "status" || key === "employee_status") {
            payload.append(key, value ?? "");
          }
          return;
        }
        payload.append(key, value);
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE}/employee/create`,
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
        toast.success("Add successfully ✅");
        router.push("/hrm/employee");
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

  // if (!permissions.includes("create employee")) {
  //   router.replace("/dashboard");
  //   return false;
  // }

  const err = (field) => (errors[field] ? "is-invalid" : "");

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
                            src={photoPreview}
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
                        {errors.employee_code?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.employee_code[0]}
                          </div>
                        )}
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
                          className={`form-control ${err("father_name")}`}
                          name="father_name"
                          value={formData.father_name}
                          onChange={handleChange}
                        />
                        {errors.father_name?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.father_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Mother Name</label>
                        <input
                          type="text"
                          className={`form-control ${err("mother_name")}`}
                          name="mother_name"
                          value={formData.mother_name}
                          onChange={handleChange}
                        />
                        {errors.mother_name?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.mother_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          className={`form-control ${err("date_of_birth")}`}
                          name="date_of_birth"
                          value={formData.date_of_birth}
                          onChange={handleChange}
                        />
                        {errors.date_of_birth?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.date_of_birth[0]}
                          </div>
                        )}
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
                          className={`form-control ${err("gender")}`}
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="">-- Select Gender --</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.gender?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.gender[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Marital Status</label>
                        <select
                          className={`form-control ${err("marital_status")}`}
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
                        {errors.marital_status?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.marital_status[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Blood Group</label>
                        <select
                          className={`form-control ${err("blood_group")}`}
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
                        {errors.blood_group?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.blood_group[0]}
                          </div>
                        )}
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
                          className={`form-control ${err("alternative_mobile")}`}
                          name="alternative_mobile"
                          value={formData.alternative_mobile}
                          onChange={handleChange}
                        />
                        {errors.alternative_mobile?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.alternative_mobile[0]}
                          </div>
                        )}
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
                          className={`form-control ${err("present_address")}`}
                          name="present_address"
                          rows={2}
                          value={formData.present_address}
                          onChange={handleChange}
                        />
                        {errors.present_address?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.present_address[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-6">
                        <label className="form-label">Permanent Address</label>
                        <textarea
                          className={`form-control ${err("permanent_address")}`}
                          name="permanent_address"
                          rows={2}
                          value={formData.permanent_address}
                          onChange={handleChange}
                        />
                        {errors.permanent_address?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.permanent_address[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          className={`form-control ${err(
                            "emergency_contact_name"
                          )}`}
                          name="emergency_contact_name"
                          value={formData.emergency_contact_name}
                          onChange={handleChange}
                        />
                        {errors.emergency_contact_name?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.emergency_contact_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Emergency Contact Mobile
                        </label>
                        <input
                          type="text"
                          className={`form-control ${err(
                            "emergency_contact_mobile"
                          )}`}
                          name="emergency_contact_mobile"
                          value={formData.emergency_contact_mobile}
                          onChange={handleChange}
                        />
                        {errors.emergency_contact_mobile?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.emergency_contact_mobile[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Emergency Contact Relation
                        </label>
                        <input
                          type="text"
                          className={`form-control ${err(
                            "emergency_contact_relation"
                          )}`}
                          name="emergency_contact_relation"
                          value={formData.emergency_contact_relation}
                          onChange={handleChange}
                        />
                        {errors.emergency_contact_relation?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.emergency_contact_relation[0]}
                          </div>
                        )}
                      </div>
                    </FormSection>

                    {/* Job Information */}
                    <FormSection title="Job Information">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Project</label>
                        <select
                          className={`form-control ${err("project_id")}`}
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
                        {errors.project_id?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.project_id[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Department</label>
                        <select
                          className={`form-control ${err("department_id")}`}
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
                        {errors.department_id?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.department_id[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Designation</label>
                        <select
                          className={`form-control ${err("designation_id")}`}
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
                        {errors.designation_id?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.designation_id[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Joining Date</label>
                        <input
                          type="date"
                          className={`form-control ${err("joining_date")}`}
                          name="joining_date"
                          value={formData.joining_date}
                          onChange={handleChange}
                        />
                        {errors.joining_date?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.joining_date[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Employment Type</label>
                        <select
                          className={`form-control ${err("employment_type")}`}
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
                        {errors.employment_type?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.employment_type[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Employee Status</label>
                        <select
                          className={`form-control ${err("employee_status")}`}
                          name="employee_status"
                          value={formData.employee_status}
                          onChange={handleChange}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                          <option value="Resigned">Resigned</option>
                          <option value="Terminated">Terminated</option>
                        </select>
                        {errors.employee_status?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.employee_status[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Reporting To</label>
                        <input
                          type="text"
                          className={`form-control ${err("reporting_to")}`}
                          name="reporting_to"
                          value={formData.reporting_to}
                          onChange={handleChange}
                        />
                        {errors.reporting_to?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.reporting_to[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Work Location</label>
                        <input
                          type="text"
                          className={`form-control ${err("work_location")}`}
                          name="work_location"
                          value={formData.work_location}
                          onChange={handleChange}
                        />
                        {errors.work_location?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.work_location[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Shift</label>
                        <input
                          type="text"
                          className={`form-control ${err("shift")}`}
                          name="shift"
                          value={formData.shift}
                          onChange={handleChange}
                        />
                        {errors.shift?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.shift[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Basic Salary</label>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${err("basic_salary")}`}
                          name="basic_salary"
                          value={formData.basic_salary}
                          onChange={handleChange}
                        />
                        {errors.basic_salary?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.basic_salary[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Gross Salary</label>
                        <input
                          type="number"
                          step="0.01"
                          className={`form-control ${err("gross_salary")}`}
                          name="gross_salary"
                          value={formData.gross_salary}
                          onChange={handleChange}
                        />
                        {errors.gross_salary?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.gross_salary[0]}
                          </div>
                        )}
                      </div>
                    </FormSection>

                    {/* Identity & Documents */}
                    <FormSection title="Identity & Documents">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">NID Number</label>
                        <input
                          type="text"
                          className={`form-control ${err("nid_number")}`}
                          name="nid_number"
                          value={formData.nid_number}
                          onChange={handleChange}
                        />
                        {errors.nid_number?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.nid_number[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Passport Number</label>
                        <input
                          type="text"
                          className={`form-control ${err("passport_number")}`}
                          name="passport_number"
                          value={formData.passport_number}
                          onChange={handleChange}
                        />
                        {errors.passport_number?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.passport_number[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Passport Expiry Date</label>
                        <input
                          type="date"
                          className={`form-control ${err(
                            "passport_expiry_date"
                          )}`}
                          name="passport_expiry_date"
                          value={formData.passport_expiry_date}
                          onChange={handleChange}
                        />
                        {errors.passport_expiry_date?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.passport_expiry_date[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Birth Certificate Number
                        </label>
                        <input
                          type="text"
                          className={`form-control ${err(
                            "birth_certificate_number"
                          )}`}
                          name="birth_certificate_number"
                          value={formData.birth_certificate_number}
                          onChange={handleChange}
                        />
                        {errors.birth_certificate_number?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.birth_certificate_number[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Driving License Number
                        </label>
                        <input
                          type="text"
                          className={`form-control ${err(
                            "driving_license_number"
                          )}`}
                          name="driving_license_number"
                          value={formData.driving_license_number}
                          onChange={handleChange}
                        />
                        {errors.driving_license_number?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.driving_license_number[0]}
                          </div>
                        )}
                      </div>
                    </FormSection>

                    {/* Bank / Payment Information */}
                    <FormSection title="Bank & Payment">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Bank Name</label>
                        <input
                          type="text"
                          className={`form-control ${err("bank_name")}`}
                          name="bank_name"
                          value={formData.bank_name}
                          onChange={handleChange}
                        />
                        {errors.bank_name?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.bank_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Bank Account Name</label>
                        <input
                          type="text"
                          className={`form-control ${err("bank_account_name")}`}
                          name="bank_account_name"
                          value={formData.bank_account_name}
                          onChange={handleChange}
                        />
                        {errors.bank_account_name?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.bank_account_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Bank Account Number</label>
                        <input
                          type="text"
                          className={`form-control ${err(
                            "bank_account_number"
                          )}`}
                          name="bank_account_number"
                          value={formData.bank_account_number}
                          onChange={handleChange}
                        />
                        {errors.bank_account_number?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.bank_account_number[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Branch Name</label>
                        <input
                          type="text"
                          className={`form-control ${err("branch_name")}`}
                          name="branch_name"
                          value={formData.branch_name}
                          onChange={handleChange}
                        />
                        {errors.branch_name?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.branch_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Routing Number</label>
                        <input
                          type="text"
                          className={`form-control ${err("routing_number")}`}
                          name="routing_number"
                          value={formData.routing_number}
                          onChange={handleChange}
                        />
                        {errors.routing_number?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.routing_number[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Payment Method</label>
                        <select
                          className={`form-control ${err("payment_method")}`}
                          name="payment_method"
                          value={formData.payment_method}
                          onChange={handleChange}
                        >
                          <option value="">-- Select --</option>
                          <option value="Bank">Bank</option>
                          <option value="Cash">Cash</option>
                          <option value="Mobile Banking">Mobile Banking</option>
                        </select>
                        {errors.payment_method?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.payment_method[0]}
                          </div>
                        )}
                      </div>
                    </FormSection>

                    {/* Education */}
                    <FormSection title="Education">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Highest Education</label>
                        <input
                          type="text"
                          className={`form-control ${err(
                            "highest_education"
                          )}`}
                          name="highest_education"
                          value={formData.highest_education}
                          onChange={handleChange}
                        />
                        {errors.highest_education?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.highest_education[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Institution Name</label>
                        <input
                          type="text"
                          className={`form-control ${err("institution_name")}`}
                          name="institution_name"
                          value={formData.institution_name}
                          onChange={handleChange}
                        />
                        {errors.institution_name?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.institution_name[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">Passing Year</label>
                        <input
                          type="text"
                          className={`form-control ${err("passing_year")}`}
                          name="passing_year"
                          value={formData.passing_year}
                          onChange={handleChange}
                        />
                        {errors.passing_year?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.passing_year[0]}
                          </div>
                        )}
                      </div>
                    </FormSection>

                    {/* System Information */}
                    <FormSection title="System Information">
                      <div className="col-12 col-md-4 col-lg-3">
                        <label className="form-label">
                          Password <span className="text-danger">*</span>
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
                          className={`form-control ${err("status")}`}
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="1">Active</option>
                          <option value="0">Inactive</option>
                        </select>
                        {errors.status?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.status[0]}
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label">Remarks</label>
                        <textarea
                          className={`form-control ${err("remarks")}`}
                          name="remarks"
                          rows={2}
                          value={formData.remarks}
                          onChange={handleChange}
                        />
                        {errors.remarks?.length > 0 && (
                          <div className="invalid-feedback">
                            {errors.remarks[0]}
                          </div>
                        )}
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
