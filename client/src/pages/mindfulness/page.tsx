import React, { useState, useEffect } from "react";
import { Calendar, Clock, Edit3, Moon } from "lucide-react";
import { FlameIcon, PlayCircle } from "lucide-react";

// For this example, we'll assume you have these UI components in your project
// You might need to install and import them from libraries like @mui/material, 
// chakra-ui, or create your own versions
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Create a simple toast implementation
const useToast = () => {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = ({ title, description }: { title: string; description: string }) => {
    alert(`${title}: ${description}`);
  };

  return { toast, toasts };
};

interface Technique {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  instructions: string[];
}

const MindfulnessPage: React.FC = () => {
  const { toast } = useToast();
  const [streak, setStreak] = useState(0);
  const [lastPracticeDate, setLastPracticeDate] = useState<string | null>(null);
  const [selectedTechnique, setSelectedTechnique] = useState<Technique | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");
  const [completedToday, setCompletedToday] = useState(false);

  // Load streak data from localStorage on component mount
  useEffect(() => {
    const savedStreak = localStorage.getItem("mindfulness-streak");
    const savedLastPractice = localStorage.getItem("mindfulness-last-practice");
    const savedCompletedToday = localStorage.getItem("mindfulness-completed-today");

    if (savedStreak) setStreak(Number.parseInt(savedStreak));
    if (savedLastPractice) setLastPracticeDate(savedLastPractice);
    if (savedCompletedToday === "true") setCompletedToday(true);

    // Check if streak should be reset (missed a day)
    if (savedLastPractice) {
      const lastPractice = new Date(savedLastPractice);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // If last practice was before yesterday, reset streak
      if (lastPractice < yesterday && lastPractice.toDateString() !== yesterday.toDateString()) {
        setStreak(0);
        localStorage.setItem("mindfulness-streak", "0");
      }

      // Reset completedToday flag if it's a new day
      if (lastPractice.toDateString() !== today.toDateString() && savedCompletedToday === "true") {
        setCompletedToday(false);
        localStorage.setItem("mindfulness-completed-today", "false");
      }
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (isTimerRunning && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (isTimerRunning && timeRemaining === 0) {
      setIsTimerRunning(false);
      toast({
        title: "Practice Complete",
        description: "Great job completing your mindfulness practice!",
      });
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isTimerRunning, timeRemaining, toast]);

  const openTechnique = (technique: Technique) => {
    setSelectedTechnique(technique);
    setTimeRemaining(technique.duration);
    setIsDialogOpen(true);
    setIsTimerRunning(false);
    setJournalEntry("");
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    if (selectedTechnique) {
      setTimeRemaining(selectedTechnique.duration);
      setIsTimerRunning(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const markAsCompleted = () => {
    const today = new Date();
    const todayString = today.toISOString();

    // If not already completed today, increment streak
    if (!completedToday) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setLastPracticeDate(todayString);
      setCompletedToday(true);

      // Save to localStorage
      localStorage.setItem("mindfulness-streak", newStreak.toString());
      localStorage.setItem("mindfulness-last-practice", todayString);
      localStorage.setItem("mindfulness-completed-today", "true");

      toast({
        title: "Streak Updated!",
        description: `You've practiced mindfulness for ${newStreak} consecutive days!`,
      });
    } else {
      toast({
        title: "Already Completed",
        description: "You've already completed your mindfulness practice for today.",
      });
    }

    setIsDialogOpen(false);
  };

  const techniques: Technique[] = [
    {
      id: "meditation",
      name: "Mindful Meditation",
      description: "A simple meditation focusing on your breath and present moment awareness.",
      icon: <Moon className="h-6 w-6" />,
      duration: 300, // 5 minutes in seconds
      instructions: [
        "Find a comfortable seated position with your back straight.",
        "Close your eyes or maintain a soft gaze.",
        "Bring your attention to your breath, noticing the sensation of air moving in and out.",
        "When your mind wanders, gently bring your focus back to your breath.",
        "Continue for the duration of the practice, allowing thoughts to come and go without judgment.",
      ],
    },
    {
      id: "box-breathing",
      name: "Box Breathing",
      description: "A structured breathing technique to reduce stress and improve focus.",
      icon: <Clock className="h-6 w-6" />,
      duration: 240, // 4 minutes in seconds
      instructions: [
        "Sit comfortably with your back straight.",
        "Inhale slowly through your nose for 4 seconds.",
        "Hold your breath for 4 seconds.",
        "Exhale slowly through your mouth for 4 seconds.",
        "Hold your breath for 4 seconds before inhaling again.",
        "Repeat this cycle for the duration of the practice.",
      ],
    },
    {
      id: "journaling",
      name: "Guided Journaling",
      description: "Reflective writing to process emotions and gain insights.",
      icon: <Edit3 className="h-6 w-6" />,
      duration: 600, // 10 minutes in seconds
      instructions: [
        "Find a quiet space where you won't be interrupted.",
        "Take a few deep breaths to center yourself.",
        "Consider the prompt: 'What emotions am I experiencing right now, and where do I feel them in my body?'",
        "Write freely without judging or editing your thoughts.",
        "After writing, take a moment to reflect on any insights or patterns you notice.",
      ],
    },
  ];

  return (
    <div className="container mx-auto max-w-5xl py-8 px-40">
      <div className="mb-8 flex flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Moon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-primary">Mindfulness Practice</h1>
        <p className="max-w-2xl text-muted-foreground">
          Cultivate presence and awareness with these mindfulness techniques
        </p>
      </div>

      <div className="mb-8">
        <Card className="border-none shadow-md">
          <CardHeader>
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div>
                <CardTitle>Your Mindfulness Journey</CardTitle>
                <CardDescription>Track your progress and build consistency</CardDescription>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
                <FlameIcon className="h-5 w-5 text-primary" />
                <span className="font-bold">{streak} Day Streak</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Weekly Goal: 7 days</span>
                  <span className="text-sm font-medium">{Math.min(streak % 7, 7)}/7</span>
                </div>
                <Progress value={((streak % 7) * 100) / 7} className="h-2" />
              </div>

              <div className="flex flex-wrap justify-center gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const dayIndex = i + 1;
                  const isActive = dayIndex <= streak % 7 || (streak % 7 === 0 && streak > 0);

                  return (
                    <div
                      key={i}
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {dayIndex}
                    </div>
                  );
                })}
              </div>

              <div className="rounded-lg bg-muted p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {completedToday
                    ? "You've completed your mindfulness practice for today. Great job!"
                    : "You haven't completed your mindfulness practice today yet. Choose a technique below to get started."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Mindfulness Techniques</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {techniques.map((technique) => (
            <Card
              key={technique.id}
              className="cursor-pointer border-none transition-all duration-300 hover:shadow-md"
              onClick={() => openTechnique(technique)}
            >
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {technique.icon}
                </div>
                <CardTitle className="text-xl">{technique.name}</CardTitle>
                <CardDescription>{technique.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{technique.duration / 60} minutes</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <PlayCircle className="h-4 w-4" /> Start
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-primary/5 p-6 text-center">
        <h3 className="mb-2 text-xl font-bold">Daily Reflection</h3>
        <p className="mb-4 text-muted-foreground">
          Take a moment to reflect on how mindfulness is impacting your daily life
        </p>
        <Button
          className="gap-2"
          onClick={() => {
            if (!completedToday) {
              toast({
                title: "Complete a Practice First",
                description: "Please complete a mindfulness practice before marking it as done.",
              });
            } else {
              toast({
                title: "Already Completed",
                description: "You've already completed your mindfulness practice for today.",
              });
            }
          }}
          disabled={completedToday}
        >
          <Calendar className="h-4 w-4" />I Did It Today
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {selectedTechnique && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedTechnique.icon}
                <span>{selectedTechnique.name}</span>
              </DialogTitle>
              <DialogDescription>{selectedTechnique.description}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="instructions">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="practice">Practice</TabsTrigger>
              </TabsList>

              <TabsContent value="instructions" className="space-y-4">
                <div className="mt-4 space-y-4">
                  <ol className="ml-6 list-decimal space-y-2">
                    {selectedTechnique.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>

                  <div className="rounded-lg bg-muted p-4">
                    <p className="text-sm text-muted-foreground">
                      Recommended practice time: {selectedTechnique.duration / 60} minutes
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="practice" className="space-y-4">
                <div className="mt-4 flex flex-col items-center justify-center">
                  {selectedTechnique.id === "journaling" ? (
                    <div className="w-full space-y-4">
                      <p className="text-center font-medium">
                        Prompt: What emotions am I experiencing right now, and where do I feel them in my body?
                      </p>
                      <Textarea
                        placeholder="Start writing here..."
                        className="min-h-[150px]"
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                      />
                      <div className="flex justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Suggested time: {selectedTechnique.duration / 60} minutes</span>
                        </div>
                        <Button size="sm" onClick={markAsCompleted} disabled={journalEntry.length < 10}>
                          I've Completed This
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary/20">
                        <span className="text-3xl font-bold">{formatTime(timeRemaining)}</span>
                      </div>

                      <div className="flex gap-2">
                        {!isTimerRunning ? (
                          <Button onClick={startTimer}>Start</Button>
                        ) : (
                          <Button variant="outline" onClick={pauseTimer}>
                            Pause
                          </Button>
                        )}
                        <Button variant="outline" onClick={resetTimer}>
                          Reset
                        </Button>
                      </div>

                      {selectedTechnique.id === "box-breathing" && isTimerRunning && (
                        <div className="mt-6 text-center">
                          <div className="mb-2 text-lg font-medium" id="breathing-instruction">
                            {Math.floor((timeRemaining % 16) / 4) === 0
                              ? "Inhale"
                              : Math.floor((timeRemaining % 16) / 4) === 1
                                ? "Hold"
                                : Math.floor((timeRemaining % 16) / 4) === 2
                                  ? "Exhale"
                                  : "Hold"}
                          </div>
                          <div className="text-3xl font-bold">{timeRemaining % 4 === 0 ? 4 : timeRemaining % 4}</div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              {selectedTechnique.id !== "journaling" && <Button onClick={markAsCompleted}>I've Completed This</Button>}
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default MindfulnessPage;