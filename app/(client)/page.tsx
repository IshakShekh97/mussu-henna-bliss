import Gallary from "@/components/home/Gallary";
import Hero from "@/components/home/Hero";
import Welcome from "@/components/home/Welcome";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <Hero />
      <Welcome />
      <Gallary />
    </div>
  );
};

export default HomePage;
