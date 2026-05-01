import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const authUser = await getCurrentUser(cookieStore);

  if (!authUser) {
    redirect("/login");
  }

  if (authUser.role !== "admin") {
    redirect("/dashboard");
  }

  return children;
}
