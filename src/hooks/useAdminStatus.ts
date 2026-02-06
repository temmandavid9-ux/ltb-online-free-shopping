'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function useAdminStatus() {
  const { user } = useUser();
  const firestore = useFirestore();

  const adminDocRef = useMemoFirebase(
    () => (user ? doc(firestore, 'roles_admin', user.uid) : null),
    [firestore, user]
  );

  const { data: adminDoc, isLoading } = useDoc(adminDocRef);

  return {
    isAdmin: !!adminDoc,
    isAdminLoading: isLoading,
  };
}
