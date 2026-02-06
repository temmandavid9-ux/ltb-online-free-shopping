import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button";
  import Link from "next/link";
  
  const mockOrders = [
    { id: 'order_1680123456', date: '2023-03-29', total: 149.98, status: 'Delivered' },
    { id: 'order_1682456789', date: '2023-04-25', total: 79.99, status: 'Shipped' },
    { id: 'order_1683987654', date: '2023-05-13', total: 249.99, status: 'Processing' },
  ];
  
  export default function AccountPage() {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold font-headline mb-8">My Account</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                        <CardDescription>Manage your personal information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p className="font-semibold">Max Robinson</p>
                        <p className="text-sm text-muted-foreground">max@example.com</p>
                        <Button variant="outline" size="sm" className="mt-2">Edit Profile</Button>
                    </CardContent>
                </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Order History</CardTitle>
                        <CardDescription>View your past orders and their status.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                                <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockOrders.map(order => (
                                    <TableRow key={order.id}>
                                        <TableCell className="font-mono text-sm">{order.id.split('_')[1]}</TableCell>
                                        <TableCell>{order.date}</TableCell>
                                        <TableCell>
                                            <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'} className={
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }>
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/order-confirmation/${order.id}`}>View</Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    )
  }
  