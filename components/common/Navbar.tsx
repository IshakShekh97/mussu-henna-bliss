"use client";

import { cn } from "@/lib/utils";
import {
  ClipboardClockIcon,
  HomeIcon,
  MenuIcon,
  ShoppingBagIcon,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LINKS = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Shop", href: "/shop", icon: ShoppingBagIcon },
  { name: "Booking", href: "/book", icon: ClipboardClockIcon },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="w-full fixed top-0 left-0 z-50  bg-background/70  backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-360 border-b border-border/50  items-center justify-between px-3 py-2 sm:px-4 md:px-6">
        <div className="flex items-center gap-2 text-xl font-semibold font-serif">
          <span className="text-primary">{"Mussu's"}</span>
          <span>Henna Bliss</span>
        </div>

        <nav className="hidden items-center justify-center gap-8 text-lg font-semibold md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "transition-colors duration-150",
                pathname === link.href
                  ? "text-primary"
                  : "text-foreground hover:text-primary",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-white/80 text-foreground shadow-sm transition hover:bg-white dark:bg-slate-950/70 dark:hover:bg-slate-900"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/40 bg-white/80 text-foreground shadow-sm transition hover:bg-white dark:bg-slate-950/70 dark:hover:bg-slate-900 md:hidden"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="min-w-45 p-1"
            >
              {LINKS.map((link) => (
                <DropdownMenuItem key={link.name} asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors duration-150",
                      pathname === link.href
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
