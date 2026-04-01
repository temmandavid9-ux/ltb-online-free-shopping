
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import React from "react";

// This is the specific type Next.js 15 requires for dynamic routes
type Props = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderConfirmationPage({ params }: Props) {
  // You MUST await params in Next.js 15
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
          <CardTitle className="text-3xl font-bold mt-4">Order Confirmed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center bg-muted p-3 rounded-md">
            <span className="text-sm font-mono">Order ID: {orderId}</span>
          </div>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline"><Link href="/">Home</Link></Button>
            <Button asChild><Link href="/shop">Continue</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}