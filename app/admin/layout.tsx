import { checkAuth } from "@/lib/checkAuth";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  await checkAuth();
  return <div>{children}</div>;
};

export default AdminLayout;
