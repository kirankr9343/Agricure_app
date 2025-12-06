"use client";
import React from 'react';
import OrdersTable from '../../../components/admin/OrdersTable';

export default function OrdersPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Orders & Rentals</h2>
      <OrdersTable />
    </div>
  );
}
