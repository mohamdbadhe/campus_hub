import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/state/AuthContext';
import { AlertTriangle, Upload, CheckCircle, Loader2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const categories = [
  { value: 'projector', label: 'Projector / Display', icon: '🖥️' },
  { value: 'ac', label: 'Air Conditioning', icon: '❄️' },
  { value: 'lighting', label: 'Lighting', icon: '💡' },
  { value: 'furniture', label: 'Furniture', icon: '🪑' },
  { value: 'computer', label: 'Computer / Hardware', icon: '💻' },
  { value: 'network', label: 'Network / WiFi', icon: '📶' },
  { value: 'plumbing', label: 'Plumbing', icon: '🚿' },
  { value: 'electrical', label: 'Electrical', icon: '⚡' },
  { value: 'other', label: 'Other', icon: '🔧' },
];

const locationTypes = [
  { value: 'classroom', label: 'Classroom' },
  { value: 'lab', label: 'Computer Lab' },
  { value: 'library', label: 'Library' },
  { value: 'common_area', label: 'Common Area' },
];

const severityLevels = [
  { value: 'low', label: 'Low - Minor inconvenience', color: 'text-slate-600' },
  { value: 'medium', label: 'Medium - Affects usability', color: 'text-amber-600' },
  { value: 'high', label: 'High - Major disruption', color: 'text-orange-600' },
  { value: 'critical', label: 'Critical - Safety concern', color: 'text-red-600' },
];

const API_BASE = "http://127.0.0.1:8000";

export default function ReportFault() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    location_type: '',
    building: '',
    room_number: '',
    category: '',
    severity: 'medium',
    title: '',
    description: '',
    image_url: ''
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // For now, we'll use a placeholder. In production, you'd upload to a file storage service
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result }));
        toast.success('Image loaded');
      };
      reader.readAsDataURL(file);
    } catch (e) {
      toast.error('Failed to load image');
    }
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location_type || !formData.building || !formData.room_number || !formData.category || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE}/api/faults/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit report");
      }

      toast.success('Report submitted successfully');
      setSubmitted(true);
    } catch (e) {
      toast.error(e.message || 'Failed to submit report');
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto">
        <Card className="p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Report Submitted!</h2>
          <p className="text-slate-500 mb-6">
            Thank you for reporting this issue. Our maintenance team will review it shortly.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => {
              setSubmitted(false);
              setFormData({
                location_type: '',
                building: '',
                room_number: '',
                category: '',
                severity: 'medium',
                title: '',
                description: '',
                image_url: ''
              });
            }}>
              Report Another
            </Button>
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Report a Fault</h1>
        <p className="text-slate-500 mt-1">Help us maintain campus facilities by reporting issues</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Location Type *</Label>
                <Select 
                  value={formData.location_type} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, location_type: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Building *</Label>
                <Input
                  placeholder="e.g., Science Building"
                  value={formData.building}
                  onChange={(e) => setFormData(prev => ({ ...prev, building: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Room Number *</Label>
                <Input
                  placeholder="e.g., 301"
                  value={formData.room_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Issue Category *</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    formData.category === cat.value
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{cat.icon}</span>
                  <span className="text-xs text-slate-600">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Provide more details about the issue..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Severity */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Severity</h3>
            <div className="space-y-2">
              {severityLevels.map(level => (
                <label
                  key={level.value}
                  className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.severity === level.value
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={level.value}
                    checked={formData.severity === level.value}
                    onChange={() => setFormData(prev => ({ ...prev, severity: level.value }))}
                    className="sr-only"
                  />
                  <span className={`font-medium ${level.color}`}>{level.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900">Photo (Optional)</h3>
            {formData.image_url ? (
              <div className="relative">
                <img 
                  src={formData.image_url} 
                  alt="Fault" 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-slate-400 transition-colors">
                {uploading ? (
                  <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-500">Click to upload an image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          {/* Submit */}
          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}