"use client";
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

type AdminUser = {
  id: string;
  displayName?: string;
  email?: string;
  role?: string;
};

export default function RolesManager() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      const ref = doc(db, 'users', u.uid);
      const snap = await (await import('firebase/firestore')).getDoc(ref);
      setCurrentRole(snap.exists() ? (snap.data() as any).role : null);
    });
    fetchAdmins();
    return () => unsub();
  }, []);

  async function fetchAdmins() {
    const snap = await getDocs(collection(db, 'users'));
    const items: AdminUser[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    setAdmins(items.filter((i)=>i.email));
  }

  async function changeRole(userId: string, role: string) {
    if (currentRole !== 'superAdmin') {
      alert('Only superAdmin can change roles');
      return;
    }
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, { role });
    fetchAdmins();
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-medium mb-3">Roles & Permissions</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id} className="border-t">
              <td className="py-2">{a.displayName || '—'}</td>
              <td>{a.email}</td>
              <td>{a.role || '—'}</td>
              <td>
                <select defaultValue={a.role || ''} onChange={(e)=>changeRole(a.id, e.target.value)} className="border px-2 py-1 rounded mr-2">
                  <option value="">(none)</option>
                  <option value="superAdmin">superAdmin</option>
                  <option value="supportAdmin">supportAdmin</option>
                  <option value="vendorManager">vendorManager</option>
                  <option value="expertManager">expertManager</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
