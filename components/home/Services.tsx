"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Users, Camera } from "lucide-react";
import { motion } from "framer-motion";
import {
  FadeIn,
  SectionHeader,
  MagneticButton,
  StaggerContainer,
  staggerItemScaleVariants,
} from "@/components/animations";

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

const cardRevealVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const Services = () => {
  return (
    <section className="w-full py-10">
      {/* Animated Section Header */}
      <SectionHeader
        badge="✨ Premium Services"
        title="High-Ticket Artistry"
        highlightedWord="Artistry"
        description="Elevate your moments with our exclusive, bespoke henna experiences."
      />

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-12">
        {/* Large Card - Bridal Mehndi */}
        <motion.div
          custom={0}
          variants={cardRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="group relative md:col-span-2 lg:col-span-2 lg:row-span-2 overflow-hidden cursor-pointer transition-shadow duration-500 ease-out hover:shadow-2xl min-h-96 md:min-h-full rounded-3xl"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={services[0].image}
              alt={services[0].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-7 sm:p-8 md:p-10">
            {/* Icon */}
            <div className="mb-4 inline-block p-3 bg-primary/20 backdrop-blur-sm rounded-full w-fit transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30">
              <Sparkles className="w-7 h-7 sm:w-8 sm:h-8 text-primary transition-transform duration-500 group-hover:rotate-12" />
            </div>

            {/* Title */}
            <h3 className="font-morlana text-3xl sm:text-4xl md:text-5xl font-light text-white mb-3">
              {services[0].title}
            </h3>

            {/* Description */}
            <p className="text-white/90 text-sm sm:text-base md:text-lg font-light mb-5 md:mb-6 max-w-md leading-relaxed">
              {services[0].description}
            </p>

            {/* Features — stagger on view */}
            <StaggerContainer
              staggerDelay={0.08}
              className="flex flex-wrap gap-2 mb-5 md:mb-6"
            >
              {services[0].features.map((feature, idx) => (
                <motion.span
                  key={idx}
                  variants={staggerItemScaleVariants}
                  className="px-3 py-1 bg-primary/30 backdrop-blur-sm text-white text-xs sm:text-sm rounded-full font-light border border-primary/20"
                >
                  {feature}
                </motion.span>
              ))}
            </StaggerContainer>

            {/* CTA Button */}
            <MagneticButton className="w-full md:w-fit">
              <Button
                className="w-full md:w-fit rounded-full px-8 py-3 bg-primary hover:bg-primary/90 text-white font-light transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
                asChild
              >
                <Link href="/book">Request a Quote</Link>
              </Button>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Small Card 1 - Party Mehndi */}
        <motion.div
          custom={1}
          variants={cardRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1 min-h-72"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={services[1].image}
              alt={services[1].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-5 sm:p-6">
            {/* Icon */}
            <div className="mb-3 inline-block p-2 bg-primary/20 backdrop-blur-sm rounded-full w-fit transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30">
              <Users className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-500 group-hover:rotate-12" />
            </div>

            {/* Title */}
            <h3 className="font-morlana text-xl sm:text-2xl md:text-3xl font-light text-white mb-2">
              {services[1].title}
            </h3>

            {/* Description */}
            <p className="text-white/85 text-xs sm:text-sm md:text-base font-light mb-4 leading-relaxed">
              {services[1].description}
            </p>

            {/* CTA Button */}
            <Button
              variant="outline"
              className="w-full rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 border-white/30 text-white font-light transition-all duration-300 hover:scale-[1.02]"
              asChild
            >
              <Link href="/book">View Availability</Link>
            </Button>
          </div>
        </motion.div>

        {/* Small Card 2 - Photoshoot */}
        <motion.div
          custom={2}
          variants={cardRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="group relative overflow-hidden rounded-3xl cursor-pointer md:col-span-2 lg:col-span-1 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1 min-h-72"
        >
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <Image
              src={services[2].image}
              alt={services[2].title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-end p-5 sm:p-6">
            {/* Icon */}
            <div className="mb-3 inline-block p-2 bg-primary/20 backdrop-blur-sm rounded-full w-fit transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/30">
              <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-primary transition-transform duration-500 group-hover:rotate-12" />
            </div>

            {/* Title */}
            <h3 className="font-morlana text-xl sm:text-2xl md:text-3xl font-light text-white mb-2">
              {services[2].title}
            </h3>

            {/* Description */}
            <p className="text-white/85 text-xs sm:text-sm md:text-base font-light mb-4 leading-relaxed">
              {services[2].description}
            </p>

            {/* CTA Button */}
            <Button
              variant="outline"
              className="w-full rounded-full px-4 py-2 bg-white/10 hover:bg-white/20 border-white/30 text-white font-light transition-all duration-300 hover:scale-[1.02]"
              asChild
            >
              <Link href="/book">Inquire Now</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
