"use client";

import CrudPage from "@/components/admin/CrudPage";
import { templatesConfig } from "@/components/admin/configs";

export default function Page() {
  return <CrudPage config={templatesConfig} />;
}