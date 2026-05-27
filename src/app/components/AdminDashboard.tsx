import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ArrowLeft, MapPin, Filter, BarChart3, Users, TrendingUp, Clock } from 'lucide-react';
import { Issue } from '../App';

interface AdminDashboardProps {
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  onBack: () => void;
}

export function AdminDashboard({ issues, setIssues, onBack }: AdminDashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const updateIssueStatus = (issueId: string, newStatus: Issue['status']) => {
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === issueId ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'acknowledged': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (category: string) => {
    // Assign priority based on category for demo
    switch (category.toLowerCase()) {
      case 'water': return 'bg-red-100 text-red-800 border-red-200';
      case 'pothole': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'garbage': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (selectedCategory !== 'all' && issue.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && issue.status !== selectedStatus) return false;
    return true;
  });

  const stats = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'submitted').length,
    inProgress: issues.filter(i => i.status === 'in-progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    avgResolutionTime: '4.2 days',
    activeUsers: '1,247'
  };

  const categoryStats = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Admin Dashboard</h1>
        </div>
        
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          Admin Panel
        </Badge>
      </div>

      <div className="p-4 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-600">Total Issues</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg mx-auto mb-2">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-800">{stats.pending}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-800">{stats.resolved}</p>
              <p className="text-sm text-gray-600">Resolved</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-md">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-semibold text-gray-800">{stats.activeUsers}</p>
              <p className="text-sm text-gray-600">Active Users</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Overview */}
        <Card className="bg-white border-0 shadow-md">
          <CardHeader>
            <CardTitle>Quick Analytics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
                <p className="text-sm text-gray-600">Avg Resolution Time</p>
                <p className="text-xl font-semibold text-gray-800">{stats.avgResolutionTime}</p>
                <p className="text-xs text-green-600">↓ 15% from last month</p>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <p className="text-sm text-gray-600">Citizen Engagement</p>
                <p className="text-xl font-semibold text-gray-800">86%</p>
                <p className="text-xs text-blue-600">↑ 8% from last month</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">Issue Categories</h4>
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{category}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        <Card className="bg-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Issue Map</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-200/30 rounded-xl"></div>
              <div className="relative z-10 text-center space-y-2">
                <span className="text-4xl">🗺️</span>
                <p className="text-gray-700 font-medium">Interactive Issue Map</p>
                <p className="text-sm text-gray-600">Showing {issues.length} reported issues</p>
              </div>
              
              {/* Mock map pins with categories */}
              <div className="absolute top-6 left-8 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xs text-white">💧</span>
              </div>
              <div className="absolute bottom-8 right-12 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xs text-white">🚧</span>
              </div>
              <div className="absolute top-12 right-6 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xs text-white">✓</span>
              </div>
              <div className="absolute bottom-16 left-16 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-xs text-white">🗑️</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-white border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filter Issues</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Garbage">Garbage</SelectItem>
                    <SelectItem value="Pothole">Pothole</SelectItem>
                    <SelectItem value="Streetlight">Streetlight</SelectItem>
                    <SelectItem value="Water">Water</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Priority</label>
                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Issues Table */}
        <Card className="bg-white border-0 shadow-md">
          <CardHeader>
            <CardTitle>Issue Management ({filteredIssues.length} issues)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredIssues.map((issue) => (
              <div key={issue.id} className="p-4 border border-gray-200 rounded-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{issue.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="text-xs text-gray-500">📍 {issue.location}</span>
                      <span className="text-xs text-gray-500">📅 {issue.dateSubmitted}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2 ml-4">
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status}
                    </Badge>
                    <Badge className={getPriorityColor(issue.category)}>
                      {issue.category}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => updateIssueStatus(issue.id, 'acknowledged')}
                      disabled={issue.status !== 'submitted'}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Acknowledge
                    </Button>
                    <Button
                      onClick={() => updateIssueStatus(issue.id, 'in-progress')}
                      disabled={issue.status === 'resolved' || issue.status === 'submitted'}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Start Work
                    </Button>
                    <Button
                      onClick={() => updateIssueStatus(issue.id, 'resolved')}
                      disabled={issue.status === 'resolved' || issue.status === 'submitted'}
                      size="sm"
                      className="text-xs bg-green-600 hover:bg-green-700 text-white"
                    >
                      Resolve
                    </Button>
                  </div>
                  
                  <span className="text-xs text-gray-500">ID: {issue.id}</span>
                </div>
              </div>
            ))}

            {filteredIssues.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No issues match the current filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Insights */}
        <Card className="bg-white border-0 shadow-md">
          <CardHeader>
            <CardTitle>Community Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-2">Most Active Areas</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Downtown</span>
                    <span className="text-sm font-medium">24 reports</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Park Avenue</span>
                    <span className="text-sm font-medium">18 reports</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Main Street</span>
                    <span className="text-sm font-medium">15 reports</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-medium text-gray-800 mb-2">Top Contributors</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Rajesh Kumar</span>
                    <span className="text-sm font-medium">23 reports</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Priya Sharma</span>
                    <span className="text-sm font-medium">19 reports</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Amit Singh</span>
                    <span className="text-sm font-medium">16 reports</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}