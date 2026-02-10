'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore, useUser, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignupPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    if (!auth || !firestore) return;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const newUser = userCredential.user;

      if (newUser) {
        const userRef = doc(firestore, "users", newUser.uid);
        const newUserDoc = {
          id: newUser.uid,
          username: values.username,
          email: values.email,
          walletBalance: 0,
          taskProgress: 0,
          socialsFollowed: false,
          orderIds: [],
          withdrawalIds: [],
          tasks: [],
        };
        
        setDocumentNonBlocking(userRef, newUserDoc, { merge: false });

        toast({
          title: t('signup.toast.successTitle'),
          description: t('signup.toast.successDescription'),
        });
        router.push("/account");
      }
    } catch (error: any) {
      let description = t('login.toast.errorDescription')
      if (error.code === 'auth/email-already-in-use') {
        description = t('signup.toast.emailInUse');
      }
      toast({
        variant: "destructive",
        title: t('signup.toast.errorTitle'),
        description,
      });
    }
  }

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/account');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || user) {
    return <div className="container text-center p-8">{t('general.loading')}</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-xl font-headline">{t('signup.title')}</CardTitle>
          <CardDescription>
            {t('signup.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
               <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.usernameLabel')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('signup.usernamePlaceholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.emailLabel')}</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder={t('signup.emailPlaceholder')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('signup.passwordLabel')}</FormLabel>
                    <FormControl>
                        <Input id="password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? t('signup.buttonLoading') : t('signup.button')}
              </Button>
              <Button variant="outline" className="w-full" disabled>
                {t('signup.googleButton')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            {t('signup.hasAccount')}{" "}
            <Link href="/login" className="underline">
              {t('signup.loginLink')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
