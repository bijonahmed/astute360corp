"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaySlipView from "../[id]/PaySlipView";

function PaySlipViewInner() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  return <PaySlipView id={id} />;
}

export default function PaySlipViewPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 13.5,
            fontWeight: 600,
            color: "#9ca3af",
          }}
        >
          Loading...
        </div>
      }
    >
      <PaySlipViewInner />
    </Suspense>
  );
}
