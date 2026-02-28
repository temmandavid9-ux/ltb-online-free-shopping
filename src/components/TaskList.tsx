
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
import { Youtube, Instagram, Twitch, CheckCircle, Zap, Crown, Trophy, Lock, ExternalLink, ShieldCheck, Clock, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAdminStatus } from '@/hooks/useAdminStatus';

const TASK_DURATION_SECONDS = 10; // CEO AUDIT: Reduced to 10 seconds
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // Strict 24-hour lockout

export default function TaskList() {
  const { user, isUserLoading } = useUser();
  const { isAdmin } = useAdminStatus();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { t } = useLanguage();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<UserProfile>(userDocRef);

  const [activeTimer, setActiveTimer] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(TASK_DURATION_SECONDS);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const isCooldownActive = useMemo(() => {
    if (!userData?.lastCompletedDate) return false;
    const lastTime = new Date(userData.lastCompletedDate).getTime();
    return (currentTime - lastTime) < COOLDOWN_MS;
  }, [userData?.lastCompletedDate, currentTime]);

  const nextUnlockTime = useMemo(() => {
    if (!userData?.lastCompletedDate) return null;
    return new Date(new Date(userData.lastCompletedDate).getTime() + COOLDOWN_MS);
  }, [userData?.lastCompletedDate]);

  // CEO LOGIC: Determine the current step index based on progress flags
  const currentStepIndex = useMemo(() => {
    if (isCooldownActive) return 3; // All steps locked/completed
    
    const lastComp = userData?.lastCompletedDate ? new Date(userData.lastCompletedDate).getTime() : 0;
    const lastStep = userData?.lastStepDate ? new Date(userData.lastStepDate).getTime() : 0;
    
    // If the last step recorded was before the last full cycle completion, start fresh
    if (lastStep <= lastComp) return 0;
    
    if (!userData?.step1Status) return 0;
    if (!userData?.step2Status) return 1;
    if (!userData?.step3Status) return 2;
    return 3;
  }, [userData, isCooldownActive]);

  const handleStageComplete = useCallback(() => {
    if (!user || !userData || !userDocRef || activeStep === null) return;

    const stage = activeStep;
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

      // Streak Anchoring Protocol
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

      // Elite Mode Entry Protocol
      if (!userData.eliteUnlocked && newStreak >= 365) {
        updates.eliteUnlocked = true;
        updates.eliteStartDate = today.toISOString();
        updates.eliteMonthlyCounter = 0;
        updates.eliteRewardsAvailable = 0;
        toast({ 
          title: "ELITE STATUS AUTHORIZED", 
          description: "365-day milestone secured. Welcome to the elite tier." 
        });
      } else if (userData.eliteUnlocked) {
        let newMonthlyCounter = (userData.eliteMonthlyCounter || 0) + 1;
        let newRewards = userData.eliteRewardsAvailable || 0;
        if (newMonthlyCounter >= 30) {
          newMonthlyCounter = 0;
          newRewards += 1;
          toast({ 
            title: "MONTHLY BONUS SECURED", 
            description: "$25 Gift Card added to your portfolio." 
          });
        }
        updates.eliteMonthlyCounter = newMonthlyCounter;
        updates.eliteRewardsAvailable = newRewards;
      }
    }

    updates.balance = increment(reward);
    updateDocumentNonBlocking(userDocRef, updates);
    
    setActiveTimer(false);
    setActiveStep(null);
    setCountdown(TASK_DURATION_SECONDS);

    toast({
      title: "STAGE VERIFIED",
      description: `+$${reward.toFixed(2)} credited to Account Balance.`,
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
    if (stepIndex !== currentStepIndex) {
        toast({ title: "Sequence Violation", description: "You must complete the tasks in the prescribed order.", variant: "destructive" });
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    setActiveStep(stepIndex);
    setCountdown(TASK_DURATION_SECONDS);
    setActiveTimer(true);
  };

  const resetForCEO = () => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, {
      lastCompletedDate: null,
      lastStepDate: null,
      step1Status: false,
      step2Status: false,
      step3Status: false,
      streakCount: 0,
      eliteUnlocked: false,
      eliteMonthlyCounter: 0,
      eliteRewardsAvailable: 0
    });
    toast({ title: "CEO BYPASS: Sequence Fully Reset" });
  };

  if (isUserLoading || isUserDataLoading) return <div className="p-24 text-center">Verifying Sequence Integrity...</div>;
  if (!user || !userData) return <p className="p-24 text-center">Authentication Required for Registry Access.</p>;

  const countdownText = `${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`;
  const lastComp = userData.lastCompletedDate ? new Date(userData.lastCompletedDate).getTime() : 0;
  const lastStep = userData.lastStepDate ? new Date(userData.lastStepDate).getTime() : 0;
  const isFreshCycle = lastStep <= lastComp;

  const channels = [
    { id: 0, title: 'YouTube @Eden-s8u', icon: Youtube, url: 'https://youtube.com/@Eden-s8u', desc: 'Stage 1 (+$0.33)', status: !isFreshCycle && userData.step1Status },
    { id: 1, title: 'Instagram: eden022026', icon: Instagram, url: 'https://www.instagram.com/eden022026/', desc: 'Stage 2 (+$0.33)', status: !isFreshCycle && userData.step2Status },
    { id: 2, title: 'Twitch: edenonlineshoppingstore', icon: Twitch, url: 'https://www.twitch.tv/edenonlineshoppingstore', desc: 'Final Stage (+$0.34)', status: !isFreshCycle && userData.step3Status }
  ];

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/10 shadow-2xl rounded-[3rem]">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-10 pb-7">
          <div>
            <div className="flex items-center gap-4 mb-4">
                <CardTitle className="text-3xl font-black luxury-text-gradient flex items-center gap-3">
                {userData.eliteUnlocked ? <Crown className="w-10 h-10 text-primary animate-pulse" /> : <Zap className="w-10 h-10 text-primary" />}
                {userData.eliteUnlocked ? "Elite Tier Active" : "Daily Task Sequence"}
                </CardTitle>
                {isAdmin && (
                    <Button onClick={resetForCEO} size="sm" variant="destructive" className="rounded-full px-4 h-10 text-[9px] font-black uppercase tracking-widest gap-2 bg-black hover:bg-red-600 transition-colors">
                        <RefreshCcw className="w-3 h-3" /> CEO BYPASS: RESET SEQUENCE
                    </Button>
                )}
            </div>
            <CardDescription className="mt-2 font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">
              Identity: CEO {userData.username} • Milestone: {userData.streakCount || 0} / 365 Cycles
            </CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Balance</div>
            <div className="text-4xl font-black text-primary">${(userData.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-10 px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2rem] p-8 border border-black/5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Trophy className="w-6 h-6 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest">Streak Registry</span>
                </div>
                <span className="text-xs font-black text-muted-foreground">{userData.streakCount || 0} / 365 Days</span>
              </div>
              <Progress value={((userData.streakCount || 0) / 365) * 100} className="h-4 bg-secondary rounded-full" />
            </div>

            {userData.eliteUnlocked && (
              <div className="bg-white rounded-[2rem] p-8 border border-primary/20 shadow-sm animate-in zoom-in">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Zap className="w-6 h-6 text-primary" />
                    <span className="text-sm font-black uppercase tracking-widest">Monthly Bonus cycle</span>
                  </div>
                  <span className="text-xs font-black text-primary">{userData.eliteMonthlyCounter || 0} / 30 Cycles</span>
                </div>
                <Progress value={((userData.eliteMonthlyCounter || 0) / 30) * 100} className="h-4 bg-secondary rounded-full" />
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-center mb-8">Authoritative Execution Sequence</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {channels.map((channel) => {
                const isSecured = channel.status || (isCooldownActive && channel.id <= 2);
                const isLocked = channel.id > currentStepIndex && !isCooldownActive;
                const isActivating = channel.id === currentStepIndex && activeTimer;

                return (
                  <Card key={channel.id} className={`rounded-[2rem] border-2 transition-all duration-500 ${isSecured ? 'border-primary/40 bg-primary/5 shadow-inner' : isActivating ? 'border-primary animate-pulse shadow-lg' : isLocked ? 'opacity-50 grayscale bg-muted/20 border-transparent' : 'border-black/5 bg-white shadow-md'}`}>
                    <CardContent className="p-8 text-center space-y-4">
                      <div className={`mx-auto w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all ${isSecured ? 'bg-primary text-white shadow-lg' : isLocked ? 'bg-muted text-muted-foreground' : 'bg-black text-white'}`}>
                        {isLocked ? <Lock className="w-10 h-10" /> : isSecured ? <ShieldCheck className="w-10 h-10" /> : <channel.icon className="w-10 h-10" />}
                      </div>
                      <div>
                        <h4 className="font-black text-[11px] uppercase tracking-widest">{channel.title}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground/60 mt-1">{channel.desc}</p>
                      </div>
                      <div className="pt-2">
                        {isSecured ? (
                          <div className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Status: Secured
                          </div>
                        ) : isLocked ? (
                          <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Locked</div>
                        ) : (
                          <Button 
                            onClick={() => handleStartSubTask(channel.id, channel.url)}
                            variant="outline"
                            className="w-full rounded-xl h-12 text-[9px] font-black uppercase tracking-widest border-2 hover:bg-black hover:text-white transition-all"
                            disabled={activeTimer}
                          >
                            {isActivating ? "Verifying..." : <><ExternalLink className="w-3 h-3 mr-2" /> Start stage</>}
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
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase tracking-widest border border-primary/20">
                <Zap className="w-5 h-5 animate-bounce" />
                Stage {activeStep! + 1} Verification Active
              </div>
              <div className="text-9xl font-black font-headline tracking-tighter tabular-nums text-foreground animate-pulse">{countdownText}</div>
              <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                Stay on page. Engagement secures fractional reward credit.
              </p>
            </div>
          )}

          {isCooldownActive && (
            <div className="text-center py-16 space-y-6 animate-in fade-in duration-1000">
              <div className="mx-auto w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20">
                <Clock className="w-16 h-16 text-primary" />
              </div>
              <h3 className="text-4xl font-black luxury-text-gradient">Task Cooldown Active</h3>
              <p className="text-muted-foreground text-[11px] font-black uppercase tracking-widest mb-6">Streak anchored. 24-hour verification window active.</p>
              <div className="inline-flex items-center gap-3 px-8 py-3 bg-black text-white rounded-full shadow-2xl">
                <Lock className="w-4 h-4 text-primary" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  Unlocks at: {nextUnlockTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-secondary/30 p-10 border-t border-border/50">
          <Button 
            className="w-full h-24 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 btn-luxury border-none"
            disabled={activeTimer || isCooldownActive}
            onClick={() => handleStartSubTask(currentStepIndex, channels[currentStepIndex].url)}
          >
            {activeTimer ? "Verifying Authorization..." : isCooldownActive ? "Reward Registry Secured" : `Initialize Stage ${currentStepIndex + 1}`}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
