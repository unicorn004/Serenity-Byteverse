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

import { get_emotion } from "../../api/emotion";
import Groq from "groq-sdk";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY, dangerouslyAllowBrowser: true }); // Allow usage in the browser
// console.log("GROQ API KEY:", import.meta.env.VITE_GROQ_API_KEY);

type Emotion =
  | "happy"
  | "sad"
  | "angry"
  | "neutral"
  | "surprised"
  | "fear"
  | "disgust"
  | null;

interface EmotionData {
  emotion: Emotion;
  confidence: number;
  color: string;
  message: string;
  suggestions: string[];
}

const emotionColors = {
  happy: "#FFD700", // Gold
  sad: "#4682B4", // Steel Blue
  angry: "#FF4500", // Orange Red
  neutral: "#808080", // Gray
  surprised: "#FF69B4", // Hot Pink
  fearful: "#8B0000", // Dark Red
};

export default function EmotionsPage() {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>(null);
  const [emotionData, setEmotionData] = useState<EmotionData | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  const fetchGroqMessage = async (emotion, confidence) => {
    try {
      const response = await groq.chat.completions.create({
        model: "llama3-70b-8192", // ✅ Adjust model if needed
        messages: [
          {
            role: "system",
            content:
              "You are an AI that provides helpful messages and suggestions based on user emotions. Respond in JSON format.",
          },
          {
            role: "user",
            content: `The user is feeling "${emotion}" with a confidence score of ${confidence}. 
                    
                    - Provide a **short motivational message**.
                    - Give **3 helpful suggestions** that the user can follow.
                    
                    Respond strictly in JSON format:
                    {
                        "message": "Your motivational message here",
                        "suggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
                    }`,
          },
        ],
        max_tokens: 256, // ✅ Increased to avoid cut-off responses
        temperature: 0.7, // ✅ Adjusted for more creativity
      });

      console.log("Groq response = ", response);

      // Extract structured response
      const content = response.choices?.[0]?.message?.content || "{}";
      const parsedResponse = JSON.parse(content);

      console.log("message = ", parsedResponse.message);
      console.log("suggestions = ", parsedResponse.suggestions);

      return parsedResponse;
    } catch (error) {
      console.error("Groq API Error:", error);
      return {
        message: "Stay strong, you got this! 💪",
        suggestions: [
          "Take a deep breath and focus on the present moment.",
          "Engage in an activity that makes you happy.",
          "Reach out to someone for support or a friendly chat.",
        ],
      };
    }
  };

  const captureImage = async () => {
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

    // Convert canvas image to Blob
    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        setAnalyzing(false);
        console.error("Failed to capture image from canvas");
        return;
      }

      // Convert blob to File (Django expects a file)
      const imageFile = new File([blob], "captured_frame.jpg", {
        type: "image/jpeg",
      });

      try {
        // Call API with the captured image
        const response = await get_emotion(imageFile);
        console.log("Emotion Detection Response:", response);

        if (response && response.emotions) {
          const emotions = response.emotions; // Expected format: { happy: 0.5, sad: 0.2, ... }
          const highestEmotion = Object.entries(emotions).reduce(
            (max, [emotion, confidence]) =>
              confidence > max.confidence ? { emotion, confidence } : max,
            { emotion: "", confidence: 0 }
          );

          //const randomIndex = Math.floor(Math.random() * messages.length);

          const { emotion, confidence } = highestEmotion;

          // Get AI-generated message & suggestions
          const { message, suggestions } = await fetchGroqMessage(
            emotion,
            confidence
          );

          const edata = {
            emotion: emotion,
            confidence: confidence,
            color: emotionColors[emotion] || "#000000", // Default to black if not found
            message: message,
            suggestions: suggestions,
          };

          // Update state
          setCurrentEmotion(edata.emotion);
          setEmotionData(edata);
        } else {
          console.warn("Unexpected API response:", response);
        }
      } catch (error) {
        console.error("Error detecting emotion:", error);
      } finally {
        setAnalyzing(false);
      }
    }, "image/jpeg");
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
                    <Progress
                      value={
                        emotionData?.confidence
                          ? emotionData.confidence * 100
                          : emotionData?.confidence
                      }
                      className="h-2"
                    />
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
    case "fear":
      return "😨";
    case "disgust":
      return "🤮";
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
    case "fear":
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
    case "fear":
      return "Grounding techniques, exposure exercises, worry scheduling";
    default:
      return "Emotional awareness check-in, breathing exercises, mindful walking";
  }
}
