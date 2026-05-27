import ProductGrid from "@/components/shop/ProductGrid";
import React from "react";

const Shoppage = () => {
  return (
    <main className="w-full mx-auto ">
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <div className="text-lg font-light mb-4 font-serif">
          ✨ Premium Henna Products
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-morlana font-light mb-4 leading-tight">
          Shop <span className="text-primary font-black">Quality</span> Henna
        </h2>
        <p className="text-base md:text-lg text-muted-foreground font-light">
          Explore handcrafted, professional-grade henna products made with
          natural ingredients for long-lasting, vibrant results. Buy with
          confidence and bring {"Mussu's"} artistry home.
        </p>
      </div>
      <ProductGrid />
    </main>
  );
};

export default Shoppage;
