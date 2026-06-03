"use client";

import { cn } from "@/lib/utils";
import {
  ClipboardClockIcon,
  HomeIcon,
  MenuIcon,
  ShoppingBagIcon,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import CartButton from "../cart/AddToCartButton";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { useState } from "react";

const LINKS = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Shop", href: "/shop", icon: ShoppingBagIcon },
  { name: "Booking", href: "/book", icon: ClipboardClockIcon },
  // { name: "Gallery", href: "/gallery", icon: HomeIcon },
  { name: "Track Order", href: "/status", icon: Search },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "w-full fixed top-0 left-0 z-50 transition-all duration-500",
        )}
      >
        <div className="mx-auto flex h-18 sm:h-20 max-w-360 items-center justify-between px-3 py-2 sm:px-4 md:px-6">
          {/* Logo */}
          <Link
            href={"/"}
            className={cn(
              "flex items-center gap-2 text-base md:text-lg font-semibold font-serif h-11 sm:h-12 px-4 sm:px-5 rounded-full transition-all duration-300",
              scrolled
                ? "bg-background/60 backdrop-blur-md border border-border/40 shadow-sm"
                : "bg-background/40 backdrop-blur-md border border-black/15",
            )}
          >
            <motion.span
              className="text-primary"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              {"Mussu's"}
            </motion.span>
            <span className="hidden min-[400px]:inline">Henna Bliss</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={cn(
              "items-center justify-center gap-1.5 text-base font-medium hidden md:flex rounded-full h-12 sm:h-14 px-2 transition-all duration-300",
              scrolled
                ? "bg-background/60 backdrop-blur-md border border-border/40 shadow-sm"
                : "bg-background/10 backdrop-blur-md border border-black/15",
            )}
          >
            {LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                    isActive
                      ? "text-primary-foreground"
                      : "text-foreground/80 hover:text-foreground hover:bg-foreground/5",
                  )}
                >
                  {/* Active pill background */}
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-primary rounded-full"
                      style={{ zIndex: -1 }}
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                      layout="position"
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side — Cart + Mobile menu toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <CartButton />

            {/* Mobile hamburger */}
            <motion.button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 md:hidden",
                scrolled
                  ? "bg-background/60 backdrop-blur-md border border-border/40 shadow-sm"
                  : "bg-background/20 backdrop-blur-md border border-black/15",
              )}
              whileTap={{ scale: 0.9 }}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MenuIcon className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile slide-down menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed top-18 sm:top-20 left-0 right-0 z-40 overflow-hidden md:hidden"
          >
            <motion.nav
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-background/95 backdrop-blur-xl border-b border-border/40 shadow-lg px-4 pb-4 pt-2"
            >
              <div className="flex flex-col gap-1">
                {LINKS.map((link, index) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: index * 0.06,
                        duration: 0.3,
                        ease: [0.25, 0.46, 0.45, 0.94],
                      }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all duration-300",
                          isActive
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : "text-foreground/80 hover:bg-foreground/5 hover:text-foreground border border-transparent",
                        )}
                      >
                        <Icon
                          className={cn(
                            "h-4.5 w-4.5 transition-colors duration-300",
                            isActive ? "text-primary" : "text-foreground/50",
                          )}
                        />
                        {link.name}

                        {/* Active indicator dot */}
                        {isActive && (
                          <motion.div
                            layoutId="mobile-active-dot"
                            className="ml-auto w-2 h-2 rounded-full bg-primary"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
