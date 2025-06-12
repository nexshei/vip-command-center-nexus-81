
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
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
        <Button variant="outline" className="border-vip-gold text-vip-gold hover:bg-vip-gold hover:text-vip-black font-medium">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border border-neutral-medium shadow-2xl">
        <DialogHeader className="pb-4 border-b border-neutral-medium">
          <DialogTitle className="text-2xl font-serif font-bold text-vip-black">Filter Options</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="status" className="text-vip-black font-medium text-sm">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black focus:border-vip-gold focus:ring-vip-gold/20">
                <SelectValue placeholder="Select status" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-medium">
                <SelectItem value="active" className="text-vip-black hover:bg-neutral-light">Active</SelectItem>
                <SelectItem value="pending" className="text-vip-black hover:bg-neutral-light">Pending</SelectItem>
                <SelectItem value="completed" className="text-vip-black hover:bg-neutral-light">Completed</SelectItem>
                <SelectItem value="cancelled" className="text-vip-black hover:bg-neutral-light">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateRange" className="text-vip-black font-medium text-sm">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black focus:border-vip-gold focus:ring-vip-gold/20">
                <SelectValue placeholder="Select date range" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-medium">
                <SelectItem value="today" className="text-vip-black hover:bg-neutral-light">Today</SelectItem>
                <SelectItem value="week" className="text-vip-black hover:bg-neutral-light">This Week</SelectItem>
                <SelectItem value="month" className="text-vip-black hover:bg-neutral-light">This Month</SelectItem>
                <SelectItem value="quarter" className="text-vip-black hover:bg-neutral-light">This Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="clientType" className="text-vip-black font-medium text-sm">Client Type</Label>
            <Select value={clientType} onValueChange={setClientType}>
              <SelectTrigger className="bg-neutral-light border-neutral-medium text-vip-black focus:border-vip-gold focus:ring-vip-gold/20">
                <SelectValue placeholder="Select client type" className="text-gray-500" />
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-medium">
                <SelectItem value="vip" className="text-vip-black hover:bg-neutral-light">VIP</SelectItem>
                <SelectItem value="premium" className="text-vip-black hover:bg-neutral-light">Premium</SelectItem>
                <SelectItem value="standard" className="text-vip-black hover:bg-neutral-light">Standard</SelectItem>
                <SelectItem value="corporate" className="text-vip-black hover:bg-neutral-light">Corporate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-neutral-medium">
          <Button 
            variant="outline" 
            className="border-neutral-medium text-vip-black hover:bg-neutral-light"
            onClick={() => { setStatus(''); setDateRange(''); setClientType(''); }}
          >
            Clear
          </Button>
          <Button 
            onClick={handleApplyFilter} 
            className="bg-vip-gold text-vip-black hover:bg-vip-gold-dark font-medium"
          >
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
