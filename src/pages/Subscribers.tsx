
import React from "react";
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Subscribers = () => {
  const { data: subscribers, isLoading, error } = useRealtimeQuery("subscribers", {
    orderBy: "created_at",
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-serif font-bold mb-4 text-vip-black">VVIP Subscribers</h1>
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-gold">Subscribers List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="py-6 text-center text-vip-gold/70">Loading...</div>}
          {error && (
            <div className="py-6 text-center text-vip-red">
              {error.message}
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-vip-gold/10">
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Subscribed</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {(subscribers || []).map((subscriber: any, idx: number) => (
                  <tr key={subscriber.id} className="border-t border-vip-gold/10">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{subscriber.email}</td>
                    <td className="px-4 py-2">
                      {subscriber.subscribed ? (
                        <span className="text-ios-green font-semibold">YES</span>
                      ) : (
                        <span className="text-vip-red font-semibold">NO</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {subscriber.created_at ? new Date(subscriber.created_at).toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
                {!isLoading && (!subscribers || subscribers.length === 0) && (
                  <tr>
                    <td colSpan={4} className="text-center text-vip-gold/60 py-8">
                      No subscribers yet.
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
