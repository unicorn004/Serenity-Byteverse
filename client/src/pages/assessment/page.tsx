import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  Brain,
  ScanLine,
  Lightbulb,
  ThumbsUp,
  AlertCircle,
  Loader,
} from "lucide-react";

import {
  getAssessments,
  postUserAssessment,
  getQuestions,
  postAnswer,
  gradeAssessment,
  assessUser,
} from "../../api/assessment";
import { all } from "axios";

const assessments = [
  {
    id: "depression",
    title: "Depression Assessment",
    description: "Evaluate symptoms of depression",
    icon: <Brain className="w-12 h-12 text-violet-700" />,
    questions: [
      {
        id: "depression-1",
        question:
          "How often have you felt down, depressed, or hopeless over the past two weeks?",
        type: "text",
      },
      {
        id: "depression-2",
        question:
          "How often have you had little interest or pleasure in doing things you usually enjoy?",
        type: "text",
      },
      {
        id: "depression-3",
        question:
          "How has your sleep been? Are you sleeping too much or having trouble sleeping?",
        type: "text",
      },
      {
        id: "depression-4",
        question: "How would you rate your energy levels throughout the day?",
        type: "text",
      },
      {
        id: "depression-5",
        question:
          "Have you had thoughts that you would be better off dead or of hurting yourself in some way?",
        type: "text",
      },
    ],
  },
  {
    id: "ptsd",
    title: "PTSD Assessment",
    description: "Evaluate symptoms of post-traumatic stress",
    icon: <AlertCircle className="w-12 h-12 text-violet-700" />,
    questions: [
      {
        id: "ptsd-1",
        question:
          "Do you experience recurrent, unwanted distressing memories of a traumatic event?",
        type: "text",
      },
      {
        id: "ptsd-2",
        question:
          "Do you experience upsetting dreams or nightmares related to a traumatic event?",
        type: "text",
      },
      {
        id: "ptsd-3",
        question:
          "Do you avoid thinking about or talking about the traumatic event?",
        type: "text",
      },
      {
        id: "ptsd-4",
        question:
          "Do you have negative thoughts about yourself, other people, or the world in general after the event?",
        type: "text",
      },
      {
        id: "ptsd-5",
        question:
          "Do you have trouble experiencing positive emotions or feeling emotionally numb?",
        type: "text",
      },
    ],
  },
  {
    id: "ocd",
    title: "OCD Assessment",
    description: "Evaluate symptoms of obsessive-compulsive disorder",
    icon: <ScanLine className="w-12 h-12 text-violet-700" />,
    questions: [
      {
        id: "ocd-1",
        question:
          "Do you experience unwanted, intrusive thoughts that cause anxiety or distress?",
        type: "text",
      },
      {
        id: "ocd-2",
        question:
          "Do you feel compelled to perform certain behaviors or mental acts repeatedly?",
        type: "text",
      },
      {
        id: "ocd-3",
        question:
          "How much time do you spend on these thoughts or behaviors each day?",
        type: "text",
      },
      {
        id: "ocd-4",
        question:
          "Do these thoughts or behaviors interfere with your daily activities or relationships?",
        type: "text",
      },
      {
        id: "ocd-5",
        question:
          "Do you recognize that these thoughts or behaviors are excessive or unreasonable?",
        type: "text",
      },
    ],
  },
  {
    id: "bipolar",
    title: "Bipolar Assessment",
    description: "Evaluate symptoms of bipolar disorder",
    icon: <Lightbulb className="w-12 h-12 text-violet-700" />,
    questions: [
      {
        id: "bipolar-1",
        question:
          "Have you experienced periods of feeling so energetic or active that others thought you were not your normal self?",
        type: "text",
      },
      {
        id: "bipolar-2",
        question:
          "Have you had periods where you needed much less sleep than usual but still felt rested?",
        type: "text",
      },
      {
        id: "bipolar-3",
        question:
          "Have you experienced episodes of depression where you felt sad, empty, or hopeless for most of the day?",
        type: "text",
      },
      {
        id: "bipolar-4",
        question:
          "Have you noticed that your moods cycle between extreme highs and lows?",
        type: "text",
      },
      {
        id: "bipolar-5",
        question:
          "During high periods, do you engage in risky behaviors such as spending sprees, sexual indiscretions, or poor business investments?",
        type: "text",
      },
    ],
  },
  {
    id: "gaslighting",
    title: "Gaslighting Assessment",
    description: "Evaluate if you are experiencing gaslighting",
    icon: <ThumbsUp className="w-12 h-12 text-violet-700" />,
    questions: [
      {
        id: "gaslighting-1",
        question:
          "Does someone in your life frequently tell you that your memories or perceptions of events are wrong?",
        type: "text",
      },
      {
        id: "gaslighting-2",
        question:
          "Do you often find yourself apologizing for things you dont think are your fault?",
        type: "text",
      },
      {
        id: "gaslighting-3",
        question:
          "Do you frequently question your own memory, perceptions, or judgment due to interactions with a specific person?",
        type: "text",
      },
      {
        id: "gaslighting-4",
        question:
          "Does someone in your life deny saying things that you clearly remember them saying?",
        type: "text",
      },
      {
        id: "gaslighting-5",
        question:
          'Do you feel confused, crazy, or "not yourself" after interactions with a specific person?',
        type: "text",
      },
    ],
  },
];

