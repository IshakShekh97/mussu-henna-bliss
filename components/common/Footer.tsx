import React from "react";
import Link from "next/link";
import { Mail, Phone, BadgeX, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Booking", href: "/book" },
    { label: "Gallery", href: "/gallery" },
  ];

  const quickLinks = [
    { label: "About Us", href: "#" },
    { label: "Services", href: "#" },
    { label: "Portfolio", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const socialLinks = [
    {
      icon: BadgeX,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-pink-300",
    },
    {
      icon: BadgeX,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-blue-300",
    },
    {
      icon: BadgeX,
      href: "https://twitter.com",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
  ];

  return (
    <footer className="relative mt-20 bg-[#520000]  text-primary-foreground">
      {/* Decorative top element */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="flex flex-col space-y-4">
            <div className="text-2xl sm:text-3xl font-serif font-bold flex items-center gap-2">
              <span className="text-white">{"Mussu's"}</span>
              <span className="text-primary-foreground">Henna Bliss</span>
            </div>
            <p className="text-sm sm:text-base text-primary-foreground/80 leading-relaxed">
              Crafting beautiful henna designs with passion and precision. Every
              design tells a story.
            </p>
            <div className="flex items-center gap-1 text-sm text-primary-foreground/70">
              <Heart className="w-4 h-4 fill-current" />
              <span>Made with love for art</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold font-serif text-white">
              Navigation
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold font-serif text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-semibold font-serif text-white">
              Get in Touch
            </h3>
            <div className="space-y-3">
              {/* Email */}
              <a
                href="mailto:contact@mussuhennabliss.com"
                className="flex items-start gap-3 text-primary-foreground/80 hover:text-white transition-colors duration-200 text-sm sm:text-base group"
              >
                <Mail className="w-5 h-5 mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span className="break-all">contact@mussuhennabliss.com</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/1234567890"
                className="flex items-start gap-3 text-primary-foreground/80 hover:text-white transition-colors duration-200 text-sm sm:text-base group"
              >
                <Phone className="w-5 h-5 mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span>+1 (234) 567-8900</span>
              </a>

              {/* Social Icons */}
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 text-primary-foreground transition-all duration-200 hover:bg-white/20 ${social.color}`}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-transparent via-white/20 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Copyright */}
          <p className="text-xs sm:text-sm text-primary-foreground/70 text-center sm:text-left">
            © {currentYear} {"Mussu's"} Henna Bliss. All rights reserved.
            Crafted with passion.
          </p>

          {/* Admin Login - Subtle Bottom Corner */}
          <Link
            href="/admin"
            className="relative text-xs sm:text-sm text-primary-foreground/50 hover:text-primary-foreground/80 transition-colors duration-200 underline underline-offset-2 group"
          >
            Admin
            <span className="absolute -inset-2 bg-white/0 group-hover:bg-white/5 rounded transition-colors duration-200" />
          </Link>
        </div>
      </div>

      {/* Decorative bottom linear */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/10 to-transparent" />
    </footer>
  );
};

export default Footer;
