
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Database, Activity, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface TableStatus {
  name: string;
  connected: boolean;
  count: number;
  error?: string;
}

const SupabaseConnectionTest = () => {
  const [tableStatuses, setTableStatuses] = useState<TableStatus[]>([]);
  const [testing, setTesting] = useState(false);
  const [lastTest, setLastTest] = useState<Date | null>(null);

  const tableNames = [
    'contact_submissions',
    'meeting_requests',
    'career_applications',
    'clients',
    'staff_members',
    'inventory_items',
    'job_postings',
    'newsletter_subscriptions'
  ];

  const testConnections = async () => {
    setTesting(true);
    const results: TableStatus[] = [];

    console.log('🧪 Starting Supabase connection tests...');

    for (const tableName of tableNames) {
      try {
        console.log(`Testing ${tableName}...`);
        
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        if (error) {
          console.error(`❌ ${tableName} failed:`, error);
          results.push({
            name: tableName,
            connected: false,
            count: 0,
            error: error.message
          });
        } else {
          console.log(`✅ ${tableName} connected, count: ${count}`);
          results.push({
            name: tableName,
            connected: true,
            count: count || 0
          });
        }
      } catch (err) {
        console.error(`💥 ${tableName} exception:`, err);
        results.push({
          name: tableName,
          connected: false,
          count: 0,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    }

    setTableStatuses(results);
    setLastTest(new Date());
    setTesting(false);
    
    console.log('🧪 Connection tests completed:', results);
  };

  useEffect(() => {
    testConnections();
  }, []);

  const allConnected = tableStatuses.every(status => status.connected);
  const totalRecords = tableStatuses.reduce((sum, status) => sum + status.count, 0);

  return (
    <Card className="bg-black border-vip-gold/30 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-vip-gold flex items-center justify-between">
          <div className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Supabase Connection Test
          </div>
          <Button
            onClick={testConnections}
            disabled={testing}
            variant="outline"
            size="sm"
            className="text-vip-gold border-vip-gold/30 hover:bg-vip-gold/10"
          >
            {testing ? (
              <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            ) : (
              <Activity className="h-3 w-3 mr-1" />
            )}
            {testing ? 'Testing...' : 'Test Again'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Status */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50">
          <div className="flex items-center">
            {allConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <span className="font-medium text-vip-gold">
              Overall Status: {allConnected ? 'All Connected' : 'Issues Detected'}
            </span>
          </div>
          <Badge variant="outline" className="text-vip-gold border-vip-gold/30">
            {totalRecords} Total Records
          </Badge>
        </div>

        {/* Individual Table Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tableStatuses.map((status) => (
            <div
              key={status.name}
              className={`p-3 rounded-lg border ${
                status.connected
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-red-900/20 border-red-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {status.connected ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="font-medium text-sm text-vip-gold capitalize">
                    {status.name.replace('_', ' ')}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    status.connected
                      ? 'text-green-400 border-green-400/30'
                      : 'text-red-400 border-red-400/30'
                  }`}
                >
                  {status.connected ? `${status.count} records` : 'Failed'}
                </Badge>
              </div>
              {status.error && (
                <p className="text-xs text-red-400 mt-1 font-mono">
                  {status.error}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Test Info */}
        {lastTest && (
          <div className="text-xs text-vip-gold/60 text-center">
            Last tested: {lastTest.toLocaleTimeString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SupabaseConnectionTest;
