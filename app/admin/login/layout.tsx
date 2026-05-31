import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const Authlayout = async ({ children }: { children: ReactNode }) => {
  "use server";
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/admin");
  }

  return <div>{children}</div>;
};

export default Authlayout;
