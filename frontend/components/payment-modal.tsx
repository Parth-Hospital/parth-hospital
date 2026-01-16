"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react"

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onPaymentComplete: () => void
  appointmentType: "general" | "priority"
  amount: number
}

export function PaymentModal({
  open,
  onClose,
  onPaymentComplete,
  appointmentType,
  amount,
}: PaymentModalProps) {
  const [upiId, setUpiId] = useState("parth@upi.id")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handlePay = async () => {
    if (!upiId.trim()) {
      return
    }

    setIsProcessing(true)

    // Simulate payment processing (2 seconds delay)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(false)
    setIsCompleted(true)

    // Wait a moment to show success, then complete payment
    setTimeout(() => {
      setIsCompleted(false)
      onPaymentComplete()
      setUpiId("parth@upi.id") // Reset for next time
    }, 1500)
  }

  const handleClose = () => {
    if (!isProcessing && !isCompleted) {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" showCloseButton={!isProcessing && !isCompleted}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            {isCompleted
              ? "Payment completed successfully!"
              : `Please complete the payment to confirm your ${appointmentType} appointment.`}
          </DialogDescription>
        </DialogHeader>

        {!isCompleted ? (
          <div className="space-y-4 py-4">
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Appointment Type</span>
                <span className="font-semibold capitalize">{appointmentType} Appointment</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{amount}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input
                id="upi-id"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter UPI ID"
                disabled={isProcessing}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Enter your UPI ID to complete the payment
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Note:</strong> This is a temporary payment method for testing purposes.
                Once Razorpay credentials are available, this will be replaced with the actual payment gateway.
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-lg font-semibold text-green-600">Payment Successful!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your appointment is being confirmed...
            </p>
          </div>
        )}

        {!isCompleted && (
          <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handlePay} disabled={isProcessing || !upiId.trim()}>
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4  animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 " />
                  Pay ₹{amount}
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
