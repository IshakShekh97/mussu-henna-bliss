import TulipSeprator from "@/components/common/TulipSeprator";
import ProductGrid from "@/components/shop/ProductGrid";
import ShopSkeleton from "@/components/shop/ShopSkeleton";
import React, { Suspense } from "react";
import { Leaf, Clock, Droplet, Truck, Snowflake, Sun } from "lucide-react";
import { SectionHeader, FadeIn, StaggerContainer } from "@/components/animations";

const trustBadges = [
  {
    icon: Leaf,
    title: "100% Natural & PPD-Free",
    description:
      "No chemicals or synthetic dyes. Pure, organic henna safe for all skin types.",
  },
  {
    icon: Clock,
    title: "Freshly Made to Order",
    description:
      "Cones are prepared in fresh batches to ensure ultimate consistency and stain intensity.",
    hasBorder: true,
  },
  {
    icon: Droplet,
    title: "Buttery Smooth Flow",
    description:
      "Double-filtered paste for a smooth, clog-free, and effortless design flow.",
  },
];

const careCards = [
  {
    icon: Truck,
    title: "1. Shipping Info",
    description: (
      <>
        We dispatch orders every{" "}
        <span className="text-primary font-semibold">Monday & Tuesday</span> to
        ensure your cones {"don't"} sit in transit over the weekend, arriving as
        fresh as possible.
      </>
    ),
  },
  {
    icon: Snowflake,
    title: "2. Storage Guidelines",
    description: (
      <>
        Because our cones contain zero preservatives,{" "}
        <span className="text-primary font-semibold">
          freeze them immediately
        </span>{" "}
        upon arrival. They can be stored in the freezer for up to 6 months.
      </>
    ),
  },
  {
    icon: Sun,
    title: "3. Thawing & Preparation",
    description: (
      <>
        When you are ready to design, simply leave the cone at room temperature
        for <span className="text-primary font-semibold">20 minutes</span>{" "}
        before use. Gently roll the cone between your palms to mix.
      </>
    ),
  },
];

const Shoppage = () => {
  return (
    <main className="w-full mx-auto pb-16">
      {/* Animated Section Header */}
      <SectionHeader
        badge="✨ Premium Henna Products"
        title="Shop Quality Henna"
        highlightedWord="Quality"
        description="Explore handcrafted, professional-grade henna products made with natural ingredients for long-lasting, vibrant results. Buy with confidence and bring Mussu's artistry home."
      />

      <TulipSeprator variant="wavy" className="my-10" />
      
      <Suspense fallback={<ShopSkeleton />}>
        <ProductGrid />
      </Suspense>

      {/* Trust Badges Section */}
      <FadeIn direction="up" delay={0.1}>
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
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center text-center gap-3 px-4 group ${
                    badge.hasBorder
                      ? "border-y border-[#EBE4DC]/60 py-6 md:py-0 md:border-y-0 md:border-x md:border-[#EBE4DC]"
                      : ""
                  }`}
                >
                  <div className="p-3.5 rounded-full bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-gray-800 text-base md:text-lg font-medium">
                      {badge.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1.5 font-light leading-relaxed max-w-60 mx-auto">
                      {badge.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </FadeIn>

      <TulipSeprator variant="wavy" className="my-14" />

      {/* Storage & Care Section */}
      <section className="space-y-10">
        <SectionHeader
          badge="✨ Storage & Care"
          title="A Note on Freshness"
          highlightedWord="Freshness"
          description="Because our henna contains zero chemical preservatives, it is highly perishable. Follow these simple steps to ensure perfect application and stain quality."
        />

        {/* Info Cards Grid */}
        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {careCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <FadeIn key={index} direction="up" delay={index * 0.1}>
                <div className="group relative overflow-hidden rounded-2xl p-6 md:p-8 bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                  <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-lg pointer-events-none z-0" />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-5 inline-block p-3.5 bg-primary/10 rounded-xl text-primary transition-all duration-500 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-6 self-start">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg md:text-xl font-morlana font-light mb-3 text-gray-800">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </StaggerContainer>
      </section>
    </main>
  );
};

export default Shoppage;
