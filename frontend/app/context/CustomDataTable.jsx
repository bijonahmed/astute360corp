"use client";

import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";

/* =========================
   PROFESSIONAL PAGINATION
========================= */
const BootstrapPagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages === 0) return null;

  const pageNumbers = [];
  const maxVisible = 5;

  let startPage = Math.max(currentPage - 2, 1);
  let endPage = Math.min(currentPage + 2, totalPages);

  if (currentPage <= 3) {
    startPage = 1;
    endPage = Math.min(maxVisible, totalPages);
  } else if (currentPage >= totalPages - 2) {
    startPage = Math.max(totalPages - (maxVisible - 1), 1);
    endPage = totalPages;
  }

  if (startPage > 1) {
    pageNumbers.push(1);
    if (startPage > 2) pageNumbers.push("start-ellipsis");
  }

  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pageNumbers.push("end-ellipsis");
    pageNumbers.push(totalPages);
  }

  return (
    <nav>
      <ul className="pagination justify-content-center mt-3">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo; Previous
          </button>
        </li>

        {pageNumbers.map((num, idx) =>
          typeof num === "string" ? (
            <li key={idx} className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          ) : (
            <li
              key={idx}
              className={`page-item ${num === currentPage ? "active" : ""}`}
            >
              <button
                className={`page-link ${
                  num === currentPage
                    ? "bg-primary text-white border-primary"
                    : "border-secondary"
                }`}
                onClick={() => onPageChange(num)}
              >
                {num}
              </button>
            </li>
          )
        )}

        <li
          className={`page-item ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

/* =========================
   CUSTOM DATA TABLE
========================= */
const CustomDataTable = ({
  columns,
  fetchFunction,
  defaultPerPage = 10,
  searchValue = "",
  customStyles = {},
}) => {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);

  const totalPages = Math.max(Math.ceil(totalRows / perPage), 1);

  const fetchData = async (page, pageSize) => {
    setLoading(true);
    try {
      const res = await fetchFunction(page, pageSize, searchValue);
      setData(res?.data || []);
      setTotalRows(Number(res?.total || 0));
    } catch (err) {
      console.error(err);
      setData([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, perPage);
  }, [currentPage, perPage, searchValue]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalRows, perPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handlePerPageChange = (e) => {
    setPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  /* =======================
     TOP CONTROL PANEL
  ======================= */
  const TopControl = () => (
    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div className="d-flex align-items-center gap-2">
        {/* <label className="fw-semibold">Show</label> */}
        <select
          className="form-select form-select-sm w-auto"
          value={perPage}
          onChange={handlePerPageChange}
        >
          {[10, 25, 50, 100, 200, 300].map((val) => (
            <option key={val} value={val}>
              {val}
            </option>
          ))}
        </select>
        <span className="ms-1 text-muted">entries</span>
      </div>

      <div className="text-muted small">
        Total Records: <strong>{totalRows}</strong>
      </div>
    </div>
  );

  /* =======================
     PROFESSIONAL TABLE STYLES
  ======================= */
  const tableStyles = {
    header: {
      style: {
        minHeight: "56px",
        fontWeight: "bold",
        fontSize: "14px",
        background: "linear-gradient(to right, #0d6efd, #6610f2)",
        color: "white",
      },
    },
    rows: {
      style: {
        minHeight: "50px",
        "&:hover": {
          backgroundColor: "#f0f8ff",
        },
      },
    },
    headCells: {
      style: {
        fontWeight: "600",
        fontSize: "14px",
        color: "white",
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
      },
    },
  };

  return (
    <>
      <TopControl />

      <DataTable
        columns={columns}
        data={data}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={handlePageChange}
        paginationComponent={() => (
          <BootstrapPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
        customStyles={{ ...tableStyles, ...customStyles }}
        highlightOnHover
        responsive
        striped
      />
    </>
  );
};

/* =======================
   PROP TYPES
======================= */
CustomDataTable.propTypes = {
  columns: PropTypes.array.isRequired,
  fetchFunction: PropTypes.func.isRequired,
  defaultPerPage: PropTypes.number,
  searchValue: PropTypes.string,
  customStyles: PropTypes.object,
};

export default CustomDataTable;
