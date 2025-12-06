"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

type Farmer = {
  id: string;
  name?: string;
  phone?: string;
  district?: string;
  mainCrop?: string;
  farmSize?: string;
  lastActive?: { seconds?: number } | string | null;
  status?: string;
};

export default function FarmersTable() {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [search, setSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  useEffect(() => {
    fetchFarmers();
  }, []);

  async function fetchFarmers() {
    const col = collection(db, 'farmers');
    const q = query(col, orderBy('name'), limit(100));
    const snap = await getDocs(q);
    const items: Farmer[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    setFarmers(items);
  }

  const filtered = farmers.filter((f) => {
    const matchesSearch = search.trim()
      ? ((f.name || '').toLowerCase().includes(search.toLowerCase()) || (f.phone || '').includes(search))
      : true;
    const matchesDistrict = districtFilter ? f.district === districtFilter : true;
    return matchesSearch && matchesDistrict;
  });

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center gap-3 mb-4">
        <input className="border px-2 py-1 rounded" placeholder="Search name or phone" value={search} onChange={(e)=>setSearch(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="District" value={districtFilter} onChange={(e)=>setDistrictFilter(e.target.value)} />
        <button className="px-3 py-1 bg-[#2E7D32] text-white rounded" onClick={fetchFarmers}>Refresh</button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-2">Name</th>
            <th>Phone</th>
            <th>District</th>
            <th>Main Crop</th>
            <th>Farm Size</th>
            <th>Last Active</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((f) => (
            <tr key={f.id} className="border-t">
              <td className="py-2">{f.name}</td>
              <td>{f.phone}</td>
              <td>{f.district}</td>
              <td>{f.mainCrop}</td>
              <td>{f.farmSize}</td>
              <td>{typeof f.lastActive === 'string' ? f.lastActive : f.lastActive?.seconds ? new Date((f.lastActive.seconds as number) * 1000).toLocaleString() : ''}</td>
              <td><span className={`px-2 py-1 rounded text-xs ${f.status==='active' ? 'bg-green-100 text-green-800' : f.status==='inactive' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{f.status||'unknown'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
