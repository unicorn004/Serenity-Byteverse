import { useState, useEffect, useRef } from "react";
import { Search, Users, Send, Plus, Lock, Shield, Calendar, Clock } from "lucide-react";
import useSWR, { mutate } from "swr";
import axios from "axios";
import io from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster, toast } from "sonner";

interface Forum {
  _id: string;
  name: string;
  description: string;
  category: string;
  privacy: "public" | "private";
  members_count: number;
  members: string[];
  created_at: string;
}

interface ChatMessage {
  _id: string;
  sender: string;
  message: string;
  sent_at: string;
}

let socket: ReturnType<typeof io> | null = null;

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  if (response.headers['content-type'].includes('text/html')) {
    throw new Error('Received HTML instead of JSON');
  }
  return response.data;
};

const fetchGroups = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/groups');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch groups:', error);
    throw error;
  }
};

export default function GroupsPage() {
  
  const [anonId] = useState(`anon-${Math.random().toString(36).substr(2, 9)}`);
  const [activeForumId, setActiveForumId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [joinedForums, setJoinedForums] = useState<Set<string>>(new Set());

  const { data: groups = [], error: groupsError } = useSWR<Forum[]>('http://localhost:5000/api/groups', fetchGroups);
  const { data: messages = [], mutate: mutateMessages } = useSWR<ChatMessage[]>(
    activeForumId ? `http://localhost:5000/api/groups/${activeForumId}/messages` : null,
    fetcher
  );

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:5000", { autoConnect: false });

      socket.on("connect", () => setSocketConnected(true));
      socket.on("disconnect", () => setSocketConnected(false));
      socket.on("connect_error", (err) => {
        console.error("Connection error:", err);
        toast.error("Connection to chat server failed. Please refresh.");
      });
      
      socket.connect();
    }

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  // Room management
  useEffect(() => {
    if (!socket || !activeForumId || !socketConnected) return;

    socket.emit("join_group", activeForumId);
    socket.on("new_message", handleNewMessage);

    return () => {
      if (socket) {
        socket.emit("leave_group", activeForumId);
        socket.off("new_message");
      }
    };
  }, [activeForumId, socketConnected]);

  const handleNewMessage = (newMessage: ChatMessage) => {
    mutateMessages((current) => {
      const exists = current?.some(msg => msg._id === newMessage._id);
      return exists ? current : [...(current || []), newMessage];
    }, false);
  };

  const handleCreateForum = async (name: string, description: string, category: string, privacy: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/groups", {
        name, description, category, privacy
      });
      mutate("http://localhost:5000/api/groups");
      setActiveForumId(response.data._id);
      toast.success("Group created!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create group");
    }
  };

  const handleJoinForum = async (groupId: string) => {
    try {
      await axios.post(`http://localhost:5000/api/groups/${groupId}/join`, { username: anonId });
      setJoinedForums(prev => new Set([...prev, groupId]));
      mutate("http://localhost:5000/api/groups");
      toast.success("Joined group!");
    } catch (error) {
      toast.error("Failed to join group");
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeForumId) return;

    try {
      const messageData = {
        message: messageInput,
        sender: anonId
      };
      await axios.post(`http://localhost:5000/api/groups/${activeForumId}/messages`, messageData);
      setMessageInput("");
    } catch (error) {
      toast.error("Failed to send message, please try again.");
    }
  };

  const isUserMemberOfForum = (groupId: string) => joinedForums.has(groupId);

  const filteredForums = Array.isArray(groups)
  ? groups.filter(
      (group) =>
        (group.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
        (group.description || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
  : [];

  const handleDialogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    handleCreateForum(
      formData.get("name") as string,
      formData.get("description") as string,
      formData.get("category") as string,
      formData.get("privacy") as string
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4 lg:px-8">
      {/* Toast notifications */}
      <Toaster position="top-right" />

      {/* Header Section */}
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

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

              <form onSubmit={handleDialogSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Group Name
                    </label>
                    <Input id="name" name="name" placeholder="Enter group name" required />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="What is this group about?"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <Select name="category" defaultValue="anxiety">
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
                    <Select name="privacy" defaultValue="public">
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
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Forums List */}
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
                  {!groups ? (
                    <div className="p-4 text-center text-muted-foreground">Loading groups...</div>
                  ) : filteredForums?.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No groups found</div>
                  ) : (
                    filteredForums?.map((forum) => (
                      <div
                        key={forum._id}
                        className={`relative cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent ${
                          activeForumId === forum._id ? "bg-accent" : ""
                        }`}
                        onClick={() => setActiveForumId(forum._id)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryColor(
                              forum.category
                            )}`}
                          >
                            <Users className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <h3 className="font-medium">{forum.name}</h3>
                              {forum.privacy === "private" && <Lock className="h-4 w-4 text-muted-foreground" />}
                            </div>
                            <p className="text-xs text-muted-foreground">{forum.members_count} members</p>
                            <div className="mt-1 flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {forum.category}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {forum.privacy}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {!isUserMemberOfForum(forum._id) && (
                          <div className="absolute right-4 top-4">
                            <Button
                              onClick={(e) => {
                                e.stopPropagation(); 
                                handleJoinForum(forum._id); 
                              }}
                            >
                              Join Group
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="my" className="mt-4 space-y-4">
                  {!groups ? (
                    <div className="p-4 text-center text-muted-foreground">Loading groups...</div>
                  ) : (
                    groups
                      .filter((group) => (group.members || []).includes(anonId)) // No authentication
                      .map((group) => (
                        <div
                          key={group._id}
                          className={`cursor-pointer rounded-lg p-3 transition-colors hover:bg-accent ${
                            activeForumId === group._id ? "bg-accent" : ""
                          }`}
                          onClick={() => {console.log("Setting active forum ID:", group._id); setActiveForumId(group._id)}}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryColor(
                                group.category
                              )}`}
                            >
                              <Users className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <h3 className="font-medium">{group.name}</h3>
                                {group.privacy === "private" && <Lock className="h-4 w-4 text-muted-foreground" />}
                              </div>
                              <p className="text-xs text-muted-foreground">{group.members_count} members</p>
                              <div className="mt-1 flex items-center gap-1">
                                <Badge variant="outline" className="text-xs">
                                  {group.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          {!isUserMemberOfForum(group._id) && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 transition-opacity hover:opacity-100">
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleJoinForum(group._id); 
                                }}
                              >
                                Join Group
                              </Button>
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </TabsContent>

                <TabsContent value="recommended" className="mt-4 space-y-4">
                  <div className="p-4 text-center text-muted-foreground">
                    Recommendations based on your activity will appear here
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Active Forum Chat */}
        <div className="md:col-span-2">
          { activeForumId ? (
            <Card className="border-none shadow-md">
              <CardHeader className="border-b bg-primary/5 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryColor(
                        groups?.find((f) => f._id === activeForumId)?.category || "bg-gray-100"
                      )}`}
                    >
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {groups?.find((f) => f._id === activeForumId)?.name}
                        {groups?.find((f) => f._id === activeForumId)?.privacy === "private" && (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        <span>{groups?.find((f) => f._id === activeForumId)?.members_count} members</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {groups?.find((f) => f._id === activeForumId)?.category}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Badge variant={socketConnected ? "default" : "destructive"} className="gap-1">
                      {socketConnected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="flex h-[60vh] flex-col">
                <div className="flex-1 overflow-y-auto p-4">
  {messages.length === 0 ? (
    <div className="flex h-full flex-col items-center justify-center text-center p-4">
      <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground">No messages yet. Be the first to send a message!</p>
    </div>
  ) : (
    messages.map((message) => {
      const isCurrentUser = message.sender === anonId;
      return (
        <div key={message._id} className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <div className="flex max-w-[80%] gap-2">
            {!isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${message.sender}?size=32`}
                  alt={message.sender}
                />
                <AvatarFallback>
                  {message.sender.startsWith('anon-') 
                    ? message.sender.substr(5, 1).toUpperCase()
                    : message.sender.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-medium">
                  {message.sender.startsWith('anon-') 
                    ? `Anonymous ${message.sender.substr(5, 3)}`
                    : message.sender}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(new Date(message.sent_at))}
                </span>
              </div>
              <div
                className={`rounded-2xl px-4 py-2 ${
                  isCurrentUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.message}</p>
              </div>
            </div>
            
            {isCurrentUser && (
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${anonId}?size=32`}
                  alt="You"
                />
                <AvatarFallback>
                  {anonId.substr(5, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      );
    })
  )}
</div>
<div className="border-t p-4">
            {!isUserMemberOfForum(activeForumId) ? (
              <div className="text-center">
                <p className="mb-2 text-muted-foreground">You need to join this group to send messages</p>
                <Button onClick={() => handleJoinForum(activeForumId)}>Join Group</Button>
              </div>
            ) : (
              <>
                <div className="flex items-end gap-2">
                  <Textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message here..."
                    className="min-h-[60px] resize-none"
                    disabled={!socketConnected}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    className="h-10 w-10 rounded-full"
                    disabled={!messageInput.trim() || !socketConnected}
                  >
                    <Send className="h-5 w-5" />
                    <span className="sr-only">Send message</span>
                  </Button>
                </div>
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  <Shield className="mr-1 inline-block h-3 w-3" />
                  Messages are moderated by AI to ensure a safe environment
                </p>
              </>
            )}
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
                <Button
                  onClick={() => document.querySelector('[data-state="active"]')?.scrollIntoView({ behavior: "smooth" })}
                >
                  Browse All Groups
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  function getCategoryColor(category?: string) {
    if (!category) return "bg-gray-100 text-gray-800";
  
    switch (category.toLowerCase()) {
      case "anxiety":
        return "bg-blue-100 text-blue-800";
      case "depression":
        return "bg-purple-100 text-purple-800";
      case "stress":
        return "bg-green-100 text-green-800";
      case "grief":
        return "bg-amber-100 text-amber-800";
      case "addiction":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }