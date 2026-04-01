import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import React from "react";

// This interface matches exactly what Next.js 15 expectations are
interface PageProps {
  params: Promise<{ orderId: string }>;
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  // We MUST await the params in Next.js 15
  const resolvedParams = await params;
  const orderId = resolvedParams.orderId;

  const trackingSteps = [
    { name: "Order Placed", icon: CheckCircle, status: "completed" },
    { name: "Processing", icon: Package, status: "completed" },
    { name: "Shipped", icon: Truck, status: "active" },
    { name: "Delivered", icon: Home, status: "pending" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto bg-green-100 rounded-full p-3 w-fit">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold mt-4">Thank You for Your Order!</CardTitle>
          <p className="text-muted-foreground">Your order has been placed successfully.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center bg-muted p-3 rounded-md">
            <span className="text-sm">Order ID: </span>
            <span className="font-mono text-sm font-semibold">{orderId}</span>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            {trackingSteps.map((step, index) => (
              <React.Fragment key={step.name}>
                <div className="flex flex-col items-center text-center w-24">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${step.status === 'completed' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <step.icon className="h-6 w-6" />
                  </div>
                  <p className="mt-2 text-[10px] font-medium">{step.name}</p>
                </div>
                {index < 3 && <div className="flex-1 h-1 bg-border mb-6"></div>}
              </React.Fragment>
            ))}
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Button asChild variant="outline"><Link href="/">Home</Link></Button>
            <Button asChild><Link href="/shop">Continue Shopping</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}