// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Progress } from "@/components/ui/progress";
// import {
//   CheckCircle2,
//   Brain,
//   ScanLine,
//   Lightbulb,
//   ThumbsUp,
//   AlertCircle,
//   Loader,
// } from "lucide-react";

// import {
//   getAssessments,
//   postUserAssessment,
//   getQuestions,
//   postAnswer,
//   gradeAssessment,
//   assessUser,
//   getAssessmentResult,
// } from "../../api/assessment";
// import { all } from "axios";
// import {getUserFromCookie} from "../../utils/get-user"


// const icons = [
//   <Brain className="w-12 h-12 text-violet-700" />,
//   <AlertCircle className="w-12 h-12 text-violet-700" />,
//   <ScanLine className="w-12 h-12 text-violet-700" />,
//   <Lightbulb className="w-12 h-12 text-violet-700" />,
//   <ThumbsUp className="w-12 h-12 text-violet-700" />,
// ];

// const MentalHealthAssessment = () => {
//   const [assessments, setAssessments] = useState([]);
//   const [selectedAssessment, setSelectedAssessment] = useState(null);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [assessmentStarted, setAssessmentStarted] = useState(false);
//   const [assessmentComplete, setAssessmentComplete] = useState(false);
//   const [isHovering, setIsHovering] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [questions, setQuestions] = useState([]);
//   const [assessmentResults, setAssessmentResults] = useState({});

//   useEffect(() => {
//     setLoading(true);
//     getAssessments()
//       .then((data) => {
//         console.log("Fetched assessments:", data);

//         // Append a random icon to each object
//         const updatedData = data.map((item) => ({
//           ...item,
//           icon: icons[Math.floor(Math.random() * icons.length)],
//         }));

//         setAssessments(updatedData);

//         getAssessmentResult()
//           .then((data) => {
//             console.log("Fetched Assessment Results:", data);

//             // Process and filter assessment results
//             const userId = getUserFromCookie().profile_id; // Replace with actual user ID
//             const filteredResults = data.filter((item) => item.user === userId);

//             // Group by assessment ID
//             const groupedResults = filteredResults.reduce((acc, item) => {
//               if (!acc[item.assessment]) {
//                 acc[item.assessment] = [];
//               }
//               acc[item.assessment].push(item);
//               return acc;
//             }, {});

//             console.log("Grouped Results = ",groupedResults)

//             setAssessmentResults(groupedResults);
//           })
//           .catch((err) => {
//             console.log("Error fetching assessment results:", err);
//           });
//       })
//       .catch((error) => {
//         console.error("Error fetching assessments:", error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   }, []);

//   const handleSelectAssessment = async (assessment) => {
//     try {
//       setLoading(true); // Start loading
//       const response = await postUserAssessment(assessment.id); // Ensure assessment is posted before fetching questions (before grading actually)

//       const all_questions = await getQuestions(assessment.id); // Fetch questions
//       console.log("questions = ", all_questions);

//       setSelectedAssessment(assessment);
//       setCurrentQuestionIndex(0);
//       setAnswers({});
//       setQuestions(all_questions);
//       setAssessmentStarted(true);
//       setAssessmentComplete(false);
//     } catch (error) {
//       console.error("Error selecting assessment:", error);
//     } finally {
//       setLoading(false); // Stop loading regardless of success or failure
//     }
//   };

//   const handleAnswerChange = (questionId, answer) => {
//     setAnswers({
//       ...answers,
//       [questionId]: answer,
//     });
//   };

//   const handleNextQuestion = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       postAnswer(
//         questions[currentQuestionIndex].id,
//         answers[questions[currentQuestionIndex].id]
//       ); // Background API call
//       console.log(
//         "answers = ",
//         answers,
//         "text = ",
//         answers[questions[currentQuestionIndex].id]
//       );
//       setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     } else {
//       // Ensure postAnswer completes before calling gradeAssessment
//       postAnswer(
//         questions[currentQuestionIndex].id,
//         answers[questions[currentQuestionIndex].id]
//       )
//         .then(() => gradeAssessment(selectedAssessment.id)) // Grade only after postAnswer is done
//         .catch((error) => console.error("Error grading assessment:", error));
//       setAssessmentComplete(true);
//     }
//   };

//   const handlePrevQuestion = () => {
//     if (currentQuestionIndex > 0) {
//       setCurrentQuestionIndex(
//         (currentQuestionIndex) => currentQuestionIndex - 1
//       );
//     }
//   };

