
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';

export const FilterModal = () => {
  const [status, setStatus] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [clientType, setClientType] = useState('');

  const handleApplyFilter = () => {
    console.log('Applying filters:', { status, dateRange, clientType });
    // Here you would typically apply the filters to your data
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-white">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] vip-glass border-vip-gold/20">
        <DialogHeader>
          <DialogTitle className="text-vip-black">Filter Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status" className="text-vip-black">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dateRange" className="text-vip-black">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientType" className="text-vip-black">Client Type</Label>
            <Select value={clientType} onValueChange={setClientType}>
              <SelectTrigger>
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => { setStatus(''); setDateRange(''); setClientType(''); }}>
            Clear
          </Button>
          <Button onClick={handleApplyFilter} className="bg-vip-gold text-white hover:bg-vip-gold-dark">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
