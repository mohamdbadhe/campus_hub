import React, { useState, useEffect } from 'react';
import { useAuth } from '@/state/AuthContext';
import { BookOpen, Users, Clock, TrendingUp } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import moment from 'moment';

const statusOptions = [
  { value: 'quiet', label: 'Quiet', icon: '🤫', color: 'bg-emerald-500', description: 'Very few people, peaceful' },
  { value: 'moderate', label: 'Moderate', icon: '📚', color: 'bg-blue-500', description: 'Some activity, comfortable' },
  { value: 'busy', label: 'Busy', icon: '👥', color: 'bg-amber-500', description: 'Quite crowded' },
  { value: 'very_busy', label: 'Very Busy', icon: '🚫', color: 'bg-red-500', description: 'Packed, hard to find seats' },
];

const API_BASE = "http://127.0.0.1:8000";

export default function LibraryStatus() {
  const { user } = useAuth();
  const [library, setLibrary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds for live updates
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/library/status`);
      if (!response.ok) throw new Error("Failed to load library status");
      
      const data = await response.json();
      setLibrary(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load library status');
    }
    setLoading(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    if (user?.role !== 'manager' && user?.role !== 'admin') {
      toast.error('Only managers can update library status');
      return;
    }

    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      // Map status to occupancy percentage
      const occupancyMap = {
        'quiet': 20,
        'moderate': 50,
        'busy': 75,
        'very_busy': 95
      };
      
      const response = await fetch(`${API_BASE}/api/library/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: library?.name || "Main Library",
          current_occupancy: Math.round((occupancyMap[newStatus] / 100) * (library?.max_capacity || 100)),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update status");
      }

      toast.success('Library status updated');
      loadData();
    } catch (e) {
      toast.error(e.message || 'Failed to update status');
    }
    setUpdating(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  // Calculate status from occupancy percentage
  const occupancyPercent = library ? (library.current_occupancy / library.max_capacity) * 100 : 50;
  let currentStatusValue = 'moderate';
  if (occupancyPercent < 30) currentStatusValue = 'quiet';
  else if (occupancyPercent < 60) currentStatusValue = 'moderate';
  else if (occupancyPercent < 85) currentStatusValue = 'busy';
  else currentStatusValue = 'very_busy';
  
  const currentStatus = statusOptions.find(s => s.value === currentStatusValue) || statusOptions[1];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Library Status</h1>
        <p className="text-slate-500 mt-1">Check the current state of the college library</p>
      </div>

      {/* Current Status Card */}
      <Card className="p-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 text-5xl">
            {currentStatus.icon}
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {currentStatus.label}
            </h2>
            <p className="text-lg text-slate-600">
              {currentStatus.description}
            </p>
          </div>

          {library && (
            <div className="space-y-2">
              <div className="text-2xl font-bold text-slate-900">
                {library.current_occupancy} / {library.max_capacity} people
              </div>
              <div className="text-sm text-slate-500">
                {Math.round(occupancyPercent)}% capacity
              </div>
            </div>
          )}

          {library?.last_updated && (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
              <Clock className="w-4 h-4" />
              <span>Updated {moment(library.last_updated).fromNow()}</span>
            </div>
          )}

          <div className={`inline-block w-full max-w-md h-3 rounded-full bg-slate-100 overflow-hidden`}>
            <div 
              className={`h-full ${currentStatus.color} transition-all`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Update Status Section - Only for Managers */}
      {(user?.role === 'manager' || user?.role === 'admin') && (
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Update Library Status
          </h3>
          <p className="text-sm text-slate-600 mb-4">
            Update the current occupancy level
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {statusOptions.map(status => (
              <Button
                key={status.value}
                variant={currentStatusValue === status.value ? "default" : "outline"}
                className="h-auto flex-col py-4"
                onClick={() => handleUpdateStatus(status.value)}
                disabled={updating || currentStatusValue === status.value}
              >
                <span className="text-2xl mb-2">{status.icon}</span>
                <span className="text-sm font-medium">{status.label}</span>
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Info Card */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex gap-3">
          <Users className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">How It Works</h4>
            <p className="text-sm text-blue-700">
              Students like you report the current occupancy level when they visit the library. 
              This helps everyone find the best time to study!
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}