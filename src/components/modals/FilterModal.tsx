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
        <Button variant="outline" className="border-vip-gold/30 text-vip-black bg-white hover:bg-vip-gold-light hover:text-black shadow-sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] bg-white border border-vip-gold/20 shadow-xl">
        <DialogHeader className="border-b border-vip-gold/10 pb-4">
          <DialogTitle className="text-xl font-serif text-vip-black">Filter Options</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid gap-3">
            <Label htmlFor="status" className="text-sm font-medium text-vip-black">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/20">
                <SelectItem value="active" className="text-vip-black hover:bg-vip-gold-light">Active</SelectItem>
                <SelectItem value="pending" className="text-vip-black hover:bg-vip-gold-light">Pending</SelectItem>
                <SelectItem value="completed" className="text-vip-black hover:bg-vip-gold-light">Completed</SelectItem>
                <SelectItem value="cancelled" className="text-vip-black hover:bg-vip-gold-light">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="dateRange" className="text-sm font-medium text-vip-black">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/20">
                <SelectItem value="today" className="text-vip-black hover:bg-vip-gold-light">Today</SelectItem>
                <SelectItem value="week" className="text-vip-black hover:bg-vip-gold-light">This Week</SelectItem>
                <SelectItem value="month" className="text-vip-black hover:bg-vip-gold-light">This Month</SelectItem>
                <SelectItem value="quarter" className="text-vip-black hover:bg-vip-gold-light">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="clientType" className="text-sm font-medium text-vip-black">Client Type</Label>
            <Select value={clientType} onValueChange={setClientType}>
              <SelectTrigger className="border-vip-gold/30 bg-white text-vip-black focus:border-vip-gold">
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-vip-gold/20">
                <SelectItem value="vip" className="text-vip-black hover:bg-vip-gold-light">VIP</SelectItem>
                <SelectItem value="premium" className="text-vip-black hover:bg-vip-gold-light">Premium</SelectItem>
                <SelectItem value="standard" className="text-vip-black hover:bg-vip-gold-light">Standard</SelectItem>
                <SelectItem value="corporate" className="text-vip-black hover:bg-vip-gold-light">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-vip-gold/10">
          <Button 
            variant="outline" 
            onClick={() => { setStatus(''); setDateRange(''); setClientType(''); }}
            className="border-vip-gold/30 text-vip-black hover:bg-vip-gold-light hover:text-black"
          >
            Clear
          </Button>
          <Button 
            onClick={handleApplyFilter} 
            className="bg-vip-gold text-black hover:bg-vip-gold-light shadow-sm"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
