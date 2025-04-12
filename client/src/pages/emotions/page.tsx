import { useState, useRef, useEffect } from "react";
import { Camera, RefreshCw, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
//import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "neutral"
  | "surprised"
  | "fearful"
  | null;

interface EmotionData {
  emotion: Emotion;
  confidence: number;
  color: string;
  message: string;
  suggestions: string[];
}

export default function EmotionsPage() {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(null);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const emotions: Record<string, EmotionData> = {
    happy: {
      emotion: "happy",
      confidence: 87,
      color: "bg-green-500",
      message: "You're feeling happy! That's wonderful to see.",
      suggestions: [
        "Celebrate this positive mood by doing something you enjoy",
        "Share your happiness with someone else through a kind gesture",
        "Journal about what's contributing to your happiness",
        "Use this energy for a creative project you've been wanting to start",
      ],
    },
    sad: {
      emotion: "sad",
      confidence: 76,
      color: "bg-blue-500",
      message: "You seem to be feeling sad. It's okay to feel this way.",
      suggestions: [
        "Practice self-compassion and be gentle with yourself",
        "Try a brief mindfulness meditation to acknowledge your feelings",
        "Reach out to a trusted friend or family member",
        "Engage in a calming activity like reading or listening to music",
      ],
    },
    angry: {
      emotion: "angry",
      confidence: 82,
      color: "bg-red-500",
      message: "You appear to be feeling angry or frustrated.",
      suggestions: [
        "Take a few deep breaths to help calm your nervous system",
        "Try physical activity to release tension, like a brisk walk",
        "Write down what's bothering you to gain perspective",
        "Consider if there's a constructive way to address what's upsetting you",
      ],
    },
    neutral: {
      emotion: "neutral",
      confidence: 91,
      color: "bg-gray-500",
      message: "You seem to be in a neutral state right now.",
      suggestions: [
        "This is a good time for planning or decision-making",
        "Consider checking in with yourself about how you're really feeling",
        "Try a brief gratitude practice to boost positive emotions",
        "Use this balanced state for a mindfulness practice",
      ],
    },
    surprised: {
      emotion: "surprised",
      confidence: 68,
      color: "bg-purple-500",
      message: "You look surprised! Something unexpected happened?",
      suggestions: [
        "Take a moment to process what surprised you",
        "Consider whether this surprise is positive, negative, or neutral",
        "Use this alertness for creative thinking or problem-solving",
        "If the surprise was stressful, try some deep breathing",
      ],
    },
    fearful: {
      emotion: "fearful",
      confidence: 73,
      color: "bg-yellow-500",
      message: "You seem to be experiencing fear or anxiety.",
      suggestions: [
        "Try the 5-4-3-2-1 grounding technique (notice 5 things you see, 4 things you feel, etc.)",
        "Focus on your breathing - try breathing in for 4 counts, hold for 2, out for 6",
        "Remind yourself that you are safe right now",
        "Consider what specific fear is present and if there are steps you can take",
      ],
    },
  };


  const startCamera = async () => {
    if (!videoRef.current) {
      console.warn("videoRef.current is null. Retrying in 200ms...");
      setTimeout(startCamera, 200);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });
      videoRef.current.srcObject = stream;
      setCameraActive(true);
      console.log("Camera started successfully");
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      console.log("Camera stopped successfully");
    } else {
      console.warn("Camera is not active or already stopped");
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setAnalyzing(true);

    const context = canvasRef.current.getContext("2d");
    if (!context) return;

    // Set canvas dimensions to match video
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    // Draw the current video frame to the canvas
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );

    // Simulate emotion detection (in a real app, you'd send the image to an API)
    setTimeout(() => {
      const emotions = [
        "happy",
        "sad",
        "angry",
        "neutral",
        "surprised",
        "fearful",
      ];
      const randomEmotion = emotions[
        Math.floor(Math.random() * emotions.length)
      ] as Emotion;

      setCurrentEmotion(randomEmotion);
      setEmotionData(emotions[randomEmotion]);
      setAnalyzing(false);
    }, 2000);
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="container mx-auto max-w-5xl py-8 lg:pl-15 lg:pr-15 md:pl-10 md:pr-10 sm:pl-5 sm:pr-5">
      <h1 className="mb-8 text-center text-3xl font-bold text-primary">
        Emotion Detection
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Camera Feed</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">
                        We use AI to detect your emotions from facial
                        expressions. Your privacy is important - images are
                        processed locally and not stored.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <CardDescription>
                Allow camera access to detect your emotional state
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
                {/* Always render the video element but control visibility */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`h-full w-full object-cover ${
                    cameraActive ? "block" : "hidden"
                  }`}
                />
                {/* Show placeholder when camera is off */}
                {!cameraActive && (
                  <div className="flex h-full flex-col items-center justify-center">
                    <Camera className="mb-2 h-12 w-12 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Camera is off
                    </p>
                  </div>
                )}
                {/* Show analyzing overlay when analyzing */}
                {analyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    <p className="text-lg font-medium">
                      Analyzing your emotion...
                    </p>
                  </div>
                )}
                {/* Hidden canvas for capturing frames */}
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant={cameraActive ? "destructive" : "default"}
                onClick={cameraActive ? stopCamera : startCamera}
              >
                {cameraActive ? "Turn Off Camera" : "Turn On Camera"}
              </Button>
              <Button
                onClick={captureImage}
                disabled={!cameraActive || analyzing}
                className="gap-2"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Detect Emotion"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card
            className={`border-none shadow-md transition-all duration-500 ${
              currentEmotion ? "opacity-100" : "opacity-70"
            }`}
          >
            <CardHeader>
              <CardTitle>Emotion Analysis</CardTitle>
              <CardDescription>
                {currentEmotion
                  ? "Here's what we detected about your emotional state"
                  : "Turn on your camera and click 'Detect Emotion' to begin"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {currentEmotion ? (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold capitalize">
                        {currentEmotion}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Confidence: {emotionData?.confidence}%
                      </p>
                    </div>
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-full ${emotionData?.color} text-white`}
                    >
                      {getEmotionIcon(currentEmotion)}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">Emotion Intensity</h4>
                    <Progress value={emotionData?.confidence} className="h-2" />
                  </div>

                  <div>
                    <h4 className="mb-2 font-medium">Analysis</h4>
                    <p className="text-sm">{emotionData?.message}</p>
                  </div>
                </div>
              ) : (
                <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground">
                  <div className="mb-4 rounded-full bg-muted p-3">
                    <Camera className="h-6 w-6" />
                  </div>
                  <p>No emotion detected yet</p>
                  <p className="text-sm">Enable your camera to get started</p>
                </div>
              )}
            </CardContent>
          </Card>

          {currentEmotion && (
            <Card className="mt-6 border-none shadow-md">
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
                <CardDescription>
                  Based on your current emotional state
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="suggestions">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="resources">Resources</TabsTrigger>
                  </TabsList>

                  <TabsContent value="suggestions" className="mt-4">
                    <ul className="space-y-2">
                      {emotionData?.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></div>
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </TabsContent>

                  <TabsContent value="resources" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <h4 className="mb-1 font-medium">Guided Meditation</h4>
                        <p className="text-sm text-muted-foreground">
                          5-minute meditation for{" "}
                          {currentEmotion === "happy"
                            ? "joy amplification"
                            : "emotional balance"}
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-1 font-medium">Reading Material</h4>
                        <p className="text-sm text-muted-foreground">
                          {getReadingMaterial(currentEmotion)}
                        </p>
                      </div>

                      <div>
                        <h4 className="mb-1 font-medium">Exercises</h4>
                        <p className="text-sm text-muted-foreground">
                          {getExercises(currentEmotion)}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function getEmotionIcon(emotion: Emotion) {
  switch (emotion) {
    case "happy":
      return "😊";
    case "sad":
      return "😢";
    case "angry":
      return "😠";
    case "neutral":
      return "😐";
    case "surprised":
      return "😲";
    case "fearful":
      return "😨";
    default:
      return "❓";
  }
}

function getReadingMaterial(emotion: Emotion) {
  switch (emotion) {
    case "happy":
      return '"The Science of Savoring Positive Emotions" - techniques to extend positive feelings';
    case "sad":
      return '"Embracing Difficult Emotions" - how sadness can lead to personal growth';
    case "angry":
      return '"Constructive Approaches to Anger" - channeling anger productively';
    case "neutral":
      return '"Mindfulness in Everyday Life" - finding meaning in ordinary moments';
    case "surprised":
      return '"Adapting to Unexpected Change" - turning surprises into opportunities';
    case "fearful":
      return '"Understanding Your Fear Response" - techniques to manage anxiety';
    default:
      return '"Emotional Intelligence" - understanding your emotional landscape';
  }
}

function getExercises(emotion: Emotion) {
  switch (emotion) {
    case "happy":
      return "Gratitude journaling, savoring walk, sharing positive experiences";
    case "sad":
      return "Self-compassion meditation, gentle movement, expressive writing";
    case "angry":
      return "Progressive muscle relaxation, physical exercise, reframing techniques";
    case "neutral":
      return "Body scan meditation, sensory awareness practice, values reflection";
    case "surprised":
      return "Curiosity journaling, flexible thinking exercises, adaptation planning";
    case "fearful":
      return "Grounding techniques, exposure exercises, worry scheduling";
    default:
      return "Emotional awareness check-in, breathing exercises, mindful walking";
  }
}
