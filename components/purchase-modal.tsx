"use client"

import type React from "react"
import { useState } from "react"
import { getAuth } from "firebase/auth"
import { updateUserData, getUserByUid } from "@/lib/firestore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, CreditCard, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CreditPlan {
  amount: number
  price: string
  popular: boolean
}

interface PurchaseCreditsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan?: CreditPlan
  onCreditsUpdated: (newCredits: number) => void
}

const creditPlans: CreditPlan[] = [
  { amount: 35, price: "$10", popular: false },
  { amount: 100, price: "$45", popular: true },
  { amount: 300, price: "$80", popular: false },
]

export default function PurchaseCreditsModal({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  onCreditsUpdated 
}: PurchaseCreditsModalProps) {
  const [currentPlan, setCurrentPlan] = useState<CreditPlan>(
    selectedPlan || creditPlans[1] // Default to 2nd plan (100 credits)
  )
  const [step, setStep] = useState<'select' | 'confirm1' | 'confirm2' | 'processing' | 'success'>('select')
  const [error, setError] = useState<string | null>(null)
  const auth = getAuth()
  const { toast } = useToast()

  const handlePlanSelect = (plan: CreditPlan) => {
    setCurrentPlan(plan)
  }

  const handleFirstConfirm = () => {
    setStep('confirm1')
  }

  const handleSecondConfirm = () => {
    setStep('confirm2')
  }

  const handleFinalPurchase = async () => {
    setStep('processing')
    setError(null)

    try {
      if (!auth.currentUser) {
        throw new Error("You must be logged in to purchase credits")
      }

      // Get current user data
      const userData = await getUserByUid(auth.currentUser.uid)
      if (!userData) {
        throw new Error("User data not found")
      }

      const currentCredits = userData.credits || 0
      const newCredits = currentCredits + currentPlan.amount

      // Update user credits in Firestore
      await updateUserData(auth.currentUser.uid, {
        credits: newCredits,
      })

      // Update parent component
      onCreditsUpdated(newCredits)

      setStep('success')
      toast({
        title: "Purchase Successful!",
        description: `${currentPlan.amount} credits have been added to your account.`,
      })

      // Auto-close after success
      setTimeout(() => {
        handleClose()
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to purchase credits")
      toast({
        variant: "destructive",
        title: "Purchase Failed",
        description: err instanceof Error ? err.message : "Failed to purchase credits",
      })
      setStep('select')
    }
  }

  const handleClose = () => {
    setStep('select')
    setError(null)
    onClose()
  }

  const handleBack = () => {
    if (step === 'confirm1') {
      setStep('select')
    } else if (step === 'confirm2') {
      setStep('confirm1')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Purchase Credits
          </DialogTitle>
          <DialogDescription>
            {step === 'select' && "Choose your credit package"}
            {step === 'confirm1' && "Confirm your purchase"}
            {step === 'confirm2' && "Final confirmation required"}
            {step === 'processing' && "Processing your purchase..."}
            {step === 'success' && "Purchase completed successfully!"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === 'select' && (
          <div className="space-y-4">
            <div className="grid gap-3">
              {creditPlans.map((plan) => (
                <Card
                  key={plan.amount}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    currentPlan.amount === plan.amount
                      ? "border-primary bg-primary/5"
                      : "hover:border-primary/50"
                  } ${plan.popular ? "relative" : ""}`}
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.popular && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      Best Value
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.amount} Credits</CardTitle>
                      <CardDescription className="text-lg font-semibold text-primary">
                        {plan.price}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground">
                      ${(parseFloat(plan.price.slice(1)) / plan.amount).toFixed(3)} per credit
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 'confirm1' && (
          <div className="space-y-4">
            <Card className="border-primary bg-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Selected Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="font-medium">{currentPlan.amount} Credits</span>
                  <span className="text-lg font-semibold text-primary">{currentPlan.price}</span>
                </div>
              </CardContent>
            </Card>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Confirm Purchase</AlertTitle>
              <AlertDescription>
                You are about to purchase {currentPlan.amount} credits for {currentPlan.price}. 
                This action cannot be undone.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 'confirm2' && (
          <div className="space-y-4">
            <Card className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <CardHeader>
                <CardTitle className="text-lg text-orange-700 dark:text-orange-300">
                  Final Confirmation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Credits to add:</span>
                    <span className="font-semibold">{currentPlan.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total cost:</span>
                    <span className="font-semibold">{currentPlan.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Last Chance!</AlertTitle>
              <AlertDescription>
                Are you absolutely sure? This purchase will be charged immediately and cannot be refunded.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {step === 'processing' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">Processing your purchase...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                Purchase Successful!
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentPlan.amount} credits have been added to your account
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="flex gap-2">
          {step === 'select' && (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleFirstConfirm}>
                Continue with {currentPlan.amount} Credits
              </Button>
            </>
          )}

          {step === 'confirm1' && (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSecondConfirm} className="bg-orange-600 hover:bg-orange-700">
                Yes, Continue
              </Button>
            </>
          )}

          {step === 'confirm2' && (
            <>
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleFinalPurchase} variant="destructive">
                Confirm Purchase
              </Button>
            </>
          )}

          {(step === 'processing' || step === 'success') && (
            <Button variant="outline" onClick={handleClose} disabled={step === 'processing'}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}