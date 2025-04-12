import { useState } from "react"
import { Phone, MessageSquare, AlertCircle, Heart, ArrowRight, Clock, Shield, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function CrisisPage() {
  const [showBreathingExercise, setShowBreathingExercise] = useState(false)

  return (
    <div className="container mx-auto max-w-5xl py-8 lg:pl-15 lg:pr-15 md:pl-10 md:pr-10 sm:pl-5 sm:pr-5">
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-primary">Crisis Assistance</h1>
        <p className="max-w-2xl text-muted-foreground">
          Immediate support resources and coping strategies for moments of crisis
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="border-none bg-red-50 shadow-md dark:bg-red-900/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-red-600 dark:text-red-400" />
              Emergency Helplines
            </CardTitle>
            <CardDescription>Immediate phone support</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="rounded-md bg-white p-3 shadow-sm dark:bg-background/50">
                <p className="font-medium">988 Suicide & Crisis Lifeline</p>
                <p className="text-sm text-muted-foreground">24/7 support for suicidal crisis or emotional distress</p>
                <Button variant="outline" className="mt-2 w-full gap-2">
                  <Phone className="h-4 w-4" /> Call 988
                </Button>
              </li>
              <li className="rounded-md bg-white p-3 shadow-sm dark:bg-background/50">
                <p className="font-medium">Crisis Text Line</p>
                <p className="text-sm text-muted-foreground">Text HOME to 741741 for crisis support</p>
                <Button variant="outline" className="mt-2 w-full gap-2">
                  <MessageSquare className="h-4 w-4" /> Text HOME to 741741
                </Button>
              </li>
              <li className="rounded-md bg-white p-3 shadow-sm dark:bg-background/50">
                <p className="font-medium">Emergency Services</p>
                <p className="text-sm text-muted-foreground">For immediate danger or medical emergency</p>
                <Button variant="outline" className="mt-2 w-full gap-2">
                  <Phone className="h-4 w-4" /> Call 911
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              SOS Button
            </CardTitle>
            <CardDescription>One-touch access to help</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-24 w-24 rounded-full bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                  SOS
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Crisis Support</DialogTitle>
                  <DialogDescription>
                    We're here to help. Please select the type of support you need right now.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button className="gap-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                    <Phone className="h-4 w-4" /> Call Crisis Hotline
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="h-4 w-4" /> Text Support
                  </Button>
                  <Button variant="outline" className="gap-2" onClick={() => setShowBreathingExercise(true)}>
                    <Clock className="h-4 w-4" /> Guided Breathing Exercise
                  </Button>
                </div>
                <DialogFooter className="flex-col gap-2 sm:flex-col">
                  <p className="text-xs text-muted-foreground">
                    If you are in immediate danger, please call emergency services (911).
                  </p>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Press the SOS button for immediate access to crisis resources and support options
            </p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              AI-Driven Coping Strategies
            </CardTitle>
            <CardDescription>Personalized support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm">
                Our AI can provide immediate coping strategies based on your current emotional state.
              </p>

              <div className="rounded-md bg-primary/5 p-3">
                <h3 className="mb-2 font-medium">How are you feeling right now?</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" className="justify-start">
                    Anxious
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Depressed
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Overwhelmed
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Suicidal
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Angry
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Hopeless
                  </Button>
                </div>
              </div>

              <Button className="w-full gap-2">
                Get Personalized Support <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coping">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="coping">Coping Strategies</TabsTrigger>
          <TabsTrigger value="resources">Local Resources</TabsTrigger>
          <TabsTrigger value="safety">Safety Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="coping" className="mt-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Immediate Coping Strategies</CardTitle>
              <CardDescription>Techniques to help manage intense emotions and crisis situations</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="grounding">
                  <AccordionTrigger>5-4-3-2-1 Grounding Technique</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>This technique helps bring your attention to the present moment:</p>
                      <ul className="list-inside list-disc space-y-1 pl-4 text-sm">
                        <li>
                          <strong>5 things you can see</strong> - Look around and name five things you can see
                        </li>
                        <li>
                          <strong>4 things you can touch/feel</strong> - Notice four things you can physically feel
                        </li>
                        <li>
                          <strong>3 things you can hear</strong> - Listen for three sounds
                        </li>
                        <li>
                          <strong>2 things you can smell</strong> - Notice two scents
                        </li>
                        <li>
                          <strong>1 thing you can taste</strong> - Identify one taste
                        </li>
                      </ul>
                      <Button variant="outline" className="mt-2" onClick={() => setShowBreathingExercise(true)}>
                        Try Guided Exercise
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="breathing">
                  <AccordionTrigger>Deep Breathing</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Box breathing can help calm your nervous system:</p>
                      <ol className="list-inside list-decimal space-y-1 pl-4 text-sm">
                        <li>Breathe in slowly through your nose for 4 counts</li>
                        <li>Hold your breath for 4 counts</li>
                        <li>Exhale slowly through your mouth for 4 counts</li>
                        <li>Hold for 4 counts before breathing in again</li>
                        <li>Repeat for at least 5 cycles</li>
                      </ol>
                      <Button variant="outline" className="mt-2" onClick={() => setShowBreathingExercise(true)}>
                        Try Guided Exercise
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="distress">
                  <AccordionTrigger>Distress Tolerance Skills</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>TIPP skills can help reduce emotional intensity quickly:</p>
                      <ul className="list-inside list-disc space-y-1 pl-4 text-sm">
                        <li>
                          <strong>Temperature change</strong> - Splash cold water on your face or hold an ice cube
                        </li>
                        <li>
                          <strong>Intense exercise</strong> - Engage in brief, intense physical activity
                        </li>
                        <li>
                          <strong>Paced breathing</strong> - Slow your breathing to 5-6 breaths per minute
                        </li>
                        <li>
                          <strong>Progressive muscle relaxation</strong> - Tense and release muscle groups
                        </li>
                      </ul>
                      <Button variant="outline" className="mt-2">
                        Learn More
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mindfulness">
                  <AccordionTrigger>Mindfulness Practices</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p>Simple mindfulness exercises to anchor yourself:</p>
                      <ul className="list-inside list-disc space-y-1 pl-4 text-sm">
                        <li>
                          <strong>Body scan</strong> - Slowly bring attention to each part of your body
                        </li>
                        <li>
                          <strong>Sensory awareness</strong> - Focus fully on one sense at a time
                        </li>
                        <li>
                          <strong>Mindful walking</strong> - Pay attention to each step and your surroundings
                        </li>
                        <li>
                          <strong>Observing thoughts</strong> - Watch thoughts come and go without judgment
                        </li>
                      </ul>
                      <Button variant="outline" className="mt-2">
                        Try Guided Meditation
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Local Support Resources</CardTitle>
              <CardDescription>Find help in your community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-md bg-primary/5 p-4">
                <p className="text-sm">
                  Enter your location to find resources near you, or browse the general resources below.
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter ZIP code"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <Button>Search</Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-1 font-medium">Community Mental Health Centers</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Local centers offering sliding scale services and crisis intervention
                  </p>
                  <Button variant="outline" className="w-full">
                    Find Centers Near Me
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-1 font-medium">Support Groups</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Peer-led and professional groups for various mental health concerns
                  </p>
                  <Button variant="outline" className="w-full">
                    Browse Support Groups
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-1 font-medium">Crisis Stabilization Units</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Short-term care facilities for mental health crises
                  </p>
                  <Button variant="outline" className="w-full">
                    Locate Crisis Units
                  </Button>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-1 font-medium">Warmlines</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Non-emergency support lines staffed by peers with lived experience
                  </p>
                  <Button variant="outline" className="w-full">
                    Find Warmlines
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="safety" className="mt-6">
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Safety Planning</CardTitle>
                  <CardDescription>Create a personalized plan for crisis situations</CardDescription>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">
                        A safety plan helps you identify warning signs, coping strategies, and resources to use during a
                        mental health crisis.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="mb-2 font-medium">1. Warning Signs</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Identify thoughts, feelings, or behaviors that indicate a crisis may be developing
                  </p>
                  <textarea
                    className="h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Examples: Increased isolation, feeling hopeless, thoughts of self-harm..."
                  ></textarea>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">2. Internal Coping Strategies</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    List activities you can do on your own to help manage distress
                  </p>
                  <textarea
                    className="h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Examples: Deep breathing, physical exercise, journaling..."
                  ></textarea>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">3. People Who Can Help</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Identify trusted contacts you can reach out to during a crisis
                  </p>
                  <textarea
                    className="h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Name: [Contact Name], Phone: [Number], Relationship: [Friend/Family/Therapist]"
                  ></textarea>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">4. Professional Resources</h3>
                  <p className="mb-2 text-sm text-muted-foreground">
                    List professional support services and their contact information
                  </p>
                  <textarea
                    className="h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Therapist: [Name/Number], Crisis Line: 988, Local Emergency: [Number]"
                  ></textarea>
                </div>

                <Button className="w-full">Save Safety Plan</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showBreathingExercise && (
        <Dialog open={showBreathingExercise} onOpenChange={setShowBreathingExercise}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Guided Breathing Exercise</DialogTitle>
              <DialogDescription>Follow the animation to regulate your breathing</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col items-center justify-center py-6">
              <div className="relative flex h-40 w-40 items-center justify-center">
                <div className="absolute h-40 w-40 animate-ping rounded-full bg-primary/20 opacity-75"></div>
                <div className="absolute h-40 w-40 animate-pulse rounded-full bg-primary/10"></div>
                <div className="z-10 text-center">
                  <p className="text-lg font-medium" id="breathing-instruction">
                    Breathe In
                  </p>
                  <p className="text-3xl font-bold" id="breathing-count">
                    4
                  </p>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Continue this exercise for at least 2 minutes for the best results
              </p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBreathingExercise(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

