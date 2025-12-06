"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebase';

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        router.push('/admin/login');
        return;
      }
      try {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        const role = data?.role;
        if (role && ['superAdmin','supportAdmin','vendorManager','expertManager'].includes(role)) {
          setAllowed(true);
        } else {
          // not authorized
          await signOut(auth);
          router.push('/admin/login');
        }
      } catch (err) {
        console.error(err);
        await signOut(auth);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router]);

  if (loading) return <div className="p-8">Checking authentication...</div>;
  if (!allowed) return null;
  return <>{children}</>;
}
