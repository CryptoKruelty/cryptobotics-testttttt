"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Plan {
  id: string
  name: string
  price: number
  bots: number
  features: string[]
  popular?: boolean
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 5,
    bots: 1,
    features: ["1 Active Bot", "60-second updates", "All bot types", "Discord support"],
  },
  {
    id: "standard",
    name: "Standard",
    price: 15,
    bots: 3,
    features: [
      "3 Active Bots",
      "60-second updates",
      "All bot types",
      "Priority Discord support",
      "Custom display formats",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: 45,
    bots: 10,
    features: [
      "10 Active Bots",
      "60-second updates",
      "All bot types",
      "Priority Discord support",
      "Custom display formats",
      "Webhook integrations",
      "Advanced analytics",
    ],
  },
]

export function SubscriptionPlans() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentPlan, setCurrentPlan] = useState("standard")

  const handleUpgrade = (planId: string) => {
    if (planId === currentPlan) {
      toast({
        title: "Already subscribed",
        description: `You are already subscribed to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
      })
      return
    }

    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setCurrentPlan(planId)
      toast({
        title: "Plan updated",
        description: `You have successfully switched to the ${planId.charAt(0).toUpperCase() + planId.slice(1)} plan.`,
      })
    }, 1500)
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`relative overflow-hidden ${
            plan.popular ? "border-primary shadow-md" : ""
          } transition-all duration-300 hover:shadow-lg`}
        >
          {plan.popular && (
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
              Popular
            </div>
          )}
          <CardHeader>
            <CardTitle className="flex items-baseline justify-between">
              <span>{plan.name}</span>
              <div className="text-right">
                <span className="text-2xl font-bold">${plan.price}</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center font-medium">
              Up to <span className="text-primary">{plan.bots}</span> active bots
            </p>
            <ul className="space-y-2">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className={`w-full ${
                currentPlan === plan.id
                  ? "bg-primary/20 text-primary hover:bg-primary/30"
                  : "gradient-bg border-0 hover:opacity-90"
              }`}
              disabled={isLoading || currentPlan === plan.id}
              onClick={() => handleUpgrade(plan.id)}
            >
              {currentPlan === plan.id ? "Current Plan" : "Upgrade"}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
