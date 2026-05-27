import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { ArrowLeft, CheckCircle, Clock, Eye, FileText, Phone, User } from 'lucide-react';
import { Issue } from '../App';
import { useLanguage } from '../contexts/LanguageContext';

interface IssueTrackingScreenProps {
  issues: Issue[];
  onBack: () => void;
}

export function IssueTrackingScreen({ issues, onBack }: IssueTrackingScreenProps) {
  const { t } = useLanguage();
  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'submitted': return 25;
      case 'acknowledged': return 50;
      case 'in-progress': return 75;
      case 'resolved': return 100;
      default: return 0;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-warning/10 text-warning-foreground border border-warning/20';
      case 'acknowledged': return 'bg-info-background text-info-foreground border border-primary/20';
      case 'in-progress': return 'bg-primary/10 text-primary border border-primary/20';
      case 'resolved': return 'bg-success-background text-success-foreground border border-success/20';
      default: return 'bg-muted text-muted-foreground border border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'submitted': return t('submitted');
      case 'acknowledged': return t('acknowledged');
      case 'in-progress': return t('in_progress');
      case 'resolved': return t('resolved');
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <FileText className="w-4 h-4" />;
      case 'acknowledged': return <Eye className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const statusSteps = [
    { key: 'submitted', label: t('submitted'), icon: '📝' },
    { key: 'acknowledged', label: t('acknowledged'), icon: '👀' },
    { key: 'in-progress', label: t('in_progress'), icon: '🔧' },
    { key: 'resolved', label: t('resolved'), icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm px-4 py-4 flex items-center space-x-4 border-b border-border">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold text-foreground">{t('issue_tracking')}</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold text-foreground">{issues.length}</p>
              <p className="text-sm text-muted-foreground font-medium">{t('total_reports')}</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-semibold text-success">
                {issues.filter(i => i.status === 'resolved').length}
              </p>
              <p className="text-sm text-muted-foreground font-medium">{t('resolved')}</p>
            </CardContent>
          </Card>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {issues.map((issue) => (
            <Card key={issue.id} className="bg-card border border-border shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-foreground">{issue.title}</CardTitle>
                  <Badge className={`${getStatusColor(issue.status)} border-0 font-semibold`}>
                    <span className="mr-1">{getStatusIcon(issue.status)}</span>
                    {getStatusText(issue.status)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  📍 {issue.location} • {formatDate(issue.dateSubmitted)}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress Timeline */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{getStatusProgress(issue.status)}%</span>
                  </div>
                  
                  <Progress 
                    value={getStatusProgress(issue.status)} 
                    className="h-2"
                  />
                  
                  <div className="flex justify-between">
                    {statusSteps.map((step, index) => {
                      const isActive = statusSteps.findIndex(s => s.key === issue.status) >= index;
                      const isCurrent = step.key === issue.status;
                      
                      return (
                        <div key={step.key} className="flex flex-col items-center space-y-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                            isActive 
                              ? isCurrent 
                                ? 'bg-primary text-white' 
                                : 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {isActive && !isCurrent ? '✓' : step.icon}
                          </div>
                          <span className={`text-xs ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-muted/50 p-3 rounded-xl border border-border/50">
                  <p className="text-sm text-foreground">{issue.description}</p>
                </div>

                {/* Officer Assignment */}
                {issue.assignedOfficer ? (
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-sm font-semibold text-foreground flex items-center">
                        <User className="w-4 h-4 mr-2 text-primary" />
                        {t('assigned_officer')}
                      </h4>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs px-3 py-1 h-auto border-primary/30 text-primary hover:bg-primary/10"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        {t('contact_officer')}
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{issue.assignedOfficer.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {issue.assignedOfficer.assignedDate && `${t('assigned_on')} ${formatDate(issue.assignedOfficer.assignedDate)}`}
                        </span>
                      </div>
                      
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p><span className="font-medium">{t('department')}:</span> {issue.assignedOfficer.department}</p>
                        <p><span className="font-medium">{t('contact_number')}:</span> {issue.assignedOfficer.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  (issue.status === 'acknowledged' || issue.status === 'in-progress') && (
                    <div className="bg-info-background/30 border border-info/20 p-3 rounded-xl">
                      <p className="text-sm text-info-foreground flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        {t('no_officer_assigned')}
                      </p>
                    </div>
                  )
                )}

                {/* Status Updates */}
                {issue.status === 'resolved' && (
                  <div className="bg-success-background border border-success/20 p-3 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-success">🎉</span>
                      <div className="flex-1">
                        <p className="text-sm text-success-foreground font-medium">
                          Issue resolved successfully!
                        </p>
                        <p className="text-xs text-success mt-1">
                          🔔 Notification sent
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {issue.status === 'in-progress' && (
                  <div className="bg-primary/10 border border-primary/20 p-3 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-primary">🔧</span>
                      <div className="flex-1">
                        <p className="text-sm text-primary font-medium">
                          Work in progress - Expected resolution in 2-3 days
                        </p>
                        <p className="text-xs text-primary/80 mt-1">
                          🔔 You'll be notified when resolved
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {issue.status === 'acknowledged' && (
                  <div className="bg-info-background border border-info/20 p-3 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-info">👀</span>
                      <p className="text-sm text-info-foreground font-medium">
                        Issue acknowledged by authorities
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {issues.length === 0 && (
          <Card className="bg-card border border-border shadow-md">
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <span className="text-6xl">📋</span>
                <h3 className="text-xl font-bold text-foreground">{t('no_issues_found')}</h3>
                <p className="text-muted-foreground font-medium">
                  {t('create_first_report')}
                </p>
                <Button
                  onClick={onBack}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-6"
                >
                  {t('report_issue')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}