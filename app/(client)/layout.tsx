import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-380 px-2 md:px-3 w-full mx-auto">{children}</main>
      <Footer />
    </>
  );
};

export default HomeLayout;
