import TulipSeprator from "@/components/common/TulipSeprator";
import ProductGrid from "@/components/shop/ProductGrid";
import React from "react";
import { Leaf, Clock, Droplet, Truck, Snowflake, Sun } from "lucide-react";

const Shoppage = () => {
  return (
    <main className="w-full mx-auto pb-16">
      <div className=" text-center max-w-3xl mx-auto">
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
      <TulipSeprator variant="wavy" className="my-10" />
      <ProductGrid />

      {/* Trust Badges Section */}
      <section className="mt-16 py-10 px-6 bg-[#FDFBF7] rounded-2xl border border-[#EBE4DC] shadow-sm relative overflow-hidden">
        {/* Decorative Inner Border */}
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC] rounded-xl pointer-events-none z-0" />

        {/* Vintage Corner Flourishes */}
        <div className="absolute top-1.5 left-1.5 text-[#D4C3B3] z-10 bg-[#FDFBF7] rounded-full p-0.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute top-1.5 right-1.5 text-[#D4C3B3] z-10 bg-[#FDFBF7] rounded-full p-0.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute bottom-1.5 left-1.5 text-[#D4C3B3] z-10 bg-[#FDFBF7] rounded-full p-0.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute bottom-1.5 right-1.5 text-[#D4C3B3] z-10 bg-[#FDFBF7] rounded-full p-0.5 pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
          {/* Badge 1 */}
          <div className="flex flex-col items-center text-center gap-3 px-4 group">
            <div className="p-3.5 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-gray-800 text-base md:text-lg font-medium">
                100% Natural & PPD-Free
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 font-light leading-relaxed max-w-60 mx-auto">
                No chemicals or synthetic dyes. Pure, organic henna safe for all
                skin types.
              </p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex flex-col items-center text-center gap-3 px-4 group border-y border-[#EBE4DC]/60 py-6 md:py-0 md:border-y-0 md:border-x md:border-[#EBE4DC]">
            <div className="p-3.5 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-gray-800 text-base md:text-lg font-medium">
                Freshly Made to Order
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 font-light leading-relaxed max-w-60 mx-auto">
                Cones are prepared in fresh batches to ensure ultimate
                consistency and stain intensity.
              </p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex flex-col items-center text-center gap-3 px-4 group">
            <div className="p-3.5 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-gray-800 text-base md:text-lg font-medium">
                Buttery Smooth Flow
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 font-light leading-relaxed max-w-60 mx-auto">
                Double-filtered paste for a smooth, clog-free, and effortless
                design flow.
              </p>
            </div>
          </div>
        </div>
      </section>

      <TulipSeprator variant="wavy" className="my-14" />

      {/* "How It Works" / "A Note on Freshness" Section */}
      <section className="space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-lg font-light mb-3 font-serif">
            ✨ Storage & Care
          </div>
          <h2 className="text-4xl md:text-5xl font-morlana font-light leading-tight">
            A Note on <span className="text-primary font-black">Freshness</span>
          </h2>
          <p className="text-muted-foreground font-light mt-3 text-sm md:text-base leading-relaxed">
            Because our henna contains zero chemical preservatives, it is highly
            perishable. Follow these simple steps to ensure perfect application
            and stain quality.
          </p>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Shipping */}
          <div className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-lg pointer-events-none z-0" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-5 inline-block p-3.5 bg-primary/10 rounded-xl text-primary transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 self-start">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-morlana font-light mb-3 text-gray-800">
                1. Shipping Info
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                We dispatch orders every{" "}
                <span className="text-primary font-semibold">
                  Monday & Tuesday
                </span>{" "}
                to ensure your cones {"don't"} sit in transit over the weekend,
                arriving as fresh as possible.
              </p>
            </div>
          </div>

          {/* Storage */}
          <div className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-lg pointer-events-none z-0" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-5 inline-block p-3.5 bg-primary/10 rounded-xl text-primary transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 self-start">
                <Snowflake className="w-6 h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-morlana font-light mb-3 text-gray-800">
                2. Storage Guidelines
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                Because our cones contain zero preservatives,{" "}
                <span className="text-primary font-semibold">
                  freeze them immediately
                </span>{" "}
                upon arrival. They can be stored in the freezer for up to 6
                months.
              </p>
            </div>
          </div>

          {/* Thawing */}
          <div className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-lg pointer-events-none z-0" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-5 inline-block p-3.5 bg-primary/10 rounded-xl text-primary transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 self-start">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg md:text-xl font-morlana font-light mb-3 text-gray-800">
                3. Thawing & Preparation
              </h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                When you are ready to design, simply leave the cone at room
                temperature for{" "}
                <span className="text-primary font-semibold">20 minutes</span>{" "}
                before use. Gently roll the cone between your palms to mix.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shoppage;
