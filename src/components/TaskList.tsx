'use client';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  setDocumentNonBlocking,
  updateDocumentNonBlocking,
  useDoc,
} from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useEffect, useState, useMemo } from 'react';
import type { Task } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Facebook, Instagram, Youtube, Twitch, CheckCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TASK_DEFINITIONS = [
  { id: 'facebook', name: 'Facebook', icon: Facebook, description: 'Engage with our Facebook page.' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, description: 'Check out our latest Instagram posts.' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, description: 'Watch our new YouTube video.' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, description: 'Join our stream on Twitch.' },
];

const TASK_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com/@Eden-s8u",
  twitch: "https://twitch.tv"
};

// NOTE: Timer is set to 20 seconds for prototype testing. Change to 1200 for 20 minutes.
const TASK_DURATION_SECONDS = 20;

export default function TaskList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const tasksCollectionRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'tasks') : null),
    [firestore, user]
  );
  const { data: tasks, isLoading: areTasksLoading } = useCollection<Task>(tasksCollectionRef);

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(TASK_DURATION_SECONDS);

  const sortedTasks = useMemo(() => {
    if (!tasks) return [];
    return [...tasks].sort((a, b) => {
        const aIndex = TASK_DEFINITIONS.findIndex(t => t.id === a.id);
        const bIndex = TASK_DEFINITIONS.findIndex(t => t.id === b.id);
        return aIndex - bIndex;
    });
  }, [tasks]);

  const allTasksCompletedToday = useMemo(() => sortedTasks.every(t => t.completed), [sortedTasks]);
  const lastCompletedTask = useMemo(() => {
      if (!allTasksCompletedToday || !sortedTasks.length) return null;
      // Find the task with the most recent unlock time
      return sortedTasks.reduce((latest, current) => {
          if (!latest.nextTaskUnlockTime || (current.nextTaskUnlockTime && new Date(current.nextTaskUnlockTime) > new Date(latest.nextTaskUnlockTime))) {
              return current;
          }
          return latest;
      });
  }, [allTasksCompletedToday, sortedTasks]);

  // Initialize tasks for a new user
  useEffect(() => {
    if (user && !areTasksLoading && tasks?.length === 0) {
      const batch = writeBatch(firestore);
      TASK_DEFINITIONS.forEach(taskDef => {
        const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskDef.id);
        const newTask: Task = {
          id: taskDef.id,
          userId: user.uid,
          name: taskDef.name,
          completed: false,
          reward: 1,
        };
        batch.set(taskRef, newTask);
      });
      batch.commit().catch(e => console.error("Failed to initialize tasks", e));
    }
  }, [user, tasks, areTasksLoading, firestore]);
  
  // Reset daily tasks if they are unlocked
  useEffect(() => {
      if(allTasksCompletedToday && lastCompletedTask?.nextTaskUnlockTime && new Date() > new Date(lastCompletedTask.nextTaskUnlockTime)){
          const batch = writeBatch(firestore);
          sortedTasks.forEach(task => {
              const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
              batch.update(taskRef, { completed: false, nextTaskUnlockTime: null, taskStartTime: null });
          });
          batch.commit().catch(e => console.error("Failed to reset tasks", e));
      }
  }, [allTasksCompletedToday, lastCompletedTask, firestore, user, sortedTasks]);


  // Timer countdown effect
  useEffect(() => {
    if (!activeTimerTaskId) return;

    if (countdown <= 0) {
      setActiveTimerTaskId(null); // Timer finished, but don't auto-complete
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTimerTaskId, countdown]);

  const handleStartTask = (task: Task) => {
    if (activeTimerTaskId || allTasksCompletedToday) return;

    const currentTaskIndex = TASK_DEFINITIONS.findIndex(t => t.id === task.id);
    const previousTask = currentTaskIndex > 0 ? sortedTasks[currentTaskIndex - 1] : null;

    if (previousTask && !previousTask.completed) {
        toast({
            variant: "destructive",
            title: "Tasks must be completed in order",
        });
        return;
    }
    
    const taskLink = TASK_LINKS[task.id as keyof typeof TASK_LINKS];
    if (taskLink) {
        window.open(taskLink, '_blank', 'noopener,noreferrer');
    }
    
    setCountdown(TASK_DURATION_SECONDS);
    setActiveTimerTaskId(task.id);
    const taskRef = doc(firestore, 'users', user!.uid, 'tasks', task.id);
    updateDocumentNonBlocking(taskRef, { taskStartTime: new Date().toISOString() });
  };
  
  const handleCompleteTask = (task: Task) => {
      if (!user || !userData) return;
      
      const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
      
      // Determine if this is the last task
      const currentTaskIndex = sortedTasks.findIndex(t => t.id === task.id);
      const isLastTask = currentTaskIndex === sortedTasks.length - 1;

      const updates: Partial<Task> = { completed: true };
      
      if (isLastTask) {
        const unlockTime = new Date();
        unlockTime.setHours(unlockTime.getHours() + 24);
        // Apply unlock time to all tasks
         const batch = writeBatch(firestore);
         sortedTasks.forEach(t => {
             const singleTaskRef = doc(firestore, 'users', user.uid, 'tasks', t.id);
             batch.update(singleTaskRef, { nextTaskUnlockTime: unlockTime.toISOString() });
         });
         batch.commit().catch(e => console.error("Failed to set unlock times", e));
      }

      updateDocumentNonBlocking(taskRef, updates);

      const newBalance = (userData.walletBalance || 0) + task.reward;
      const completedTasksCount = sortedTasks.filter(t => t.completed).length + 1;
      const newTaskProgress = (completedTasksCount / sortedTasks.length) * 100;
      
      updateDocumentNonBlocking(userDocRef!, { walletBalance: newBalance, taskProgress: newTaskProgress });
      
      toast({
          title: "Task Completed!",
          description: `You've earned $${task.reward.toFixed(2)}!`,
      });
  };

  if (isUserLoading || areTasksLoading || isUserDataLoading) {
    return <div>Loading tasks...</div>;
  }
  
  if (!user) {
    return <p>Please log in to see your tasks.</p>
  }

  if (allTasksCompletedToday && lastCompletedTask) {
      return (
          <Card className="text-center p-8">
              <CardHeader>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500"/>
                  <CardTitle className="mt-4">All tasks completed for today!</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">Come back tomorrow to earn more rewards.</p>
                  <p className="font-bold mt-2">Next tasks unlock at: {new Date(lastCompletedTask.nextTaskUnlockTime!).toLocaleString()}</p>
              </CardContent>
          </Card>
      )
  }

  const firstIncompleteTaskIndex = sortedTasks.findIndex(t => !t.completed);

  return (
    <Tabs defaultValue={sortedTasks[firstIncompleteTaskIndex]?.id || TASK_DEFINITIONS[0].id} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {TASK_DEFINITIONS.map(taskDef => {
          const taskData = sortedTasks.find(t => t.id === taskDef.id);
          const isLocked = !taskData || (firstIncompleteTaskIndex !== -1 && TASK_DEFINITIONS.findIndex(t => t.id === taskDef.id) > firstIncompleteTaskIndex);

          return (
            <TabsTrigger key={taskDef.id} value={taskDef.id} disabled={isLocked}>
              {taskData?.completed ? <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> : isLocked ? <Lock className="w-4 h-4 mr-2" /> : <taskDef.icon className="w-4 h-4 mr-2" />}
              {taskDef.name}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {TASK_DEFINITIONS.map(taskDef => {
          const task = sortedTasks.find(t => t.id === taskDef.id);
          if (!task) return null;

          const isTimerActiveForThisTask = activeTimerTaskId === task.id;
          const isButtonDisabled = !!activeTimerTaskId || task.completed;
          const isTaskUnlocked = firstIncompleteTaskIndex === TASK_DEFINITIONS.findIndex(t => t.id === taskDef.id);

          return (
             <TabsContent key={taskDef.id} value={taskDef.id}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><taskDef.icon/> {task.name}</CardTitle>
                        <CardDescription>{taskDef.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-center">
                        {isTimerActiveForThisTask ? (
                            <>
                                <p className="text-lg font-semibold">Task in progress...</p>
                                <div className="space-y-2">
                                    <Progress value={( (TASK_DURATION_SECONDS - countdown) / TASK_DURATION_SECONDS) * 100} className="w-full"/>
                                    <p className="text-2xl font-mono font-bold">{countdown}s</p>
                                    <p className="text-muted-foreground text-sm">Please wait for the timer to finish.</p>
                                </div>
                            </>
                        ) : task.completed ? (
                             <div className="flex items-center justify-center gap-2 text-green-600 font-medium"><CheckCircle /> Task Completed!</div>
                        ) : (
                             <p className="text-muted-foreground">Start the task to earn your reward.</p>
                        )}
                    </CardContent>
                    <CardFooter>
                         {isTimerActiveForThisTask ? (
                            <Button className="w-full" disabled={countdown > 0} onClick={() => handleCompleteTask(task)}>
                                {countdown > 0 ? `Complete in ${countdown}s` : 'Claim Reward!'}
                            </Button>
                         ) : task.completed ? (
                            <Button className="w-full" disabled>Completed</Button>
                         ) : (
                             <Button className="w-full" disabled={isButtonDisabled || !isTaskUnlocked} onClick={() => handleStartTask(task)}>
                                { !isTaskUnlocked ? <><Lock className="mr-2 h-4 w-4"/> Locked</> : `Start Task (Earn $${task.reward})`}
                            </Button>
                         )}
                    </CardFooter>
                </Card>
             </TabsContent>
          )
      })}
    </Tabs>
  );
}
