import { ArrowRight, Brain, Calendar, Heart, MessageCircle, Shield, Users } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import HeroImage from "./components/hero-image";
import FeatureCard from "./components/feature-card";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function App() {
  return (
    <div className="flex min-h-screen flex-col ">
      <Navbar/>
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-background to-primary/5 px-4 py-24 text-center md:py-32">
      <div className="container relative z-10 max-w-5xl pl-50 pr-50 lg:pl-50 lg:pr-50 md:pl-32 md:pr-32 sm:pl-24 sm:pr-24">
  <h1 className="mb-6 text-4xl font-bold tracking-tight text-violet-600 md:text-6xl">
    Your Journey to Mental Wellness Starts Here
  </h1>
  <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl pl-55 pr-55 lg:pl-55 lg:pr-55 md:pl-36 md:pr-36 sm:pl-28 sm:pr-28">
    Personalized support, AI-powered insights, and a community that cares. Take the first step towards a healthier mind today.
  </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 z-0 opacity-10">
          <HeroImage />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="container py-20">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">
          Comprehensive Mental Health Solutions
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<MessageCircle className="h-10 w-10 text-primary" />}
            title="AI Chatbot"
            description="24/7 support with our empathetic AI assistant, designed to listen and provide personalized guidance."
            href="/chat"
          />
          <FeatureCard
            icon={<Brain className="h-10 w-10 text-primary" />}
            title="Emotion Detection"
            description="Advanced technology that recognizes your emotional state and adapts to provide the most relevant support."
            href="/emotions"
          />
          <FeatureCard
            icon={<Heart className="h-10 w-10 text-primary" />}
            title="Gamified Wellness"
            description="Track your progress and earn rewards as you develop healthy habits and coping mechanisms."
            href="/dashboard"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Support Groups"
            description="Connect anonymously with others facing similar challenges in a safe, moderated environment."
            href="/groups"
          />
          <FeatureCard
            icon={<Calendar className="h-10 w-10 text-primary" />}
            title="Therapist Booking"
            description="Easily schedule sessions with licensed professionals who specialize in your specific needs."
            href="/booking"
          />
          <FeatureCard
            icon={<Shield className="h-10 w-10 text-primary" />}
            title="Crisis Assistance"
            description="Immediate help when you need it most, with one-touch access to resources and support."
            href="/crisis"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-primary/5 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Stories of Transformation
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="border-none bg-background/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{testimonial.quote}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-primary md:text-4xl">
            Begin Your Wellness Journey Today
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands who have transformed their mental health with our comprehensive, personalized approach.
          </p>
          <Button size="lg" className="gap-2">
            Start Now <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
      <Footer/>
    </div>
  );
}

const testimonials = [
  {
    name: "Alex J.",
    location: "New York, NY",
    quote:
      "The AI chatbot was there for me at 3 AM when anxiety hit. It guided me through breathing exercises that actually helped me calm down and sleep.",
  },
  {
    name: "Morgan T.",
    location: "Seattle, WA",
    quote:
      "The gamification aspect made building healthy habits fun. I've meditated daily for 60 days now, something I never thought possible.",
  },
  {
    name: "Jamie L.",
    location: "Austin, TX",
    quote:
      "Finding a therapist used to be overwhelming. This platform matched me with someone perfect for my needs in minutes.",
  },
];