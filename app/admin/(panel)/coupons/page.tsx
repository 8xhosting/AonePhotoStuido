"use client";

import CrudPage from "@/components/admin/CrudPage";
import { couponsConfig } from "@/components/admin/configs";

export default function Page() {
  return <CrudPage config={couponsConfig} />;
}