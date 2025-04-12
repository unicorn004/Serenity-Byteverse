import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}

export default function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card className="group overflow-hidden border-none bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
      <CardFooter>
        <Link
          to={href}
          className="flex items-center gap-1 text-sm font-medium text-primary transition-all duration-300 hover:gap-2"
        >
          Learn more <ArrowRight className="h-4 w-4" />
        </Link>
      </CardFooter>
    </Card>
  );
}