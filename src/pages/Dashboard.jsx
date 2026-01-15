import React, { useState, useEffect } from 'react';
import { useAuth } from '@/state/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Monitor, 
  AlertTriangle, 
  Building2, 
  ArrowRight,
  TrendingUp,
  Users
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from '../components/dashboard/StatsCard';
import LibraryCard from '../components/cards/LibraryCard';
import LabCard from '../components/cards/LabCard';
import FaultCard from '../components/cards/FaultCard';
import moment from 'moment';

const API_BASE = "http://127.0.0.1:8000";

export default function Dashboard() {
  const { user } = useAuth();
  const [library, setLibrary] = useState(null);
  const [labs, setLabs] = useState([]);
  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds for live updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [libraryRes, labsRes, faultsRes] = await Promise.all([
        fetch(`${API_BASE}/api/library/status`),
        fetch(`${API_BASE}/api/labs/list`),
        fetch(`${API_BASE}/api/faults/list`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (libraryRes.ok) {
        const libData = await libraryRes.json();
        setLibrary(libData);
      }

      if (labsRes.ok) {
        const labsData = await labsRes.json();
        setLabs(labsData.labs || []);
      }

      if (faultsRes.ok) {
        const faultsData = await faultsRes.json();
        // Show only open faults, limit to 5
        const openFaults = (faultsData.faults || []).filter(f => f.status === 'open').slice(0, 5);
        setFaults(openFaults);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const userRole = user?.role || 'student';
  const isManager = ['manager', 'admin'].includes(userRole);

  const getLabStatus = (lab) => {
    if (!lab.is_available) return 'unavailable';
    if (lab.current_occupancy === 0) return 'available';
    if (lab.current_occupancy >= lab.max_capacity) return 'occupied';
    return 'partial';
  };

  const labsWithStatus = labs.map(lab => ({
    ...lab,
    status: getLabStatus(lab)
  }));

  const availableLabs = labsWithStatus.filter(l => l.status === 'available').slice(0, 6);
  
  // Map library status to percentage for display
  const statusToPercentage = {
    'quiet': 25,
    'moderate': 50,
    'busy': 75,
    'very_busy': 100
  };
  
  const libraryOccupancy = library 
    ? Math.round((library.current_occupancy / library.max_capacity) * 100)
    : 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.username?.split('@')[0] || 'User'}
        </h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening on campus today
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Library Occupancy"
          value={`${libraryOccupancy}%`}
          subtitle={library ? `${library.current_occupancy}/${library.max_capacity} people` : 'Loading...'}
          icon={BookOpen}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Available Labs"
          value={availableLabs.length}
          subtitle={`of ${labs.length} total`}
          icon={Monitor}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <StatsCard
          title="Open Faults"
          value={faults.length}
          subtitle="need attention"
          icon={AlertTriangle}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        {isManager && (
          <StatsCard
            title="Total Spaces"
            value={1 + labs.length}
            subtitle="monitored"
            icon={Building2}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/library-status">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Library Status</p>
                <p className="text-xs text-slate-500">Check occupancy</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/find-labs">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                <Monitor className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Find Labs</p>
                <p className="text-xs text-slate-500">Available now</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link to="/report-fault">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Report Fault</p>
                <p className="text-xs text-slate-500">Report issue</p>
              </div>
            </div>
          </Card>
        </Link>

        {['lecturer', 'manager', 'admin'].includes(userRole) && (
          <Link to="/room-requests">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 text-sm">Request Room</p>
                  <p className="text-xs text-slate-500">Book space</p>
                </div>
              </div>
            </Card>
          </Link>
        )}
      </div>

      {/* Library Status */}
      {library && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Library Status</h2>
            <Link to="/library-status">
              <Button variant="ghost" size="sm" className="text-slate-600">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <LibraryCard library={library} />
          </div>
        </div>
      )}

      {/* Available Labs */}
      {availableLabs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Available Labs</h2>
            <Link to="/find-labs">
              <Button variant="ghost" size="sm" className="text-slate-600">
                View all <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLabs.slice(0, 6).map(lab => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Faults (for managers) */}
      {isManager && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Fault Reports</h2>
              <p className="text-sm text-slate-500 mt-1">
                View and manage reports from students and lecturers
              </p>
            </div>
            <Link to="/reports">
              <Button variant="default" size="sm">
                View All Reports <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          {faults.length > 0 ? (
            <div className="space-y-3">
              {faults.slice(0, 3).map(fault => (
                <FaultCard key={fault.id} fault={fault} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="font-medium text-slate-900 mb-1">No Open Faults</h3>
              <p className="text-slate-500 mb-4">There are no open fault reports at the moment.</p>
              <Link to="/reports">
                <Button variant="outline">Go to Reports</Button>
              </Link>
            </Card>
          )}
        </div>
      )}

      {/* My Reports (for students and lecturers) */}
      {!isManager && faults.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">My Fault Reports</h2>
              <p className="text-sm text-slate-500 mt-1">
                Track the status of your submitted reports
              </p>
            </div>
            <Link to="/reports">
              <Button variant="ghost" size="sm" className="text-slate-600">
                View All <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {faults.slice(0, 3).map(fault => (
              <FaultCard key={fault.id} fault={fault} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}