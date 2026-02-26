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
import { Youtube, Instagram, Twitch, CheckCircle, Zap, Crown, Trophy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const TASK_DURATION_SECONDS = 600; // 10 minutes verification as per Elite requirements
const DAILY_REWARD = 1.00;

export default function TaskList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Standardized 2-segment path: /users/{userId}
  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<UserProfile>(userDocRef);

  const [activeTimer, setActiveTimer] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(TASK_DURATION_SECONDS);
  const [visitedChannels, setVisitedChannels] = useState<Record<string, boolean>>({
    youtube: false,
    instagram: false,
    twitch: false
  });

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
    
    // Streak logic: check if last completion was yesterday
    if (lastDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastDate.toDateString() === yesterday.toDateString()) {
        newStreak += 1;
      } else if (lastDate.toDateString() !== today.toDateString()) {
        newStreak = 1; // Reset to 1 if a day was missed
      }
    } else {
      newStreak = 1;
    }

    const updates: Partial<UserProfile> = {
      balance: (userData.balance || 0) + DAILY_REWARD,
      lastCompletedDate: today.toISOString(),
      streakCount: newStreak,
    };

    // Elite Unlock Milestone (365 Days)
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

    // Elite Monthly Gift Card Cycle (30 Days)
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
    setVisitedChannels({ youtube: false, instagram: false, twitch: false });
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

  const handleVisitChannel = (channel: string, url: string) => {
    setVisitedChannels(prev => ({ ...prev, [channel]: true }));
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const allVisited = Object.values(visitedChannels).every(v => v);

  const handleStartTimer = () => {
    if (isCompletedToday) {
      toast({ variant: "destructive", title: t('tasks.toast.alreadyCompleted') });
      return;
    }
    if (!allVisited) {
      toast({ 
        variant: "destructive", 
        title: "Engagement Required", 
        description: "Please visit all 3 required media channels (YouTube, Instagram, Twitch) to begin verification." 
      });
      return;
    }
    setCountdown(TASK_DURATION_SECONDS);
    setActiveTimer(true);
  };

  if (isUserLoading || isUserDataLoading) return <div className="p-24 text-center">{t('tasks.loading')}</div>;
  if (!user || !userData) return <p className="p-24 text-center">{t('tasks.loginPrompt')}</p>;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const countdownText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/10 shadow-2xl rounded-[3rem]">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-10 pb-7">
          <div>
            <CardTitle className="text-3xl font-black luxury-text-gradient flex items-center gap-3">
              {userData.eliteUnlocked ? <Crown className="w-10 h-10 text-primary animate-pulse" /> : <Zap className="w-10 h-10 text-primary" />}
              {userData.eliteUnlocked ? "Elite Verification Active" : t('tasks.pageTitle')}
            </CardTitle>
            <CardDescription className="mt-2 font-medium uppercase tracking-widest text-[10px] text-muted-foreground">
              Complete the daily social media trinity to build your streak.
            </CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Current Earnings</div>
            <div className="text-4xl font-black text-primary">${(userData.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-10 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest">Streak Progress</span>
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
                    <span className="text-sm font-black uppercase tracking-widest">Monthly Bonus</span>
                  </div>
                  <span className="text-xs font-black text-primary">{userData.eliteMonthlyCounter || 0} / 30 Days</span>
                </div>
                <Progress value={((userData.eliteMonthlyCounter || 0) / 30) * 100} className="h-4 bg-secondary rounded-full" />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-center mb-8">Engagement Trinity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'youtube', title: 'YouTube', icon: Youtube, url: 'https://youtube.com/@Eden-s8u', desc: 'Watch latest verified media.' },
                { id: 'instagram', title: 'Instagram', icon: Instagram, url: 'https://instagram.com/', desc: 'Follow visual showcases.' },
                { id: 'twitch', title: 'Twitch', icon: Twitch, url: 'https://twitch.tv/', desc: 'Join live engagement streams.' }
              ].map((channel) => (
                <Card key={channel.id} className={`rounded-[2rem] border-2 transition-all duration-500 overflow-hidden ${visitedChannels[channel.id] ? 'border-primary/40 bg-primary/5' : 'border-black/5 hover:border-black/10'}`}>
                  <CardContent className="p-6 text-center space-y-4">
                    <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${visitedChannels[channel.id] ? 'bg-primary text-white scale-90' : 'bg-secondary text-foreground'}`}>
                      <channel.icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-widest">{channel.title}</h4>
                      <p className="text-[9px] font-bold text-muted-foreground/60 mt-1">{channel.desc}</p>
                    </div>
                    <Button 
                      onClick={() => handleVisitChannel(channel.id, channel.url)}
                      variant={visitedChannels[channel.id] ? "ghost" : "outline"}
                      className="w-full rounded-xl h-10 text-[9px] font-black uppercase tracking-widest"
                      disabled={isCompletedToday || activeTimer}
                    >
                      {visitedChannels[channel.id] ? <><CheckCircle className="w-3 h-3 mr-2 text-primary" /> Visited</> : <><ExternalLink className="w-3 h-3 mr-2" /> Visit Channel</>}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-center py-12">
            {activeTimer ? (
              <div className="space-y-8 animate-in zoom-in duration-500">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Zap className="w-4 h-4 animate-bounce" />
                  Verification Active
                </div>
                <div className="text-8xl font-black font-headline tracking-tighter tabular-nums text-foreground">
                  {countdownText}
                </div>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                  Engagement verified. Reward will be added to your balance shortly.
                </p>
              </div>
            ) : isCompletedToday ? (
              <div className="space-y-6 animate-in fade-in duration-1000">
                <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-14 h-14 text-primary" />
                </div>
                <h3 className="text-3xl font-black luxury-text-gradient">{t('tasks.allCompletedTitle')}</h3>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">Secure return in 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {!allVisited ? (
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest italic">Engage with all platforms to unlock the daily reward.</p>
                ) : (
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">Ready for verification. Click button below.</p>
                )}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="bg-secondary/30 p-10 border-t border-border/50">
          <Button 
            className="w-full h-20 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 btn-luxury"
            disabled={activeTimer || isCompletedToday || !allVisited}
            onClick={handleStartTimer}
          >
            {activeTimer ? "Verification Running..." : isCompletedToday ? "Reward Secured" : "Unlock $1.00 Reward"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
