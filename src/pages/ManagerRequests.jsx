import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Check, X, Clock, Briefcase, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import moment from 'moment';

export default function ManagerRequests() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      const [userData, requestsData] = await Promise.all([
        isAuth ? base44.auth.me() : Promise.resolve(null),
        base44.entities.ManagerRequest.filter({ status: 'pending' }, '-created_date', 100)
      ]);
      setUser(userData);
      setRequests(requestsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setProcessing(true);
    try {
      // Update request status
      await base44.entities.ManagerRequest.update(selectedRequest.id, {
        status: 'approved',
        reviewed_by: user?.email,
        reviewed_at: new Date().toISOString()
      });

      // Update user's role
      const users = await base44.entities.User.filter({ email: selectedRequest.requester_email });
      if (users.length > 0) {
        await base44.entities.User.update(users[0].id, { user_role: 'manager' });
      }

      toast.success('Manager request approved');
      setSelectedRequest(null);
      setActionType(null);
      loadData();
    } catch (e) {
      toast.error('Failed to approve request');
    }
    setProcessing(false);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setProcessing(true);
    try {
      await base44.entities.ManagerRequest.update(selectedRequest.id, {
        status: 'rejected',
        rejection_reason: rejectionReason,
        reviewed_by: user?.email,
        reviewed_at: new Date().toISOString()
      });
      toast.success('Manager request rejected');
      setSelectedRequest(null);
      setActionType(null);
      setRejectionReason('');
      loadData();
    } catch (e) {
      toast.error('Failed to reject request');
    }
    setProcessing(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manager Requests</h1>
        <p className="text-slate-500 mt-1">
          {requests.length} pending manager request{requests.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        {requests.map(request => (
          <Card key={request.id} className="p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-900">
                      {request.requester_name || request.requester_email}
                    </h3>
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">
                      Pending
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    Requesting Manager role access
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>📧 {request.requester_email}</span>
                    <span>📅 {moment(request.created_date).format('MMM D, YYYY')}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 lg:flex-shrink-0">
                <Button
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setSelectedRequest(request);
                    setActionType('reject');
                  }}
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    setSelectedRequest(request);
                    setActionType('approve');
                  }}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {requests.length === 0 && (
          <Card className="p-12 text-center">
            <Check className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-medium text-slate-900 mb-1">All Caught Up!</h3>
            <p className="text-slate-500">No pending manager requests to review.</p>
          </Card>
        )}
      </div>

      {/* Approve Dialog */}
      <Dialog open={actionType === 'approve'} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Manager Request</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500">User</p>
                <p className="font-medium">{selectedRequest.requester_name || selectedRequest.requester_email}</p>
                <p className="text-sm text-slate-600">{selectedRequest.requester_email}</p>
              </div>
              <p className="text-sm text-slate-600">
                This will grant manager access to approve requests, manage faults, and view reports.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={processing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={actionType === 'reject'} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Manager Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Rejection Reason *</Label>
              <Textarea
                placeholder="Explain why this request is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setActionType(null);
              setRejectionReason('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
              variant="destructive"
            >
              {processing ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <X className="w-4 h-4 mr-2" />
              )}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}