import React from "react";
import TulipSeprator from "../common/TulipSeprator";

const Welcome = () => {
  return (
    <div className="w-full py-5">
      <div className="flex flex-col gap-6 items-center justify-center mb-10 sm:flex-row sm:gap-0 sm:justify-around">
        <div className="flex flex-col items-center gap-2 text-center text-lg sm:flex-row sm:text-left sm:items-start sm:gap-5">
          <span className="font-morlana text-primary text-5xl sm:text-6xl">
            1.
          </span>
          <span className="font-serif leading-tight">
            View my <br />
            Gallery
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center text-lg sm:flex-row sm:text-left sm:items-start sm:gap-5">
          <span className="font-morlana text-primary text-5xl sm:text-6xl">
            2.
          </span>
          <span className="font-serif leading-tight">
            Explore my <br /> Services & Products
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 text-center text-lg sm:flex-row sm:text-left sm:items-start sm:gap-5">
          <span className="font-morlana text-primary text-5xl sm:text-6xl">
            3.
          </span>
          <span className="font-serif leading-tight">
            Book Your <br /> Appointment
          </span>
        </div>
      </div>

      <TulipSeprator />
      <div className="mx-auto flex flex-col items-center justify-center gap-2 rounded-md  bg-white/5 px-4 py-4 text-center text-sm sm:flex-row sm:gap-2 sm:px-6 sm:py-3 sm:text-base md:text-lg">
        <span>Welcome to</span>
        <span className="text-primary font-bold">Mussu Henna Bliss</span>
        <span>- Where Art Meets Tradition!</span>
      </div>
      <TulipSeprator />
    </div>
  );
};

export default Welcome;
