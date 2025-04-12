import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send, Smile, Paperclip, Mic, Bot } from "lucide-react"
import { io } from "socket.io-client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your mental wellness assistant. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const socketRef = useRef<any>(null)
  
  // Unique identifier for this user - in a real app, this would come from authentication
  const userId = useRef(Date.now().toString())
  // Group ID for the chat - in a real app, this might be dynamic based on the conversation
  const groupId = "wellness-chat-group" 

  // Initialize socket connection and set up event listeners
  useEffect(() => {
    // Connect to the WebSocket server
    socketRef.current = io("http://localhost:3000") // Use your actual server URL

    // Join the chat group
    socketRef.current.emit("join_group", groupId)
    console.log(`Joining group: ${groupId}`)

    // Listen for new messages
    socketRef.current.on("new_message", (newMessage: any) => {
      console.log("New message received:", newMessage)
      
      // Only add the message if it's not from this user
      if (newMessage.sender !== userId.current) {
        const formattedMessage: Message = {
          id: newMessage._id || Date.now().toString(),
          content: newMessage.message,
          sender: "bot", // Assuming all other messages are from the bot/assistant
          timestamp: new Date(newMessage.createdAt || Date.now()),
        }
        
        setMessages((prev) => [...prev, formattedMessage])
      }
    })

    // Connection status logs
    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id)
    })

    socketRef.current.on("connect_error", (error: any) => {
      console.error("Socket connection error:", error)
    })

    // Clean up on component unmount
    return () => {
      console.log("Leaving group and disconnecting socket")
      if (socketRef.current) {
        socketRef.current.emit("leave_group", groupId)
        socketRef.current.disconnect()
      }
    }
  }, [])

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Create user message object
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }
    
    // Add message to local state
    setMessages((prev) => [...prev, userMessage])
    
    // Send message to server through socket
    if (socketRef.current) {
      console.log("Sending message to group:", groupId)
      socketRef.current.emit("send_message", {
        groupId: groupId,
        sender: userId.current,
        message: inputValue,
      })
    } else {
      console.error("Socket not connected")
    }
    
    setInputValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="container mx-auto max-w-5xl py-8 lg:pl-25 lg:pr-25 md:pl-15 md:pr-15 sm:pl-10 sm:pr-10">
      <h1 className="mb-8 text-center text-3xl font-bold text-primary">AI Wellness Assistant</h1>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-4">
          <Card className="border-none shadow-md">
            <CardHeader className="border-b bg-primary/5 px-4 py-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border bg-primary/10">
                  <AvatarFallback className="text-primary">AI</AvatarFallback>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Wellness Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">Online • Replies instantly</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="flex h-[60vh] flex-col">
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          {message.sender === "bot" && <Bot className="h-4 w-4 text-primary" />}
                          <span className="text-xs font-medium">{message.sender === "user" ? "You" : "Assistant"}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="mb-4 flex justify-start">
                      <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">Assistant</span>
                          <div className="flex space-x-1">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0.2s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0.3s]"></div>
                            <div className="h-2 w-2 animate-bounce rounded-full bg-primary/60 [animation-delay:0.4s]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <Textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message here..."
                      className="min-h-[60px] resize-none"
                    />
                    <div className="flex flex-col gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Smile className="h-5 w-5" />
                        <span className="sr-only">Add emoji</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Attach file</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="rounded-full text-muted-foreground hover:text-foreground"
                      >
                        <Mic className="h-5 w-5" />
                        <span className="sr-only">Voice message</span>
                      </Button>
                      <Button
                        size="icon"
                        onClick={handleSendMessage}
                        className="rounded-full bg-primary text-primary-foreground"
                      >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send message</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="mt-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Mental Wellness Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Coping Strategies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>Deep breathing exercises</li>
                      <li>Progressive muscle relaxation</li>
                      <li>Mindfulness meditation</li>
                      <li>Grounding techniques</li>
                      <li>Journaling prompts</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Emergency Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Crisis Text Line:</strong> Text HOME to 741741
                      </li>
                      <li>
                        <strong>National Suicide Prevention Lifeline:</strong> 988
                      </li>
                      <li>
                        <strong>Emergency Services:</strong> 911
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recommended Reading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>The Anxiety and Phobia Workbook</li>
                      <li>Feeling Good: The New Mood Therapy</li>
                      <li>The Mindful Way Through Depression</li>
                      <li>The Body Keeps the Score</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Self-Care Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-inside list-disc space-y-1 text-sm">
                      <li>Nature walks</li>
                      <li>Creative expression</li>
                      <li>Physical exercise</li>
                      <li>Social connection</li>
                      <li>Adequate sleep</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}