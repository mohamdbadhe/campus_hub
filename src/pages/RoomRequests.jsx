import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Building2, Filter, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import RequestCard from '../components/cards/RequestCard';

const roomTypes = [
  { value: 'classroom', label: 'Classroom' },
  { value: 'lecture_hall', label: 'Lecture Hall' },
  { value: 'meeting_room', label: 'Meeting Room' },
  { value: 'seminar_room', label: 'Seminar Room' },
  { value: 'lab', label: 'Computer Lab' },
];

const equipmentOptions = [
  'Projector',
  'Whiteboard',
  'Smart Board',
  'Microphone',
  'Video Conferencing',
  'Computer Stations',
  'Air Conditioning',
];

export default function RoomRequests() {
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  const [formData, setFormData] = useState({
    room_type: '',
    date: '',
    start_time: '',
    end_time: '',
    purpose: '',
    expected_attendees: '',
    equipment_needed: [],
    booking_type: 'partial_booking',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      const [userData, requestsData] = await Promise.all([
        isAuth ? base44.auth.me() : Promise.resolve(null),
        base44.entities.RoomRequest.list('-created_date', 100)
      ]);
      setUser(userData);
      // Filter to show only user's requests (unless manager/admin)
      const userRole = userData?.user_role || 'student';
      if (['manager', 'admin'].includes(userRole)) {
        setRequests(requestsData);
      } else {
        setRequests(requestsData.filter(r => r.requester_email === userData?.email));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.room_type || !formData.date || !formData.start_time || !formData.end_time || !formData.purpose) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const userRole = user?.user_role || 'student';
      const bookingType = ['lecturer', 'manager', 'admin'].includes(userRole) ? 
        formData.booking_type : 'partial_booking';
      
      await base44.entities.RoomRequest.create({
        ...formData,
        expected_attendees: parseInt(formData.expected_attendees) || 1,
        requester_email: user?.email,
        requester_name: user?.full_name,
        requester_role: userRole,
        booking_type: bookingType,
        status: 'pending'
      });
      toast.success('Request submitted successfully');
      setShowDialog(false);
      setFormData({
        room_type: '',
        date: '',
        start_time: '',
        end_time: '',
        purpose: '',
        expected_attendees: '',
        equipment_needed: [],
        booking_type: 'partial_booking',
      });
      loadData();
    } catch (e) {
      toast.error('Failed to submit request');
    }
    setSubmitting(false);
  };

  const toggleEquipment = (item) => {
    setFormData(prev => ({
      ...prev,
      equipment_needed: prev.equipment_needed.includes(item)
        ? prev.equipment_needed.filter(e => e !== item)
        : [...prev.equipment_needed, item]
    }));
  };

  const filteredRequests = requests.filter(req => {
    if (activeTab === 'all') return true;
    return req.status === activeTab;
  });

  const counts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Room Requests</h1>
          <p className="text-slate-500 mt-1">Request and manage room/lab bookings</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({counts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({counts.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map(request => (
              <RequestCard key={request.id} request={request} />
            ))}
            {filteredRequests.length === 0 && (
              <Card className="p-12 col-span-full text-center">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-medium text-slate-900 mb-1">No Requests Found</h3>
                <p className="text-slate-500 mb-4">
                  {activeTab === 'all' 
                    ? "You haven't made any room requests yet."
                    : `No ${activeTab} requests.`
                  }
                </p>
                <Button onClick={() => setShowDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Request
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Request Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Room Request</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label>Room Type *</Label>
              <Select 
                value={formData.room_type} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, room_type: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  {roomTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Input
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time *</Label>
                <Input
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_time: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Purpose *</Label>
              <Textarea
                placeholder="Describe the purpose of your booking..."
                value={formData.purpose}
                onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                rows={3}
              />
            </div>

            {(['lecturer', 'manager', 'admin'].includes(user?.user_role)) && (
              <div className="space-y-2">
                <Label>Booking Type</Label>
                <Select 
                  value={formData.booking_type} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, booking_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_booking">
                      Full Booking (Class/Entire Room)
                    </SelectItem>
                    <SelectItem value="partial_booking">
                      Partial Booking (Individual Study)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>
                {formData.booking_type === 'full_booking' ? 'Expected Attendees' : 'Number of Seats Needed'}
              </Label>
              <Input
                type="number"
                placeholder={formData.booking_type === 'full_booking' ? 'Total class size' : 'How many seats?'}
                value={formData.expected_attendees}
                onChange={(e) => setFormData(prev => ({ ...prev, expected_attendees: e.target.value }))}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Equipment Needed</Label>
              <div className="flex flex-wrap gap-2">
                {equipmentOptions.map(item => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleEquipment(item)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      formData.equipment_needed.includes(item)
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}