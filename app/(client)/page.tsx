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
    <div className="relative overflow-hidden">
      {/* Decorative henna-inspired background ornament — very subtle */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b8860b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content — stacked with z-10 to sit above ornament */}
      <div className="relative z-10">
        <Hero />
        <TrustBanner />
        <ShoppableProducts />
        <Welcome />
        <Gallary />
        <Services />
        <TulipSeprator variant="wavy" />
        <MeetArtist />
        <TulipSeprator variant="wavy" />
      </div>
    </div>
  );
};

export default HomePage;
