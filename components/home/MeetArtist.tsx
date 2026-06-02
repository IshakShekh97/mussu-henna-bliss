"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FadeIn,
  SectionHeader,
  AnimatedCounter,
  MagneticButton,
  StaggerContainer,
  staggerItemVariants,
  staggerItemSlideVariants,
} from "@/components/animations";

const processSteps = [
  {
    icon: Calendar,
    title: "Select Your Date",
    description: "Browse available dates and choose what works best for you.",
    color: "from-primary/20 to-primary/10",
  },
  {
    icon: MessageCircle,
    title: "Receive Custom Quote",
    description:
      "We'll send you a personalized quote via WhatsApp with details.",
    color: "from-amber-500/20 to-amber-400/10",
  },
  {
    icon: CheckCircle2,
    title: "Confirm & Book",
    description: "Approve your quote and secure your booking instantly.",
    color: "from-emerald-500/20 to-emerald-400/10",
  },
];

const values = [
  "Bespoke designs tailored to your vision",
  "Premium henna using natural, safe ingredients",
  "Meticulous attention to every detail",
  "Professional finish that lasts 2+ weeks",
];

const imageRevealVariants = {
  hidden: { clipPath: "circle(0% at 50% 50%)", opacity: 0 },
  visible: {
    clipPath: "circle(75% at 50% 50%)",
    opacity: 1,
    transition: {
      clipPath: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
      opacity: { duration: 0.3 },
    },
  },
};

