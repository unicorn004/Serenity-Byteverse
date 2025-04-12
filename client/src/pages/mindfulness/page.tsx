import React, { useState, useEffect } from "react";
import { Calendar, Clock, Edit3, Moon, FlameIcon, PlayCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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

// Custom theme setup
const theme = {
  colors: {
    primary: "#8A2BE2", // Violet
    primaryLight: "#9D4EDD",
    primaryDark: "#6A0DAD",
    background: "#FFFFFF", // White
    text: "#121212", // Near black
    textMuted: "#4B4B4B",
    cardBg: "#F8F5FF",
  }
};

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
  const [activeTab, setActiveTab] = useState("instructions");

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
    setActiveTab("instructions");
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
// ----------------------------------edit here to post diary data to backend-------------------------------------------------------------->
  const markAsCompleted = () => {
    if (journalEntry.length >0){
        console.log("sending jornal data to backend");
        
    }
// --------------------------------------edit above------------------------------------------------------------------------------------>
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
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto max-w-5xl py-8 px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-col items-center justify-center text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
            <Moon className="h-10 w-10 text-purple-700" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-purple-800">Mindful Moments</h1>
          <p className="max-w-2xl text-gray-600">
            Cultivate presence and awareness with these mindfulness techniques
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-none bg-purple-50 shadow-lg overflow-hidden">
            <CardHeader className="pb-2 bg-gradient-to-r from-purple-700 to-violet-500">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-white">
                  <CardTitle className="text-2xl">Your Mindfulness Journey</CardTitle>
                  <CardDescription className="text-purple-100">Track your progress and build consistency</CardDescription>
                </div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm"
                >
                  <FlameIcon className="h-5 w-5 text-yellow-300" />
                  <span className="font-bold text-white">{streak} Day Streak</span>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-purple-800">Weekly Goal: 7 days</span>
                    <span className="text-sm font-medium text-purple-800">{Math.min(streak % 7, 7)}/7</span>
                  </div>
                  <Progress value={((streak % 7) * 100) / 7} className="h-3 bg-purple-100">
                    <div className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full"></div>
                  </Progress>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {Array.from({ length: 7 }).map((_, i) => {
                    const dayIndex = i + 1;
                    const isActive = dayIndex <= streak % 7 || (streak % 7 === 0 && streak > 0);

                    return (
                      <motion.div
                        key={i}
                        whileHover={{ scale: 1.1 }}
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          isActive ? "bg-purple-700 text-white" : "bg-purple-100 text-purple-400"
                        } shadow-sm transition-all duration-300`}
                      >
                        {dayIndex}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="rounded-xl bg-white p-5 text-center shadow-inner">
                  <p className="text-sm text-gray-600">
                    {completedToday
                      ? "You've completed your mindfulness practice for today. Great job!"
                      : "You haven't completed your mindfulness practice today yet. Choose a technique below to get started."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-purple-800">Mindfulness Techniques</h2>
            <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 px-3 py-1">
              Choose a practice
            </Badge>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {techniques.map((technique, index) => (
              <motion.div
                key={technique.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 30px rgba(138, 43, 226, 0.2)"
                }}
              >
                <Card
                  className="cursor-pointer bg-white border-none h-full transition-all duration-300 shadow-md overflow-hidden hover:shadow-lg"
                  onClick={() => openTechnique(technique)}
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-600"></div>
                  <CardHeader className="pb-2">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                      {technique.icon}
                    </div>
                    <CardTitle className="text-xl text-purple-800">{technique.name}</CardTitle>
                    <CardDescription className="text-gray-600">{technique.description}</CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0">
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="h-4 w-4" />
                        <span>{technique.duration / 60} minutes</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 text-purple-700 hover:text-purple-900 hover:bg-purple-50"
                      >
                        <PlayCircle className="h-4 w-4" /> Start
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-xl bg-gradient-to-br from-purple-100 to-purple-50 p-8 text-center shadow-lg"
        >
          <h3 className="mb-3 text-2xl font-bold text-purple-800">Daily Reflection</h3>
          <p className="mb-5 text-gray-600">
            Take a moment to reflect on how mindfulness is impacting your daily life
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="gap-2 bg-purple-700 hover:bg-purple-800 text-white"
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
          </motion.div>
        </motion.div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AnimatePresence>
            {selectedTechnique && isDialogOpen && (
              <DialogContent className="sm:max-w-md px-6 md:px-8 w-full max-w-md bg-white border-none shadow-xl rounded-xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader className="border-b border-purple-100 pb-4">
                    <DialogTitle className="flex items-center gap-3 text-xl text-purple-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        {selectedTechnique.icon}
                      </div>
                      <span>{selectedTechnique.name}</span>
                    </DialogTitle>
                    <DialogDescription className="text-gray-600">{selectedTechnique.description}</DialogDescription>
                  </DialogHeader>

                  <Tabs defaultValue="instructions" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                    <TabsList className="grid w-full grid-cols-2 bg-purple-50">
                      <TabsTrigger 
                        value="instructions" 
                        className="data-[state=active]:bg-white data-[state=active]:text-purple-800 data-[state=active]:shadow-none"
                      >
                        Instructions
                      </TabsTrigger>
                      <TabsTrigger 
                        value="practice" 
                        className="data-[state=active]:bg-white data-[state=active]:text-purple-800 data-[state=active]:shadow-none"
                      >
                        Practice
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="instructions" className="space-y-4 pt-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <ol className="ml-6 list-decimal space-y-3 text-gray-700">
                          {selectedTechnique.instructions.map((instruction, index) => (
                            <motion.li 
                              key={index}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 * index }}
                            >
                              {instruction}
                            </motion.li>
                          ))}
                        </ol>

                        <div className="mt-4 rounded-lg bg-purple-50 p-4 text-center">
                          <p className="text-sm text-purple-700">
                            Recommended practice time: {selectedTechnique.duration / 60} minutes
                          </p>
                        </div>
                        
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="flex justify-end"
                        >
                          <Button 
                            className="bg-purple-700 hover:bg-purple-800 text-white"
                            onClick={() => setActiveTab("practice")}
                          >
                            Start Practice
                          </Button>
                        </motion.div>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="practice" className="space-y-4 pt-4">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-4 flex flex-col items-center justify-center"
                      >
                        {selectedTechnique.id === "journaling" ? (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="w-full space-y-4"
                          >
                            <p className="text-center font-medium text-purple-800 bg-purple-50 py-3 px-4 rounded-lg">
                              Prompt: What emotions am I experiencing right now, and where do I feel them in my body?
                            </p>
                            <Textarea
                              placeholder="Start writing here..."
                              className="min-h-[180px] border-purple-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                              value={journalEntry}
                              onChange={(e) => setJournalEntry(e.target.value)}
                            />
                            <div className="flex justify-between">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>Suggested time: {selectedTechnique.duration / 60} minutes</span>
                              </div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  className="bg-purple-700 hover:bg-purple-800 text-white"
                                  onClick={markAsCompleted} 
                                  disabled={journalEntry.length < 10}
                                >
                                  I've Completed This
                                </Button>
                              </motion.div>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center"
                          >
                            <motion.div 
                              className="mb-8 relative"
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="absolute inset-0 rounded-full border-8 border-purple-200 animate-pulse"></div>
                              <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-purple-300 bg-white shadow-lg relative z-10">
                                <span className="text-4xl font-bold text-purple-800">{formatTime(timeRemaining)}</span>
                              </div>
                            </motion.div>

                            <div className="flex gap-3">
                              {!isTimerRunning ? (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    className="px-6 bg-purple-700 hover:bg-purple-800 text-white"
                                    onClick={startTimer}
                                  >
                                    Start
                                  </Button>
                                </motion.div>
                              ) : (
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    variant="outline" 
                                    className="px-6 border-purple-300 text-purple-700 hover:bg-purple-50"
                                    onClick={pauseTimer}
                                  >
                                    Pause
                                  </Button>
                                </motion.div>
                              )}
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button 
                                  variant="outline" 
                                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                                  onClick={resetTimer}
                                >
                                  Reset
                                </Button>
                              </motion.div>
                            </div>

                            {selectedTechnique.id === "box-breathing" && isTimerRunning && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mt-8 text-center bg-purple-50 py-4 px-8 rounded-xl"
                              >
                                <div className="mb-2 text-lg font-medium text-purple-800" id="breathing-instruction">
                                  {Math.floor((timeRemaining % 16) / 4) === 0
                                    ? "Inhale"
                                    : Math.floor((timeRemaining % 16) / 4) === 1
                                      ? "Hold"
                                      : Math.floor((timeRemaining % 16) / 4) === 2
                                        ? "Exhale"
                                        : "Hold"}
                                </div>
                                <motion.div 
                                  key={timeRemaining}
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-4xl font-bold text-purple-700"
                                >
                                  {timeRemaining % 4 === 0 ? 4 : timeRemaining % 4}
                                </motion.div>
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </TabsContent>
                  </Tabs>

                  <DialogFooter className="mt-6 border-t border-purple-100 pt-4 flex flex-col sm:flex-row gap-3">
                    {selectedTechnique.id !== "journaling" && (
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full sm:w-auto"
                      >
                        <Button 
                          className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white"
                          onClick={markAsCompleted}
                        >
                          I've Completed This
                        </Button>
                      </motion.div>
                    )}
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto"
                    >
                      <Button 
                        variant="outline" 
                        className="w-full sm:w-auto border-purple-300 text-purple-700 hover:bg-purple-50"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </motion.div>
                  </DialogFooter>
                </motion.div>
              </DialogContent>
            )}
          </AnimatePresence>
        </Dialog>
      </div>
    </div>
  );
};

export default MindfulnessPage;