"use client";
import Link from 'next/link';
import React from 'react';

const nav = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/farmers', label: 'Farmers' },
  { href: '/admin/vendors', label: 'Vendors' },
  { href: '/admin/products', label: 'Products' },
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/ai-scans', label: 'AI Scans' },
  { href: '/admin/tickets', label: 'Tickets' },
  { href: '/admin/advisories', label: 'Advisories' },
  { href: '/admin/analytics', label: 'Analytics' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-4 border-b">
        <Link href="/admin">
          <h1 className="text-2xl font-semibold text-[#2E7D32]">AgriCure Admin</h1>
        </Link>
      </div>
      <nav className="p-4">
        {nav.map((n) => (
          <div key={n.href} className="mb-1">
            <Link className="block px-3 py-2 rounded hover:bg-gray-100" href={n.href}>
              {n.label}
            </Link>
          </div>
        ))}
      </nav>
    </aside>
  );
}