const icons = [
  <Brain className="w-12 h-12 text-violet-700" />,
  <AlertCircle className="w-12 h-12 text-violet-700" />,
  <ScanLine className="w-12 h-12 text-violet-700" />,
  <Lightbulb className="w-12 h-12 text-violet-700" />,
  <ThumbsUp className="w-12 h-12 text-violet-700" />,
];

const MentalHealthAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [isHovering, setIsHovering] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAssessments()
      .then((data) => {
        console.log("Fetched assessments:", data);

        // Append a random icon to each object
        const updatedData = data.map((item) => ({
          ...item,
          icon: icons[Math.floor(Math.random() * icons.length)],
        }));

        setAssessments(updatedData);
      })
      .catch((error) => {
        console.error("Error fetching assessments:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelectAssessment = async (assessment) => {
    try {
      setLoading(true); // Start loading
      await postUserAssessment(assessment.id); // Ensure assessment is posted before fetching questions

      const all_questions = await getQuestions(assessment.id); // Fetch questions
      console.log("questions = ", all_questions);

      setSelectedAssessment(assessment);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setQuestions(all_questions);
      setAssessmentStarted(true);
      setAssessmentComplete(false);
    } catch (error) {
      console.error("Error selecting assessment:", error);
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  // const handleNextQuestion = () => {
  //   if (currentQuestionIndex < questions.length - 1) {
  //     setCurrentQuestionIndex(currentQuestionIndex => currentQuestionIndex + 1);
  //   } else {
  //     setAssessmentComplete(true);
  //   }
  // };
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      postAnswer(
        questions[currentQuestionIndex].id,
        answers[questions[currentQuestionIndex].id]
      ); // Background API call
      console.log("answers = ",answers, "text = ", answers[questions[currentQuestionIndex].id]);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      // Ensure postAnswer completes before calling gradeAssessment
      postAnswer(
        questions[currentQuestionIndex].id,
        answers[questions[currentQuestionIndex].id]
      )
        .then(() => gradeAssessment(selectedAssessment.id)) // Grade only after postAnswer is done
        .catch((error) => console.error("Error grading assessment:", error));
      setAssessmentComplete(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(
        (currentQuestionIndex) => currentQuestionIndex - 1
      );
    }
  };

  const handleRestartAssessment = () => {
    setQuestions([]);
    setSelectedAssessment(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setAssessmentStarted(false);
    setAssessmentComplete(false);
  };

  // Gradient background for header
  const headerStyle = {
    background: "linear-gradient(135deg, #7e22ce 0%, #4c1d95 100%)",
  };

  // Pattern for main background (subtle dots)
  const mainBackgroundStyle = {
    backgroundImage:
      "radial-gradient(#8b5cf6 0.5px, transparent 0.5px), radial-gradient(#8b5cf6 0.5px, #f5f3ff 0.5px)",
    backgroundSize: "20px 20px",
    backgroundPosition: "0 0, 10px 10px",
  };

  const renderAssessmentSelection = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full p-8">
        {assessments.map((assessment) => (
          <motion.div
            key={assessment.id}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            onMouseEnter={() => setIsHovering(assessment.id)}
            onMouseLeave={() => setIsHovering(null)}
            className="perspective-800"
          >
            <Card
              className="h-full border-2 border-violet-300 hover:border-violet-500 cursor-pointer bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => handleSelectAssessment(assessment)}
            >
              <CardHeader className="bg-violet-100 rounded-t-lg">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-violet-800 text-xl">
                    {assessment.name}
                  </CardTitle>
                  {assessment.icon}
                </div>
                <CardDescription className="text-black/70">
                  {assessment.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 relative">
                <p className="text-black/80">
                  This assessment contains 5 questions about your experiences
                  with{" "}
                  {assessment.name.toLowerCase().replace(" assessment", "")}.
                </p>

                <motion.div
                  className="absolute bottom-0 right-0 w-full h-40 opacity-10"
                  initial={{ rotate: -5, scale: 0.9 }}
                  animate={{
                    rotate: isHovering === assessment.id ? 0 : -5,
                    scale: isHovering === assessment.id ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  {assessment.icon}
                </motion.div>
              </CardContent>
              <CardFooter className="bg-violet-50 rounded-b-lg flex justify-between p-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-violet-500 mr-2"></div>
                  <span className="text-xs text-violet-700">5 Questions</span>
                </div>
                <Button
                  variant="outline"
                  className="border-violet-500 text-violet-700 hover:bg-violet-100"
                >
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderQuestion = () => {
    if (!selectedAssessment) return null;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full max-w-3xl mx-auto p-6"
        >
          <Card className="border-2 border-violet-300 bg-white shadow-xl">
            <CardHeader className="bg-gradient-to-r from-violet-100 to-violet-200 rounded-t-lg">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  {selectedAssessment.icon}
                  <CardTitle className="text-violet-800 ml-3">
                    {selectedAssessment.name}
                  </CardTitle>
                </div>
                <span className="text-black/70 bg-white px-3 py-1 rounded-full text-sm font-medium">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="relative pt-1">
                <Progress
                  value={progress}
                  className="h-3 rounded-full bg-white overflow-hidden"
                />
                <div className="flex justify-between mt-1 text-xs text-violet-700">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <motion.h3
                className="text-xl font-medium mb-8 text-black leading-relaxed"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {currentQuestion.text}
              </motion.h3>
              <motion.div
                className="mt-4"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Textarea
                  placeholder="Type your answer here..."
                  className="min-h-32 border-violet-300 focus:border-violet-500 focus:ring-violet-500 text-lg transition-all duration-300 shadow-sm hover:shadow resize-none p-4"
                  value={answers[currentQuestion.id] || ""}
                  onChange={(e) =>
                    handleAnswerChange(currentQuestion.id, e.target.value)
                  }
                />
                <p className="text-violet-600 text-xs mt-2 italic">
                  Your answers are confidential and will help assess your mental
                  health needs.
                </p>
              </motion.div>
            </CardContent>
            <CardFooter className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-b-lg flex justify-between p-6">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="border-violet-500 text-violet-700 hover:bg-violet-100 px-6 disabled:opacity-50 transition-all duration-300"
              >
                Previous
              </Button>
              <Button
                variant="default"
                onClick={handleNextQuestion}
                className="bg-violet-600 hover:bg-violet-700 text-white px-8 shadow-md hover:shadow-lg transition-all duration-300"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Complete"
                  : "Next"}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderCompletionScreen = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-3xl mx-auto p-6"
      >
        <Card className="border-2 border-violet-300 bg-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 bg-violet-100 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 -ml-12 -mb-12 bg-violet-100 rounded-full opacity-50"></div>

          <CardHeader className="bg-gradient-to-r from-violet-700 to-violet-900 text-center relative overflow-hidden">
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="relative z-10"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-full">
                  <CheckCircle2 className="h-16 w-16 text-violet-600" />
                </div>
              </div>
              <CardTitle className="text-white text-2xl mb-2">
                Assessment Complete
              </CardTitle>
              <CardDescription className="text-violet-100">
                Thank you for completing the {selectedAssessment.name}
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent className="p-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-black/80 mb-6 text-lg">
                Your responses have been recorded. A mental health professional
                would review these responses to provide proper guidance.
              </p>
              <div className="bg-violet-50 p-6 rounded-lg mb-6">
                <h3 className="text-violet-900 font-semibold mb-2">
                  Important Note
                </h3>
                <p className="text-black/80">
                  Remember, this is just a screening tool and not a diagnostic
                  assessment. For a proper diagnosis, please consult with a
                  qualified healthcare provider.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={handleRestartAssessment}
                  className="border-violet-500 text-violet-700 hover:bg-violet-100 px-6"
                >
                  Take Another Assessment
                </Button>
                <Button
                  variant="default"
                  onClick={handleRestartAssessment}
                  className="bg-violet-600 hover:bg-violet-700 text-white px-8 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Return to Home
                </Button>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div
      className="min-h-screen bg-violet-50 flex flex-col"
      style={mainBackgroundStyle}
    >
      <header
        className="w-full text-white p-8 shadow-md relative overflow-hidden"
        style={headerStyle}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-3">
              Mental Health Assessment
            </h1>
            <p className="opacity-90 text-lg max-w-2xl">
              Complete an assessment to better understand your mental health and
              wellbeing. Your responses are confidential.
            </p>
          </motion.div>
        </div>

        {/* Abstract shapes for header background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-32 w-40 h-40 bg-white opacity-5 rounded-full -mb-20"></div>
      </header>

      <main className="flex-grow flex items-start justify-center w-full max-w-7xl mx-auto my-12 px-4">
        {loading ? (
          <div className="flex justify-center items-center w-full h-40 text-center">
            <Loader className="w-12 h-12 text-violet-700 animate-spin" />
          </div>
        ) : (
          <></>
        )}
        {!assessmentStarted && !loading && renderAssessmentSelection()}
        {assessmentStarted && !assessmentComplete && renderQuestion()}
        {assessmentComplete && renderCompletionScreen()}
      </main>

      <footer className="bg-black text-white p-6 text-center">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm opacity-80 max-w-2xl mx-auto">
            This tool is for educational purposes only. If you're experiencing a
            mental health emergency, please call your local emergency number or
            a mental health crisis hotline. Remember that seeking help is a sign
            of strength.
          </p>
          <div className="mt-4 flex justify-center space-x-8">
            <a
              href="#"
              className="text-violet-300 hover:text-violet-100 text-sm"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-violet-300 hover:text-violet-100 text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-violet-300 hover:text-violet-100 text-sm"
            >
              Get Help Now
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MentalHealthAssessment;
