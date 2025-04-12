import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

import { useAuthContext } from "../context/useAuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuthContext();

  return (
    <header className="xl:px-15 lg:px-12 px-3 sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-indigo-600"
          >
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
          <nav className="hidden space-x-6 md:flex">
            <Link
              to="/chat"
              className="text-md font-large text-gray-600 hover:text-indigo-600"
            >
              AI Chat
            </Link>
            <Link
              to="/emotions"
              className="text-md font-large text-gray-600 hover:text-indigo-600"
            >
              Emotion Detection
            </Link>
            <Link
              to="/dashboard"
              className="text-md font-large text-gray-600 hover:text-indigo-600"
            >
              Dashboard
            </Link>
            <Link
              to="/groups"
              className="text-md font-large text-gray-600 hover:text-indigo-600"
            >
              Support Groups
            </Link>
            <Link
              to="/booking"
              className="text-md font-large text-gray-600 hover:text-indigo-600"
            >
              Book Therapist
            </Link>
            <Link
              to="/crisis"
              className="text-md font-large text-gray-600 hover:text-indigo-600"
            >
              Crisis Help
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* Sign In Button */}
            {isAuthenticated ? (
              <img src="https://cdn3.iconfinder.com/data/icons/communication-social-media-1/24/account_profile_user_contact_person_avatar_placeholder-1024.png" 
              alt="Group Profile" 
              className="h-10 w-10 rounded-full object-cover border border-gray-300 shadow-sm" />
         
            ) : (
              <Button variant="default" className="hidden md:inline-flex">
                <Link to="/login">
                  {" "}
                  <p className="text-white"> Sign In </p>
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button - Completely rebuilt */}
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white p-2 text-gray-700 shadow-sm hover:bg-gray-50 md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="space-y-1 pb-3 pt-2 md:hidden">
            <Link
              to="/chat"
              className="block rounded-md px-3 py-2 text-base font-large text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Chat
            </Link>
            <Link
              to="/emotions"
              className="block rounded-md px-3 py-2 text-base font-large text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Emotion Detection
            </Link>
            <Link
              to="/dashboard"
              className="block rounded-md px-3 py-2 text-base font-large text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/groups"
              className="block rounded-md px-3 py-2 text-base font-large text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Support Groups
            </Link>
            <Link
              to="/booking"
              className="block rounded-md px-3 py-2 text-base font-large text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Book Therapist
            </Link>
            <Link
              to="/crisis"
              className="block rounded-md px-3 py-2 text-base font-large text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Crisis Help
            </Link>
            <Link
              to="/login"
              className="block rounded-md px-3 py-2 text-base font-large text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
