"use client";
import { BarChart2, LogOut, Menu, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { logOutUser } from "@/auth/actions/auth";
import { UserSession } from "@/auth/core/session";
import { LogbaseLogo } from "@/components/LogbaseLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
interface HeaderProps {
  user?: UserSession | null;
}

export const Header = ({ user }: HeaderProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const initials = user?.email
    .split("@")[0]
    .split(".")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const navItems = [{ icon: BarChart2, label: "Projects", href: "/projects" }];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 md:px-4">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open mobile menu"
            >
              <Menu className="h-5 w-5 -ml-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <SheetTitle className="flex items-center justify-between p-4">
              <Link href="/">
                <LogbaseLogo />
              </Link>
            </SheetTitle>
            <div className="flex flex-col">
              <nav className="grid gap-2">
                {navItems.map((item, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="justify-start space-x-2"
                    onClick={() => {
                      setIsOpen(false);
                      router.push(item.href);
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex md:items-center md:gap-2">
          <Link href="/">
            <LogbaseLogo />
          </Link>
        </div>

        <nav className="hidden md:ml-8 md:flex md:gap-4 lg:gap-6">
          {navItems.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={() => router.push(item.href)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle></ThemeToggle>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                  aria-label="Open user menu"
                >
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={async () => logOutUser()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button>Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
