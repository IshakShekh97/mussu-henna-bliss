import Gallary from "@/components/home/Gallary";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import ShoppableProducts from "@/components/home/ShoppableProducts";
import TrustBanner from "@/components/home/TrsustBanner";
import Welcome from "@/components/home/Welcome";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <TrustBanner />
      <ShoppableProducts />
      <Welcome />
      <Gallary />
      <Services />
    </div>
  );
};

export default HomePage;
