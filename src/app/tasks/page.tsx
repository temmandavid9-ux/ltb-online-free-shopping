import TaskList from "@/components/TaskList";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function TasksPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card className="bg-primary text-primary-foreground mb-8">
        <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Daily Tasks</CardTitle>
            <CardDescription className="text-primary-foreground/80">Complete tasks to earn rewards and increase your wallet balance. Complete all 4 tasks to fulfill your daily goal.</CardDescription>
        </CardHeader>
      </Card>
      <TaskList />
    </div>
  );
}
