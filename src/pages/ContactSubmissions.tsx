
import React from "react";
import { useRealtimeQuery } from "@/hooks/useRealtimeQuery";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ContactSubmissions = () => {
  const { data: submissions, isLoading, error } = useRealtimeQuery("contact_submissions", {
    orderBy: "created_at",
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-serif font-bold mb-4 text-vip-black">Contact Submissions</h1>
      <Card className="vip-glass border-vip-gold/20">
        <CardHeader>
          <CardTitle className="text-vip-gold">All Received Messages</CardTitle>
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
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Message</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {(submissions || []).map((submission: any, idx: number) => (
                  <tr key={submission.id} className="border-t border-vip-gold/10">
                    <td className="px-4 py-2">{idx + 1}</td>
                    <td className="px-4 py-2">{submission.name}</td>
                    <td className="px-4 py-2">{submission.email}</td>
                    <td className="px-4 py-2">{submission.subject || "-"}</td>
                    <td className="px-4 py-2 max-w-xs whitespace-pre-wrap">{submission.message}</td>
                    <td className="px-4 py-2">
                      {submission.created_at
                        ? new Date(submission.created_at).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
                {!isLoading && (!submissions || submissions.length === 0) && (
                  <tr>
                    <td colSpan={6} className="text-center text-vip-gold/60 py-8">
                      No messages received yet.
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

export default ContactSubmissions;
