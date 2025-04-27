// file: frontend/src/pages/Dashboard.jsx
import React from 'react';
import { AppSidebar } from '../components/app-sidebar.jsx';
import { ChartAreaInteractive } from '../components/chart-area-interactive.jsx';
import { DataTable } from '../components/data-table.jsx';
import { SectionCards } from '../components/section-cards.jsx';
import { SiteHeader } from '../components/site-header.jsx';
import { SidebarInset, SidebarProvider } from '../components/ui/sidebar.jsx';

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
