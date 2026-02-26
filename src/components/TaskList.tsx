'use client';
import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc } from 'firebase/firestore';
import { useEffect, useState, useMemo, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Youtube, Instagram, Twitch, CheckCircle, Zap, Crown, Trophy, Lock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const TASK_DURATION_SECONDS = 600; // 10 minutes per stage

export default function TaskList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<UserProfile>(userDocRef);

  // Sequential task state: 0 = YouTube, 1 = Instagram, 2 = Twitch, 3 = All Completed
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [activeTimer, setActiveTimer] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(TASK_DURATION_SECONDS);

  const isCompletedToday = useMemo(() => {
    if (!userData?.lastCompletedDate) return false;
    const lastDate = new Date(userData.lastCompletedDate).toDateString();
    const today = new Date().toDateString();
    return lastDate === today;
  }, [userData]);

  // Sync current step with taskProgress if it's still today
  useEffect(() => {
    if (userData) {
      if (isCompletedToday) {
        // If completed today, show step 3 (Completed state)
        setCurrentStep(3);
      } else {
        // If NOT completed today, but DB progress is 3, it means it's a new day and we need to start over
        const dbProgress = userData.taskProgress || 0;
        setCurrentStep(dbProgress === 3 ? 0 : dbProgress);
      }
    }
  }, [userData, isCompletedToday]);

  const handleStageComplete = useCallback(() => {
    if (!user || !userData || !userDocRef) return;

    const stage = currentStep;
    let reward = 0.33;
    let updates: Partial<UserProfile> = {};

    // Logic for Stage 3 (Final)
    if (stage === 2) {
      reward = 0.34; // Final stage completes the $1.00
      const today = new Date();
      const lastDate = userData.lastCompletedDate ? new Date(userData.lastCompletedDate) : null;
      
      let newStreak = userData.streakCount || 0;
      
      if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastDate.toDateString() === yesterday.toDateString()) {
          newStreak += 1;
        } else if (lastDate.toDateString() !== today.toDateString()) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      updates.lastCompletedDate = today.toISOString();
      updates.streakCount = newStreak;
      updates.taskProgress = 3;

      if (!userData.eliteUnlocked && newStreak >= 365) {
        updates.eliteUnlocked = true;
        updates.eliteStartDate = today.toISOString();
        updates.eliteMonthlyCounter = 0;
        updates.eliteRewardsAvailable = 0;
        toast({
          title: t('tasks.toast.eliteUnlockedTitle'),
          description: t('tasks.toast.eliteUnlockedDesc'),
        });
      }

      if (userData.eliteUnlocked || updates.eliteUnlocked) {
        let newMonthlyCounter = (userData.eliteMonthlyCounter || 0) + 1;
        let newRewards = userData.eliteRewardsAvailable || 0;

        if (newMonthlyCounter >= 30) {
          newMonthlyCounter = 0;
          newRewards += 1;
          toast({
            title: t('tasks.toast.giftCardEarned'),
          });
        }
        updates.eliteMonthlyCounter = newMonthlyCounter;
        updates.eliteRewardsAvailable = newRewards;
      }
      
      toast({
        title: "Daily Sequence Finalized",
        description: `Total $1.00 reward secured. Streak: Day ${newStreak}.`,
      });
    } else {
      // Logic for Stage 1 & 2
      updates.taskProgress = stage + 1;
      toast({
        title: `Stage ${stage + 1} Secured`,
        description: `+$${reward.toFixed(2)} added to your registry. Next stage unlocked.`,
      });
    }

    updates.balance = (userData.balance || 0) + reward;
    updateDocumentNonBlocking(userDocRef, updates);
    
    setActiveTimer(false);
    setCountdown(TASK_DURATION_SECONDS);
  }, [user, userData, userDocRef, t, toast, currentStep]);

  useEffect(() => {
    if (!activeTimer) return;
    if (countdown <= 0) {
      handleStageComplete();
      return;
    }
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [activeTimer, countdown, handleStageComplete]);

  const handleStartSubTask = (stepIndex: number, url: string) => {
    if (isCompletedToday) return;
    if (stepIndex !== currentStep) return;
    
    window.open(url, '_blank', 'noopener,noreferrer');
    setCountdown(TASK_DURATION_SECONDS);
    setActiveTimer(true);
  };

  if (isUserLoading || isUserDataLoading) return <div className="p-24 text-center">{t('tasks.loading')}</div>;
  if (!user || !userData) return <p className="p-24 text-center">{t('tasks.loginPrompt')}</p>;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const countdownText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const channels = [
    { id: 0, title: 'YouTube @Eden-s8u', icon: Youtube, url: 'https://youtube.com/@Eden-s8u', desc: 'Registry Step 1 (+$0.33)' },
    { id: 1, title: 'Instagram: eden022026', icon: Instagram, url: 'https://www.instagram.com/eden022026/', desc: 'Registry Step 2 (+$0.33)' },
    { id: 2, title: 'Twitch: edenonlineshoppingstore', icon: Twitch, url: 'https://www.twitch.tv/edenonlineshoppingstore', desc: 'Final Verification (+$0.34)' }
  ];

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/10 shadow-2xl rounded-[3rem]">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-10 pb-7">
          <div>
            <CardTitle className="text-3xl font-black luxury-text-gradient flex items-center gap-3">
              {userData.eliteUnlocked ? <Crown className="w-10 h-10 text-primary animate-pulse" /> : <Zap className="w-10 h-10 text-primary" />}
              {userData.eliteUnlocked ? "Elite Sequence" : "Daily Sequential Registry"}
            </CardTitle>
            <CardDescription className="mt-2 font-medium uppercase tracking-widest text-[10px] text-muted-foreground">
              Stages yield fractional rewards ($0.33). Complete all 3 for the full $1.00 daily credit.
            </CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status Balance</div>
            <div className="text-4xl font-black text-primary">${(userData.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-10 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest">Streak Tracker</span>
                </div>
                <span className="text-xs font-black text-muted-foreground">{userData.streakCount || 0} / 365 Days</span>
              </div>
              <Progress value={((userData.streakCount || 0) / 365) * 100} className="h-4 bg-secondary rounded-full" />
            </div>

            {userData.eliteUnlocked && (
              <div className="bg-white rounded-[2rem] p-8 border border-primary/20 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest">Monthly Bonus Cycle</span>
                  </div>
                  <span className="text-xs font-black text-primary">{userData.eliteMonthlyCounter || 0} / 30 Days</span>
                </div>
                <Progress value={((userData.eliteMonthlyCounter || 0) / 30) * 100} className="h-4 bg-secondary rounded-full" />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-center mb-8">Execution Sequence</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {channels.map((channel) => {
                const isLocked = channel.id > currentStep && !isCompletedToday;
                const isCurrent = channel.id === currentStep && !isCompletedToday && !activeTimer;
                const isVerifying = channel.id === currentStep && activeTimer;
                const isDone = channel.id < currentStep || isCompletedToday;

                return (
                  <Card key={channel.id} className={`rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${isVerifying ? 'border-primary animate-pulse' : isDone ? 'border-primary/40 bg-primary/5' : isLocked ? 'opacity-50 grayscale bg-muted/20' : 'border-black/5'}`}>
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isDone ? 'bg-primary text-white scale-90' : isLocked ? 'bg-muted text-muted-foreground' : 'bg-secondary text-foreground'}`}>
                        {isLocked ? <Lock className="w-8 h-8" /> : <channel.icon className="w-8 h-8" />}
                      </div>
                      <div>
                        <h4 className="font-black text-[10px] uppercase tracking-widest">{channel.title}</h4>
                        <p className="text-[9px] font-bold text-muted-foreground/60 mt-1">{channel.desc}</p>
                      </div>
                      <Button 
                        onClick={() => handleStartSubTask(channel.id, channel.url)}
                        variant={isDone ? "ghost" : isLocked ? "secondary" : "outline"}
                        className="w-full rounded-xl h-10 text-[9px] font-black uppercase tracking-widest"
                        disabled={isLocked || isDone || activeTimer}
                      >
                        {isDone ? <><CheckCircle className="w-3 h-3 mr-2 text-primary" /> Secured</> : isLocked ? "Locked" : isVerifying ? "Verifying..." : <><ExternalLink className="w-3 h-3 mr-2" /> Start Stage</>}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="text-center py-12">
            {activeTimer ? (
              <div className="space-y-8 animate-in zoom-in duration-500">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Zap className="w-4 h-4 animate-bounce" />
                  Stage {currentStep + 1} Verification Active
                </div>
                <div className="text-8xl font-black font-headline tracking-tighter tabular-nums text-foreground">
                  {countdownText}
                </div>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                  Stay on page to verify engagement. Fractional reward credited after verification.
                </p>
              </div>
            ) : isCompletedToday ? (
              <div className="space-y-6 animate-in fade-in duration-1000">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-14 h-14 text-primary" />
                </div>
                <h3 className="text-3xl font-black luxury-text-gradient">Daily Sequence Finalized</h3>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Streak updated. Return in 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">
                  Current Target: Stage {currentStep + 1}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-secondary/30 p-10 border-t border-border/50">
          <Button 
            className="w-full h-20 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 btn-luxury"
            disabled={activeTimer || isCompletedToday}
            onClick={() => handleStartSubTask(currentStep, channels[currentStep].url)}
          >
            {activeTimer ? "Verifying Current Stage..." : isCompletedToday ? "Reward Secured" : `Unlock Stage ${currentStep + 1}`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
