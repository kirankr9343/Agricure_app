"use client";
import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

type Order = {
  id: string;
  orderId?: string;
  farmerId?: string;
  totalAmount?: number;
  paymentStatus?: string;
  orderStatus?: string;
  createdAt?: any;
};

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    const snap = await getDocs(collection(db, 'orders'));
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    setOrders(items);
  }

  async function updateStatus(id: string, status: string) {
    const ref = doc(db, 'orders', id);
    await updateDoc(ref, { orderStatus: status });
    fetchOrders();
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-medium mb-3">Orders</h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600">
            <th className="py-2">Order ID</th>
            <th>Farmer</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Order Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="py-2">{o.orderId || o.id}</td>
              <td>{o.farmerId}</td>
              <td>{o.totalAmount}</td>
              <td>{o.paymentStatus}</td>
              <td>
                <select defaultValue={o.orderStatus || 'pending'} onChange={(e)=>updateStatus(o.id, e.target.value)} className="border px-2 py-1 rounded">
                  <option value="pending">pending</option>
                  <option value="packed">packed</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </td>
              <td>{o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleString() : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
