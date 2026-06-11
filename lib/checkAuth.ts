import { auth } from "@/lib/auth";
import { headers } from "next/headers";
export const checkAuth = async () => {
  "use server";
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("unauthorised");
  }
};
