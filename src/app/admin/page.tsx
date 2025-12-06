"use client";
import React, { useEffect, useState } from 'react';
import KpiCard from '../../components/admin/KpiCard';
import FarmersTable from '../../components/admin/FarmersTable';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export default function AdminDashboard() {
  const [totalFarmers, setTotalFarmers] = useState<number | null>(null);
  const [activeVendors, setActiveVendors] = useState<number | null>(null);
  const [todayOrders, setTodayOrders] = useState<number | null>(null);
  const [todayScans, setTodayScans] = useState<number | null>(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  async function fetchCounts() {
    const farmersSnap = await getDocs(collection(db, 'farmers'));
    setTotalFarmers(farmersSnap.size);

    const vendorsSnap = await getDocs(query(collection(db, 'vendors'), where('status','==','approved')));
    setActiveVendors(vendorsSnap.size);

    // today orders
    const ordersSnap = await getDocs(collection(db, 'orders'));
    setTodayOrders(ordersSnap.size);

    const scansSnap = await getDocs(collection(db, 'diseaseScans'));
    setTodayScans(scansSnap.size);
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <div className="flex gap-4 mb-6">
        <KpiCard title="Total Farmers" value={totalFarmers ?? '—'} />
        <KpiCard title="Active Vendors" value={activeVendors ?? '—'} />
        <KpiCard title="Orders" value={todayOrders ?? '—'} />
        <KpiCard title="AI Scans" value={todayScans ?? '—'} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Recent Farmer Activities</h3>
          <FarmersTable />
        </div>
      </div>
    </div>
  );
}
