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
import { Youtube, Instagram, Facebook, CheckCircle, Zap, Crown, Trophy, Lock, ExternalLink, ShieldCheck, Clock, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { useAdminStatus } from '@/hooks/useAdminStatus';

const TASK_DURATION_SECONDS = 600; // STRICT 10 MINUTES
const COOLDOWN_MS = 20 * 60 * 60 * 1000; // 20 Hour Security Cooldown
const TOTAL_CYCLE_MS = 24 * 60 * 60 * 1000; // STRICT 24H REGISTRY WINDOW

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

  const isElite = !!(userData && userData.streakCount >= 365);

  const isCooldownActive = useMemo(() => {
    if (!userData?.lastCompletedDate) return false;
    const lastTime = new Date(userData.lastCompletedDate).getTime();
    return (currentTime - lastTime) < COOLDOWN_MS;
  }, [userData?.lastCompletedDate, currentTime]);

  const cooldownRemainingText = useMemo(() => {
    if (!isCooldownActive || !userData?.lastCompletedDate) return null;
    const lastTime = new Date(userData.lastCompletedDate).getTime();
    const remainingMs = COOLDOWN_MS - (currentTime - lastTime);
    if (remainingMs <= 0) return null;
    const h = Math.floor(remainingMs / (1000 * 60 * 60));
    const m = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((remainingMs % (1000 * 60)) / 1000);
    return `${h}h ${m}m ${s}s`;
  }, [isCooldownActive, userData?.lastCompletedDate, currentTime]);

  const currentStepIndex = useMemo(() => {
    if (isCooldownActive) return 3;
    if (!userData?.step1Status) return 0;
    if (!userData?.step2Status) return 1;
    if (!userData?.step3Status) return 2;
    return 3; 
  }, [userData?.step1Status, userData?.step2Status, userData?.step3Status, isCooldownActive]);

  useEffect(() => {
    if (userData && userDocRef && !activeTimer) {
      const updates: any = {};
      let needsUpdate = false;
      const lastStepDay = userData.lastStepDate ? new Date(userData.lastStepDate).toDateString() : null;
      const today = new Date().toDateString();
      const hasCompletedAll = userData.step3Status;
      const isNewDaySinceLastStep = lastStepDay && lastStepDay !== today;

      if (!isCooldownActive && (hasCompletedAll || isNewDaySinceLastStep)) {
        updates.step1Status = false;
        updates.step2Status = false;
        updates.step3Status = false;
        needsUpdate = true;
      }

      if (userData.lastCompletedDate) {
        const lastTime = new Date(userData.lastCompletedDate).getTime();
        const diff = currentTime - lastTime;
        if (diff > TOTAL_CYCLE_MS && userData.streakCount > 0) {
          updates.streakCount = 0;
          updates.eliteUnlocked = false; 
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        updateDocumentNonBlocking(userDocRef, updates);
        if (updates.streakCount === 0 && userData.streakCount > 0) {
          toast({
            variant: "destructive",
            title: "STREAK REGISTRY RESET",
            description: "Strict 24h activity window breached. Registry initialized to Day 0.",
          });
        }
      }
    }
  }, [userData, userDocRef, isCooldownActive, activeTimer, currentTime, toast]);

  const handleStageComplete = useCallback(() => {
    if (!user || !userData || !userDocRef || activeStep === null) return;
    const stage = activeStep;
    let reward = (stage === 2 ? 0.34 : 0.33);
    let updates: any = {};
    const now = new Date().toISOString();
    updates.lastStepDate = now;

    if (stage === 0) updates.step1Status = true;
    if (stage === 1) updates.step2Status = true;
    if (stage === 2) {
      updates.step3Status = true;
      updates.lastCompletedDate = now;
      let newStreak = (userData.streakCount || 0) + 1;
      updates.streakCount = newStreak;
      if (newStreak >= 365 && !userData.eliteUnlocked) {
        updates.eliteUnlocked = true;
        updates.eliteStartDate = now;
        toast({ title: "ELITE STATUS AUTHORIZED", description: "365-day milestone secured. Bonus claims enabled." });
      }
      let newMonthlyCounter = (userData.eliteMonthlyCounter || 0) + 1;
      if (newMonthlyCounter >= 30) {
        updates.eliteMonthlyCounter = 0;
        updates.eliteRewardsAvailable = (userData.eliteRewardsAvailable || 0) + 1;
        toast({ title: "BONUS GENERATED", description: "$100 LTB Brand Elite Gift Card added to registry. Reach 365-day streak to claim." });
      } else {
        updates.eliteMonthlyCounter = newMonthlyCounter;
      }
    }
    updates.balance = increment(reward);
    updateDocumentNonBlocking(userDocRef, updates);
    setActiveTimer(false);
    setActiveStep(null);
    setCountdown(TASK_DURATION_SECONDS);
    toast({ title: "STAGE VERIFIED", description: `+$${reward.toFixed(2)} credited to Account Balance.` });
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
    window.open(url, '_blank', 'noopener,noreferrer');
    setActiveStep(stepIndex);
    setCountdown(TASK_DURATION_SECONDS);
    setActiveTimer(true);
  };

  if (isUserLoading || isUserDataLoading) return <div className="p-24 text-center font-black uppercase tracking-widest text-foreground">Verifying System Integrity...</div>;
  if (!user || !userData) return <p className="p-24 text-center font-black uppercase tracking-widest text-muted-foreground">Authentication Required.</p>;

  const channels = [
    { id: 0, title: 'YouTube @LTBLIVESPORTSTV', icon: Youtube, url: 'https://www.youtube.com/@LTBLIVESPORTSTV', desc: `Stage 1 (+0.33)`, status: userData.step1Status },
    { id: 1, title: 'Instagram @ltblivesports', icon: Instagram, url: 'https://www.instagram.com/ltblivesports/', desc: `Stage 2 (+0.33)`, status: userData.step2Status },
    { id: 2, title: 'Facebook Reels: ltbliveurielsport', icon: Facebook, url: 'https://www.facebook.com/ltbliveurielsport/reels/', desc: `Final Stage (+0.34)`, status: userData.step3Status }
  ];

  return (
    <div className="space-y-10">
      <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/10 shadow-2xl rounded-[3rem]">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-10 pb-7">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-3xl font-black luxury-text-gradient flex items-center gap-3">
              {isElite ? <Crown className="w-10 h-10 text-primary animate-pulse" /> : <Zap className="w-10 h-10 text-primary" />}
              {isElite ? "Elite Active Tier 1" : "Daily Task Sequence"}
            </CardTitle>
            <CardDescription className="font-black uppercase tracking-widest text-[10px] text-muted-foreground/60">
              Identity: CEO {userData.username} • Registry: Day {userData.streakCount || 0} / 365
            </CardDescription>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Balance</div>
            <div className="text-4xl font-black text-primary">${(userData.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
        </CardHeader>

        <div className="px-10 pb-6">
          <Card className="bg-primary/5 border-primary/10 rounded-[2rem] border-2 overflow-hidden shadow-inner">
            <CardContent className="p-8">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary mb-4">ELITE ACTIVE TIER 1 PROTOCOL</h3>
              <p className="text-[11px] font-black uppercase leading-relaxed text-foreground text-justify">
                ACHIEVE A 365-DAY CONSECUTIVE STREAK TO AUTHORIZE PERMANENT ACCESS TO THE ELITE REGISTRY. ALL EXECUTIVES EARN A CONSOLIDATED $1.00 PER DAILY TASK CYCLE. ADDITIONALLY, ALL MEMBERS GENERATE A $100.00 LTB BRAND ELITE GIFT CARD BONUS FOR EVERY 30 DAYS OF CONTINUOUS ACTIVITY; HOWEVER, CLAIMING IS EXCLUSIVELY LOCKED UNTIL THE 365-DAY MILESTONE IS SECURED. UPON CLAIMING, $100.00 IS CREDITED DIRECTLY TO YOUR WALLET. A STRICT 24-HOUR COMPLETION WINDOW IS MANDATORY; BREACHING THIS WINDOW INITIALIZES THE STREAK REGISTRY TO DAY 0.
              </p>
            </CardContent>
          </Card>
        </div>
        
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
            <div className="bg-white rounded-[2rem] p-8 border border-primary/20 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-primary" />
                  <span className="text-sm font-black uppercase tracking-widest">Monthly Bonus Cycle</span>
                </div>
                <span className="text-xs font-black text-primary">{userData.eliteMonthlyCounter || 0} / 30 Cycles</span>
              </div>
              <Progress value={((userData.eliteMonthlyCounter || 0) / 30) * 100} className="h-4 bg-secondary rounded-full" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-center mb-8">Authoritative Execution Sequence</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {channels.map((channel) => (
                <Card key={channel.id} className={`rounded-[2rem] border-2 transition-all duration-500 ${channel.status ? 'border-primary/40 bg-primary/5 shadow-inner' : (channel.id === currentStepIndex && activeTimer) ? 'border-primary animate-pulse shadow-lg' : (channel.id > currentStepIndex || isCooldownActive) ? 'opacity-50 grayscale bg-muted/20 border-transparent' : 'border-black/5 bg-white shadow-md'}`}>
                  <CardContent className="p-8 text-center space-y-4">
                    <div className={`mx-auto w-20 h-20 rounded-[1.5rem] flex items-center justify-center transition-all ${channel.status ? 'bg-primary text-white shadow-lg' : (channel.id > currentStepIndex || isCooldownActive) ? 'bg-muted text-muted-foreground' : 'bg-black text-white'}`}>
                      {channel.id > currentStepIndex || isCooldownActive ? <Lock className="w-10 h-10" /> : channel.status ? <ShieldCheck className="w-10 h-10" /> : <channel.icon className="w-10 h-10" />}
                    </div>
                    <div>
                      <h4 className="font-black text-[11px] uppercase tracking-widest">{channel.title}</h4>
                      <p className="text-[10px] font-bold text-muted-foreground/60 mt-1 uppercase tracking-tighter">{channel.desc}</p>
                    </div>
                    <div className="pt-2">
                      {channel.status ? (
                        <div className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3" /> Status: Secured</div>
                      ) : (channel.id > currentStepIndex || isCooldownActive) ? (
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Locked</div>
                      ) : (
                        <Button onClick={() => handleStartSubTask(channel.id, channel.url)} variant="outline" className="w-full rounded-xl h-12 text-[9px] font-black uppercase tracking-widest border-2 hover:bg-black hover:text-white transition-all" disabled={activeTimer}>
                          { (channel.id === currentStepIndex && activeTimer) ? "Verifying..." : <><ExternalLink className="w-3 h-3 mr-2" /> Start stage</>}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {activeTimer && (
            <div className="text-center py-12 space-y-8 animate-in zoom-in duration-500">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-primary/10 text-primary rounded-full text-[11px] font-black uppercase tracking-widest border border-primary/20">
                <Zap className="w-5 h-5 animate-bounce" /> Stage {activeStep! + 1} Verification Active
              </div>
              <div className="text-9xl font-black font-headline tracking-tighter tabular-nums text-foreground animate-pulse">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</div>
            </div>
          )}

          {isCooldownActive && (
            <div className="text-center py-16 space-y-6 animate-in fade-in duration-1000">
              <div className="mx-auto w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mb-8 border border-primary/20"><Clock className="w-16 h-16 text-primary" /></div>
              <h3 className="text-4xl font-black luxury-text-gradient">Daily Cooldown Active</h3>
              <div className="text-5xl font-black tabular-nums tracking-tighter mb-6 text-foreground">Next Task: {cooldownRemainingText}</div>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-secondary/30 p-10 border-t border-border/50">
          <Button className="w-full h-24 rounded-[2.5rem] text-sm font-black uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95 btn-luxury border-none" disabled={activeTimer || isCooldownActive || currentStepIndex > 2} onClick={() => currentStepIndex <= 2 && handleStartSubTask(currentStepIndex, channels[currentStepIndex].url)}>
            {activeTimer ? "Verifying Authorization..." : isCooldownActive ? `Authorized in ${cooldownRemainingText}` : currentStepIndex > 2 ? "Cycle Finalized" : "Initialize Tasks"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}