import React from 'react';
import Sidebar from '../../components/admin/Sidebar';
import TopNav from '../../components/admin/TopNav';
import AdminAuth from '../../components/admin/AdminAuth';
import PageAnimator from '../../components/admin/PageAnimator';

export const metadata = {
  title: 'AgriCure Admin',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuth>
      <div className="min-h-screen bg-[#F5F7FA] text-gray-800">
        <div className="flex">
          <Sidebar />
          <div className="flex-1">
            <TopNav />
            <main className="p-6">
              <PageAnimator>
                {children}
              </PageAnimator>
            </main>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}
