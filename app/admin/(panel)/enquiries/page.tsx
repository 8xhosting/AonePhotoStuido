"use client";

import CrudPage from "@/components/admin/CrudPage";
import { enquiriesConfig } from "@/components/admin/configs";

export default function Page() {
  return <CrudPage config={enquiriesConfig} />;
}