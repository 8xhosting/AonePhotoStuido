"use client";

import CrudPage from "@/components/admin/CrudPage";
import { testimonialsConfig } from "@/components/admin/configs";

export default function Page() {
  return <CrudPage config={testimonialsConfig} />;
}