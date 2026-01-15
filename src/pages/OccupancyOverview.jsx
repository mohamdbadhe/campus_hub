import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2, BookOpen, Monitor, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import OccupancyBar from '../components/occupancy/OccupancyBar';
import OccupancyBadge from '../components/occupancy/OccupancyBadge';

const OVERLOAD_THRESHOLD = 80;

export default function OccupancyOverview() {
  const [libraries, setLibraries] = useState([]);
  const [labs, setLabs] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [librariesData, labsData, roomsData] = await Promise.all([
        base44.entities.Library.list('-occupancy_percentage', 100),
        base44.entities.Lab.list('-occupancy_percentage', 100),
        base44.entities.Room.list('-occupancy_percentage', 100)
      ]);
      setLibraries(librariesData);
      setLabs(labsData);
      setRooms(roomsData);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    setRefreshing(false);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Aggregate data
  const allSpaces = [
    ...libraries.map(l => ({ ...l, type: 'library' })),
    ...labs.map(l => ({ ...l, type: 'lab' })),
    ...rooms.map(r => ({ ...r, type: 'room' }))
  ];

  const overloadedSpaces = allSpaces.filter(s => (s.occupancy_percentage || 0) >= OVERLOAD_THRESHOLD);
  
  const avgOccupancy = allSpaces.length 
    ? Math.round(allSpaces.reduce((sum, s) => sum + (s.occupancy_percentage || 0), 0) / allSpaces.length)
    : 0;

  const chartData = [
    { name: 'Libraries', occupancy: libraries.length ? Math.round(libraries.reduce((sum, l) => sum + (l.occupancy_percentage || 0), 0) / libraries.length) : 0, count: libraries.length },
    { name: 'Labs', occupancy: labs.length ? Math.round(labs.reduce((sum, l) => sum + (l.occupancy_percentage || 0), 0) / labs.length) : 0, count: labs.length },
    { name: 'Rooms', occupancy: rooms.length ? Math.round(rooms.reduce((sum, r) => sum + (r.occupancy_percentage || 0), 0) / rooms.length) : 0, count: rooms.length },
  ];

  const getBarColor = (occupancy) => {
    if (occupancy <= 40) return '#10b981';
    if (occupancy <= 70) return '#f59e0b';
    if (occupancy <= 90) return '#f97316';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <Skeleton key={i} className="h-24 rounded-xl" />
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
          <h1 className="text-2xl font-bold text-slate-900">Campus Occupancy Overview</h1>
          <p className="text-slate-500 mt-1">Real-time view of all campus spaces</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{allSpaces.length}</p>
              <p className="text-sm text-slate-500">Total Spaces</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold text-blue-600">{avgOccupancy}%</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">Average</p>
              <p className="text-sm text-slate-500">Occupancy</p>
            </div>
          </div>
        </Card>
        <Card className={`p-5 ${overloadedSpaces.length > 0 ? 'border-red-200 bg-red-50' : ''}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${overloadedSpaces.length > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
              <AlertTriangle className={`w-5 h-5 ${overloadedSpaces.length > 0 ? 'text-red-600' : 'text-slate-600'}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{overloadedSpaces.length}</p>
              <p className="text-sm text-slate-500">Overloaded (&gt;80%)</p>
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Monitor className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{labs.filter(l => l.status === 'available').length}</p>
              <p className="text-sm text-slate-500">Labs Available</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Occupancy Chart */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Average Occupancy by Type</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Occupancy']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="occupancy" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.occupancy)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overloaded</TabsTrigger>
          <TabsTrigger value="libraries">Libraries ({libraries.length})</TabsTrigger>
          <TabsTrigger value="labs">Labs ({labs.length})</TabsTrigger>
          <TabsTrigger value="rooms">Rooms ({rooms.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          {overloadedSpaces.length > 0 ? (
            <div className="space-y-3">
              {overloadedSpaces.map(space => (
                <Card key={space.id} className="p-4 border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        space.type === 'library' ? 'bg-blue-50' : 
                        space.type === 'lab' ? 'bg-emerald-50' : 'bg-purple-50'
                      }`}>
                        {space.type === 'library' ? <BookOpen className="w-5 h-5 text-blue-600" /> :
                         space.type === 'lab' ? <Monitor className="w-5 h-5 text-emerald-600" /> :
                         <Building2 className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900">{space.name}</h4>
                        <p className="text-sm text-slate-500">{space.location || space.building}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <OccupancyBadge level={space.occupancy_level || 'high'} percentage={space.occupancy_percentage} />
                      <p className="text-sm text-slate-500 mt-1">{space.current_occupancy || 0} / {space.capacity}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">No Overloaded Spaces</h3>
              <p className="text-slate-500">All campus spaces are operating within normal capacity.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="libraries" className="mt-4">
          <div className="space-y-3">
            {libraries.map(library => (
              <Card key={library.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{library.name}</h4>
                      <p className="text-sm text-slate-500">{library.location}</p>
                    </div>
                  </div>
                  <OccupancyBadge level={library.occupancy_level} />
                </div>
                <OccupancyBar percentage={library.occupancy_percentage || 0} />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="labs" className="mt-4">
          <div className="space-y-3">
            {labs.map(lab => (
              <Card key={lab.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{lab.name}</h4>
                      <p className="text-sm text-slate-500">{lab.building}, Room {lab.room_number}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    lab.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                    lab.status === 'occupied' ? 'bg-slate-100 text-slate-700' :
                    lab.status === 'maintenance' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {lab.status}
                  </Badge>
                </div>
                <OccupancyBar percentage={lab.occupancy_percentage || 0} />
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rooms" className="mt-4">
          <div className="space-y-3">
            {rooms.map(room => (
              <Card key={room.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900">{room.name}</h4>
                      <p className="text-sm text-slate-500">{room.building}, Room {room.room_number}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={
                    room.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                    room.status === 'occupied' ? 'bg-slate-100 text-slate-700' :
                    room.status === 'maintenance' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }>
                    {room.status}
                  </Badge>
                </div>
                <OccupancyBar percentage={room.occupancy_percentage || 0} />
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Check({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}