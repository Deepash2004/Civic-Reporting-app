import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onGoogleLogin: () => Promise<void>;
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();

  const isHindi = language === 'hi';

  const validateForm = () => {
    if (!email.trim()) {
      setError(isHindi ? 'ईमेल आवश्यक है' : 'Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError(isHindi ? 'वैध ईमेल दर्ज करें' : 'Please enter a valid email');
      return false;
    }
    if (!password.trim()) {
      setError(isHindi ? 'पासवर्ड आवश्यक है' : 'Password is required');
      return false;
    }
    if (password.length < 6) {
      setError(isHindi ? 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए' : 'Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onLogin(email, password);
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle Firebase Auth errors
      let errorMessage = isHindi ? 'लॉगिन में त्रुटि हुई' : 'Login failed';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = isHindi ? 'यह ईमेल पंजीकृत नहीं है' : 'No account found with this email';
            break;
          case 'auth/wrong-password':
            errorMessage = isHindi ? 'गलत पासवर्ड' : 'Incorrect password';
            break;
          case 'auth/invalid-email':
            errorMessage = isHindi ? 'अवैध ईमेल पता' : 'Invalid email address';
            break;
          case 'auth/user-disabled':
            errorMessage = isHindi ? 'यह खाता अक्षम है' : 'This account has been disabled';
            break;
          case 'auth/too-many-requests':
            errorMessage = isHindi ? 'बहुत से प्रयास, कुछ देर बाद कोशिश करें' : 'Too many attempts. Please try again later';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    
    try {
      await onGoogleLogin();
    } catch (error: any) {
      console.error('Google login error:', error);
      
      let errorMessage = isHindi ? 'Google लॉगिन में त्रुटि' : 'Google login failed';
      
      if (error.code) {
        switch (error.code) {
          case 'auth/popup-closed-by-user':
            errorMessage = isHindi ? 'लॉगिन रद्द किया गया' : 'Login cancelled';
            break;
          case 'auth/popup-blocked':
            errorMessage = isHindi ? 'पॉप-अप ब्लॉक किया गया' : 'Popup blocked by browser';
            break;
          default:
            errorMessage = error.message || errorMessage;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card shadow-sm px-4 py-4 flex items-center space-x-4 border-b border-border">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="p-2"
          disabled={isLoading || isGoogleLoading}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {isHindi ? 'साइन इन करें' : 'Sign In'}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            {isHindi ? 'अपने खाते में प्रवेश करें' : 'Access your account'}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md bg-card border border-border shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏛️</span>
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {isHindi ? 'CitySaathi में वापस आएं' : 'Welcome Back to CitySaathi'}
            </CardTitle>
            <p className="text-sm text-muted-foreground font-medium mt-2">
              {isHindi ? 'अपने नागरिक रिपोर्टिंग खाते में साइन इन करें' : 'Sign in to your civic reporting account'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-destructive/10 border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive font-medium">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-semibold text-foreground">
                  {isHindi ? 'ईमेल पता' : 'Email Address'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isHindi ? 'आपका ईमेल दर्ज करें' : 'Enter your email'}
                  className="bg-input-background"
                  disabled={isLoading || isGoogleLoading}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold text-foreground">
                  {isHindi ? 'पासवर्ड' : 'Password'}
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isHindi ? 'अपना पासवर्ड दर्ज करें' : 'Enter your password'}
                    className="bg-input-background pr-10"
                    disabled={isLoading || isGoogleLoading}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isHindi ? 'साइन इन हो रहा है...' : 'Signing in...'}
                  </>
                ) : (
                  isHindi ? 'साइन इन करें' : 'Sign In'
                )}
              </Button>
            </form>

            <div className="flex items-center justify-between">
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary"
                onClick={onForgotPassword}
                disabled={isLoading || isGoogleLoading}
              >
                {isHindi ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
              </Button>
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary"
                onClick={onSignUp}
                disabled={isLoading || isGoogleLoading}
              >
                {isHindi ? 'नया खाता बनाएं' : 'Create Account'}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground font-medium">
                  {isHindi ? 'या' : 'Or'}
                </span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full font-bold"
              disabled={isLoading || isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isHindi ? 'Google से साइन इन हो रहा है...' : 'Signing in with Google...'}
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  {isHindi ? 'Google से साइन इन करें' : 'Continue with Google'}
                </>
              )}
            </Button>

            <Separator />

            <Button
              onClick={onGuestLogin}
              variant="outline"
              className="w-full font-bold"
              disabled={isLoading || isGoogleLoading}
            >
              <span className="mr-2">👤</span>
              {isHindi ? 'अतिथि के रूप में जारी रखें' : 'Continue as Guest'}
            </Button>

            <p className="text-xs text-muted-foreground text-center font-medium">
              {isHindi 
                ? 'साइन इन करके, आप हमारी गोपनीयता नीति और सेवा की शर्तों से सहमत हैं'
                : 'By signing in, you agree to our Privacy Policy and Terms of Service'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}