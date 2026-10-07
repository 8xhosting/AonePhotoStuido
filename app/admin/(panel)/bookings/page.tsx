"use client";

import CrudPage from "@/components/admin/CrudPage";
import { bookingsConfig } from "@/components/admin/configs";

export default function Page() {
  return <CrudPage config={bookingsConfig} />;
}