import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import React from "react";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="sm:px-4 md:px-5 lg:px-6 xl:px-7 px-3 w-full mx-auto">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default HomeLayout;
