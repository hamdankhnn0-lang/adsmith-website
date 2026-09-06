import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/rbac";

export default async function Home() {
  const user = await getCurrentUser();
  redirect(user ? "/dashboard" : "/login");
}
