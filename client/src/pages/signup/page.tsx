import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User 
} from "lucide-react";


const therapyTypes = [
  { value: "cbt", label: "Cognitive Behavioral Therapy" },
  { value: "mindfulness", label: "Mindfulness-Based Therapy" },
  { value: "psychodynamic", label: "Psychodynamic Therapy" },
  { value: "humanistic", label: "Humanistic Therapy" },
  { value: "integrative", label: "Integrative Therapy" },
];

export default function SignupPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    therapyType: "",
    notifications: "all",
    goals: "",
    termsAccepted: false,
  });

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 1500);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  className="pl-10 pr-10"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="therapyType">Preferred Therapy Type</Label>
              <Select value={formData.therapyType} onValueChange={(value) => updateFormData("therapyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a therapy type" />
                </SelectTrigger>
                <SelectContent>
                  {therapyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This helps us personalize your experience. You can change this later.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Notification Preferences</Label>
              <RadioGroup
                value={formData.notifications}
                onValueChange={(value) => updateFormData("notifications", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all" className="font-normal">
                    All notifications
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="important" id="important" />
                  <Label htmlFor="important" className="font-normal">
                    Important notifications only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="none" id="none" />
                  <Label htmlFor="none" className="font-normal">
                    No notifications
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals">What are your current mental health goals or challenges?</Label>
              <Textarea
                id="goals"
                placeholder="I want to manage my anxiety better and develop healthier coping mechanisms..."
                className="min-h-[150px]"
                value={formData.goals}
                onChange={(e) => updateFormData("goals", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                This helps us understand your needs better. Your response is confidential.
              </p>
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <h3 className="mb-2 font-medium">Account Information</h3>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span> {formData.name}
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span> {formData.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Therapy Type:</span>{" "}
                  {therapyTypes.find((t) => t.value === formData.therapyType)?.label || "Not specified"}
                </p>
                <p>
                  <span className="text-muted-foreground">Notifications:</span>{" "}
                  {formData.notifications === "all"
                    ? "All notifications"
                    : formData.notifications === "important"
                      ? "Important notifications only"
                      : "No notifications"}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.termsAccepted}
                  onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
                  required
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the{" "}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center xl:pl-125 xl:pr-125 lg:pl-75 lg:pr-75 md:pl-50 md:pr-50  pl-3 pr-3 py-10">
      <Card className="mx-auto w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Join our community and start your wellness journey</CardDescription>
          <div className="mx-auto mt-4 flex w-full max-w-xs justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                        ? "border-2 border-primary bg-primary/20 text-primary"
                        : "border border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i}
                </div>
                <span className="mt-1 text-xs text-muted-foreground">Step {i}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>{renderStepContent()}</CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="flex w-full justify-between">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1} className="gap-1">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              {step < 4 ? (
                <Button type="button" onClick={handleNext} className="gap-1">
                  Next <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading || !formData.termsAccepted}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              )}
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}