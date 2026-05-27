import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, FileText, Users, AlertTriangle, Scale, Gavel } from 'lucide-react';

interface TermsConditionsScreenProps {
  onBack: () => void;
}

export function TermsConditionsScreen({ onBack }: TermsConditionsScreenProps) {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: <Scale className="w-5 h-5" />,
      content: [
        'By downloading, installing, or using CitySaathi, you agree to be bound by these terms',
        'These terms constitute a legally binding agreement between you and CitySaathi',
        'If you do not agree to these terms, please do not use our service',
        'We may update these terms periodically, and continued use implies acceptance',
        'You must be at least 13 years old to use this service'
      ]
    },
    {
      title: 'User Responsibilities',
      icon: <Users className="w-5 h-5" />,
      content: [
        'Provide accurate and truthful information when reporting issues',
        'Only report legitimate civic issues within the app\'s intended scope',
        'Respect the privacy and rights of other users and community members',
        'Do not misuse the platform for personal gain or malicious purposes',
        'Keep your account credentials secure and confidential'
      ]
    },
    {
      title: 'Prohibited Activities',
      icon: <AlertTriangle className="w-5 h-5" />,
      content: [
        'Submitting false, misleading, or fraudulent reports',
        'Uploading inappropriate, offensive, or copyrighted content',
        'Attempting to hack, disrupt, or compromise the app\'s security',
        'Harassing, threatening, or intimidating other users',
        'Using the platform for commercial advertising without permission'
      ]
    },
    {
      title: 'Service Availability',
      icon: <FileText className="w-5 h-5" />,
      content: [
        'We strive to maintain continuous service but cannot guarantee 100% uptime',
        'Maintenance, updates, or technical issues may cause temporary interruptions',
        'We reserve the right to modify or discontinue features with notice',
        'Emergency situations may require temporary service restrictions',
        'Third-party dependencies may affect service availability'
      ]
    },
    {
      title: 'Intellectual Property',
      icon: <Gavel className="w-5 h-5" />,
      content: [
        'CitySaathi and its content are protected by intellectual property laws',
        'You retain ownership of content you submit but grant us usage rights',
        'Do not infringe upon third-party copyrights, trademarks, or patents',
        'Report any suspected intellectual property violations to us',
        'We respect intellectual property rights and respond to valid takedown requests'
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
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Terms & Conditions</h1>
            <p className="text-sm text-muted-foreground font-medium">Legal terms of service</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Introduction */}
        <Card className="bg-card border border-border shadow-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <span className="text-4xl">📜</span>
              <h2 className="text-xl font-bold text-foreground">Terms of Service</h2>
              <p className="text-muted-foreground leading-relaxed font-medium">
                Welcome to CitySaathi! These terms and conditions govern your use of our 
                civic reporting platform. Please read them carefully to understand your 
                rights and obligations when using our service.
              </p>
              <div className="bg-primary/10 p-4 rounded-xl border border-primary/20">
                <p className="text-sm text-primary font-semibold">
                  <strong>Effective Date:</strong> September 10, 2025<br />
                  <strong>Version:</strong> 1.0
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Sections */}
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

        {/* Liability and Disclaimers */}
        <Card className="bg-warning/10 border border-warning/30 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span className="text-xl">⚠️</span>
              <span className="font-bold text-foreground">Disclaimers & Liability</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-bold text-foreground mb-2">Service Disclaimer</h4>
              <p className="text-foreground text-sm font-medium">
                CitySaathi is provided "as is" without warranties of any kind. We do not 
                guarantee that issues reported through our platform will be resolved by 
                civic authorities, nor do we control the response time or quality of 
                municipal services.
              </p>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-bold text-foreground mb-2">Limitation of Liability</h4>
              <p className="text-foreground text-sm font-medium">
                CitySaathi and its affiliates shall not be liable for any indirect, 
                incidental, or consequential damages arising from your use of the platform. 
                Our total liability is limited to the amount you paid for premium features, 
                if any.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="bg-info/10 border border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span className="text-xl">🏛️</span>
              <span className="font-bold text-foreground">Governing Law</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4 font-medium">
              These terms are governed by the laws of India. Any disputes will be resolved 
              through binding arbitration in Bangalore, Karnataka, India.
            </p>
            <div className="bg-card p-4 rounded-xl border border-border">
              <h4 className="font-bold text-foreground mb-2">Dispute Resolution</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground font-medium">
                <li>Attempt resolution through direct communication</li>
                <li>Mediation through designated third-party mediator</li>
                <li>Binding arbitration if mediation fails</li>
                <li>Litigation as a last resort</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="bg-destructive/10 border border-destructive/30 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span className="text-xl">🚫</span>
              <span className="font-bold text-foreground">Account Termination</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4 font-medium">
              We reserve the right to suspend or terminate accounts that violate these terms. 
              You may also terminate your account at any time through the app settings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-foreground mb-2">Grounds for Termination:</h5>
                <ul className="space-y-1 text-muted-foreground font-medium">
                  <li>• Violation of terms</li>
                  <li>• Fraudulent activity</li>
                  <li>• Abuse of other users</li>
                  <li>• Security threats</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-foreground mb-2">Upon Termination:</h5>
                <ul className="space-y-1 text-muted-foreground font-medium">
                  <li>• Access will be revoked</li>
                  <li>• Data may be deleted</li>
                  <li>• Outstanding reports remain</li>
                  <li>• Terms continue to apply</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact for Legal Issues */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <span className="text-xl">📞</span>
              <span className="font-bold text-foreground">Legal Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4 font-medium">
              For legal questions, concerns about these terms, or to report violations:
            </p>
            <div className="space-y-2 text-muted-foreground font-medium">
              <p><strong className="text-foreground">Legal Department:</strong> legal@citysaathi.app</p>
              <p><strong className="text-foreground">Address:</strong> CitySaathi Legal, Tech Park, Bangalore 560001</p>
              <p><strong className="text-foreground">Business Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM IST</p>
            </div>
            
            <Separator className="my-4" />
            
            <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
              Contact Legal Team
            </Button>
          </CardContent>
        </Card>

        {/* Acknowledgment */}
        <Card className="bg-success/10 border border-success/30 shadow-md">
          <CardContent className="p-6 text-center">
            <span className="text-3xl mb-3 block">✅</span>
            <h3 className="font-bold text-foreground mb-2">Acknowledgment</h3>
            <p className="text-foreground text-sm font-medium">
              By using CitySaathi, you acknowledge that you have read, understood, and 
              agree to be bound by these terms and conditions. Thank you for helping 
              build better communities!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}