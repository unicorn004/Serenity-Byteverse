import { useState } from "react"
import { CalendarIcon, Clock, MapPin, Star, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Therapist {
  id: string
  name: string
  title: string
  specialties: string[]
  rating: number
  reviews: number
  price: number
  location: string
  remote: boolean
  avatar?: string
  availability: {
    date: Date
    slots: string[]
  }[]
  bio: string
  education: string[]
  approach: string
}

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null)

  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearch =
      therapist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      therapist.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesSpecialty = !specialtyFilter || therapist.specialties.includes(specialtyFilter)

    return matchesSearch && matchesSpecialty
  })

  const handleTherapistSelect = (therapist: Therapist) => {
    setSelectedTherapist(therapist)
    setSelectedTimeSlot(null)
  }

  const getAvailableSlots = () => {
    if (!selectedTherapist || !date) return []

    const availabilityForDate = selectedTherapist.availability.find(
      (a) => a.date.toDateString() === date.toDateString(),
    )

    return availabilityForDate?.slots || []
  }

  const handleBookAppointment = () => {
    if (!selectedTherapist || !selectedTimeSlot || !date) return

    // In a real app, you would send this to your backend
    console.log("Booking appointment:", {
      therapistId: selectedTherapist.id,
      date: date.toISOString(),
      timeSlot: selectedTimeSlot,
    })

    // Reset selection
    setSelectedTimeSlot(null)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 lg:pl-15 lg:pr-15 md:pl-10 md:pr-10 sm:pl-5 sm:pr-5">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-primary">Book a Therapist</h1>
          <p className="text-muted-foreground">Find and schedule sessions with licensed professionals</p>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or specialty..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={specialtyFilter || "all"}
            onValueChange={(value) => setSpecialtyFilter(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>{specialtyFilter || "All Specialties"}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="Anxiety">Anxiety</SelectItem>
              <SelectItem value="Depression">Depression</SelectItem>
              <SelectItem value="Trauma">Trauma</SelectItem>
              <SelectItem value="Relationships">Relationships</SelectItem>
              <SelectItem value="Stress">Stress</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Available Therapists</CardTitle>
              <CardDescription>Select a therapist to view their availability</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTherapists.length > 0 ? (
                <div className="space-y-4">
                  {filteredTherapists.map((therapist) => (
                    <div
                      key={therapist.id}
                      className={`cursor-pointer rounded-lg border p-4 transition-all hover:border-primary/50 hover:shadow-sm ${
                        selectedTherapist?.id === therapist.id ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleTherapistSelect(therapist)}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <Avatar className="h-16 w-16 border">
                          <AvatarFallback>{therapist.name.charAt(0)}</AvatarFallback>
                          {therapist.avatar && <AvatarImage src={therapist.avatar} />}
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row">
                            <div>
                              <h3 className="font-medium">{therapist.name}</h3>
                              <p className="text-sm text-muted-foreground">{therapist.title}</p>
                            </div>

                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{therapist.rating}</span>
                              <span className="text-xs text-muted-foreground">({therapist.reviews})</span>
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2">
                            {therapist.specialties.map((specialty) => (
                              <Badge key={specialty} variant="outline">
                                {specialty}
                              </Badge>
                            ))}
                          </div>

                          <div className="mt-3 flex flex-col justify-between gap-2 sm:flex-row">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              <span>{therapist.location}</span>
                              {therapist.remote && (
                                <Badge variant="outline" className="ml-2">
                                  Remote Sessions
                                </Badge>
                              )}
                            </div>

                            <div className="text-sm font-medium">${therapist.price}/session</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No therapists found matching your criteria</p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("")
                      setSpecialtyFilter(null)
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {selectedTherapist ? (
            <div className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Therapist Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <Avatar className="mb-4 h-24 w-24 border-4 border-primary/20">
                      <AvatarFallback className="text-2xl">{selectedTherapist.name.charAt(0)}</AvatarFallback>
                      {selectedTherapist.avatar && <AvatarImage src={selectedTherapist.avatar} />}
                    </Avatar>
                    <h2 className="mb-1 text-xl font-bold">{selectedTherapist.name}</h2>
                    <p className="mb-2 text-sm text-muted-foreground">{selectedTherapist.title}</p>

                    <div className="mb-4 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(selectedTherapist.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                        />
                      ))}
                      <span className="ml-1 text-sm">({selectedTherapist.reviews})</span>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="bio">
                        <AccordionTrigger>About</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm">{selectedTherapist.bio}</p>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="education">
                        <AccordionTrigger>Education & Credentials</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-inside list-disc space-y-1 text-sm">
                            {selectedTherapist.education.map((edu, index) => (
                              <li key={index}>{edu}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="approach">
                        <AccordionTrigger>Therapeutic Approach</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm">{selectedTherapist.approach}</p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Book a Session</CardTitle>
                  <CardDescription>Select a date and time for your appointment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Select Date</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? formatDate(date) : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">Available Time Slots</label>
                      <div className="grid grid-cols-3 gap-2">
                        {getAvailableSlots().length > 0 ? (
                          getAvailableSlots().map((slot) => (
                            <Button
                              key={slot}
                              variant={selectedTimeSlot === slot ? "default" : "outline"}
                              className="text-sm"
                              onClick={() => setSelectedTimeSlot(slot)}
                            >
                              {slot}
                            </Button>
                          ))
                        ) : (
                          <div className="col-span-3 rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
                            No available slots for this date. Please select another date.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" disabled={!selectedTimeSlot}>
                        Book Appointment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Appointment</DialogTitle>
                        <DialogDescription>Please review your appointment details below.</DialogDescription>
                      </DialogHeader>

                      {date && selectedTimeSlot && (
                        <div className="space-y-4 py-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12 border">
                              <AvatarFallback>{selectedTherapist.name.charAt(0)}</AvatarFallback>
                              {selectedTherapist.avatar && <AvatarImage src={selectedTherapist.avatar} />}
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{selectedTherapist.name}</h4>
                              <p className="text-sm text-muted-foreground">{selectedTherapist.title}</p>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="mb-3 flex items-center gap-2">
                              <CalendarIcon className="h-5 w-5 text-primary" />
                              <span className="font-medium">{formatDate(date)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-5 w-5 text-primary" />
                              <span className="font-medium">{selectedTimeSlot}</span>
                            </div>
                          </div>

                          <div className="rounded-lg border p-4">
                            <div className="flex items-center justify-between">
                              <span>Session Fee</span>
                              <span className="font-medium">${selectedTherapist.price}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <DialogFooter>
                        <Button type="submit" onClick={handleBookAppointment}>
                          Confirm Booking
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <CalendarIcon className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-medium">Select a Therapist</h3>
              <p className="mb-6 text-muted-foreground">
                Choose a therapist from the list to view their availability and book a session
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Generate some sample therapists
const therapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    title: "Licensed Clinical Psychologist",
    specialties: ["Anxiety", "Depression", "Trauma"],
    rating: 4.9,
    reviews: 124,
    price: 120,
    location: "New York, NY",
    remote: true,
    avatar: "/placeholder.svg?height=64&width=64",
    availability: [
      {
        date: new Date(),
        slots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      },
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        slots: ["10:00 AM", "1:00 PM", "3:00 PM"],
      },
    ],
    bio: "Dr. Johnson has over 15 years of experience helping individuals overcome anxiety, depression, and trauma. She uses evidence-based approaches tailored to each client's unique needs.",
    education: [
      "Ph.D. in Clinical Psychology, Columbia University",
      "Licensed in New York State since 2008",
      "Certified in Cognitive Behavioral Therapy (CBT)",
      "Trauma-Informed Care Certification",
    ],
    approach:
      "I believe in a collaborative, client-centered approach that combines cognitive-behavioral techniques with mindfulness practices. My goal is to help you develop practical skills while addressing underlying patterns that contribute to distress.",
  },
  {
    id: "2",
    name: "Michael Chen, LMFT",
    title: "Licensed Marriage and Family Therapist",
    specialties: ["Relationships", "Couples Therapy", "Family Dynamics"],
    rating: 4.7,
    reviews: 98,
    price: 110,
    location: "San Francisco, CA",
    remote: true,
    avatar: "/placeholder.svg?height=64&width=64",
    availability: [
      {
        date: new Date(),
        slots: ["10:00 AM", "3:00 PM", "5:00 PM"],
      },
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        slots: ["9:00 AM", "12:00 PM", "4:00 PM"],
      },
    ],
    bio: "Michael specializes in helping couples and families improve communication, resolve conflicts, and build stronger relationships. He creates a safe space for all voices to be heard.",
    education: [
      "M.A. in Marriage and Family Therapy, Stanford University",
      "Licensed Marriage and Family Therapist",
      "Gottman Method Couples Therapy, Level 3 Trained",
      "Emotionally Focused Therapy (EFT) Certification",
    ],
    approach:
      "I help couples and families identify unhelpful patterns and develop new ways of connecting. My approach integrates systems theory with emotionally focused techniques to foster secure, loving relationships.",
  },
  {
    id: "3",
    name: "Dr. James Wilson",
    title: "Clinical Psychologist",
    specialties: ["Anxiety", "Stress", "Work-Life Balance"],
    rating: 4.8,
    reviews: 87,
    price: 130,
    location: "Chicago, IL",
    remote: true,
    avatar: "/placeholder.svg?height=64&width=64",
    availability: [
      {
        date: new Date(),
        slots: ["11:00 AM", "1:00 PM", "4:00 PM"],
      },
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        slots: ["9:00 AM", "2:00 PM", "5:00 PM"],
      },
    ],
    bio: "Dr. Wilson specializes in helping professionals manage stress, anxiety, and achieve better work-life balance. He combines cognitive-behavioral approaches with mindfulness techniques.",
    education: [
      "Ph.D. in Clinical Psychology, University of Chicago",
      "Licensed Clinical Psychologist",
      "Mindfulness-Based Stress Reduction (MBSR) Certified",
      "Executive Coaching Certification",
    ],
    approach:
      "I help clients identify sources of stress and develop practical strategies for managing anxiety. My approach combines evidence-based techniques with mindfulness practices to promote resilience and well-being.",
  },
  {
    id: "4",
    name: "Aisha Patel, LCSW",
    title: "Licensed Clinical Social Worker",
    specialties: ["Depression", "Grief & Loss", "Life Transitions"],
    rating: 4.9,
    reviews: 112,
    price: 100,
    location: "Austin, TX",
    remote: true,
    avatar: "/placeholder.svg?height=64&width=64",
    availability: [
      {
        date: new Date(),
        slots: ["9:00 AM", "12:00 PM", "3:00 PM"],
      },
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        slots: ["10:00 AM", "1:00 PM", "4:00 PM"],
      },
    ],
    bio: "Aisha specializes in helping individuals navigate depression, grief, and major life transitions. She creates a compassionate space for healing and growth.",
    education: [
      "Master of Social Work, University of Texas",
      "Licensed Clinical Social Worker",
      "Certified Grief Counselor",
      "Dialectical Behavior Therapy (DBT) Training",
    ],
    approach:
      "I believe in meeting clients where they are and providing a safe, non-judgmental space for healing. My integrative approach draws from cognitive-behavioral therapy, mindfulness practices, and narrative therapy to help clients process emotions and develop meaningful paths forward.",
  },
  {
    id: "5",
    name: "Robert Taylor, LPC",
    title: "Licensed Professional Counselor",
    specialties: ["Trauma", "PTSD", "Veterans' Mental Health"],
    rating: 4.8,
    reviews: 76,
    price: 115,
    location: "Denver, CO",
    remote: true,
    avatar: "/placeholder.svg?height=64&width=64",
    availability: [
      {
        date: new Date(),
        slots: ["10:00 AM", "2:00 PM", "5:00 PM"],
      },
      {
        date: new Date(Date.now() + 86400000), // Tomorrow
        slots: ["9:00 AM", "11:00 AM", "3:00 PM"],
      },
    ],
    bio: "Robert specializes in trauma treatment, with particular expertise in working with veterans and first responders. He provides a structured approach to processing traumatic experiences and building resilience.",
    education: [
      "M.S. in Clinical Mental Health Counseling, University of Colorado",
      "Licensed Professional Counselor",
      "EMDR Certified Therapist",
      "Prolonged Exposure Therapy Training",
    ],
    approach:
      "I utilize evidence-based trauma treatments including EMDR and Prolonged Exposure therapy. My approach is structured yet flexible, focusing on safety, processing traumatic memories, and developing skills for managing triggers and symptoms.",
  },
]

