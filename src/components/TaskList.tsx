'use client';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  updateDocumentNonBlocking,
  useDoc,
} from '@/firebase';
import { collection, doc, writeBatch } from 'firebase/firestore';
import { useEffect, useState, useMemo, useCallback } from 'react';
import type { Task } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Instagram, Youtube, Twitch, CheckCircle, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const TASK_DEFINITIONS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, description: 'Check out our latest Instagram posts.' },
  { id: 'youtube', name: 'YouTube', icon: Youtube, description: 'Watch our new YouTube video.' },
  { id: 'twitch', name: 'Twitch', icon: Twitch, description: 'Join our stream on Twitch.' },
];

const TASK_LINKS = {
  instagram: "https://instagram.com/eden022026",
  youtube: "https://youtube.com/@Eden-s8u",
  twitch: "https://twitch.tv/edenonlineshoppingstore"
};

// NOTE: Timer is set to 600 seconds (10 minutes).
const TASK_DURATION_SECONDS = 600;
const TASK_REWARD = 0.25;


function InitialSocialFollow() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
    const { t } = useLanguage();

    const handleConfirmation = () => {
        if (userDocRef) {
            updateDocumentNonBlocking(userDocRef, { socialsFollowed: true });
            toast({
                title: t('tasks.initialFollow.toast.successTitle'),
                description: t('tasks.initialFollow.toast.successDescription'),
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('tasks.initialFollow.title')}</CardTitle>
                <CardDescription>{t('tasks.initialFollow.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {TASK_DEFINITIONS.map(task => (
                        <Card key={task.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <task.icon className="w-8 h-8 text-primary" />
                                <span className="font-semibold">{task.name}</span>
                            </div>
                            <Button asChild variant="outline">
                                <a href={TASK_LINKS[task.id as keyof typeof TASK_LINKS]} target="_blank" rel="noopener noreferrer">
                                    {t('tasks.initialFollow.followButton')}
                                </a>
                            </Button>
                        </Card>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-4">
                 <p className="text-sm text-center text-muted-foreground">{t('tasks.initialFollow.confirmationPrompt')}</p>
                <Button onClick={handleConfirmation} size="lg">
                    {t('tasks.initialFollow.confirmButton')}
                </Button>
            </CardFooter>
        </Card>
    );
}

export default function TaskList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const tasksCollectionRef = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'tasks') : null),
    [firestore, user]
  );
  const { data: tasks, isLoading: areTasksLoading } = useCollection<Task>(tasksCollectionRef);

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const [activeTimerTaskId, setActiveTimerTaskId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(TASK_DURATION_SECONDS);
  const [unlockTimeMessage, setUnlockTimeMessage] = useState<string>('');

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
      return sortedTasks.reduce((latest, current) => {
          if (!latest.nextTaskUnlockTime || (current.nextTaskUnlockTime && new Date(current.nextTaskUnlockTime) > new Date(latest.nextTaskUnlockTime))) {
              return current;
          }
          return latest;
      });
  }, [allTasksCompletedToday, sortedTasks]);

  const handleCompleteTask = useCallback((taskId: string) => {
    if (!user || !userData || !firestore) return;
    
    const task = sortedTasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskId);
    
    const currentTaskIndex = sortedTasks.findIndex(t => t.id === taskId);
    const isLastTask = currentTaskIndex === sortedTasks.length - 1;

    const updates: Partial<Task> = { completed: true };
    
    if (isLastTask) {
        const unlockTime = new Date();
        unlockTime.setHours(unlockTime.getHours() + 24);
        const batch = writeBatch(firestore);
        sortedTasks.forEach(t => {
            const singleTaskRef = doc(firestore, 'users', user.uid, 'tasks', t.id);
            batch.update(singleTaskRef, { nextTaskUnlockTime: unlockTime.toISOString() });
        });
        if (userDocRef) {
            batch.update(userDocRef, { taskProgress: 100 });
        }
        batch.commit().catch(e => console.error("Failed to set unlock times", e));
    }

    updateDocumentNonBlocking(taskRef, updates);

    const newBalance = (userData.walletBalance || 0) + task.reward;
    const completedTasksCount = sortedTasks.filter(t => t.completed).length + 1;
    const newTaskProgress = (completedTasksCount / sortedTasks.length) * 100;
    
    if(userDocRef) {
        updateDocumentNonBlocking(userDocRef, { walletBalance: newBalance, taskProgress: isLastTask ? 100 : newTaskProgress });
    }
    
    toast({
        title: t('tasks.taskCompleted', { reward: `$${task.reward.toLocaleString()}` }),
    });
    
    setActiveTimerTaskId(null);

  }, [user, userData, firestore, sortedTasks, toast, userDocRef, t]);


  // Initialize or reset tasks
  useEffect(() => {
    if (!user || !firestore || areTasksLoading || !userData) return;
    if (!userData.socialsFollowed) return;

    if (tasks?.length === 0) {
      const batch = writeBatch(firestore);
      TASK_DEFINITIONS.forEach(taskDef => {
        const taskRef = doc(firestore, 'users', user.uid, 'tasks', taskDef.id);
        const newTask: Omit<Task, 'id'> = {
          userId: user.uid,
          name: taskDef.name,
          completed: false,
          reward: TASK_REWARD,
        };
        batch.set(taskRef, newTask);
      });
      batch.commit().catch(e => console.error("Failed to initialize tasks", e));
    } else if (allTasksCompletedToday && lastCompletedTask?.nextTaskUnlockTime && new Date() > new Date(lastCompletedTask.nextTaskUnlockTime)) {
        const batch = writeBatch(firestore);
        sortedTasks.forEach(task => {
            const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
            batch.update(taskRef, { completed: false, nextTaskUnlockTime: null, taskStartTime: null, reward: TASK_REWARD });
        });
        if(userDocRef) {
          updateDocumentNonBlocking(userDocRef, { taskProgress: 0 });
        }
        batch.commit().catch(e => console.error("Failed to reset tasks", e));
    }
  }, [user, tasks, areTasksLoading, firestore, allTasksCompletedToday, lastCompletedTask, sortedTasks, userDocRef, userData]);

  // Check for in-progress task on load
  useEffect(() => {
    if (areTasksLoading || !tasks || activeTimerTaskId) return;

    const inProgressTask = sortedTasks.find(t => t.taskStartTime && !t.completed);
    if (inProgressTask) {
        const startTime = new Date(inProgressTask.taskStartTime!).getTime();
        const timeElapsed = (new Date().getTime() - startTime) / 1000;
        const remainingTime = TASK_DURATION_SECONDS - timeElapsed;

        setActiveTimerTaskId(inProgressTask.id);
        setCountdown(Math.ceil(remainingTime > 0 ? remainingTime : 0));
    }
  }, [tasks, areTasksLoading, sortedTasks, activeTimerTaskId]);

  // Timer countdown effect, triggers auto-completion
  useEffect(() => {
    if (!activeTimerTaskId) return;

    if (countdown <= 0) {
      handleCompleteTask(activeTimerTaskId);
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTimerTaskId, countdown, handleCompleteTask]);

  // Daily completion message effect
  useEffect(() => {
    if (allTasksCompletedToday && lastCompletedTask?.nextTaskUnlockTime) {
      const date = new Date(lastCompletedTask.nextTaskUnlockTime);
      setUnlockTimeMessage(t('tasks.unlockTime', { date: date.toLocaleString() }));
    }
  }, [allTasksCompletedToday, lastCompletedTask, t]);

  // Anti-tab-switch: Reset task if user navigates away
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeTimerTaskId) {
        const activeTask = sortedTasks.find(t => t.id === activeTimerTaskId);
        if (!activeTask || !user || !firestore) return;

        setActiveTimerTaskId(null);
        setCountdown(TASK_DURATION_SECONDS);

        const taskRef = doc(firestore, 'users', user.uid, 'tasks', activeTimerTaskId);
        updateDocumentNonBlocking(taskRef, { taskStartTime: null });

        toast({
          variant: "destructive",
          title: t('tasks.toast.cancelledTitle'),
          description: t('tasks.toast.cancelledDescription'),
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeTimerTaskId, user, firestore, sortedTasks, toast, t]);


  const handleStartTask = (task: Task) => {
    if (activeTimerTaskId || allTasksCompletedToday || !user || !firestore) return;

    const currentTaskIndex = TASK_DEFINITIONS.findIndex(t => t.id === task.id);
    const previousTask = currentTaskIndex > 0 ? sortedTasks[currentTaskIndex - 1] : null;

    if (previousTask && !previousTask.completed) {
        toast({
            variant: "destructive",
            title: t('tasks.toast.orderRequired'),
        });
        return;
    }
    
    const taskLink = TASK_LINKS[task.id as keyof typeof TASK_LINKS];
    if (taskLink) {
        window.open(taskLink, '_blank', 'noopener,noreferrer');
    }

    toast({
        title: t('tasks.toast.inProgressTitle'),
        description: t('tasks.toast.inProgressDescription'),
    });
    
    setCountdown(TASK_DURATION_SECONDS);
    setActiveTimerTaskId(task.id);
    const taskRef = doc(firestore, 'users', user.uid, 'tasks', task.id);
    updateDocumentNonBlocking(taskRef, { taskStartTime: new Date().toISOString() });
  };

  if (isUserLoading || isUserDataLoading) {
    return <div>{t('tasks.loading')}</div>;
  }
  
  if (!user || !userData) {
    return <p>{t('tasks.loginPrompt')}</p>
  }
  
  if (!userData.socialsFollowed) {
      return <InitialSocialFollow />;
  }

  if (allTasksCompletedToday && lastCompletedTask) {
      return (
          <Card className="text-center p-8">
              <CardHeader>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500"/>
                  <CardTitle className="mt-4">{t('tasks.allCompletedTitle')}</CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground">{t('tasks.allCompletedDescription')}</p>
                  <p className="font-bold mt-2">{unlockTimeMessage}</p>
              </CardContent>
          </Card>
      )
  }

  const firstIncompleteTaskIndex = sortedTasks.findIndex(t => !t.completed);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const countdownText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <Tabs defaultValue={sortedTasks[firstIncompleteTaskIndex]?.id || TASK_DEFINITIONS[0].id} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        {TASK_DEFINITIONS.map((taskDef, index) => {
          const taskData = sortedTasks.find(t => t.id === taskDef.id);
          const isLocked = !taskData || (firstIncompleteTaskIndex !== -1 && index > firstIncompleteTaskIndex);

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
          const isTaskUnlocked = firstIncompleteTaskIndex === TASK_DEFINITIONS.findIndex(t => t.id === taskDef.id);
          const isButtonDisabled = !!activeTimerTaskId || task.completed || !isTaskUnlocked;
          // Use the constant for display to ensure consistency
          const displayReward = TASK_REWARD;

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
                                <p className="text-lg font-semibold">{t('tasks.inProgress')}</p>
                                <div className="space-y-2">
                                    <Progress value={( (TASK_DURATION_SECONDS - countdown) / TASK_DURATION_SECONDS) * 100} className="w-full"/>
                                    <p className="text-2xl font-mono font-bold">{countdownText}</p>
                                    <p className="text-muted-foreground text-sm">{t('tasks.stayOnPage')}</p>
                                </div>
                            </>
                        ) : task.completed ? (
                             <div className="flex items-center justify-center gap-2 text-green-600 font-medium"><CheckCircle /> {t('tasks.taskCompleted', { reward: displayReward.toLocaleString() })}</div>
                        ) : (
                             <p className="text-muted-foreground">{isTaskUnlocked ? t('tasks.startPrompt') : t('tasks.unlockPrompt')}</p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            disabled={isButtonDisabled} 
                            onClick={() => handleStartTask(task)}
                        >
                            {task.completed ? <><CheckCircle className="mr-2 h-4 w-4"/> {t('tasks.completed')}</> 
                            : !isTaskUnlocked ? <><Lock className="mr-2 h-4 w-4"/> {t('tasks.locked')}</> 
                            : isTimerActiveForThisTask ? t('tasks.timerActive')
                            : t('tasks.startButton', { reward: `$${displayReward.toLocaleString()}`})}
                        </Button>
                    </CardFooter>
                </Card>
             </TabsContent>
          )
      })}
    </Tabs>
  );
}