//   const handleRestartAssessment = () => {
//     setQuestions([]);
//     setSelectedAssessment(null);
//     setCurrentQuestionIndex(0);
//     setAnswers({});
//     setAssessmentStarted(false);
//     setAssessmentComplete(false);
//   };

//   // Gradient background for header
//   const headerStyle = {
//     background: "linear-gradient(135deg, #7e22ce 0%, #4c1d95 100%)",
//   };

//   // Pattern for main background (subtle dots)
//   const mainBackgroundStyle = {
//     backgroundImage:
//       "radial-gradient(#8b5cf6 0.5px, transparent 0.5px), radial-gradient(#8b5cf6 0.5px, #f5f3ff 0.5px)",
//     backgroundSize: "20px 20px",
//     backgroundPosition: "0 0, 10px 10px",
//   };

//   const renderAssessmentSelection = () => {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full p-8">
//         {assessments.map((assessment) => (
//           <motion.div
//             key={assessment.id}
//             whileHover={{ scale: 1.03, y: -5 }}
//             whileTap={{ scale: 0.98 }}
//             transition={{ type: "spring", stiffness: 400, damping: 17 }}
//             onMouseEnter={() => setIsHovering(assessment.id)}
//             onMouseLeave={() => setIsHovering(null)}
//             className="perspective-800"
//           >
//             <Card
//               className="h-full border-2 border-violet-300 hover:border-violet-500 cursor-pointer bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
//               onClick={() => handleSelectAssessment(assessment)}
//             >
//               <CardHeader className="bg-violet-100 rounded-t-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <CardTitle className="text-violet-800 text-xl">
//                     {assessment.name}
//                   </CardTitle>
//                   {assessment.icon}
//                 </div>
//                 <CardDescription className="text-black/70">
//                   {assessment.description}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="p-6 relative">
//                 <p className="text-black/80">
//                   This assessment contains 5 questions about your experiences
//                   with{" "}
//                   {assessment.name.toLowerCase().replace(" assessment", "")}.
//                 </p>

//                 <motion.div
//                   className="absolute bottom-0 right-0 w-full h-40 opacity-10"
//                   initial={{ rotate: -5, scale: 0.9 }}
//                   animate={{
//                     rotate: isHovering === assessment.id ? 0 : -5,
//                     scale: isHovering === assessment.id ? 1 : 0.9,
//                   }}
//                   transition={{ duration: 0.4 }}
//                 >
//                   {assessment.icon}
//                 </motion.div>
//               </CardContent>
//               <CardFooter className="bg-violet-50 rounded-b-lg flex justify-between p-4">
//                 <div className="flex items-center">
//                   <div className="w-2 h-2 rounded-full bg-violet-500 mr-2"></div>
//                   <span className="text-xs text-violet-700">5 Questions</span>
//                 </div>
//                 <Button
//                   variant="outline"
//                   className="border-violet-500 text-violet-700 hover:bg-violet-100"
//                 >
//                   Start Assessment
//                 </Button>
//               </CardFooter>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     );
//   };

//   const renderQuestion = () => {
//     if (!selectedAssessment) return null;

//     const currentQuestion = questions[currentQuestionIndex];
//     const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

