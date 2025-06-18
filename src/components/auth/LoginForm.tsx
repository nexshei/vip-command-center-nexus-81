
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Crown, Lock, Mail, ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot-password' | 'create-password';

const LoginForm = () => {
  const { login, signUp, resetPassword } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'protocol_admin'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      switch (mode) {
        case 'login':
          await login(formData.email, formData.password);
          toast({
            title: "Welcome back!",
            description: "Successfully logged into VIP Admin Dashboard"
          });
          break;
          
        case 'signup':
          if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          await signUp(formData.email, formData.password, {
            full_name: formData.fullName,
            role: formData.role
          });
          toast({
            title: "Check your email!",
            description: "We've sent you a confirmation link to complete your registration."
          });
          setMode('login');
          break;
          
        case 'create-password':
          await signUp(formData.email, undefined, {
            full_name: formData.fullName,
            role: formData.role
          });
          toast({
            title: "Check your email!",
            description: "We've sent you a link to create your password."
          });
          setMode('login');
          break;
          
        case 'forgot-password':
          await resetPassword(formData.email);
          toast({
            title: "Password reset sent!",
            description: "Check your email for password reset instructions."
          });
          setMode('login');
          break;
      }
    } catch (error: any) {
      toast({
        title: mode === 'login' ? "Login Failed" : "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      role: 'protocol_admin'
    });
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    resetForm();
  };

  return (
    <div className="min-h-screen flex items-center justify-center vip-gradient p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 vip-shadow border-0 bg-white">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-between">
            {mode !== 'login' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => switchMode('login')}
                className="text-vip-gold hover:text-vip-gold-light"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            )}
            <div className="flex-1 flex justify-center">
              <img 
                src="/lovable-uploads/60f33973-4d25-45cd-ab56-8d36ade1a7b1.png" 
                alt="Sir Ole VVIP Protocol Logo" 
                className="h-16 w-16 object-contain" 
              />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-serif text-vip-black">
            {mode === 'login' && 'VVIP Admin Portal'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'create-password' && 'Create Password'}
            {mode === 'forgot-password' && 'Reset Password'}
          </CardTitle>
          
          <CardDescription className="text-vip-black/70">
            {mode === 'login' && 'Access the Sir Ole VVIP Protocol Dashboard'}
            {mode === 'signup' && 'Join the VIP administration team'}
            {mode === 'create-password' && 'Set up your account password'}
            {mode === 'forgot-password' && 'Enter your email to reset password'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {(mode === 'signup' || mode === 'create-password') && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-vip-black font-medium">Full Name</Label>
                <Input 
                  id="fullName" 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={formData.fullName} 
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} 
                  className="border-vip-gold/30 focus:border-vip-gold text-vip-black bg-white" 
                  required 
                />
              </div>
            )}

            {(mode === 'signup' || mode === 'create-password') && (
              <div className="space-y-2">
                <Label htmlFor="role" className="text-vip-black font-medium">Role</Label>
                <select 
                  id="role" 
                  value={formData.role} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-vip-gold/30 rounded-md focus:border-vip-gold text-vip-black bg-white"
                  required
                >
                  <option value="protocol_admin">Protocol Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-vip-black font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-vip-black/60" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email address" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="pl-10 border-vip-gold/30 focus:border-vip-gold text-vip-black bg-white" 
                  required 
                />
              </div>
            </div>
            
            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-2">
                <Label htmlFor="password" className="text-vip-black font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-vip-black/60" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={formData.password} 
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                    className="pl-10 border-vip-gold/30 focus:border-vip-gold text-vip-black bg-white" 
                    required 
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-vip-black font-medium">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-vip-black/60" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword} 
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} 
                    className="pl-10 border-vip-gold/30 focus:border-vip-gold text-vip-black bg-white" 
                    required 
                  />
                </div>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full vip-gold-gradient hover:opacity-90 text-white font-medium h-11" 
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 
                mode === 'login' ? 'Sign In' :
                mode === 'signup' ? 'Create Account' :
                mode === 'create-password' ? 'Send Password Link' :
                'Send Reset Link'
              }
            </Button>
          </form>

          {mode === 'login' && (
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="text-sm text-vip-gold hover:text-vip-gold-light underline"
              >
                Create new account
              </button>
              <br />
              <button
                type="button"
                onClick={() => switchMode('create-password')}
                className="text-sm text-vip-gold hover:text-vip-gold-light underline"
              >
                Create account via email verification
              </button>
              <br />
              <button
                type="button"
                onClick={() => switchMode('forgot-password')}
                className="text-sm text-vip-gold hover:text-vip-gold-light underline"
              >
                Forgot password?
              </button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
