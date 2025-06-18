
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import DataExportCard from '@/components/reports/DataExportCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Mail, 
  Key,
  Save
} from 'lucide-react';

const SystemSettings = () => {
  const { profile, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    phone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || ''
      });
    }
  }, [profile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    try {
      await updateProfile(profileForm);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsUpdatingPassword(true);
    
    try {
      await updatePassword(passwordForm.newPassword);
      toast({
        title: "Password Updated",
        description: "Your password has been successfully updated."
      });
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update password.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">System Settings</h1>
          <p className="text-vip-gold/80 mt-2">Configure your VIP dashboard preferences and manage your account</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* User Profile Settings */}
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="flex items-center text-vip-black">
              <User className="h-5 w-5 mr-2 text-vip-gold" />
              User Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="full_name" className="text-sm font-medium text-vip-black">Full Name</Label>
                <Input 
                  id="full_name" 
                  value={profileForm.full_name} 
                  onChange={(e) => setProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-sm font-medium text-vip-black">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profileForm.email} 
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                  disabled
                />
                <p className="text-xs text-vip-gold/60">Email cannot be changed. Contact administrator if needed.</p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone" className="text-sm font-medium text-vip-black">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={profileForm.phone} 
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                  placeholder="+254 700 000 000"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-vip-gold text-white hover:bg-vip-gold-dark"
                disabled={isUpdatingProfile}
              >
                <Save className="h-4 w-4 mr-2" />
                {isUpdatingProfile ? 'Updating...' : 'Save Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="flex items-center text-vip-black">
              <Bell className="h-5 w-5 mr-2 text-vip-gold" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-vip-black">Email Notifications</Label>
                <p className="text-xs text-vip-gold/70">Receive booking updates via email</p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-vip-gold"
              />
            </div>
            <Separator className="bg-vip-gold/10" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-vip-black">SMS Notifications</Label>
                <p className="text-xs text-vip-gold/70">Receive urgent alerts via SMS</p>
              </div>
              <Switch 
                checked={smsNotifications} 
                onCheckedChange={setSmsNotifications}
                className="data-[state=checked]:bg-vip-gold"
              />
            </div>
            <Separator className="bg-vip-gold/10" />
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-vip-black">Auto Backup</Label>
                <p className="text-xs text-vip-gold/70">Automatically backup data daily</p>
              </div>
              <Switch 
                checked={autoBackup} 
                onCheckedChange={setAutoBackup}
                className="data-[state=checked]:bg-vip-gold"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white border border-vip-gold/20 shadow-sm">
          <CardHeader className="border-b border-vip-gold/10">
            <CardTitle className="flex items-center text-vip-black">
              <Shield className="h-5 w-5 mr-2 text-vip-gold" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid gap-3">
                <Label htmlFor="new-password" className="text-sm font-medium text-vip-black">New Password</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                  placeholder="Enter new password"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-vip-black">Confirm Password</Label>
                <Input 
                  id="confirm-password" 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
                  placeholder="Confirm new password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-vip-gold text-white hover:bg-vip-gold-dark"
                disabled={isUpdatingPassword}
              >
                <Key className="h-4 w-4 mr-2" />
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Data Export Card */}
        <DataExportCard />
      </div>
    </div>
  );
};

export default SystemSettings;