//     return (
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={currentQuestion.id}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.4, ease: "easeOut" }}
//           className="w-full max-w-3xl mx-auto p-6"
//         >
//           <Card className="border-2 border-violet-300 bg-white shadow-xl">
//             <CardHeader className="bg-gradient-to-r from-violet-100 to-violet-200 rounded-t-lg">
//               <div className="flex justify-between items-center mb-3">
//                 <div className="flex items-center">
//                   {selectedAssessment.icon}
//                   <CardTitle className="text-violet-800 ml-3">
//                     {selectedAssessment.name}
//                   </CardTitle>
//                 </div>
//                 <span className="text-black/70 bg-white px-3 py-1 rounded-full text-sm font-medium">
//                   Question {currentQuestionIndex + 1} of {questions.length}
//                 </span>
//               </div>
//               <div className="relative pt-1">
//                 <Progress
//                   value={progress}
//                   className="h-3 rounded-full bg-white overflow-hidden"
//                 />
//                 <div className="flex justify-between mt-1 text-xs text-violet-700">
//                   <span>Progress</span>
//                   <span>{Math.round(progress)}%</span>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="p-8">
//               <motion.h3
//                 className="text-xl font-medium mb-8 text-black leading-relaxed"
//                 initial={{ x: -10, opacity: 0 }}
//                 animate={{ x: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 {currentQuestion.text}
//               </motion.h3>
//               <motion.div
//                 className="mt-4"
//                 initial={{ y: 10, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.3 }}
//               >
//                 <Textarea
//                   placeholder="Type your answer here..."
//                   className="min-h-32 border-violet-300 focus:border-violet-500 focus:ring-violet-500 text-lg transition-all duration-300 shadow-sm hover:shadow resize-none p-4"
//                   value={answers[currentQuestion.id] || ""}
//                   onChange={(e) =>
//                     handleAnswerChange(currentQuestion.id, e.target.value)
//                   }
//                 />
//                 <p className="text-violet-600 text-xs mt-2 italic">
//                   Your answers are confidential and will help assess your mental
//                   health needs.
//                 </p>
//               </motion.div>
//             </CardContent>
//             <CardFooter className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-b-lg flex justify-between p-6">
//               <Button
//                 variant="outline"
//                 onClick={handlePrevQuestion}
//                 disabled={currentQuestionIndex === 0}
//                 className="border-violet-500 text-violet-700 hover:bg-violet-100 px-6 disabled:opacity-50 transition-all duration-300"
//               >
//                 Previous
//               </Button>
//               <Button
//                 variant="default"
//                 onClick={handleNextQuestion}
//                 className="bg-violet-600 hover:bg-violet-700 text-white px-8 shadow-md hover:shadow-lg transition-all duration-300"
//               >
//                 {currentQuestionIndex === questions.length - 1
//                   ? "Complete"
//                   : "Next"}
//               </Button>
//             </CardFooter>
//           </Card>
//         </motion.div>
//       </AnimatePresence>
//     );
//   };

//   const renderCompletionScreen = () => {
//     return (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6, type: "spring" }}
//         className="w-full max-w-3xl mx-auto p-6"
//       >
//         <Card className="border-2 border-violet-300 bg-white shadow-xl overflow-hidden">
//           <div className="absolute top-0 right-0 w-40 h-40 -mr-16 -mt-16 bg-violet-100 rounded-full opacity-50"></div>
//           <div className="absolute bottom-0 left-0 w-32 h-32 -ml-12 -mb-12 bg-violet-100 rounded-full opacity-50"></div>

//           <CardHeader className="bg-gradient-to-r from-violet-700 to-violet-900 text-center relative overflow-hidden">
//             <motion.div
//               initial={{ y: -100, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: 0.2, type: "spring" }}
//               className="relative z-10"
//             >
//               <div className="flex justify-center mb-4">
//                 <div className="bg-white p-4 rounded-full">
//                   <CheckCircle2 className="h-16 w-16 text-violet-600" />
//                 </div>
//               </div>
//               <CardTitle className="text-white text-2xl mb-2">
//                 Assessment Complete
//               </CardTitle>
//               <CardDescription className="text-violet-100">
//                 Thank you for completing the {selectedAssessment.name}
//               </CardDescription>
//             </motion.div>
//           </CardHeader>

//           <CardContent className="p-8 text-center relative z-10">
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//             >
//               <p className="text-black/80 mb-6 text-lg">
//                 Your responses have been recorded. A mental health professional
//                 would review these responses to provide proper guidance.
//               </p>
//               <div className="bg-violet-50 p-6 rounded-lg mb-6">
//                 <h3 className="text-violet-900 font-semibold mb-2">
//                   Important Note
//                 </h3>
//                 <p className="text-black/80">
//                   Remember, this is just a screening tool and not a diagnostic
//                   assessment. For a proper diagnosis, please consult with a
//                   qualified healthcare provider.
//                 </p>
//               </div>
//               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
//                 <Button
//                   variant="outline"
//                   onClick={handleRestartAssessment}
//                   className="border-violet-500 text-violet-700 hover:bg-violet-100 px-6"
//                 >
//                   Take Another Assessment
//                 </Button>
//                 <Button
//                   variant="default"
//                   onClick={handleRestartAssessment}
//                   className="bg-violet-600 hover:bg-violet-700 text-white px-8 shadow-md hover:shadow-lg transition-all duration-300"
//                 >
//                   Return to Home
//                 </Button>
//               </div>
//             </motion.div>
//           </CardContent>
//         </Card>
//       </motion.div>
//     );
//   };

