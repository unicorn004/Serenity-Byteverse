import { Award } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Challenge {
  title: string
  description: string
  progress: number
  daysLeft: number
  category: string
}

interface ChallengeCardProps {
  challenge: Challenge
}

export default function ChallengeCard({ challenge }: ChallengeCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "meditation":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "journaling":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "lifestyle":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "health":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  return (
    <Card className="overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg">
      <div className={`h-2 w-full ${challenge.progress >= 50 ? "bg-primary" : "bg-primary/50"}`}></div>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{challenge.title}</CardTitle>
            <CardDescription>{challenge.description}</CardDescription>
          </div>
          <Badge className={getCategoryColor(challenge.category)} variant="outline">
            {challenge.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">{challenge.progress}%</span>
            </div>
            <Progress value={challenge.progress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-sm">{challenge.daysLeft} days left</span>
            </div>

            {challenge.progress < 100 ? (
              <Button size="sm">Continue</Button>
            ) : (
              <Button size="sm" variant="outline" disabled>
                Completed
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

