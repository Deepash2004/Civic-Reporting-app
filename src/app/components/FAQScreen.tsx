import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ArrowLeft, ChevronDown, Send, MessageCircle, Mic, MicOff } from 'lucide-react';

interface FAQScreenProps {
  onBack: () => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I track my report?',
    answer: 'You can track your report by going to the "Track Issues" section from the home screen. There you\'ll see all your submitted reports with their current status and progress.',
    category: 'Tracking'
  },
  {
    id: '2',
    question: 'How long does it take for issues to get resolved?',
    answer: 'Resolution time varies by issue type and severity. Typically: Emergency issues (0-24 hours), High priority (1-3 days), Medium priority (3-7 days), Low priority (1-2 weeks).',
    category: 'General'
  },
  {
    id: '3',
    question: 'Can I report issues anonymously?',
    answer: 'Yes! You can continue as a guest to report issues anonymously. However, creating an account helps you track your reports and earn rewards.',
    category: 'Reporting'
  },
  {
    id: '4',
    question: 'How do I earn points and badges?',
    answer: 'You earn points by: Reporting issues (50 points), Issues getting resolved (bonus points), Daily reporting streak, Community participation. Badges are awarded for milestones and achievements.',
    category: 'Rewards'
  },
  {
    id: '5',
    question: 'What types of issues can I report?',
    answer: 'You can report: Potholes, Broken streetlights, Garbage collection issues, Water leakage, Noise pollution, Environmental concerns, Public safety issues, and more.',
    category: 'Reporting'
  },
  {
    id: '6',
    question: 'Why was my report rejected?',
    answer: 'Reports may be rejected if: The issue is not within our jurisdiction, Insufficient or unclear information, Duplicate report, Issue doesn\'t meet our guidelines. You\'ll receive a notification with the reason.',
    category: 'General'
  },
  {
    id: '7',
    question: 'How do I update my profile?',
    answer: 'Go to Profile section from the side menu. There you can update your name, contact information, notification preferences, and avatar.',
    category: 'Account'
  },
  {
    id: '8',
    question: 'Can I edit or delete my report?',
    answer: 'You can edit reports that are still in "submitted" status. Once acknowledged by authorities, reports cannot be edited but you can add comments or additional photos.',
    category: 'Reporting'
  }
];

const suggestedQuestions = [
  'How do I track my report?',
  'How long does resolution take?',
  'Can I report anonymously?',
  'How do I earn points?',
  'What issues can I report?',
  'Why was my report rejected?'
];

export function FAQScreen({ onBack }: FAQScreenProps) {
  const [activeTab, setActiveTab] = useState('static');
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hi! I\'m your CitySaathi FAQ Assistant. I can help answer questions about using the app, reporting issues, tracking progress, and more. What would you like to know?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const categories = [...new Set(faqs.map(faq => faq.category))];
  
  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItem = (itemId: string) => {
    setOpenItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const getAIResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase();
    
    // Find matching FAQ
    const matchingFAQ = faqs.find(faq =>
      faq.question.toLowerCase().includes(lowerQuestion) ||
      lowerQuestion.includes(faq.question.toLowerCase().split(' ').slice(0, 3).join(' '))
    );
    
    if (matchingFAQ) {
      return matchingFAQ.answer;
    }

    // Pattern matching for common queries
    if (lowerQuestion.includes('track') || lowerQuestion.includes('status')) {
      return 'You can track your reports by going to "Track Issues" from the home screen. You\'ll see real-time status updates for all your submitted reports including progress timeline and assigned civic workers.';
    }
    
    if (lowerQuestion.includes('time') || lowerQuestion.includes('long') || lowerQuestion.includes('when')) {
      return 'Resolution times vary by issue type: Emergency issues are handled within 24 hours, high priority issues in 1-3 days, medium priority in 3-7 days, and low priority in 1-2 weeks. You\'ll receive notifications at each stage.';
    }
    
    if (lowerQuestion.includes('points') || lowerQuestion.includes('reward') || lowerQuestion.includes('badge')) {
      return 'You earn 50 points for each report, bonus points when issues are resolved, and streak bonuses for daily reporting. Badges are awarded for milestones like "First Reporter", "Problem Solver", and "Community Champion".';
    }
    
    if (lowerQuestion.includes('report') || lowerQuestion.includes('submit') || lowerQuestion.includes('issue')) {
      return 'To report an issue: 1) Tap "Report an Issue" on home screen, 2) Select issue category, 3) Add description and photo, 4) Confirm location, 5) Submit. You\'ll get a confirmation and tracking ID.';
    }
    
    if (lowerQuestion.includes('anonymous') || lowerQuestion.includes('guest')) {
      return 'Yes! You can report issues anonymously by continuing as a guest. However, creating an account lets you track reports, earn rewards, and receive status updates.';
    }

    // Default response
    return 'I\'m here to help! You can ask me about reporting issues, tracking progress, earning rewards, account management, or any other app features. Try asking "How do I track my report?" or browse the FAQ sections above.';
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage('');
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice input
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage('How do I track my report?');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm px-4 py-4 flex items-center space-x-4 border-b border-border">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-muted rounded-full"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">FAQs & Help</h1>
          <p className="text-sm text-muted-foreground font-medium">Get answers to common questions</p>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-card shadow-sm border border-border">
            <TabsTrigger value="static" className="flex items-center space-x-2 font-semibold">
              <span>📋</span>
              <span>FAQ List</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center space-x-2 font-semibold">
              <MessageCircle className="w-4 h-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
          </TabsList>

          {/* Static FAQ Tab */}
          <TabsContent value="static" className="space-y-6">
            {/* Search */}
            <Card className="bg-card border border-border shadow-md">
              <CardContent className="p-4">
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-input-background"
                />
              </CardContent>
            </Card>

            {/* FAQ Categories */}
            {categories.map(category => (
              <Card key={category} className="bg-card border border-border shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-foreground">{category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredFAQs
                    .filter(faq => faq.category === category)
                    .map(faq => (
                      <Collapsible key={faq.id}>
                        <CollapsibleTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-between p-4 h-auto text-left hover:bg-secondary rounded-xl"
                            onClick={() => toggleItem(faq.id)}
                          >
                            <span className="font-semibold text-foreground">{faq.question}</span>
                            <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${
                              openItems.includes(faq.id) ? 'rotate-180' : ''
                            }`} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                          <div className="bg-secondary/50 p-4 rounded-xl border border-border">
                            <p className="text-foreground font-medium">{faq.answer}</p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                  }
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            {/* Suggested Questions */}
            <Card className="bg-card border border-border shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-foreground">Suggested Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      variant="outline"
                      className="justify-start text-left h-auto p-3 hover:bg-primary/5 hover:border-primary/30 font-medium"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="bg-card border border-border shadow-md">
              <CardContent className="p-4">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.isUser ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`p-3 rounded-2xl ${
                            message.isUser
                              ? 'bg-primary text-primary-foreground ml-4'
                              : 'bg-secondary text-foreground mr-4 border border-border'
                          }`}
                        >
                          <p className="text-sm font-medium">{message.text}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 px-4">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="mt-4 flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={isRecording ? "Listening..." : "Ask a question..."}
                      className="pr-12 rounded-full bg-input-background"
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      disabled={isRecording}
                    />
                    <Button
                      onClick={handleVoiceToggle}
                      variant="ghost"
                      size="sm"
                      className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 ${
                        isRecording ? 'text-destructive bg-destructive/10' : 'text-muted-foreground'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </Button>
                  </div>
                  
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() && !isRecording}
                    className="rounded-full p-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}