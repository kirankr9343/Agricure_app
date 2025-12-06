"use client";
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
      <div className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl font-semibold text-[#2E7D32] mb-4">Admin Login</h2>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input className="border px-3 py-2 rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
          <input className="border px-3 py-2 rounded" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="bg-[#2E7D32] text-white px-4 py-2 rounded" type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
