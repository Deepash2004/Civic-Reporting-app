import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLogin: () => void;
  onGoogleLogin: () => void;
  onBack: () => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
  onGuestLogin: () => void;
}

export function LoginScreen({ 
  onLogin, 
  onGoogleLogin,
  onBack, 
  onForgotPassword, 
  onSignUp, 
  onGuestLogin 
}: LoginScreenProps) {
  const { t } = useLanguage();
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate Google login process
    setTimeout(() => {
      setIsLoading(false);
      onGoogleLogin();
    }, 1000);
  };

  const isFormValid = () => {
    if (loginMethod === 'email') {
      return formData.email.trim() && formData.password.trim();
    } else {
      return formData.phone.trim() && formData.password.trim();
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
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">{t('sign_in')}</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-3xl text-primary-foreground font-bold">CS</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">{t('welcome_back')}</h2>
            <p className="text-muted-foreground font-medium mt-2">
              {t('sign_in_subtitle')}
            </p>
          </div>
        </div>

        {/* Login Method Toggle */}
        <Card className="bg-card border border-border shadow-md">
          <CardContent className="p-4">
            <div className="flex bg-secondary rounded-xl p-1">
              <Button
                variant={loginMethod === 'email' ? 'default' : 'ghost'}
                className={`flex-1 rounded-lg font-semibold transition-all ${
                  loginMethod === 'email' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setLoginMethod('email')}
              >
                <Mail className="w-4 h-4 mr-2" />
                {t('email')}
              </Button>
              <Button
                variant={loginMethod === 'phone' ? 'default' : 'ghost'}
                className={`flex-1 rounded-lg font-semibold transition-all ${
                  loginMethod === 'phone' 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setLoginMethod('phone')}
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('phone')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="bg-card border border-border shadow-md">
          <CardHeader className="pb-4">
            <h3 className="font-bold text-foreground">{t('enter_credentials')}</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Email/Phone Input */}
            <div className="space-y-2">
              <Label className="font-semibold text-foreground">
                {loginMethod === 'email' ? t('email_address') : t('phone_number')}
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {loginMethod === 'email' ? (
                    <Mail className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Phone className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
                <Input
                  type={loginMethod === 'email' ? 'email' : 'tel'}
                  placeholder={
                    loginMethod === 'email' 
                      ? t('email_placeholder')
                      : t('phone_placeholder')
                  }
                  value={loginMethod === 'email' ? formData.email : formData.phone}
                  onChange={(e) => 
                    handleInputChange(loginMethod === 'email' ? 'email' : 'phone', e.target.value)
                  }
                  className="pl-12 bg-input-background border border-border rounded-xl py-3 font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label className="font-semibold text-foreground">{t('password')}</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-muted-foreground" />
                </div>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('password_placeholder')}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-12 pr-12 bg-input-background border border-border rounded-xl py-3 font-medium"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-0 h-auto"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <Eye className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={onForgotPassword}
                className="text-primary hover:text-primary/80 font-semibold p-0 h-auto"
              >
                {t('forgot_password')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Button */}
        <Button
          onClick={handleLogin}
          disabled={!isFormValid() || isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
              <span>{t('signing_in')}</span>
            </div>
          ) : (
            t('sign_in')
          )}
        </Button>

        {/* Alternative Options */}
        <div className="space-y-4">
          {/* Divider */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-muted-foreground font-medium text-sm">{t('or')}</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Google Login */}
          <Button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            variant="outline"
            className="w-full border-2 border-border bg-card hover:bg-secondary py-4 rounded-xl font-semibold text-lg transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" className="w-5 h-5">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span className="text-foreground font-semibold">
                {isLoading ? t('signing_in') : t('continue_with_google')}
              </span>
            </div>
          </Button>

          {/* Guest Login */}
          <Button
            onClick={onGuestLogin}
            variant="outline"
            className="w-full border-2 border-border text-foreground hover:bg-secondary py-4 rounded-xl font-semibold text-lg"
          >
            {t('continue_as_guest')}
          </Button>

          {/* Sign Up Link */}
          <div className="text-center">
            <span className="text-muted-foreground font-medium">
              {t('dont_have_account')} 
            </span>
            <Button
              variant="ghost"
              onClick={onSignUp}
              className="text-primary hover:text-primary/80 font-bold p-1 h-auto ml-1"
            >
              {t('sign_up')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}