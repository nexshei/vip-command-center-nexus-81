
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  subscribed: boolean;
  created_at: string;
}

// Mock data for subscribers
const mockSubscribers: Subscriber[] = [
  {
    id: '1',
    email: 'ambassador.johnson@embassy.com',
    subscribed: true,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    email: 'sarah.williams@megacorp.com',
    subscribed: true,
    created_at: '2024-01-16T10:00:00Z'
  },
  {
    id: '3',
    email: 'minister.chen@gov.example',
    subscribed: false,
    created_at: '2024-01-17T10:00:00Z'
  }
];

const Subscribers = () => {
  const [subscribers] = useState<Subscriber[]>(mockSubscribers);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSubscribers = subscribers.filter(subscriber =>
    subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-serif font-bold mb-4 text-vip-black">VVIP Subscribers</h1>
      
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-gold">Subscribers List</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-vip-gold/50" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-vip-gold/30"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-vip-gold/10">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscribers.map((subscriber, idx) => (
                  <tr key={subscriber.id} className="border-t border-vip-gold/10">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{subscriber.email}</td>
                    <td className="px-4 py-2">
                      {subscriber.subscribed ? (
                        <Badge className="bg-green-100 text-green-800">SUBSCRIBED</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800">UNSUBSCRIBED</Badge>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(subscriber.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {filteredSubscribers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-vip-gold/60 py-8">
                      {searchTerm ? 'No subscribers match your search.' : 'No subscribers yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribers;
