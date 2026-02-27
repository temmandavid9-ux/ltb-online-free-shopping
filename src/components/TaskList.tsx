
'use client';
import {
  useUser,
  useFirestore,
  useDoc,
  useMemoFirebase,
  updateDocumentNonBlocking,
} from '@/firebase';
import { doc, increment } from 'firebase/firestore';
import { useEffect, useState, useMemo, useCallback } from 'react';
import type { UserProfile } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Youtube, Instagram, Twitch, CheckCircle, Zap, Crown, Trophy, Lock, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';

const TASK_DURATION_SECONDS = 600; // 10 minutes verification
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // Strict 24-hour lockout

export default function TaskList() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<UserProfile>(userDocRef);

  const [activeTimer, setActiveTimer] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(TASK_DURATION_SECONDS);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update local clock for real-time cooldown tracking
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Strict 24-hour cooldown check from the last FULL sequence completion
  const isCooldownActive = useMemo(() => {
    if (!userData?.lastCompletedDate) return false;
    const lastTime = new Date(userData.lastCompletedDate).getTime();
    return (currentTime - lastTime) < COOLDOWN_MS;
  }, [userData?.lastCompletedDate, currentTime]);

  const nextUnlockTime = useMemo(() => {
    if (!userData?.lastCompletedDate) return null;
    return new Date(new Date(userData.lastCompletedDate).getTime() + COOLDOWN_MS);
  }, [userData?.lastCompletedDate]);

  /**
   * RE-ENGINEERED UNLOCK LOGIC:
   * 1. If in 24h lockout, index is 3 (all secured).
   * 2. If steps are from a PREVIOUS cycle (before lastCompletedDate), index is 0 (fresh start).
   * 3. Else, return the first incomplete step.
   */
  const currentStepIndex = useMemo(() => {
    if (isCooldownActive) return 3;
    
    const lastComp = userData?.lastCompletedDate ? new Date(userData.lastCompletedDate).getTime() : 0;
    const lastStep = userData?.lastStepDate ? new Date(userData.lastStepDate).getTime() : 0;
    
    // If the last step activity happened before the last full completion, it's a stale cycle
    const isStaleCycle = lastStep < lastComp;
    
    if (isStaleCycle) return 0;
    if (!userData?.step1Status) return 0;
    if (!userData?.step2Status) return 1;
    if (!userData?.step3Status) return 2;
    return 3;
  }, [userData, isCooldownActive]);

  // Handle fractional rewards and sequential unlocking
  const handleStageComplete = useCallback(() => {
    if (!user || !userData || !userDocRef || activeStep === null) return;

    const stage = activeStep;
    // Sequential Rewards: Step 1: $0.33, Step 2: $0.33, Final: $0.34 (Total $1.00)
    let reward = stage === 2 ? 0.34 : 0.33;
    let updates: any = {};

    updates.lastStepDate = new Date().toISOString();

    if (stage === 0) updates.step1Status = true;
    if (stage === 1) updates.step2Status = true;
    if (stage === 2) {
      updates.step3Status = true;
      
      const today = new Date();
      const lastDate = userData.lastCompletedDate ? new Date(userData.lastCompletedDate) : null;
      let newStreak = userData.streakCount || 0;

      // Streak logic: check if last completion was within 48 hours
      if (lastDate) {
        const diff = today.getTime() - lastDate.getTime();
        if (diff < COOLDOWN_MS * 2) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      updates.lastCompletedDate = today.toISOString();
      updates.streakCount = newStreak;

      // Elite Mode Activation at 365 Days
      if (!userData.eliteUnlocked && newStreak >= 365) {
        updates.eliteUnlocked = true;
        updates.eliteStartDate = today.toISOString();
        updates.eliteMonthlyCounter = 0;
        updates.eliteRewardsAvailable = 0;
        toast({ title: "ELITE MODE ACTIVATED", description: "365-day milestone achieved. Permanent Elite status secured." });
      }

      // Elite Monthly Bonus Cycle (30 Days = $25 Gift Card)
      if (userData.eliteUnlocked || updates.eliteUnlocked) {
        let newMonthlyCounter = (userData.eliteMonthlyCounter || 0) + 1;
        let newRewards = userData.eliteRewardsAvailable || 0;
        if (newMonthlyCounter >= 30) {
          newMonthlyCounter = 0;
          newRewards = (userData.eliteRewardsAvailable || 0) + 1;
          toast({ title: "MONTHLY BONUS EARNED", description: "$25 Gift Card credited to your account." });
        }
        updates.eliteMonthlyCounter = newMonthlyCounter;
        updates.eliteRewardsAvailable = newRewards;
      }
    }

    // ATOMIC INCREMENT: Mission-critical for precision wallet tracking
    updates.balance = increment(reward);
    
    updateDocumentNonBlocking(userDocRef, updates);
    
    setActiveTimer(false);
    setActiveStep(null);
    setCountdown(TASK_DURATION_SECONDS);

    toast({
      title: "Step Secured",
      description: `+$${reward.toFixed(2)} credited to your status balance. Sequence advanced.`,
    });
  }, [user, userData, userDocRef, toast, activeStep]);

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
    if (isCooldownActive || activeTimer) return;
    if (stepIndex !== currentStepIndex) return;
    
    window.open(url, '_blank', 'noopener,noreferrer');
    setActiveStep(stepIndex);
    setCountdown(TASK_DURATION_SECONDS);
    setActiveTimer(true);
  };

  if (isUserLoading || isUserDataLoading) return <div className="p-24 text-center">Loading Registry...</div>;
  if (!user || !userData) return <p className="p-24 text-center">Authentication Required.</p>;

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const countdownText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  // Check if steps are fresh or from a previous day
  const lastComp = userData.lastCompletedDate ? new Date(userData.lastCompletedDate).getTime() : 0;
  const lastStep = userData.lastStepDate ? new Date(userData.lastStepDate).getTime() : 0;
  const isStale = lastStep < lastComp;

  const channels = [
    { id: 0, title: 'YouTube @Eden-s8u', icon: Youtube, url: 'https://youtube.com/@Eden-s8u', desc: 'Registry Step 1 (+$0.33)', status: !isStale && userData.step1Status },
    { id: 1, title: 'Instagram: eden022026', icon: Instagram, url: 'https://www.instagram.com/eden022026/', desc: 'Registry Step 2 (+$0.33)', status: !isStale && userData.step2Status },
    { id: 2, title: 'Twitch: edenonlineshoppingstore', icon: Twitch, url: 'https://www.twitch.tv/edenonlineshoppingstore', desc: 'Final Verification (+$0.34)', status: !isStale && userData.step3Status }
  ];

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/10 shadow-2xl rounded-[3rem]">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-10 pb-7">
          <div>
            <CardTitle className="text-3xl font-black luxury-text-gradient flex items-center gap-3">
              {userData.eliteUnlocked ? <Crown className="w-10 h-10 text-primary animate-pulse" /> : <Zap className="w-10 h-10 text-primary" />}
              {userData.eliteUnlocked ? "Elite Monthly Registry" : "Daily Sequential Registry"}
            </CardTitle>
            <CardDescription className="mt-2 font-medium uppercase tracking-widest text-[10px] text-muted-foreground">
              Sequential Execution Required. Full PACK: $1.00 Total Daily Reward.
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
                const isSecured = channel.status || (isCooldownActive && channel.id <= 2);
                const isLocked = channel.id > currentStepIndex && !isCooldownActive;
                const isActivating = channel.id === currentStepIndex && activeTimer;

                return (
                  <Card key={channel.id} className={`rounded-[2rem] border-2 transition-all duration-500 ${isSecured ? 'border-primary/40 bg-primary/5' : isActivating ? 'border-primary animate-pulse' : isLocked ? 'opacity-50 grayscale bg-muted/20' : 'border-black/5 bg-white'}`}>
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isSecured ? 'bg-primary text-white' : isLocked ? 'bg-muted text-muted-foreground' : 'bg-secondary text-foreground'}`}>
                        {isLocked ? <Lock className="w-8 h-8" /> : isSecured ? <ShieldCheck className="w-8 h-8" /> : <channel.icon className="w-8 h-8" />}
                      </div>
                      <div>
                        <h4 className="font-black text-[10px] uppercase tracking-widest">{channel.title}</h4>
                        <p className="text-[9px] font-bold text-muted-foreground/60 mt-1">{channel.desc}</p>
                      </div>
                      <div className="pt-2">
                        {isSecured ? (
                          <div className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Status: Secured
                          </div>
                        ) : isLocked ? (
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                            Locked
                          </div>
                        ) : (
                          <Button 
                            onClick={() => handleStartSubTask(channel.id, channel.url)}
                            variant="outline"
                            className="w-full rounded-xl h-10 text-[9px] font-black uppercase tracking-widest"
                            disabled={activeTimer}
                          >
                            {isActivating ? "Verifying..." : <><ExternalLink className="w-3 h-3 mr-2" /> Start Stage</>}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {activeTimer && (
            <div className="text-center py-12 space-y-8 animate-in zoom-in duration-500">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-primary/10 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                <Zap className="w-4 h-4 animate-bounce" />
                Stage {activeStep! + 1} Verification Active
              </div>
              <div className="text-8xl font-black font-headline tracking-tighter tabular-nums text-foreground">
                {countdownText}
              </div>
              <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                Verification Required. Engage with social media content to secure fractional reward.
              </p>
            </div>
          )}

          {isCooldownActive && (
            <div className="text-center py-12 space-y-6 animate-in fade-in duration-1000">
              <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Clock className="w-14 h-14 text-primary" />
              </div>
              <h3 className="text-3xl font-black luxury-text-gradient">Daily PACK Cooldown</h3>
              <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mb-4">Streak: Day {userData.streakCount}. 24-hour verification window active.</p>
              <div className="inline-flex items-center gap-2 px-6 py-2 bg-secondary rounded-full border border-border/50">
                <Lock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  Next Registry Unlocks at: {nextUnlockTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-secondary/30 p-10 border-t border-border/50">
          <Button 
            className="w-full h-20 rounded-[2rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95 btn-luxury"
            disabled={activeTimer || isCooldownActive}
            onClick={() => handleStartSubTask(currentStepIndex, channels[currentStepIndex].url)}
          >
            {activeTimer ? "Verification in Progress..." : isCooldownActive ? "Reward Secured" : `Unlock Registry Step ${currentStepIndex + 1}`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