//   return (
//     <div
//       className="min-h-screen bg-violet-50 flex flex-col"
//       style={mainBackgroundStyle}
//     >
//       <header
//         className="w-full text-white p-8 shadow-md relative overflow-hidden"
//         style={headerStyle}
//       >
//         <div className="max-w-7xl mx-auto relative z-10">
//           <motion.div
//             initial={{ y: -20, opacity: 0 }}
//             animate={{ y: 0, opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h1 className="text-4xl font-bold mb-3">
//               Mental Health Assessment
//             </h1>
//             <p className="opacity-90 text-lg max-w-2xl">
//               Complete an assessment to better understand your mental health and
//               wellbeing. Your responses are confidential.
//             </p>
//           </motion.div>
//         </div>

//         {/* Abstract shapes for header background */}
//         <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
//         <div className="absolute bottom-0 left-32 w-40 h-40 bg-white opacity-5 rounded-full -mb-20"></div>
//       </header>

//       <main className="flex-grow flex items-start justify-center w-full max-w-7xl mx-auto my-12 px-4">
//         {loading ? (
//           <div className="flex justify-center items-center w-full h-40 text-center">
//             <Loader className="w-12 h-12 text-violet-700 animate-spin" />
//           </div>
//         ) : (
//           <></>
//         )}
//         {!assessmentStarted && !loading && renderAssessmentSelection()}
//         {assessmentStarted && !assessmentComplete && renderQuestion()}
//         {assessmentComplete && renderCompletionScreen()}
//       </main>

//       <footer className="bg-black text-white p-6 text-center">
//         <div className="max-w-7xl mx-auto">
//           <p className="text-sm opacity-80 max-w-2xl mx-auto">
//             This tool is for educational purposes only. If you're experiencing a
//             mental health emergency, please call your local emergency number or
//             a mental health crisis hotline. Remember that seeking help is a sign
//             of strength.
//           </p>
//           <div className="mt-4 flex justify-center space-x-8">
//             <a
//               href="#"
//               className="text-violet-300 hover:text-violet-100 text-sm"
//             >
//               Terms of Service
//             </a>
//             <a
//               href="#"
//               className="text-violet-300 hover:text-violet-100 text-sm"
//             >
//               Privacy Policy
//             </a>
//             <a
//               href="#"
//               className="text-violet-300 hover:text-violet-100 text-sm"
//             >
//               Get Help Now
//             </a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default MentalHealthAssessment;


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
  ArrowLeft,
  ClipboardList,
  Calendar,
  LineChart,
  MessageSquare,
  Sparkles,
} from "lucide-react";

