import React from "react";

const Welcome = () => {
  return (
    <div className="w-full py-5 ">
      <div className="flex items-center justify-around mb-10">
        <div className="flex items-start gap-5 justify-center text-xl">
          <span className="font-morlana text-primary text-6xl">1.</span>
          <span className="font-serif ">
            View my <br />
            Gallery
          </span>
        </div>
        <div className="flex items-center gap-5 justify-center text-xl">
          <span className="font-morlana text-primary text-6xl">2.</span>
          <span className="font-serif ">
            Explore my <br /> Services & Products
          </span>
        </div>
        <div className="flex items-center gap-5 justify-center text-xl">
          <span className="font-morlana text-primary text-6xl">3.</span>
          <span className="font-serif ">
            Book Your <br /> Appointment
          </span>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-360 border-y border-primary/50 items-center justify-center px-3 py-2 sm:px-4 md:px-6">
        Welcome to{" "}
        <span className="text-primary font-bold mx-1">Mussu Henna Bliss</span> -
        Where Art Meets Tradition!
      </div>
    </div>
  );
};

export default Welcome;
