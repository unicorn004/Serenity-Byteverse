

import { useState } from "react"
import { Search, Users, Send, Plus, Clock, Calendar, Lock, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  id: string
  content: string
  sender: {
    name: string
    avatar?: string
    isBot?: boolean
  }
  timestamp: Date
}

interface Group {
  id: string
  name: string
  description: string
  members: number
  category: string
  privacy: "public" | "private"
  nextSession?: string
  messages: Message[]
}

export default function GroupsPage() {
  const [activeGroup, setActiveGroup] = useState<Group | null>(supportGroups[0])
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredGroups = supportGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeGroup) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageInput,
      sender: {
        name: "You",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      timestamp: new Date(),
    }

    // In a real app, you would send this to your backend
    console.log("Sending message:", newMessage)

    // For demo purposes, we'll just update the UI
    const updatedGroup = {
      ...activeGroup,
      messages: [...activeGroup.messages, newMessage],
    }

    setActiveGroup(updatedGroup)
    setMessageInput("")

    // Simulate AI moderator response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Thank you for sharing. Remember that this is a safe space for everyone. Would anyone else like to share their experiences?",
        sender: {
          name: "AI Moderator",
          isBot: true,
        },
        timestamp: new Date(),
      }

      const updatedWithBotResponse = {
        ...updatedGroup,
        messages: [...updatedGroup.messages, botResponse],
      }

      setActiveGroup(updatedWithBotResponse)
    }, 5000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container mx-auto max-w-7xl py-8">
      <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div>
          <h1 className="text-3xl font-bold text-primary">Support Groups</h1>
          <p className="text-muted-foreground">Connect with others in a safe, moderated environment</p>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search groups..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Group</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a Support Group</DialogTitle>
                <DialogDescription>Start a new support group for people with similar experiences.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Group Name
                  </label>
                  <Input id="name" placeholder="Enter group name" />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea id="description" placeholder="What is this group about?" />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="anxiety">Anxiety</SelectItem>
                      <SelectItem value="depression">Depression</SelectItem>
                      <SelectItem value="stress">Stress Management</SelectItem>
                      <SelectItem value="grief">Grief & Loss</SelectItem>
                      <SelectItem value="addiction">Addiction Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="privacy" className="text-sm font-medium">
                    Privacy Setting
                  </label>
                  <Select defaultValue="public">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public (Anyone can join)</SelectItem>
                      <SelectItem value="private">Private (Approval required)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="submit">Create Group</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Available Groups</CardTitle>
              <CardDescription>Find your community</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="my">My Groups</TabsTrigger>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4 space-y-4">
                  {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        className={`cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent ${activeGroup?.id === group.id ? "bg-accent" : ""}`}
                        onClick={() => setActiveGroup(group)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryColor(group.category)}`}
                          >
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium">{group.name}</h3>
                              {group.privacy === "private" && <Lock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{group.members} members</p>
                            <div className="mt-1 flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {group.category}
                              </Badge>
                              {group.nextSession && (
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="mr-1 h-3 w-3" />
                                  Upcoming
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Search className="mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">No groups found matching "{searchQuery}"</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="my" className="mt-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">You haven't joined any groups yet</p>
                    <Button variant="link" className="mt-2">
                      Browse all groups
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="recommended" className="mt-4">
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Users className="mb-2 h-8 w-8 text-muted-foreground" />
                    <p className="text-muted-foreground">Complete your profile to get recommendations</p>
                    <Button variant="link" className="mt-2">
                      Update profile
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {activeGroup ? (
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-primary/5 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryColor(activeGroup.category)}`}
                    >
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {activeGroup.name}
                        {activeGroup.privacy === "private" && <Lock className="h-4 w-4 text-muted-foreground" />}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{activeGroup.members} members</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {activeGroup.category}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>

                  {activeGroup.nextSession && (
                    <div className="hidden rounded-lg border bg-background p-2 text-center md:block">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Next Session</span>
                      </div>
                      <p className="text-xs font-medium">{formatDate(activeGroup.nextSession)}</p>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex h-[60vh] flex-col">
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="mb-4 rounded-lg bg-primary/5 p-3 text-center text-sm">
                      <p className="mb-1 font-medium">Welcome to {activeGroup.name}</p>
                      <p className="text-muted-foreground">{activeGroup.description}</p>
                    </div>

                    {activeGroup.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${message.sender.name === "You" ? "justify-end" : "justify-start"}`}
                      >
                        <div className="flex max-w-[80%] gap-2">
                          {message.sender.name !== "You" && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className={message.sender.isBot ? "bg-primary/20 text-primary" : ""}>
                                {message.sender.name.charAt(0)}
                              </AvatarFallback>
                              {message.sender.avatar && <AvatarImage src={message.sender.avatar} />}
                            </Avatar>
                          )}

                          <div>
                            <div className="mb-1 flex items-center gap-2">
                              <span className="text-xs font-medium">
                                {message.sender.name}
                                {message.sender.isBot && (
                                  <Badge variant="outline" className="ml-1 text-[10px]">
                                    <Shield className="mr-1 h-3 w-3" />
                                    Moderator
                                  </Badge>
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                            </div>
                            <div
                              className={`rounded-2xl px-4 py-2 ${
                                message.sender.name === "You"
                                  ? "bg-primary text-primary-foreground"
                                  : message.sender.isBot
                                    ? "bg-primary/10 text-foreground"
                                    : "bg-muted"
                              }`}
                            >
                              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                            </div>
                          </div>

                          {message.sender.name === "You" && (
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>Y</AvatarFallback>
                              {message.sender.avatar && <AvatarImage src={message.sender.avatar} />}
                            </Avatar>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t p-4">
                    <div className="flex items-end gap-2">
                      <Textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="min-h-[60px] resize-none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="h-10 w-10 rounded-full"
                        disabled={!messageInput.trim()}
                      >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      <Shield className="mr-1 inline-block h-3 w-3" />
                      Messages are moderated by AI to ensure a safe environment
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-medium">Select a Group</h3>
              <p className="mb-6 text-muted-foreground">
                Choose a support group from the list to join the conversation
              </p>
              <Button>Browse All Groups</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    case "anxiety":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    case "depression":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    case "stress management":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case "grief & loss":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
    case "addiction recovery":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  }
}

const supportGroups: Group[] = [
  {
    id: "1",
    name: "Anxiety Support Circle",
    description: "A safe space to discuss anxiety and share coping strategies.",
    members: 128,
    category: "Anxiety",
    privacy: "public",
    nextSession: "2025-03-18T18:30:00",
    messages: [
      {
        id: "1",
        content:
          "Welcome to today's session. Let's start by sharing one thing that triggered anxiety for you this week and one coping strategy you used.",
        sender: {
          name: "Dr. Johnson",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        content:
          "I had a panic attack before a work presentation. I used the 5-4-3-2-1 grounding technique which really helped me calm down enough to continue.",
        sender: {
          name: "Sarah",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        timestamp: new Date(Date.now() - 3500000),
      },
      {
        id: "3",
        content:
          "Thank you for sharing, Sarah. The grounding technique is an excellent tool for managing acute anxiety. Would anyone else like to share their experience?",
        sender: {
          name: "AI Moderator",
          isBot: true,
        },
        timestamp: new Date(Date.now() - 3400000),
      },
    ],
  },
  {
    id: "2",
    name: "Depression Support Group",
    description: "Supporting each other through depression with understanding and compassion.",
    members: 95,
    category: "Depression",
    privacy: "public",
    messages: [
      {
        id: "1",
        content:
          "Welcome everyone. This is a safe space to share your experiences with depression. Remember, you're not alone in this journey.",
        sender: {
          name: "AI Moderator",
          isBot: true,
        },
        timestamp: new Date(Date.now() - 86400000),
      },
    ],
  },
  {
    id: "3",
    name: "Stress Management",
    description: "Learn and share techniques for managing daily stress and building resilience.",
    members: 156,
    category: "Stress Management",
    privacy: "public",
    nextSession: "2025-03-20T19:00:00",
    messages: [
      {
        id: "1",
        content:
          "Welcome to the Stress Management group. Feel free to share your experiences and techniques that have helped you manage stress.",
        sender: {
          name: "AI Moderator",
          isBot: true,
        },
        timestamp: new Date(Date.now() - 172800000),
      },
    ],
  },
  {
    id: "4",
    name: "Grief & Loss Support",
    description: "A compassionate community for those experiencing grief and loss.",
    members: 67,
    category: "Grief & Loss",
    privacy: "private",
    messages: [
      {
        id: "1",
        content:
          "This is a private group for those dealing with grief and loss. All shared experiences are kept confidential.",
        sender: {
          name: "AI Moderator",
          isBot: true,
        },
        timestamp: new Date(Date.now() - 259200000),
      },
    ],
  },
  {
    id: "5",
    name: "Addiction Recovery",
    description: "Supporting each other on the journey to recovery and sobriety.",
    members: 89,
    category: "Addiction Recovery",
    privacy: "private",
    nextSession: "2025-03-19T20:00:00",
    messages: [
      {
        id: "1",
        content:
          "Welcome to the Addiction Recovery group. This is a judgment-free zone where we support each other's recovery journey.",
        sender: {
          name: "AI Moderator",
          isBot: true,
        },
        timestamp: new Date(Date.now() - 345600000),
      },
    ],
  },
]

