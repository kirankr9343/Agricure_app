"use client";
import React from 'react';
import FarmersTable from '../../../components/admin/FarmersTable';

export default function FarmersPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Farmers</h2>
      <FarmersTable />
    </div>
  );
}
