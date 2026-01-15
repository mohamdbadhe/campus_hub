
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from "../utils";
import { useAuth } from '@/state/AuthContext';
import { 
  Building2, 
  BookOpen, 
  Monitor, 
  AlertTriangle, 
  Users, 
  BarChart3, 
  Menu, 
  X, 
  LogOut,
  Home,
  FileText,
  Settings,
  ChevronDown
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function Layout({ children, currentPageName }) {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userRole = user?.role || 'student';

  // Check if user needs to select a role (new user)
  useEffect(() => {
    if (!loading && user && !user.role && currentPageName !== 'RoleSelection') {
      navigate('/role-selection');
    }
  }, [user, loading, currentPageName, navigate]);

  const navigation = [
    { name: 'Dashboard', page: 'Dashboard', icon: Home, roles: ['student', 'lecturer', 'manager', 'admin'] },
    { name: 'Library Status', page: 'LibraryStatus', icon: BookOpen, roles: ['student', 'lecturer', 'manager', 'admin'] },
    { name: 'Find Labs', page: 'FindLabs', icon: Monitor, roles: ['student', 'lecturer', 'manager', 'admin'] },
    { name: 'Room Requests', page: 'RoomRequests', icon: Building2, roles: ['student', 'lecturer', 'manager', 'admin'] },
    { name: 'Report Fault', page: 'ReportFault', icon: AlertTriangle, roles: ['student', 'lecturer', 'manager', 'admin'] },
    { name: 'Fault Management', page: 'FaultManagement', icon: Settings, roles: ['manager', 'admin'] },
    { name: 'Occupancy Overview', page: 'OccupancyOverview', icon: BarChart3, roles: ['manager', 'admin'] },
    { name: 'Request Approvals', page: 'RequestApprovals', icon: FileText, roles: ['manager', 'admin'] },
    { name: 'Reports', page: 'Reports', icon: BarChart3, roles: ['manager', 'admin'] },
    { name: 'Manager Requests', page: 'ManagerRequests', icon: Users, roles: ['admin'] },
    { name: 'User Management', page: 'UserManagement', icon: Users, roles: ['admin'] },
  ];

  const filteredNav = navigation.filter(item => item.roles.includes(userRole));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary: 222.2 47.4% 11.2%;
          --primary-foreground: 210 40% 98%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-slate-900 hidden sm:block">CampusHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {filteredNav.slice(0, 6).map((item) => {
                const routeMap = {
                  'Dashboard': '/dashboard',
                  'LibraryStatus': '/library-status',
                  'FindLabs': '/find-labs',
                  'RoomRequests': '/room-requests',
                  'ReportFault': '/report-fault',
                  'FaultManagement': '/fault-management',
                  'OccupancyOverview': '/occupancy-overview',
                  'RequestApprovals': '/request-approvals',
                  'Reports': '/reports',
                  'ManagerRequests': '/manager-requests',
                  'UserManagement': '/user-management',
                };
                return (
                  <Link
                    key={item.page}
                    to={routeMap[item.page] || createPageUrl(item.page)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      currentPageName === item.page
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              {filteredNav.length > 6 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-slate-600">
                      More <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {filteredNav.slice(6).map((item) => {
                      const routeMap = {
                        'Dashboard': '/dashboard',
                        'LibraryStatus': '/library-status',
                        'FindLabs': '/find-labs',
                        'RoomRequests': '/room-requests',
                        'ReportFault': '/report-fault',
                        'FaultManagement': '/fault-management',
                        'OccupancyOverview': '/occupancy-overview',
                        'RequestApprovals': '/request-approvals',
                        'Reports': '/reports',
                        'ManagerRequests': '/manager-requests',
                        'UserManagement': '/user-management',
                      };
                      return (
                        <DropdownMenuItem key={item.page} asChild>
                          <Link to={routeMap[item.page] || createPageUrl(item.page)} className="flex items-center gap-2">
                            <item.icon className="w-4 h-4" />
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-700">
                          {user.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="hidden sm:block text-sm">{user.email || user.username}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2 border-b">
                      <p className="text-sm font-medium">{user.username || user.email}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 rounded text-xs font-medium capitalize">
                        {userRole}
                      </span>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => navigate('/login')}>
                  Sign In
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <nav className="px-4 py-3 space-y-1">
              {filteredNav.map((item) => {
                const routeMap = {
                  'Dashboard': '/dashboard',
                  'LibraryStatus': '/library-status',
                  'FindLabs': '/find-labs',
                  'RoomRequests': '/room-requests',
                  'ReportFault': '/report-fault',
                  'FaultManagement': '/fault-management',
                  'OccupancyOverview': '/occupancy-overview',
                  'RequestApprovals': '/request-approvals',
                  'Reports': '/reports',
                  'ManagerRequests': '/manager-requests',
                  'UserManagement': '/user-management',
                };
                return (
                  <Link
                    key={item.page}
                    to={routeMap[item.page] || createPageUrl(item.page)}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      currentPageName === item.page
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
