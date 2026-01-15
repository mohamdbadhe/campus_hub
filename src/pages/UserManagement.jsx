import React, { useState, useEffect } from 'react';
import { useAuth } from '@/state/AuthContext';
import { Users, Search, Shield, Edit2, Loader2, UserPlus, Check, X, Clock } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import moment from 'moment';

const roleConfig = {
  student: { label: 'Student', className: 'bg-blue-100 text-blue-700' },
  lecturer: { label: 'Lecturer', className: 'bg-purple-100 text-purple-700' },
  manager: { label: 'Manager', className: 'bg-amber-100 text-amber-700' },
  admin: { label: 'Admin', className: 'bg-red-100 text-red-700' },
};

const rolePermissions = {
  student: ['View library status', 'View available labs', 'Report faults'],
  lecturer: ['All student permissions', 'Request room bookings', 'View own requests'],
  manager: ['All lecturer permissions', 'Approve room requests', 'Manage faults', 'View reports', 'View all occupancy'],
  admin: ['All manager permissions', 'Manage user roles', 'System administration'],
};

const API_BASE = "http://127.0.0.1:8000";

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteData, setInviteData] = useState({ email: '', role: 'user' });
  const [inviting, setInviting] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    loadData();
    // Refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const token = localStorage.getItem("token");
      
      // Load role requests
      const requestsRes = await fetch(`${API_BASE}/api/role-requests/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setRoleRequests(requestsData.requests || []);
      }

      // For now, we'll get users from Django admin or create a simple endpoint
      // Since we don't have a users list endpoint, we'll focus on role requests
    } catch (e) {
      console.error(e);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/role-requests/${requestId}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to approve request");
      }

      toast.success('Role request approved');
      loadData();
    } catch (e) {
      toast.error(e.message || 'Failed to approve request');
    }
    setUpdating(false);
  };

  const handleRejectRequest = async (requestId) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/role-requests/${requestId}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to reject request");
      }

      toast.success('Role request rejected');
      loadData();
    } catch (e) {
      toast.error(e.message || 'Failed to reject request');
    }
    setUpdating(false);
  };

  const pendingRequests = roleRequests.filter(r => r.status === 'pending');
  const approvedRequests = roleRequests.filter(r => r.status === 'approved');
  const rejectedRequests = roleRequests.filter(r => r.status === 'rejected');

  const filteredRequests = roleRequests.filter(request => {
    const matchesSearch = !searchQuery || 
      request.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.user_username?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'pending') return matchesSearch && request.status === 'pending';
    if (activeTab === 'approved') return matchesSearch && request.status === 'approved';
    if (activeTab === 'rejected') return matchesSearch && request.status === 'rejected';
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Manage role requests and user permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-amber-600">{pendingRequests.length}</p>
              <p className="text-sm text-slate-500">Pending Requests</p>
            </div>
            <Clock className="w-8 h-8 text-amber-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-emerald-600">{approvedRequests.length}</p>
              <p className="text-sm text-slate-500">Approved</p>
            </div>
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-red-600">{rejectedRequests.length}</p>
              <p className="text-sm text-slate-500">Rejected</p>
            </div>
            <X className="w-8 h-8 text-red-400" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === 'pending' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('pending')}
          className="rounded-b-none"
        >
          Pending ({pendingRequests.length})
        </Button>
        <Button
          variant={activeTab === 'approved' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('approved')}
          className="rounded-b-none"
        >
          Approved ({approvedRequests.length})
        </Button>
        <Button
          variant={activeTab === 'rejected' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('rejected')}
          className="rounded-b-none"
        >
          Rejected ({rejectedRequests.length})
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by email or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Role Requests Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Requested Role</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.map(request => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-600">
                        {request.user_username?.[0]?.toUpperCase() || request.user_email?.[0]?.toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{request.user_username || '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-500">{request.user_email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleConfig[request.requested_role]?.className}>
                    {roleConfig[request.requested_role]?.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500">{request.reason || '-'}</TableCell>
                <TableCell className="text-slate-500">
                  {request.created_at ? moment(request.created_at).format('MMM D, YYYY') : '-'}
                </TableCell>
                <TableCell>
                  {request.status === 'pending' && (
                    <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
                  )}
                  {request.status === 'approved' && (
                    <Badge className="bg-emerald-100 text-emerald-700">Approved</Badge>
                  )}
                  {request.status === 'rejected' && (
                    <Badge className="bg-red-100 text-red-700">Rejected</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleApproveRequest(request.id)}
                        disabled={updating}
                        className="h-8"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRejectRequest(request.id)}
                        disabled={updating}
                        className="h-8"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                  {request.status !== 'pending' && request.reviewed_by && (
                    <span className="text-xs text-slate-500">
                      By {request.reviewed_by}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredRequests.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  No role requests found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

    </div>
  );
}