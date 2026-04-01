import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import React from "react";

// The 'async' and 'Promise' are required for Next.js 15
export default async function OrderConfirmationPage({ 
  params 
}: { 
  params: Promise<{ orderId: string }> 
}) {
  const { orderId } = await params;

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
          <CardTitle className="text-3xl font-bold mt-4">Thank You!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center bg-muted p-3 rounded-md">
            <span className="text-sm font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            {trackingSteps.map((step, index) => (
              <React.Fragment key={step.name}>
                <div className="flex flex-col items-center">
                  <step.icon className={`h-6 w-6 ${step.status === 'completed' ? 'text-primary' : 'text-muted'}`} />
                  <p className="text-[10px] mt-1">{step.name}</p>
                </div>
                {index < 3 && <div className="flex-1 h-[2px] bg-border mx-2" />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild variant="outline"><Link href="/">Home</Link></Button>
            <Button asChild><Link href="/shop">Continue</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}