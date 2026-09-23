// app/components/ClientNavbar.js
"use client"; // Must be top

import Link from "next/link";

export default function AdminFooter() {
  return (
      <footer className="app-footer">
  {/*begin::To the end*/}
  <div className="float-end d-none d-sm-inline"></div>
  {/*end::To the end*/}

  {/*begin::Copyright*/}
  <strong>
    Copyright © {new Date().getFullYear()}&nbsp;
    <a
      href="https://usaskillsinc.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="text-decoration-none"
    >
      USASKILLSINC
    </a>.
  </strong>&nbsp;
  All rights reserved.
  {/*end::Copyright*/}
</footer>

  );
}
