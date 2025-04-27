/* File: src/components/app-sidebar.jsx */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '../components/ui/sidebar.jsx';
import { IconDashboard, IconUsers, IconUpload, IconSettings, IconLogout } from '@tabler/icons-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

export function AppSidebar(props) {
  const { logout } = useContext(AuthContext);
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/dashboard" className="flex items-center space-x-2 p-2">
                <IconDashboard size={20} />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/customers" className="flex items-center space-x-2 p-2">
                <IconUsers size={20} />
                <span>Customer Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/upload" className="flex items-center space-x-2 p-2">
                <IconUpload size={20} />
                <span>Upload CSV</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings" className="flex items-center space-x-2 p-2">
                <IconSettings size={20} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} className="flex items-center space-x-2 p-2 cursor-pointer">
              <IconLogout size={20} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
