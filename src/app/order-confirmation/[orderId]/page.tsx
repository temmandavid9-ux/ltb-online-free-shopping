import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home } from "lucide-react";

export default function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  const { orderId } = params;

  const trackingSteps = [
    { name: "Order Placed", icon: CheckCircle, status: "completed" },
    { name: "Processing", icon: Package, status: "completed" },
    { name: "Shipped", icon: Truck, status: "active" },
    { name: "Delivered", icon: Home, status: "pending" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline mt-4">Thank You for Your Order!</CardTitle>
          <p className="text-muted-foreground">Your order has been placed successfully.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center bg-muted p-3 rounded-md">
            <span className="text-sm">Order ID: </span>
            <span className="font-mono text-sm font-semibold">{orderId}</span>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Order Tracking</h3>
            <div className="flex justify-between items-center">
              {trackingSteps.map((step, index) => (
                <>
                  <div key={step.name} className="flex flex-col items-center text-center w-24">
                    <div className={`
                      h-12 w-12 rounded-full flex items-center justify-center
                      ${step.status === 'completed' ? 'bg-primary text-primary-foreground' : ''}
                      ${step.status === 'active' ? 'bg-accent text-accent-foreground' : ''}
                      ${step.status === 'pending' ? 'bg-muted text-muted-foreground' : ''}
                    `}>
                      <step.icon className="h-6 w-6" />
                    </div>
                    <p className={`mt-2 text-xs font-medium ${step.status !== 'pending' ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.name}
                    </p>
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div className={`flex-1 h-1 ${index < 2 ? 'bg-primary' : 'bg-border'}`}></div>
                  )}
                </>
              ))}
            </div>
          </div>

          <Separator />

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              We've sent a confirmation email to your address with the order details. You can track your order status in your account.
            </p>
            <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                    <Link href="/account">View My Orders</Link>
                </Button>
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
