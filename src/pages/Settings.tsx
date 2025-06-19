
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import DataExportCard from '@/components/reports/DataExportCard';
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
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">System Settings</h1>
          <p className="text-vip-gold/80 mt-2">Configure your VIP dashboard preferences and export data</p>
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
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-sm font-medium text-vip-black">Full Name</Label>
              <Input 
                id="name" 
                defaultValue="Sir Dennis Olele" 
                className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="email" className="text-sm font-medium text-vip-black">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="admin@sirolele.com" 
                className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="phone" className="text-sm font-medium text-vip-black">Phone Number</Label>
              <Input 
                id="phone" 
                defaultValue="+254 700 000 000" 
                className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
              />
            </div>
            <Button className="w-full bg-vip-gold text-white hover:bg-vip-gold-dark">
              <Save className="h-4 w-4 mr-2" />
              Save Profile
            </Button>
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
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="current-password" className="text-sm font-medium text-vip-black">Current Password</Label>
              <Input 
                id="current-password" 
                type="password" 
                className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="new-password" className="text-sm font-medium text-vip-black">New Password</Label>
              <Input 
                id="new-password" 
                type="password" 
                className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirm-password" className="text-sm font-medium text-vip-black">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password" 
                className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold"
              />
            </div>
            <Button className="w-full bg-vip-gold text-white hover:bg-vip-gold-dark">
              <Key className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Data Export Card */}
        <DataExportCard />
      </div>
    </div>
  );
};

export default SystemSettings;
