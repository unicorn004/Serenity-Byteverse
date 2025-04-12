import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className=" pl-15 pr-15 sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" />
            <path d="m6 17 3.13-5.78c.53-.97.43-2.22-.26-3.07A4 4 0 0 1 22 7a3.98 3.98 0 0 1-3.57 3.93L13 17" />
          </svg>
          MindWell
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/chat"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            AI Chat
          </Link>
          <Link
            to="/emotions"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Emotion Detection
          </Link>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>
          <Link
            to="/groups"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Support Groups
          </Link>
          <Link
            to="/booking"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Book Therapist
          </Link>
          <Link
            to="/crisis"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Crisis Help
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}
          <Button className="hidden md:inline-flex">Sign In</Button>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="container pb-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/chat"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Chat
            </Link>
            <Link
              to="/emotions"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Emotion Detection
            </Link>
            <Link
              to="/dashboard"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/groups"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Support Groups
            </Link>
            <Link
              to="/booking"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Therapist
            </Link>
            <Link
              to="/crisis"
              className="rounded-md px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              onClick={() => setIsMenuOpen(false)}
            >
              Crisis Help
            </Link>
            <Button className="mt-2 w-full" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}