import {
  getAssessments,
  postUserAssessment,
  getQuestions,
  postAnswer,
  gradeAssessment,
  assessUser,
  getAssessmentResult,
} from "../../api/assessment";
import { all } from "axios";
import { getUserFromCookie } from "../../utils/get-user";

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
  const [assessmentResults, setAssessmentResults] = useState({});
  const [viewingResults, setViewingResults] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);

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

        getAssessmentResult()
          .then((data) => {
            console.log("Fetched Assessment Results:", data);

            // Process and filter assessment results
            const userId = getUserFromCookie().profile_id; // Replace with actual user ID
            const filteredResults = data.filter((item) => item.user === userId);

            // Group by assessment ID
            const groupedResults = filteredResults.reduce((acc, item) => {
              if (!acc[item.assessment]) {
                acc[item.assessment] = [];
              }
              acc[item.assessment].push(item);
              return acc;
            }, {});

            console.log("Grouped Results = ", groupedResults);

            setAssessmentResults(groupedResults);
          })
          .catch((err) => {
            console.log("Error fetching assessment results:", err);
          });
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
      const response = await postUserAssessment(assessment.id); // Ensure assessment is posted before fetching questions (before grading actually)

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

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      postAnswer(
        questions[currentQuestionIndex].id,
        answers[questions[currentQuestionIndex].id]
      ); // Background API call
      console.log(
        "answers = ",
        answers,
        "text = ",
        answers[questions[currentQuestionIndex].id]
      );
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

  const handleViewResults = (assessment) => {
    const results = assessmentResults[assessment.id] || [];
    if (results.length > 0) {
      // Sort by date_taken, most recent first
      const sortedResults = [...results].sort((a, b) => 
        new Date(b.date_taken) - new Date(a.date_taken)
      );
      setSelectedResult(sortedResults[0]); // Show most recent result
      setViewingResults(true);
    }
  };

  const handleBackFromResults = () => {
    setViewingResults(false);
    setSelectedResult(null);
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
        {assessments.map((assessment) => {
          const hasResults = assessmentResults[assessment.id] && 
                           assessmentResults[assessment.id].length > 0;
          
          return (
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
                className="h-full border-2 border-violet-300 hover:border-violet-500 bg-white overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
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

                  {hasResults && (
                    <div className="mt-4">
                      <div className="flex items-center text-green-600">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span className="text-sm">Previously completed</span>
                      </div>
                    </div>
                  )}

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
                  <div className="flex gap-2">
                    {hasResults && (
                      <Button
                        variant="outline"
                        className="border-green-500 text-green-700 hover:bg-green-100"
                        onClick={() => handleViewResults(assessment)}
                      >
                        <ClipboardList className="h-4 w-4 mr-1" /> View Results
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="border-violet-500 text-violet-700 hover:bg-violet-100"
                      onClick={() => handleSelectAssessment(assessment)}
                    >
                      Start Assessment
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
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

  const renderResultsScreen = () => {
    if (!selectedResult) return null;
    
    // Format the date
    const dateTaken = new Date(selectedResult.date_taken);
    const formattedDate = dateTaken.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Get the assessment info
    const assessmentInfo = assessments.find(a => a.id === selectedResult.assessment);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-4xl mx-auto p-6"
      >
        <Card className="border-2 border-violet-300 bg-white shadow-xl">
          <CardHeader className="bg-gradient-to-r from-violet-700 to-violet-900 text-white rounded-t-lg relative overflow-hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBackFromResults}
              className="absolute top-4 left-4 text-white hover:bg-white/20 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div className="text-center mt-6">
              <div className="flex justify-center mb-4">
                {assessmentInfo?.icon || <ClipboardList className="h-16 w-16 text-white" />}
              </div>
              <CardTitle className="text-2xl mb-2">
                {assessmentInfo ? assessmentInfo.name : 'Assessment'} Results
              </CardTitle>
              <CardDescription className="text-violet-100">
                <div className="flex items-center justify-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formattedDate}
                </div>
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-violet-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <LineChart className="h-6 w-6 text-violet-700 mr-3" />
                  <h3 className="text-lg font-semibold text-violet-900">Assessment Summary</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-violet-700 mb-1">Severity Level</p>
                    <div className="flex items-center">
                      <div className={`px-3 py-1 rounded-full text-white font-medium ${
                        selectedResult.severity.includes("Highly") 
                          ? "bg-red-500" 
                          : selectedResult.severity.includes("Moderate") 
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}>
                        {selectedResult.severity}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-violet-700 mb-1">Score</p>
                    <div className="flex items-center">
                      <div className="text-3xl font-bold text-violet-900">{selectedResult.total_score.toFixed(1)}</div>
                      <div className="text-sm text-violet-700 ml-2">/ 10.0</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-violet-50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <MessageSquare className="h-6 w-6 text-violet-700 mr-3" />
                  <h3 className="text-lg font-semibold text-violet-900">Professional Insight</h3>
                </div>
                <p className="text-black/80">
                  {selectedResult.llm_remark}
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-violet-100 to-violet-200 p-6 rounded-lg mb-8">
              <div className="flex items-center mb-4">
                <Sparkles className="h-6 w-6 text-violet-700 mr-3" />
                <h3 className="text-lg font-semibold text-violet-900">Recommended Solutions</h3>
              </div>
              <p className="text-black/80">
                {selectedResult.solutions}
              </p>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Important Disclaimer</h3>
                  <p className="text-black/80">
                    This assessment is intended for informational purposes only and is not a substitute for 
                    professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified 
                    healthcare provider with any questions you may have regarding your mental health.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gradient-to-r from-violet-50 to-violet-100 rounded-b-lg p-6">
            <div className="w-full flex justify-between">
              <Button
                variant="outline"
                onClick={handleBackFromResults}
                className="border-violet-500 text-violet-700 hover:bg-violet-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Assessments
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  const assessment = assessments.find(a => a.id === selectedResult.assessment);
                  if (assessment) {
                    handleBackFromResults();
                    handleSelectAssessment(assessment);
                  }
                }}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Retake Assessment
              </Button>
            </div>
          </CardFooter>
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
        {!assessmentStarted && !viewingResults && !loading && renderAssessmentSelection()}
        {assessmentStarted && !assessmentComplete && renderQuestion()}
        {assessmentComplete && renderCompletionScreen()}
        {viewingResults && renderResultsScreen()}
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