"use client";
import React from 'react';

export default function TopNav() {
  return (
    <header className="flex items-center justify-between bg-white p-4 border-b">
      <div className="flex items-center gap-4">
        <div className="text-xl font-medium text-[#2E7D32]">/admin</div>
        <div className="hidden md:block">
          <input
            className="border rounded px-3 py-1 w-72"
            placeholder="Search farmers, orders, scans..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="px-3 py-1 bg-[#FBC02D] rounded">Notifications</button>
        <div className="w-10 h-10 bg-gray-200 rounded-full" />
      </div>
    </header>
  );
}
