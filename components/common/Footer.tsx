"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Heart,
  MapPin,
  Clock,
  ChevronUp,
  Send,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import TulipSeprator from "./TulipSeprator";

// Custom SVG Social Icons (to avoid missing lucide-react brand icons)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    // Simulate API subscription delay
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 1200);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Booking", href: "/book" },
    { label: "Gallery", href: "/gallery" },
    { label: "Track Order", href: "/status" },
  ];

  const serviceLinks = [
    { label: "Bridal Design", href: "/book" },
    { label: "Festive Henna", href: "/book" },
    { label: "Party Packages", href: "/book" },
    { label: "Organic Cones", href: "/shop" },
  ];

  const socialLinks = [
    {
      icon: InstagramIcon,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-[#c2624a] hover:border-[#c2624a]/40",
    },
    {
      icon: FacebookIcon,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-[#8ba2ff] hover:border-[#8ba2ff]/40",
    },
    {
      icon: TwitterIcon,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-[#7dd3fc] hover:border-[#7dd3fc]/40",
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 14,
      },
    },
  };

  return (
    <footer className="relative mt-20 overflow-hidden bg-[#241212] text-[#FAF6F0] border-t border-[#C5A880]/15">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-[#C5A880]/30 to-transparent" />

      {/* Radial glow background - shifted towards deep rich maroon burgundy */}
      <div className="absolute inset-0 bg-[radial-linear(ellipse_at_top,var(--tw-linear-stops))] from-[#3a1919] via-[#241212] to-[#1a0c0c] opacity-95 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Main Grid Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16"
        >
          {/* Brand Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-5"
          >
            <Link href="/" className="inline-block group">
              <div className="flex items-baseline gap-1.5 transition-transform duration-300 group-hover:scale-[1.02]">
                <span className="text-[#FAF6F0] font-morlana font-light text-4.5xl tracking-wide leading-none">
                  {"Mussu's"}
                </span>
                <span className="text-[#C5A880] font-serif font-bold text-base tracking-widest uppercase">
                  Henna Bliss
                </span>
              </div>
            </Link>
            <p className="text-sm text-[#FAF6F0]/75 leading-relaxed font-sans font-light">
              Bespoke, hand-crafted organic henna designs that weave tradition,
              elegance, and beauty into memories. Every pattern tells a unique
              story.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3.5 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.12, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 text-[#FAF6F0]/85 transition-colors duration-300 ${social.color}`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-4"
          >
            <h3 className="text-lg font-serif font-medium text-[#C5A880] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A880]/60" /> Explore
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="relative text-sm text-[#FAF6F0]/70 hover:text-[#C5A880] transition-colors duration-250 font-sans font-light inline-block group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C5A880] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Service Categories */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-4"
          >
            <h3 className="text-lg font-serif font-medium text-[#C5A880] flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#C5A880]/60" /> Services
            </h3>
            <ul className="space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="relative text-sm text-[#FAF6F0]/70 hover:text-[#C5A880] transition-colors duration-250 font-sans font-light inline-block group"
                  >
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C5A880] transition-all duration-300 group-hover:w-full" />
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter & Contact Details */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col space-y-5"
          >
            {/* <div className="flex flex-col space-y-3">
              <h3 className="text-lg font-serif font-medium text-[#C5A880] flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A880]/60" /> Newsletter
              </h3>
              <p className="text-xs text-[#FAF6F0]/70 leading-relaxed font-sans font-light">
                Join for design releases, bridal care guides, and exclusive
                booking openings.
              </p>

              <form onSubmit={handleSubscribe} className="relative mt-1">
                <div className="flex items-center border-b border-white/15 focus-within:border-[#C5A880]/70 transition-colors duration-300 pb-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    required
                    className="w-full bg-transparent text-sm text-[#FAF6F0] placeholder:text-[#FAF6F0]/35 focus:outline-none pr-8 py-0.5"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="absolute right-0 text-[#FAF6F0]/60 hover:text-[#C5A880] disabled:text-[#FAF6F0]/30 transition-colors duration-200 cursor-pointer"
                  >
                    {status === "loading" ? (
                      <span className="inline-block w-4 h-4 border-2 border-[#C5A880] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <AnimatePresence>
                  {status === "success" && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-[#C5A880] mt-1.5 font-serif italic"
                    >
                      Thank you! Subscribed successfully.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div> */}

            {/* Studio Hours & Address */}
            <div className="pt-2 border-t border-white/5 space-y-2">
              <div className="flex items-start gap-2.5 text-xs text-[#FAF6F0]/75">
                <MapPin className="w-4 h-4 text-[#C5A880]/60 mt-0.5 shrink-0" />
                <span>
                  Suchia , West Bengal, India
                  <br />
                  (By Appointment Only)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#FAF6F0]/75">
                <Clock className="w-4 h-4 text-[#C5A880]/60 shrink-0" />
                <span>Mon - Sat: 10 AM - 7 PM</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Custom Wavy Seprator */}
        <div className="my-8 opacity-40">
          <TulipSeprator
            variant="wavy"
            sepratorColor="rgba(250, 246, 240, 0.2)"
            tulipColor="text-[#C5A880]"
          />
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 text-xs text-[#FAF6F0]/65 font-sans font-light">
          {/* Contacts & Copyright */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <div className="flex flex-wrap justify-center sm:justify-start gap-x-5 gap-y-1">
              <a
                href={`mailto:muskanmallick153@gmail.com`}
                className="flex items-center gap-1.5 hover:text-[#C5A880] transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>muskanmallick153@gmail.com</span>
              </a>
              <a
                href="https://wa.me/916290665156"
                className="flex items-center gap-1.5 hover:text-[#C5A880] transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>+91 6290665156</span>
              </a>
            </div>
            <p className="text-center sm:text-left mt-1 text-[#FAF6F0]/50">
              © {currentYear} {"Mussu's"} Henna Bliss. All rights reserved.
              Crafted with love & art.
            </p>
          </div>

          {/* Interactive Scroll & Admin Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="hover:text-[#C5A880] transition-colors underline underline-offset-4"
            >
              Admin Panel
            </Link>

            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#C5A880]/30 text-xs text-[#FAF6F0]/80 hover:text-[#C5A880] transition-colors duration-250 cursor-pointer"
            >
              <span>Top</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Subtle border bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-linear-to-r from-transparent via-[#C5A880]/10 to-transparent" />
    </footer>
  );
};

export default Footer;
