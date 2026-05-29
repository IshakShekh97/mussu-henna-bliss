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
import { Button } from "../ui/button";
import CartButton from "../cart/AddToCartButton";

const LINKS = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Shop", href: "/shop", icon: ShoppingBagIcon },
  { name: "Booking", href: "/book", icon: ClipboardClockIcon },
  { name: "Gallery", href: "/gallery", icon: HomeIcon },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <div className="mx-auto flex h-20 max-w-360 items-center justify-between px-3 py-2 sm:px-4 md:px-6">
        <Link
          href={"/"}
          className="flex items-center gap-2 text-xl font-semibold font-serif bg-background/40 backdrop-blur-md border border-black/20 h-12 px-4 rounded-full"
        >
          <span className="text-primary">{"Mussu's"}</span>
          <span>Henna Bliss</span>
        </Link>

        <nav className="items-center justify-center gap-8 text-lg font-semibold flex md:bg-background/10 md:backdrop-blur-md md:border md:border-black/20 md:h-16 md:px-7 rounded-full">
          <div className="hidden md:flex items-center justify-center gap-8 text-lg font-semibold">
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
          </div>

          <div className="flex items-center gap-3">
            <CartButton />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  size={"icon-lg"}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-background/10 backdrop-blur-md border border-border/20 text-foreground shadow-sm transition hover:bg-background/20 md:hidden"
                >
                  <MenuIcon className="h-5 w-5" />
                </Button>
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
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
