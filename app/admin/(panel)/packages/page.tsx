"use client";

import CrudPage from "@/components/admin/CrudPage";
import { packagesConfig } from "@/components/admin/configs";

export default function Page() {
  return <CrudPage config={packagesConfig} />;
}