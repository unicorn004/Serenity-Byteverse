
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-md">
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">MindWell</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive mental health solutions powered by AI and human expertise.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Features</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/chat" className="text-muted-foreground transition-colors hover:text-foreground">
                  AI Chatbot
                </Link>
              </li>
              <li>
                <Link to="/emotions" className="text-muted-foreground transition-colors hover:text-foreground">
                  Emotion Detection
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
                  Wellness Dashboard
                </Link>
              </li>
              <li>
                <Link to="/groups" className="text-muted-foreground transition-colors hover:text-foreground">
                  Support Groups
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/guides" className="text-muted-foreground transition-colors hover:text-foreground">
                  Wellness Guides
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-muted-foreground transition-colors hover:text-foreground">
                  Research
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground transition-colors hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground transition-colors hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">
                Contact us at{" "}
                <a href="mailto:support@mindwell.com" className="text-primary hover:underline">
                  support@mindwell.com
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} MindWell. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}