/* File: src/pages/Settings.jsx */
import React from 'react';
import { AppSidebar } from '../components/app-sidebar.jsx';
import { SidebarInset, SidebarProvider } from '../components/ui/sidebar.jsx';
import { SiteHeader } from '../components/site-header.jsx';

export default function Settings() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <h1 className="text-2xl font-semibold">Settings Page Coming Soon!</h1>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