const MeetArtist = () => {
  return (
    <section className="w-full py-16 md:py-20">
      {/* Animated Section Header */}
      <SectionHeader
        badge="✨ The Artist Behind the Art"
        title="Meet Mussu"
        highlightedWord="Mussu"
        description="A master of intricate henna artistry with years of expertise crafting unforgettable moments."
      />

      {/* Main Content - Asymmetrical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 items-center">
        {/* Left Side - Artist Image with clip-path reveal */}
        <motion.div
          variants={imageRevealVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="relative h-80 sm:h-96 md:h-125 lg:h-150 rounded-3xl overflow-hidden group"
        >
          {/* Image Container */}
          <div className="absolute inset-0">
            <Image
              src="/images/hero-1.jpg"
              alt="Artist at work"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Sophisticated Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-primary/20" />
          </div>

          {/* Floating Experience Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1, duration: 0.5, ease: "backOut" }}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 sm:px-6 sm:py-4 shadow-lg animate-float"
          >
            <div className="text-2xl sm:text-3xl font-morlana font-black text-primary">
              <AnimatedCounter target={15} suffix="+" />
            </div>
            <div className="text-[10px] sm:text-xs font-light text-gray-700 mt-0.5 sm:mt-1">
              Years of Artistry
            </div>
          </motion.div>

          {/* Bottom Info Card */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 sm:h-8 bg-primary rounded-full" />
              <h3 className="text-white text-base sm:text-lg font-light">
                Premium Artist
              </h3>
            </div>
            <p className="text-white/80 text-xs sm:text-sm font-light">
              Certified & Recognized
            </p>
          </div>
        </motion.div>

        {/* Right Side - Bio & Details */}
        <div className="space-y-7 sm:space-y-8">
          {/* Bio Section */}
          <div className="space-y-5 sm:space-y-6">
            <FadeIn direction="right" delay={0.2}>
              <div>
                <h3 className="text-sm font-serif uppercase tracking-widest text-primary mb-2">
                  About Mussu
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-foreground font-light leading-relaxed">
                  Mussu is a master henna artist with over 15 years of
                  experience in creating breathtaking, intricate designs. Each
                  piece is a celebration of tradition, artistry, and personal
                  connection to the client.
                </p>
              </div>
            </FadeIn>

            {/* Expertise Highlights — animated counters */}
            <FadeIn direction="up" delay={0.3}>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3 sm:p-4 bg-primary/10 rounded-2xl border border-primary/20 transition-all duration-500 hover:bg-primary/15 hover:scale-[1.02]">
                  <div className="text-xl sm:text-2xl font-morlana font-black text-primary mb-0.5 sm:mb-1">
                    <AnimatedCounter target={500} suffix="+" />
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-light">
                    Happy Clients
                  </div>
                </div>
                <div className="p-3 sm:p-4 bg-primary/10 rounded-2xl border border-primary/20 transition-all duration-500 hover:bg-primary/15 hover:scale-[1.02]">
                  <div className="text-xl sm:text-2xl font-morlana font-black text-primary mb-0.5 sm:mb-1">
                    <AnimatedCounter target={100} suffix="%" />
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-light">
                    Custom Designs
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Values Section — stagger from left */}
          <div className="space-y-3 sm:space-y-4">
            <FadeIn direction="right" delay={0.1}>
              <h3 className="text-sm font-serif uppercase tracking-widest text-primary">
                What Sets Us Apart
              </h3>
            </FadeIn>
            <StaggerContainer
              staggerDelay={0.1}
              delay={0.3}
              className="space-y-2.5 sm:space-y-3"
            >
              {values.map((value, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItemSlideVariants("left")}
                  className="flex items-start gap-2.5 sm:gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-xs sm:text-sm text-foreground font-light">
                    {value}
                  </span>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </div>

      {/* Process Flow Section */}
      <div className="mt-16 md:mt-20 space-y-10 md:space-y-12">
        {/* Process Header */}
        <SectionHeader
          badge="✨ How It Works"
          title="No Complicated Hassles"
          highlightedWord="Hassles"
          description="We've made booking as simple and smooth as possible. Just three easy steps."
          className="mb-10 md:mb-12"
        />

        {/* Process Cards - Stagger Grid */}
        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        >
          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                variants={staggerItemVariants}
                className="group relative overflow-hidden rounded-3xl p-6 sm:p-8 md:p-10 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${step.color}`}
                />

                {/* Border Effect */}
                <div className="absolute inset-0 rounded-3xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Number Badge */}
                <div className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-primary font-black text-base sm:text-lg">
                  {idx + 1}
                </div>

                {/* Icon */}
                <div className="mb-5 sm:mb-6 inline-block p-3 sm:p-4 bg-white/10 backdrop-blur-sm rounded-2xl transition-all duration-500 group-hover:bg-white/20 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                </div>

                {/* Content */}
                <div className="relative space-y-3 sm:space-y-4">
                  <h4 className="text-lg sm:text-xl md:text-2xl font-morlana font-light">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm md:text-base text-foreground/80 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line (hidden on last and mobile) */}
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 w-6 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </StaggerContainer>
      </div>

      {/* CTA Section */}
      <FadeIn direction="up" delay={0.2}>
        <div className="mt-14 md:mt-16 bg-gradient-to-r from-primary/15 to-primary/5 rounded-3xl p-6 sm:p-8 md:p-12 text-center border border-primary/30 relative overflow-hidden">
          {/* Animated gradient border effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-transparent to-primary/20 animate-gradient-rotate opacity-50" />

          <div className="relative z-10">
            <h3 className="font-morlana text-2xl sm:text-3xl md:text-4xl font-light mb-3 sm:mb-4">
              Ready for Your{" "}
              <span className="text-primary font-black">Henna Experience</span>
              ?
            </h3>
            <p className="text-muted-foreground font-light text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              No complicated forms. No waiting. Just select your date and{" "}
              {"we'll"} handle the rest via WhatsApp.
            </p>
            <MagneticButton className="inline-block">
              <Button
                className="rounded-full px-8 py-3 text-sm sm:text-base transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.03] active:scale-[0.97]"
                asChild
              >
                <Link href="/book">Start Booking Now</Link>
              </Button>
            </MagneticButton>
          </div>
        </div>
      </FadeIn>
    </section>
  );
};

export default MeetArtist;
