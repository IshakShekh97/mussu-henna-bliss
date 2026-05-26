"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MeetArtist = () => {
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

  return (
    <section className="w-full py-20 px-4 md:px-8 lg:px-16 bg-linear-to-b from-transparent via-primary/5 to-transparent">
      {/* Section Header */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <div className="text-lg font-light mb-4 font-serif">
          ✨ The Artist Behind the Art
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-morlana font-light mb-4 leading-tight">
          Meet <span className="text-primary font-black">Mussu</span>
        </h2>
        <p className="text-base md:text-lg text-muted-foreground font-light">
          A master of intricate henna artistry with years of expertise crafting
          unforgettable moments.
        </p>
      </div>

      {/* Main Content - Asymmetrical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 items-center">
        {/* Left Side - Artist Image */}
        <div className="relative h-96 md:h-125 lg:h-150 rounded-3xl overflow-hidden group">
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
            <div className="absolute inset-0 bg-linear-to-tr from-black/40 via-transparent to-primary/20" />
          </div>

          {/* Floating Experience Badge */}
          <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl px-6 py-4 shadow-lg">
            <div className="text-3xl font-morlana font-black text-primary">
              15+
            </div>
            <div className="text-xs font-light text-gray-700 mt-1">
              Years of Artistry
            </div>
          </div>

          {/* Bottom Info Card */}
          <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-primary rounded-full" />
              <h3 className="text-white text-lg font-light">Premium Artist</h3>
            </div>
            <p className="text-white/80 text-sm font-light">
              Certified & Recognized
            </p>
          </div>
        </div>

        {/* Right Side - Bio & Details */}
        <div className="space-y-8">
          {/* Bio Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-serif uppercase tracking-widest text-primary mb-2">
                About Mussu
              </h3>
              <p className="text-base md:text-lg text-foreground font-light leading-relaxed">
                Mussu is a master henna artist with over 15 years of experience
                in creating breathtaking, intricate designs. Each piece is a
                celebration of tradition, artistry, and personal connection to
                the client.
              </p>
            </div>

            {/* Expertise Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <div className="text-2xl font-morlana font-black text-primary mb-1">
                  500+
                </div>
                <div className="text-xs text-muted-foreground font-light">
                  Happy Clients
                </div>
              </div>
              <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20">
                <div className="text-2xl font-morlana font-black text-primary mb-1">
                  100%
                </div>
                <div className="text-xs text-muted-foreground font-light">
                  Custom Designs
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-serif uppercase tracking-widest text-primary">
              What Sets Us Apart
            </h3>
            <div className="space-y-3">
              {[
                "Bespoke designs tailored to your vision",
                "Premium henna using natural, safe ingredients",
                "Meticulous attention to every detail",
                "Professional finish that lasts 2+ weeks",
              ].map((value, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                  <span className="text-sm text-foreground font-light">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Process Flow Section */}
      <div className="mt-20 space-y-12">
        {/* Process Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-lg font-serif mb-3">✨ How It Works</h3>
          <p className="text-4xl md:text-5xl font-morlana font-light">
            No Complicated{" "}
            <span className="text-primary font-black">Hassles</span>
          </p>
          <p className="text-muted-foreground font-light mt-4 text-base md:text-lg">
            {
              "We've made booking as simple and smooth as possible. Just three easy"
            }
            steps.
          </p>
        </div>

        {/* Process Cards - Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {processSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-3xl p-8 md:p-10 transition-all duration-500 hover:shadow-xl"
              >
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${step.color}`}
                />

                {/* Border Effect */}
                <div className="absolute inset-0 rounded-3xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Number Badge */}
                <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-primary font-black text-lg">
                  {idx + 1}
                </div>

                {/* Icon */}
                <div className="mb-6 inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl transition-all duration-500 group-hover:bg-white/20 group-hover:scale-110">
                  <Icon className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <div className="relative space-y-4">
                  <h4 className="text-xl md:text-2xl font-morlana font-light">
                    {step.title}
                  </h4>
                  <p className="text-sm md:text-base text-foreground/80 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector Line (hidden on last) */}
                {idx < processSteps.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 w-6 h-0.5 bg-linear-to-r from-primary/50 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-linear-to-r from-primary/15 to-primary/5 rounded-3xl p-8 md:p-12 text-center border border-primary/30">
        <h3 className="font-morlana text-3xl md:text-4xl font-light mb-4">
          Ready for Your{" "}
          <span className="text-primary font-black">Henna Experience</span>?
        </h3>
        <p className="text-muted-foreground font-light text-base md:text-lg mb-8 max-w-2xl mx-auto">
          No complicated forms. No waiting. Just select your date and {"we'll"}
          handle the rest via WhatsApp.
        </p>
        <Button className="rounded-full px-8 py-3 text-base" asChild>
          <Link href="/book">Start Booking Now</Link>
        </Button>
      </div>
    </section>
  );
};

export default MeetArtist;
