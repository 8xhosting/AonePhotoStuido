"use client";

import CrudPage from "@/components/admin/CrudPage";
import { servicesConfig } from "@/components/admin/configs";

export default function Page() {
  return <CrudPage config={servicesConfig} />;
}