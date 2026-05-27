"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, Camera } from "lucide-react";

const Services = () => {
  const services = [
    {
      id: 1,
      title: "Bridal Mehndi",
      description:
        "The most intricate & elaborate designs for your special day. Celebrate your wedding with stunning, custom henna artwork.",
      icon: Sparkles,
      category: "bridal",
      image: "/images/hero-1.jpg",
      isLarge: true,
      features: ["Custom Designs", "Premium Application", "Long-lasting"],
    },
    {
      id: 2,
      title: "Guest & Party Mehndi",
      description:
        "Perfect for celebrations. Quick, beautiful designs for your guests.",
      icon: Users,
      category: "party",
      image: "/images/hero-2.jpg",
      isLarge: false,
      features: ["Group Packages", "Quick Service", "Festive Designs"],
    },
    {
      id: 3,
      title: "Photoshoot Henna",
      description:
        "Specially designed for professional shoots & portfolio builds.",
      icon: Camera,
      category: "photoshoot",
      image: "/images/hero-3.jpg",
      isLarge: false,
      features: ["Bold Designs", "Photo-Ready", "Professional"],
    },
  ];

  return (
    <section className="w-full py-10">
      {/* Section Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <div className="text-lg font-light mb-4 font-serif">
          ✨ Premium Services
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-morlana font-light mb-4 leading-tight">
          High-Ticket <span className="text-primary font-black">Artistry</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground font-light">
          Elevate your moments with our exclusive, bespoke henna experiences.
        </p>
      </div>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {/* Large Card - Bridal Mehndi */}
        <div className="group relative md:col-span-2 lg:col-span-2 lg:row-span-2 overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl min-h-96 md:min-h-full rounded-3xl">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={services[0].image}
              alt={services[0].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-8 md:p-10">
            {/* Icon */}
            <div className="mb-4 inline-block p-3 bg-primary/20 backdrop-blur-sm rounded-full w-fit">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>

            {/* Title */}
            <h3 className="font-morlana text-4xl md:text-5xl font-light text-white mb-3">
              {services[0].title}
            </h3>

            {/* Description */}
            <p className="text-white/90 text-base md:text-lg font-light mb-6 max-w-md leading-relaxed">
              {services[0].description}
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-6">
              {services[0].features.map((feature, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-primary/30 backdrop-blur-sm text-white text-sm rounded-full font-light"
                >
                  {feature}
                </span>
              ))}
            </div>

            {/* CTA Button */}
            <Button
              className="w-full md:w-fit rounded-full px-8 py-3 bg-primary hover:bg-primary/90 text-white font-light"
              asChild
            >
              <Link href="/book">Request a Quote</Link>
            </Button>
          </div>
        </div>

        {/* Small Card 1 - Party Mehndi */}
        <div className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl min-h-72">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={services[1].image}
              alt={services[1].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 25vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/50 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-6">
            {/* Icon */}
            <div className="mb-3 inline-block p-2 bg-primary/20 backdrop-blur-sm rounded-full w-fit">
              <Users className="w-6 h-6 text-primary" />
            </div>

            {/* Title */}
            <h3 className="font-morlana text-2xl md:text-3xl font-light text-white mb-2">
              {services[1].title}
            </h3>

            {/* Description */}
            <p className="text-white/85 text-sm md:text-base font-light mb-4 leading-relaxed">
              {services[1].description}
            </p>

            {/* CTA Button */}
            <Button
              variant="outline"
              className="w-full rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 border-white/30 text-white font-light"
              asChild
            >
              <Link href="/book">View Availability</Link>
            </Button>
          </div>
        </div>

        {/* Small Card 2 - Photoshoot */}
        <div className="group relative overflow-hidden rounded-3xl cursor-pointer md:col-span-2 lg:col-span-1 transition-all duration-500 ease-out hover:shadow-2xl min-h-72">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={services[2].image}
              alt={services[2].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 25vw"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/50 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-6">
            {/* Icon */}
            <div className="mb-3 inline-block p-2 bg-primary/20 backdrop-blur-sm rounded-full w-fit">
              <Camera className="w-6 h-6 text-primary" />
            </div>

            {/* Title */}
            <h3 className="font-morlana text-2xl md:text-3xl font-light text-white mb-2">
              {services[2].title}
            </h3>

            {/* Description */}
            <p className="text-white/85 text-sm md:text-base font-light mb-4 leading-relaxed">
              {services[2].description}
            </p>

            {/* CTA Button */}
            <Button
              variant="outline"
              className="w-full rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 border-white/30 text-white font-light"
              asChild
            >
              <Link href="/book">Inquire Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
