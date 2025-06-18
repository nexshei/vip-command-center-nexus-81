
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Crown, Lock, Mail } from 'lucide-react';

const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Welcome back!",
        description: "Successfully logged into VIP Admin Dashboard"
      });
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role: 'super' | 'protocol') => {
    const credentials = {
      super: {
        email: 'superadmin@sirolevvipprotocolltd.co.ke',
        password: 'vip123'
      },
      protocol: {
        email: 'subadmin@sirolevvipprotocolltd.co.ke',
        password: 'vip123'
      }
    };
    setFormData(credentials[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center vip-gradient p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <Card className="w-full max-w-md relative z-10 vip-shadow border-0 bg-white">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <img 
                src="/lovable-uploads/60f33973-4d25-45cd-ab56-8d36ade1a7b1.png" 
                alt="Sir Ole VVIP Protocol Logo" 
                className="h-16 w-16 object-contain" 
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-serif text-vip-black">VVIP Admin Portal</CardTitle>
          <CardDescription className="text-vip-black/70">
            Access the Sir Ole VVIP Protocol Dashboard
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-vip-black font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-vip-black/60" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@sirolevvipprotocolltd.co.ke" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  className="pl-10 border-vip-gold/30 focus:border-vip-gold text-vip-black bg-white" 
                  required 
                />
              </div>
            </div>
            
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
            
            <Button 
              type="submit" 
              className="w-full vip-gold-gradient hover:opacity-90 text-white font-medium h-11" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
          
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-vip-gold/30" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-vip-black/60">Demo Accounts</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('super')} 
                className="text-vip-black border-vip-gold/30 hover:bg-vip-gold hover:text-white text-sm bg-white"
              >
                Super Admin
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleDemoLogin('protocol')} 
                className="text-vip-black border-vip-gold/30 hover:bg-vip-gold hover:text-white text-sm bg-white"
              >
                Protocol Admin
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
