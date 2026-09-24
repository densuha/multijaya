"use server";

import { redirect } from "next/navigation";
import { clearAdminSession } from "@/lib/admin";

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
