import TulipSeprator from "@/components/common/TulipSeprator";
import Gallary from "@/components/home/Gallary";
import Hero from "@/components/home/Hero";
import MeetArtist from "@/components/home/MeetArtist";
import Services from "@/components/home/Services";
import ShoppableProducts from "@/components/home/ShoppableProducts";
import TrustBanner from "@/components/home/TrsustBanner";
import Welcome from "@/components/home/Welcome";

const HomePage = () => {
  return (
    <div className="">
      <div className="relative z-10">
        <Hero />
        <TrustBanner />
        <ShoppableProducts />
        <Welcome />
        <Gallary />
        <Services />
        <TulipSeprator variant="wavy" />
        <MeetArtist />
      </div>
    </div>
  );
};

export default HomePage;
