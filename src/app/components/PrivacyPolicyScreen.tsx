import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, Shield, Eye, Lock, Database, Share2, Clock } from 'lucide-react';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  const sections = [
    {
      title: 'Information We Collect',
      icon: <Database className="w-5 h-5" />,
      content: [
        'Personal information (name, email, phone number) when you create an account',
        'Location data when you report issues (with your permission)',
        'Photos and descriptions you provide with issue reports',
        'Usage data and app analytics to improve our services',
        'Device information for security and performance purposes'
      ]
    },
    {
      title: 'How We Use Your Information',
      icon: <Eye className="w-5 h-5" />,
      content: [
        'Process and track your civic issue reports',
        'Send you status updates about your reports',
        'Improve our app features and user experience',
        'Communicate with you about community issues and updates',
        'Ensure security and prevent fraud or abuse'
      ]
    },
    {
      title: 'Data Protection',
      icon: <Lock className="w-5 h-5" />,
      content: [
        'All data is encrypted in transit and at rest',
        'We implement industry-standard security measures',
        'Regular security audits and vulnerability assessments',
        'Staff access to data is limited and monitored',
        'We comply with applicable data protection regulations'
      ]
    },
    {
      title: 'Information Sharing',
      icon: <Share2 className="w-5 h-5" />,
      content: [
        'Issue reports are shared with relevant civic authorities',
        'Anonymized data may be used for city planning and analytics',
        'We never sell your personal information to third parties',
        'Community features may display your name and contributions',
        'Emergency situations may require sharing data with authorities'
      ]
    },
    {
      title: 'Data Retention',
      icon: <Clock className="w-5 h-5" />,
      content: [
        'Issue reports are kept for administrative and historical purposes',
        'Personal account data is retained while your account is active',
        'You can request deletion of your data at any time',
        'Some anonymized data may be retained for statistical purposes',
        'We comply with legal requirements for data retention'
      ]
    }
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
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground font-medium">How we protect your data</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Introduction */}
        <Card className="bg-card border border-border shadow-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <span className="text-4xl">🔒</span>
              <h2 className="text-xl font-bold text-foreground">Your Privacy Matters</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                At CitySaathi, we're committed to protecting your privacy and ensuring transparency 
                about how we collect, use, and safeguard your personal information. This policy 
                explains our practices in simple, clear terms.
              </p>
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                <p className="text-sm text-primary font-semibold">
                  <strong>Last updated:</strong> September 10, 2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policy Sections */}
        {sections.map((section, index) => (
          <Card key={index} className="bg-card border border-border shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  {section.icon}
                </div>
                <span className="font-bold text-foreground">{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start space-x-3">
                    <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        {/* Your Rights */}
        <Card className="bg-gradient-to-r from-primary/10 to-success/10 border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span className="text-xl">⚖️</span>
              <span className="font-bold text-foreground">Your Rights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-success font-bold">✓</span>
                  <span className="text-foreground font-medium">Access your personal data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-success font-bold">✓</span>
                  <span className="text-foreground font-medium">Correct inaccurate information</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-success font-bold">✓</span>
                  <span className="text-foreground font-medium">Delete your account and data</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-success font-bold">✓</span>
                  <span className="text-foreground font-medium">Export your data</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-success font-bold">✓</span>
                  <span className="text-foreground font-medium">Opt out of communications</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-success font-bold">✓</span>
                  <span className="text-foreground font-medium">File a privacy complaint</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span className="text-xl">📧</span>
              <span className="font-bold text-foreground">Contact Us</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4 font-medium">
              If you have questions about this privacy policy or want to exercise your rights, 
              please contact us:
            </p>
            <div className="space-y-2 text-muted-foreground font-medium">
              <p><strong className="text-foreground">Email:</strong> privacy@citysaathi.app</p>
              <p><strong className="text-foreground">Phone:</strong> +91 1800-123-4567</p>
              <p><strong className="text-foreground">Address:</strong> CitySaathi Privacy Office, Tech Park, Bangalore, India</p>
            </div>
            
            <Separator className="my-4" />
            
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              Contact Privacy Team
            </Button>
          </CardContent>
        </Card>

        {/* Agreement */}
        <Card className="bg-warning/10 border border-warning/30 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-3xl mb-3 block">🤝</span>
            <h3 className="font-bold text-foreground mb-2">Your Consent</h3>
            <p className="text-foreground text-sm font-medium">
              By using CitySaathi, you consent to the collection and use of your information 
              as described in this privacy policy. We'll notify you of any significant changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}