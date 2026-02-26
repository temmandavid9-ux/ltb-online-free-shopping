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
import { Youtube, CheckCircle, Zap, Crown, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const TASK_DURATION_SECONDS = 600; // 10 minutes verification
const DAILY_REWARD = 1.00;

export default function TaskList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid, 'profile', 'data') : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<UserProfile>(userDocRef);

  const [activeTimer, setActiveTimer] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(TASK_DURATION_SECONDS);

  const isCompletedToday = useMemo(() => {
    if (!userData?.lastCompletedDate) return false;
    const lastDate = new Date(userData.lastCompletedDate).toDateString();
    const today = new Date().toDateString();
    return lastDate === today;
  }, [userData]);

  const handleCompleteTask = useCallback(() => {
    if (!user || !userData || !userDocRef) return;

    const today = new Date();
    const lastDate = userData.lastCompletedDate ? new Date(userData.lastCompletedDate) : null;
    
    let newStreak = userData.streakCount || 0;
    
    // Streak logic
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

    const updates: Partial<UserProfile> = {
      balance: (userData.balance || 0) + DAILY_REWARD,
      lastCompletedDate: today.toISOString(),
      streakCount: newStreak,
    };

    // Elite Unlock Check (365 days)
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

    // Elite Monthly Progress (30 days cycle)
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

    updateDocumentNonBlocking(userDocRef, updates);
    
    toast({
      title: t('tasks.taskCompleted', { reward: `$${DAILY_REWARD.toFixed(2)}` }),
      description: t('tasks.toast.streakMaintained', { streak: newStreak }),
    });
    
    setActiveTimer(false);
  }, [user, userData, userDocRef, t, toast]);

  useEffect(() => {
    if (!activeTimer) return;
    if (countdown <= 0) {
      handleCompleteTask();
      return;
    }
    const timer = setInterval(() => setCountdown(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [activeTimer, countdown, handleCompleteTask]);

  const handleStartTask = () => {
    if (isCompletedToday) {
      toast({ variant: "destructive", title: t('tasks.toast.alreadyCompleted') });
      return;
    }
    window.open("https://youtube.com/@Eden-s8u", '_blank', 'noopener,noreferrer');
    setCountdown(TASK_DURATION_SECONDS);
    setActiveTimer(true);
  };

  if (isUserLoading || isUserDataLoading) return <div className="p-8 text-center">{t('tasks.loading')}</div>;
  if (!user || !userData) return <p className="p-8 text-center">{t('tasks.loginPrompt')}</p>;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const countdownText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/10 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div>
            <CardTitle className="text-2xl font-black luxury-text-gradient flex items-center gap-3">
              {userData.eliteUnlocked ? <Crown className="w-8 h-8 text-primary animate-pulse" /> : <Zap className="w-8 h-8 text-primary" />}
              {userData.eliteUnlocked ? t('tasks.eliteActive') : t('tasks.pageTitle')}
            </CardTitle>
            <CardDescription className="mt-2 font-medium">{t('tasks.pageDescription')}</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-1">Current Reward</div>
            <div className="text-3xl font-black text-primary">${DAILY_REWARD.toFixed(2)}</div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/5 rounded-3xl p-6 border border-border/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest">Master Streak</span>
                </div>
                <span className="text-xs font-bold text-muted-foreground">{userData.streakCount || 0} / 365 Days</span>
              </div>
              <Progress value={((userData.streakCount || 0) / 365) * 100} className="h-3 bg-secondary" />
              <p className="mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {t('account.eliteStreak', { streak: userData.streakCount || 0 })}
              </p>
            </div>

            {userData.eliteUnlocked && (
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest">Elite Monthly Bonus</span>
                  </div>
                  <span className="text-xs font-bold text-primary">{userData.eliteMonthlyCounter || 0} / 30 Days</span>
                </div>
                <Progress value={((userData.eliteMonthlyCounter || 0) / 30) * 100} className="h-3 bg-secondary" />
                <p className="mt-3 text-[10px] font-bold text-primary uppercase tracking-widest">
                  {t('tasks.eliteMonthlyStatus', { count: userData.eliteMonthlyCounter || 0 })}
                </p>
              </div>
            )}
          </div>

          <div className="text-center py-8">
            {activeTimer ? (
              <div className="space-y-6 animate-in zoom-in duration-500">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest">
                  <Zap className="w-4 h-4 animate-bounce" />
                  Verification Active
                </div>
                <div className="text-7xl font-black font-mono tracking-tighter tabular-nums text-foreground">
                  {countdownText}
                </div>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                  {t('tasks.stayOnPage')}
                </p>
              </div>
            ) : isCompletedToday ? (
              <div className="space-y-4 animate-in fade-in duration-1000">
                <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-2xl font-black luxury-text-gradient">{t('tasks.allCompletedTitle')}</h3>
                <p className="text-muted-foreground text-sm font-medium">{t('tasks.allCompletedDescription')}</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="mx-auto w-24 h-24 bg-secondary rounded-[2.5rem] flex items-center justify-center border-4 border-white shadow-xl">
                  <Youtube className="w-12 h-12 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{t('tasks.startPrompt')}</h3>
                  <p className="text-sm text-muted-foreground">Engage with our curated content to secure your daily reward.</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-secondary/50 p-8 border-t border-border/50">
          <Button 
            className="w-full h-16 rounded-2xl text-lg font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 btn-luxury"
            disabled={activeTimer || isCompletedToday}
            onClick={handleStartTask}
          >
            {activeTimer ? t('tasks.timerActive') : isCompletedToday ? t('tasks.completed') : t('tasks.startButton', { reward: DAILY_REWARD.toFixed(2) })}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
