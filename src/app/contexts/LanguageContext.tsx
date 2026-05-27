import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation keys type for better TypeScript support
export type TranslationKey = keyof typeof translations.en;

const translations = {
  en: {
    // App Name
    app_name: 'CitySaathi',
    
    // Onboarding
    onboarding_title: 'Welcome to CitySaathi',
    onboarding_subtitle: 'Your Partner in Building Better Cities',
    onboarding_description: 'Report civic issues, track progress, and collaborate with your community to make your city a better place to live.',
    get_started: 'Get Started',
    continue_as_guest: 'Continue as Guest',
    
    // Navigation
    home: 'Home',
    report: 'Report',
    tracking: 'Tracking',
    community: 'Community',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    faqs: 'FAQs',
    privacy_policy: 'Privacy Policy',
    terms_conditions: 'Terms & Conditions',
    logout: 'Logout',
    
    // Home Screen
    welcome_back: 'Welcome back',
    guest_user: 'Guest User',
    report_issue: 'Report Issue',
    track_issues: 'Track Issues',
    community_hub: 'Community Hub',
    recent_activity: 'Recent Activity',
    quick_stats: 'Quick Stats',
    your_reports: 'Your Reports',
    community_reports: 'Community Reports',
    resolved_this_week: 'Resolved This Week',
    pending_issues: 'Pending Issues',
    
    // Issue Categories
    garbage: 'Garbage',
    road_infrastructure: 'Road & Infrastructure',
    lighting_traffic: 'Lighting & Traffic',
    water_drainage: 'Water & Drainage',
    noise_pollution: 'Noise & Pollution',
    public_spaces: 'Public Spaces',
    
    // Issue Status
    submitted: 'Submitted',
    acknowledged: 'Acknowledged',
    in_progress: 'In Progress',
    resolved: 'Resolved',
    
    // Report Issue Screen
    report_issue_title: 'Report Issue',
    select_category: 'What type of issue are you reporting?',
    issue_title_optional: 'Issue Title (Optional)',
    issue_title_placeholder: 'Brief title for the issue',
    description_required: 'Description *',
    description_placeholder: 'Describe the issue in detail...',
    add_media_location: 'Add Media & Location',
    photo: 'Photo',
    video: 'Video',
    voice: 'Voice',
    voice_note: 'Voice Note',
    recording: 'Recording...',
    location: 'Location',
    current_location: 'Current Location',
    change_location: 'Change',
    submit_report: 'Submit Report',
    pro_tips: 'Pro Tips:',
    tip_photos: '• Include clear photos for faster resolution',
    tip_location: '• Be specific about the location',
    tip_impact: '• Describe the impact on the community',
    
    // Media Upload
    add_photos_videos: 'Add Photos & Videos',
    add_photos: 'Add Photos',
    add_videos: 'Add Videos',
    uploaded_media: 'Uploaded Media',
    uploading_files: 'Uploading Files',
    view_all_media: 'View All Media',
    photos: 'Photos',
    videos: 'Videos',
    uploaded_on: 'Uploaded on',
    photo_tip: 'Photos help authorities understand the issue better',
    video_tip: 'Videos provide more context and details',
    file_limit_tip: 'Maximum 5 files (10MB photos, 50MB videos)',
    
    // Issue Tracking
    issue_tracking: 'Issue Tracking',
    my_issues: 'My Issues',
    filter_all: 'All',
    filter_submitted: 'Submitted',
    filter_in_progress: 'In Progress',
    filter_resolved: 'Resolved',
    no_issues_found: 'No issues found',
    create_first_report: 'Create your first report to start tracking issues.',
    assigned_officer: 'Assigned Officer',
    officer_details: 'Officer Details',
    department: 'Department',
    contact_number: 'Contact Number',
    assigned_on: 'Assigned on',
    contact_officer: 'Contact Officer',
    no_officer_assigned: 'No officer assigned yet',
    
    // Community Screen
    community_title: 'Community',
    leaderboard: 'Leaderboard',
    top_reporters: 'Top Reporters',
    recent_reports: 'Recent Reports',
    community_stats: 'Community Stats',
    total_reports: 'Total Reports',
    this_month: 'This Month',
    resolution_rate: 'Resolution Rate',
    avg_resolution_time: 'Avg Resolution Time',
    days: 'days',
    
    // Notifications
    notifications_title: 'Notifications',
    mark_all_read: 'Mark All Read',
    no_notifications: 'No notifications yet',
    stay_updated: 'We\'ll notify you about issue updates and community activities.',
    
    // Profile
    profile_title: 'Profile',
    edit_profile: 'Edit Profile',
    save_changes: 'Save Changes',
    full_name: 'Full Name',
    email_address: 'Email Address',
    phone_number: 'Phone Number',
    location_city: 'Location/City',
    activity_stats: 'Activity Stats',
    issues_reported: 'Issues Reported',
    issues_resolved: 'Issues Resolved',
    community_rank: 'Community Rank',
    member_since: 'Member Since',
    badges_earned: 'Badges Earned',
    
    // Settings
    settings_title: 'Settings',
    app_preferences: 'App Preferences',
    language: 'Language',
    english: 'English',
    hindi: 'हिन्दी',
    notifications_settings: 'Notifications',
    push_notifications: 'Push Notifications',
    email_notifications: 'Email Notifications',
    sms_notifications: 'SMS Notifications',
    privacy_security: 'Privacy & Security',
    data_privacy: 'Data Privacy',
    account_security: 'Account Security',
    support_feedback: 'Support & Feedback',
    help_support: 'Help & Support',
    send_feedback: 'Send Feedback',
    rate_app: 'Rate App',
    
    // FAQs
    faqs_title: 'Frequently Asked Questions',
    ask_ai_chat: 'Ask AI Chat',
    general_questions: 'General Questions',
    reporting_issues: 'Reporting Issues', 
    tracking_resolution: 'Tracking & Resolution',
    community_features: 'Community Features',
    privacy_data: 'Privacy & Data',
    
    // Login & Authentication
    sign_in: 'Sign In',
    sign_up: 'Sign Up',
    sign_in_subtitle: 'Sign in to track your issues and connect with your community',
    enter_credentials: 'Enter your credentials',
    email: 'Email',
    phone: 'Phone',
    email_placeholder: 'Enter your email address',
    phone_placeholder: 'Enter your phone number',
    password: 'Password',
    password_placeholder: 'Enter your password',
    forgot_password: 'Forgot Password?',
    signing_in: 'Signing In...',
    continue_with_google: 'Continue with Google',
    or: 'OR',
    dont_have_account: "Don't have an account?",
    
    // Theme
    dark_mode: 'Dark Mode',
    light_mode: 'Light Mode',
    dark_mode_desc: 'Switch to dark theme',
    light_mode_desc: 'Switch to light theme',
    
    // Common Actions
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    share: 'Share',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    try_again: 'Try Again',
    
    // Form Validation
    field_required: 'This field is required',
    select_category_required: 'Please select a category and provide a description',
    
    // Notifications Messages
    report_submitted: 'Report Submitted! 📝',
    report_submitted_message: 'Your {category} report has been submitted successfully. We\'ll update you on the progress.',
    water_pipe_fixed: 'Water Pipe Fixed! 🎉',
    pothole_repair_progress: 'Pothole Repair in Progress',
    streetlight_acknowledged: 'Streetlight Acknowledged',
    new_badge_earned: 'New Badge Earned! 🏆',
    community_impact_update: 'Community Impact Update',
    monsoon_alert: 'Monsoon Alert ⚠️',
    weekly_digest: 'Weekly Community Digest',
    trending_issue_alert: 'Trending Issue Alert',
    welcome_message: 'Welcome to CitySaathi! 🎊',
  },
  hi: {
    // App Name
    app_name: 'सिटीसाथी',
    
    // Onboarding
    onboarding_title: 'सिटीसाथी में आपका स्वागत है',
    onboarding_subtitle: 'बेहतर शहरों के निर्माण में आपका साझीदार',
    onboarding_description: 'नागरिक समस्याओं की रिपोर्ट करें, प्रगति को ट्रैक करें, और अपने शहर को रहने के लिए बेहतर जगह बनाने के लिए अपने समुदाय के साथ सहयोग करें।',
    get_started: 'शुरू करें',
    continue_as_guest: 'अतिथि के रूप में जारी रखें',
    
    // Navigation
    home: 'मुख्य',
    report: 'रिपोर्ट',
    tracking: 'ट्रैकिंग',
    community: 'समुदाय',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',
    settings: 'सेटिंग्स',
    faqs: 'सामान्य प्रश्न',
    privacy_policy: 'गोपनीयता नीति',
    terms_conditions: 'नियम और शर्तें',
    logout: 'लॉग आउट',
    
    // Home Screen
    welcome_back: 'वापस स्वागत है',
    guest_user: 'अतिथि उपयोगकर्ता',
    report_issue: 'समस्या रिपोर्ट करें',
    track_issues: 'समस्याओं को ट्रैक करें',
    community_hub: 'समुदायिक केंद्र',
    recent_activity: 'हाल की गतिविधि',
    quick_stats: 'त्वरित आंकड़े',
    your_reports: 'आपकी रिपोर्ट्स',
    community_reports: 'समुदायिक रिपोर्ट्स',
    resolved_this_week: 'इस सप्ताह हल किए गए',
    pending_issues: 'लंबित समस्याएं',
    
    // Issue Categories
    garbage: 'कचरा',
    road_infrastructure: 'सड़क और अवसंरचना',
    lighting_traffic: 'प्रकाश व्यवस्था और यातायात',
    water_drainage: 'पानी और जल निकासी',
    noise_pollution: 'शोर और प्रदूषण',
    public_spaces: 'सार्वजनिक स्थान',
    
    // Issue Status
    submitted: 'जमा किया गया',
    acknowledged: 'स्वीकार किया गया',
    in_progress: 'प्रगति में',
    resolved: 'हल किया गया',
    
    // Report Issue Screen
    report_issue_title: 'समस्या रिपोर्ट करें',
    select_category: 'आप किस प्रकार की समस्या की रिपोर्ट कर रहे हैं?',
    issue_title_optional: 'समस्या का शीर्षक (वैकल्पिक)',
    issue_title_placeholder: 'समस्या के लिए संक्षिप्त शीर्षक',
    description_required: 'विवरण *',
    description_placeholder: 'समस्या का विस्तार से वर्णन करें...',
    add_media_location: 'मीडिया और स्थान जोड़ें',
    photo: 'फोटो',
    video: 'वीडियो',
    voice: 'आवाज',
    voice_note: 'आवाज़ नोट',
    recording: 'रिकॉर्डिंग...',
    location: 'स्थान',
    current_location: 'वर्तमान स्थान',
    change_location: 'बदलें',
    submit_report: 'रिपोर्ट जमा करें',
    pro_tips: 'उपय��गी सुझाव:',
    tip_photos: '• तेज़ समाधान के लिए स्पष्ट फोटो शामिल करें',
    tip_location: '• स्थान के बारे में विशिष्ट जानकारी दें',
    tip_impact: '• समुदाय पर प्रभाव का वर्णन करें',
    
    // Media Upload
    add_photos_videos: 'फोटो और वीडियो जोड़ें',
    add_photos: 'फोटो जोड़ें',
    add_videos: 'वीडियो जोड़ें',
    uploaded_media: 'अपलोड की गई मीडिया',
    uploading_files: 'फाइलें अपलोड हो रही हैं',
    view_all_media: 'सभी मीडिया देखें',
    photos: 'फोटो',
    videos: 'वीडियो',
    uploaded_on: 'अपलोड किया गया',
    photo_tip: 'फोटो अधिकारियों को समस्या को बेहतर समझने में मदद करते हैं',
    video_tip: 'वीडियो अधिक संदर्भ और विवरण प्रदान करते हैं',
    file_limit_tip: 'अधिकतम 5 फाइलें (10MB फोटो, 50MB वीडियो)',
    
    // Issue Tracking
    issue_tracking: 'समस्या ट्रैकिंग',
    my_issues: 'मेरी समस्याएं',
    filter_all: 'सभी',
    filter_submitted: 'जमा किए गए',
    filter_in_progress: 'प्रगति में',
    filter_resolved: 'हल किए गए',
    no_issues_found: 'कोई समस्या नहीं मिली',
    create_first_report: 'समस्याओं को ट्रैक करना शुरू करने के लिए अपनी पहली रिपोर्ट बनाएं।',
    assigned_officer: 'नियुक्त अधिकारी',
    officer_details: 'अधिकारी विवरण',
    department: 'विभाग',
    contact_number: 'संपर्क नंबर',
    assigned_on: 'को नियुक्त किया गया',
    contact_officer: 'अधिकारी से संपर्क करें',
    no_officer_assigned: 'अभी तक कोई अधिकारी नियुक्त नहीं किया गया',
    
    // Community Screen
    community_title: 'समुदाय',
    leaderboard: 'लीडरबोर्ड',
    top_reporters: 'शीर्ष रिपोर्टर',
    recent_reports: 'हाल की रिपोर्ट्स',
    community_stats: 'समुदायिक आंकड़े',
    total_reports: 'कुल रिपोर्ट्स',
    this_month: 'इस महीने',
    resolution_rate: 'समाधान दर',
    avg_resolution_time: 'औसत समाधान समय',
    days: 'दिन',
    
    // Notifications
    notifications_title: 'सूचनाएं',
    mark_all_read: 'सभी को पढ़ा हुआ चिह्नित करें',
    no_notifications: 'अभी तक कोई सूचना नहीं',
    stay_updated: 'हम आपको समस्या अपडेट और समुदायिक गतिविधियों के बारे में सूचित करेंगे।',
    
    // Profile
    profile_title: 'प्रोफाइल',
    edit_profile: 'प्रोफाइल संपादित करें',
    save_changes: 'परिवर्तन सहेजें',
    full_name: 'पूरा नाम',
    email_address: 'ईमेल पता',
    phone_number: 'फोन नंबर',
    location_city: 'स्थान/शहर',
    activity_stats: 'गतिविधि आंकड़े',
    issues_reported: 'रिपोर्ट की गई समस्याएं',
    issues_resolved: 'हल की गई समस्याएं',
    community_rank: 'समुदायिक रैंक',
    member_since: 'सदस्य बने',
    badges_earned: 'अर्जित बैज',
    
    // Settings
    settings_title: 'सेटिंग्स',
    app_preferences: 'ऐप प्राथमिकताएं',
    language: 'भाषा',
    english: 'English',
    hindi: 'हिन्दी',
    notifications_settings: 'सूचनाएं',
    push_notifications: 'पुश सूचनाएं',
    email_notifications: 'ईमेल सूचनाएं',
    sms_notifications: 'SMS सूचनाएं',
    privacy_security: 'गोपनीयता और सुरक्षा',
    data_privacy: 'डेटा गोपनीयता',
    account_security: 'खाता सुरक्षा',
    support_feedback: 'सहायता और प्रतिक्रिया',
    help_support: 'सहायता और समर्थन',
    send_feedback: 'प्रतिक्रिया भेजें',
    rate_app: 'ऐप को रेट करें',
    
    // FAQs
    faqs_title: 'अक्सर पूछे जाने वाले प्रश्न',
    ask_ai_chat: 'AI चैट से पूछें',
    general_questions: 'सामान्य प्रश्न',
    reporting_issues: 'समस्या रिपोर्टिंग',
    tracking_resolution: 'ट्रैकिंग और समाधान',
    community_features: 'समुदायिक सुविधाएं',
    privacy_data: 'गोपनीयता और डेटा',
    
    // Login & Authentication
    sign_in: 'साइन इन करें',
    sign_up: 'साइन अप करें',
    sign_in_subtitle: 'अपनी समस्याओं को ट्रैक करने और अपने समुदाय से जुड़ने के लिए साइन इन करें',
    enter_credentials: 'अपनी जानकारी दर्ज करें',
    email: 'ईमेल',
    phone: 'फोन',
    email_placeholder: 'अपना ईमेल पता दर्ज करें',
    phone_placeholder: 'अपना फोन नंबर दर्ज करें',
    password: 'पासवर्ड',
    password_placeholder: 'अपना पासवर्ड दर्ज करें',
    forgot_password: 'पासवर्ड भूल गए?',
    signing_in: 'साइन इन हो रहे हैं...',
    continue_with_google: 'Google के साथ जारी रखें',
    or: 'या',
    dont_have_account: 'खाता नहीं है?',
    
    // Theme
    dark_mode: 'डार्क मोड',
    light_mode: 'लाइट मोड',
    dark_mode_desc: 'डार्क थीम पर स्विच करें',
    light_mode_desc: 'लाइट थीम पर स्विच करें',
    
    // Common Actions
    back: 'वापस',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'मिटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    share: 'साझा करें',
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    try_again: 'पुनः प्रयास करें',
    
    // Form Validation
    field_required: 'यह फील्ड आवश्यक है',
    select_category_required: 'कृपया एक श्रेणी चुनें और विवरण प्रदान करें',
    
    // Notifications Messages
    report_submitted: 'रिपोर्ट जमा की गई! 📝',
    report_submitted_message: 'आपकी {category} रिपोर्ट सफलतापूर्वक जमा की गई है। हम आपको प्रगति के बारे में अपडेट करेंगे।',
    water_pipe_fixed: 'पानी का पाइप ठीक हो गया! 🎉',
    pothole_repair_progress: 'गड्ढे की मरम्मत प्रगति में',
    streetlight_acknowledged: 'स्ट्रीट लाइट स्वीकार की गई',
    new_badge_earned: 'नया बैज अर्जित किया! 🏆',
    community_impact_update: 'समुदायिक प्रभाव अपडेट',
    monsoon_alert: 'मानसून अलर्ट ⚠️',
    weekly_digest: 'साप्ताहिक समुदायिक सारांश',
    trending_issue_alert: 'ट्रेंडिंग समस्या अलर्ट',
    welcome_message: 'सिटीसाथी में आपका स्वागत है! 🎊',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};