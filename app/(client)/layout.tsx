import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="max-w-380 w-full mx-auto  py-20 px-4 md:px-8 lg:px-16 ">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default HomeLayout;
