
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Settings, Shield, Database, Notifications, Mail, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SystemSettings = () => {
  const [companyName, setCompanyName] = useState('Sir Dennis Olele VVIP Protocol');
  const [timezone, setTimezone] = useState('Africa/Nairobi');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const { toast } = useToast();

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "System settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vip-black">System Settings</h1>
          <p className="text-gray-600 mt-2">Configure system preferences and security settings</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark">
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="border-b border-neutral-medium">
            <CardTitle className="flex items-center text-vip-black">
              <Settings className="h-5 w-5 mr-2 text-vip-gold" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-vip-black font-medium">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-neutral-light border-neutral-medium text-vip-black"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone" className="text-vip-black font-medium">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-medium">
                  <SelectItem value="Africa/Nairobi" className="text-vip-black">Africa/Nairobi (EAT)</SelectItem>
                  <SelectItem value="UTC" className="text-vip-black">UTC</SelectItem>
                  <SelectItem value="Europe/London" className="text-vip-black">Europe/London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="border-b border-neutral-medium">
            <CardTitle className="flex items-center text-vip-black">
              <Shield className="h-5 w-5 mr-2 text-vip-gold" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor" className="text-vip-black font-medium">Two-Factor Authentication</Label>
              <Switch id="two-factor" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="session-timeout" className="text-vip-black font-medium">Auto Session Timeout</Label>
              <Switch id="session-timeout" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label className="text-vip-black font-medium">Session Duration</Label>
              <Select defaultValue="30">
                <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-medium">
                  <SelectItem value="15" className="text-vip-black">15 minutes</SelectItem>
                  <SelectItem value="30" className="text-vip-black">30 minutes</SelectItem>
                  <SelectItem value="60" className="text-vip-black">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="border-b border-neutral-medium">
            <CardTitle className="flex items-center text-vip-black">
              <Notifications className="h-5 w-5 mr-2 text-vip-gold" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="text-vip-black font-medium">Email Notifications</Label>
              <Switch 
                id="email-notifications" 
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-notifications" className="text-vip-black font-medium">SMS Notifications</Label>
              <Switch 
                id="sms-notifications"
                checked={smsNotifications}
                onCheckedChange={setSmsNotifications}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <Label htmlFor="desktop-notifications" className="text-vip-black font-medium">Desktop Notifications</Label>
              <Switch id="desktop-notifications" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Backup & Data */}
        <Card className="bg-white border border-neutral-medium shadow-lg">
          <CardHeader className="border-b border-neutral-medium">
            <CardTitle className="flex items-center text-vip-black">
              <Database className="h-5 w-5 mr-2 text-vip-gold" />
              Backup & Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-backup" className="text-vip-black font-medium">Automatic Backup</Label>
              <Switch 
                id="auto-backup"
                checked={autoBackup}
                onCheckedChange={setAutoBackup}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-vip-black font-medium">Backup Frequency</Label>
              <Select defaultValue="daily">
                <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-neutral-medium">
                  <SelectItem value="hourly" className="text-vip-black">Every Hour</SelectItem>
                  <SelectItem value="daily" className="text-vip-black">Daily</SelectItem>
                  <SelectItem value="weekly" className="text-vip-black">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="w-full border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-vip-black">
              Export Data Backup
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SystemSettings;
