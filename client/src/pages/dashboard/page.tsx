import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Award, TrendingUp, Activity, BarChart3 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import MoodChart from "@/components/dashboard/mood-chart"
import ChallengeCard from "@/components/dashboard/challenge-card"


export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const previousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const nextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  return (
    <div className="container mx-auto max-w-7xl py-8 lg:pl-15 lg:pr-15 md:pl-10 md:pr-10 sm:pl-5 sm:pr-5">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-primary">Wellness Dashboard</h1>
          <p className="text-muted-foreground">Track your progress and complete challenges</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousDay}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={goToToday}>
            <Calendar className="h-4 w-4" />
            {formatDate(currentDate)}
          </Button>
          <Button variant="outline" size="icon" onClick={nextDay}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Daily Mood</CardTitle>
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription>Your emotional journey</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] w-full">
                      <MoodChart />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Wellness Score</CardTitle>
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <CardDescription>Your overall wellbeing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center space-y-6 py-4">
                      <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-8 border-primary/20">
                        <div className="text-center">
                          <span className="text-4xl font-bold">78</span>
                          <span className="text-sm text-muted-foreground">/100</span>
                        </div>
                        <svg className="absolute -rotate-90" width="150" height="150" viewBox="0 0 150 150">
                          <circle
                            cx="75"
                            cy="75"
                            r="60"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="12"
                            strokeDasharray="376.8"
                            strokeDashoffset="82.9"
                            className="text-primary"
                          />
                        </svg>
                      </div>

                      <div className="grid w-full grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Sleep Quality</p>
                          <Progress value={65} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Stress Level</p>
                          <Progress value={40} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Activity</p>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Mindfulness</p>
                          <Progress value={70} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Daily Habits</CardTitle>
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <CardDescription>Your consistency builds resilience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {habits.map((habit) => (
                      <div key={habit.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${habit.completed ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                          >
                            {habit.icon}
                          </div>
                          <div>
                            <p className="font-medium">{habit.name}</p>
                            <p className="text-xs text-muted-foreground">{habit.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-sm font-medium">{habit.streak} days</p>
                            <p className="text-xs text-muted-foreground">Current streak</p>
                          </div>
                          <Button
                            variant={habit.completed ? "default" : "outline"}
                            size="sm"
                            className={habit.completed ? "pointer-events-none" : ""}
                          >
                            {habit.completed ? "Completed" : "Complete"}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="challenges" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {challenges.map((challenge, index) => (
                  <ChallengeCard key={index} challenge={challenge} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="mt-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Milestones in your wellness journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={`flex flex-col items-center rounded-lg p-4 text-center ${achievement.unlocked ? "bg-primary/5" : "bg-muted/50 opacity-70"}`}
                      >
                        <div
                          className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ${achievement.unlocked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
                        >
                          {achievement.icon}
                        </div>
                        <h3 className="mb-1 font-medium">{achievement.name}</h3>
                        <p className="mb-3 text-xs text-muted-foreground">{achievement.description}</p>
                        <Badge variant={achievement.unlocked ? "default" : "outline"}>
                          {achievement.unlocked ? "Unlocked" : "Locked"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <Avatar className="mb-4 h-24 w-24 border-4 border-primary/20">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-2xl">JD</AvatarFallback>
                </Avatar>
                <h2 className="mb-1 text-xl font-bold">Jane Doe</h2>
                <p className="mb-4 text-sm text-muted-foreground">Member since June 2023</p>

                <div className="mb-6 grid w-full grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-primary/5 p-2">
                    <p className="text-lg font-bold">42</p>
                    <p className="text-xs text-muted-foreground">Days</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-2">
                    <p className="text-lg font-bold">12</p>
                    <p className="text-xs text-muted-foreground">Challenges</p>
                  </div>
                  <div className="rounded-lg bg-primary/5 p-2">
                    <p className="text-lg font-bold">8</p>
                    <p className="text-xs text-muted-foreground">Badges</p>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div>
                    <h3 className="mb-2 text-sm font-medium">Current Level</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                        <Award className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">Mindfulness Master</p>
                          <p className="text-xs text-muted-foreground">Level 4</p>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-2 text-sm font-medium">Recent Badges</h3>
                    <div className="flex justify-between">
                      {recentBadges.map((badge, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                            {badge.icon}
                          </div>
                          <p className="text-xs">{badge.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">View Full Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6 border-none shadow-md">
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => (
                  <div key={index} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10 text-primary">
                      {session.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{session.title}</h4>
                      <p className="text-xs text-muted-foreground">{session.date}</p>
                      <p className="mt-1 text-sm">{session.description}</p>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  View All Sessions
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const habits = [
  {
    name: "Morning Meditation",
    description: "10 minutes of mindfulness",
    icon: <Activity className="h-5 w-5" />,
    streak: 12,
    completed: true,
  },
  {
    name: "Gratitude Journal",
    description: "Write 3 things you're grateful for",
    icon: <Calendar className="h-5 w-5" />,
    streak: 8,
    completed: true,
  },
  {
    name: "Evening Reflection",
    description: "Review your day and emotions",
    icon: <Award className="h-5 w-5" />,
    streak: 5,
    completed: false,
  },
]

const challenges = [
  {
    title: "7-Day Mindfulness",
    description: "Practice mindfulness for 10 minutes daily",
    progress: 71,
    daysLeft: 2,
    category: "Meditation",
  },
  {
    title: "Gratitude Challenge",
    description: "Write down 3 things you're grateful for each day",
    progress: 40,
    daysLeft: 3,
    category: "Journaling",
  },
  {
    title: "Digital Detox",
    description: "Reduce screen time by 30 minutes daily",
    progress: 25,
    daysLeft: 6,
    category: "Lifestyle",
  },
  {
    title: "Sleep Improvement",
    description: "Establish a consistent sleep schedule",
    progress: 60,
    daysLeft: 4,
    category: "Health",
  },
]

const achievements = [
  {
    name: "First Steps",
    description: "Complete your first wellness assessment",
    icon: <Award className="h-8 w-8" />,
    unlocked: true,
  },
  {
    name: "Consistency Champion",
    description: "Complete daily check-ins for 7 days straight",
    icon: <Calendar className="h-8 w-8" />,
    unlocked: true,
  },
  {
    name: "Meditation Master",
    description: "Complete 10 meditation sessions",
    icon: <Activity className="h-8 w-8" />,
    unlocked: true,
  },
  {
    name: "Journaling Journey",
    description: "Write in your journal for 14 consecutive days",
    icon: <BarChart3 className="h-8 w-8" />,
    unlocked: false,
  },
  {
    name: "Emotion Explorer",
    description: "Use the emotion detection feature 5 times",
    icon: <TrendingUp className="h-8 w-8" />,
    unlocked: false,
  },
  {
    name: "Support Seeker",
    description: "Participate in your first support group",
    icon: <ChevronRight className="h-8 w-8" />,
    unlocked: false,
  },
]

const recentBadges = [
  {
    name: "Mindful",
    icon: <Award className="h-5 w-5" />,
  },
  {
    name: "Consistent",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    name: "Engaged",
    icon: <Activity className="h-5 w-5" />,
  },
]

const upcomingSessions = [
  {
    title: "Therapy Session",
    date: "Tomorrow, 2:00 PM",
    description: "Virtual session with Dr. Smith",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    title: "Support Group",
    date: "Friday, 6:30 PM",
    description: "Anxiety management group",
    icon: <Activity className="h-5 w-5" />,
  },
]

