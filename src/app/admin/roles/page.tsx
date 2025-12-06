"use client";
import React from 'react';
import RolesManager from '../../../components/admin/RolesManager';

export default function RolesPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Roles & Permissions</h2>
      <RolesManager />
    </div>
  );
}
