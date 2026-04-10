"use client";

import { Suspense } from "react";
import OrderConfirm from "./OrderConfirm";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirm />
    </Suspense>
  );
}

