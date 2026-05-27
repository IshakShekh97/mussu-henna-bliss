"use client";

import { Leaf, Award, Heart } from "lucide-react";

const TrustBanner = () => {
  const trustItems = [
    {
      icon: Leaf,
      text: "100% Organic & Chemical-Free",
    },
    {
      icon: Award,
      text: "Rich, Dark Stain Guarantee",
    },
    {
      icon: Heart,
      text: "Expert Bridal Artist",
    },
  ];

  return (
    <div className="w-full py-16">
      <div className="flex flex-col gap-6 items-center justify-center sm:flex-row sm:gap-8 sm:justify-around">
        {trustItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={index}
              className="flex flex-col items-center gap-3 text-center sm:gap-4"
            >
              <div className="p-3 rounded-full bg-primary/10">
                <IconComponent className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <span className="text-sm sm:text-base font-medium max-w-xs leading-tight">
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustBanner;
