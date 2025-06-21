import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { Users, DownloadCloud, BarChart3, CalendarDays, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

const AdminDashboard = () => {
  const [visitorStats, setVisitorStats] = useState({ weekly: 0, monthly: 0, total: 0 });
  const [downloadStats, setDownloadStats] = useState({ weekly: 0, monthly: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString();

      const { count: totalVisitors, error: visitorError } = await supabase
        .from('visitor_logs')
        .select('*', { count: 'exact', head: true });
      if (visitorError) throw new Error(`Visitor Stats Error: ${visitorError.message}`);

      const { count: weeklyVisitors, error: weeklyVisitorError } = await supabase
        .from('visitor_logs')
        .select('*', { count: 'exact', head: true })
        .gte('visited_at', oneWeekAgo);
      if (weeklyVisitorError) throw new Error(`Weekly Visitor Stats Error: ${weeklyVisitorError.message}`);
      
      const { count: monthlyVisitors, error: monthlyVisitorError } = await supabase
        .from('visitor_logs')
        .select('*', { count: 'exact', head: true })
        .gte('visited_at', oneMonthAgo);
      if (monthlyVisitorError) throw new Error(`Monthly Visitor Stats Error: ${monthlyVisitorError.message}`);

      setVisitorStats({ weekly: weeklyVisitors || 0, monthly: monthlyVisitors || 0, total: totalVisitors || 0 });

      const { count: totalDownloads, error: downloadError } = await supabase
        .from('recent_facebook_downloads')
        .select('*', { count: 'exact', head: true });
      if (downloadError) throw new Error(`Download Stats Error: ${downloadError.message}`);

      const { count: weeklyDownloads, error: weeklyDownloadError } = await supabase
        .from('recent_facebook_downloads')
        .select('*', { count: 'exact', head: true })
        .gte('downloaded_at', oneWeekAgo);
      if (weeklyDownloadError) throw new Error(`Weekly Download Stats Error: ${weeklyDownloadError.message}`);

      const { count: monthlyDownloads, error: monthlyDownloadError } = await supabase
        .from('recent_facebook_downloads')
        .select('*', { count: 'exact', head: true })
        .gte('downloaded_at', oneMonthAgo);
      if (monthlyDownloadError) throw new Error(`Monthly Download Stats Error: ${monthlyDownloadError.message}`);

      setDownloadStats({ weekly: weeklyDownloads || 0, monthly: monthlyDownloads || 0, total: totalDownloads || 0 });

    } catch (err) {
      console.error("Error fetching admin stats:", err.message);
      setError(err.message);
      toast({
        title: "📊 Stats Error",
        description: `Could not load dashboard statistics. ${err.message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const StatCard = ({ title, weekly, monthly, total, icon, color }) => (
    <motion.div 
      className="glass-card rounded-xl p-6 flex flex-col justify-between min-h-[180px]"
      whileHover={{ y: -5, boxShadow: `0 10px 20px ${color}33`}}
    >
      <div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-gradient-to-br ${color}`}>
          {React.cloneElement(icon, { className: "w-6 h-6 text-white" })}
        </div>
        <h3 className="text-xl font-semibold text-cyan-300 mb-2">{title}</h3>
      </div>
      <div className="space-y-1 mt-auto">
        <p className="text-sm text-slate-300 flex justify-between">
          <span>Weekly:</span> <span className="font-bold text-white">{isLoading ? '...' : weekly}</span>
        </p>
        <p className="text-sm text-slate-300 flex justify-between">
          <span>Monthly:</span> <span className="font-bold text-white">{isLoading ? '...' : monthly}</span>
        </p>
        <p className="text-sm text-slate-300 flex justify-between">
          <span>Total:</span> <span className="font-bold text-white">{isLoading ? '...' : total}</span>
        </p>
      </div>
    </motion.div>
  );

  if (error) {
    return (
       <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-8 text-center"
      >
        <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-400" />
        <h2 className="text-2xl font-bold text-red-400 mb-2">Error Loading Dashboard</h2>
        <p className="text-slate-300 mb-4">{error}</p>
        <Button onClick={fetchStats} disabled={isLoading}>
          {isLoading ? 'Retrying...' : 'Retry'}
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-8"
    >
      <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 mb-10 orbitron">
        Admin Dashboard
      </h2>
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        <StatCard 
          title="Site Visitors" 
          weekly={visitorStats.weekly} 
          monthly={visitorStats.monthly} 
          total={visitorStats.total}
          icon={<Users />}
          color="from-blue-500 to-cyan-400"
        />
        <StatCard 
          title="Videos Downloaded" 
          weekly={downloadStats.weekly} 
          monthly={downloadStats.monthly} 
          total={downloadStats.total}
          icon={<DownloadCloud />}
          color="from-green-500 to-teal-400"
        />
      </div>
      <div className="mt-8 glass-card rounded-xl p-6">
        <h3 className="text-xl font-semibold text-cyan-300 mb-4 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-yellow-400"/>
          Activity Overview
        </h3>
        <p className="text-slate-400">
          {isLoading ? "Loading detailed analytics..." : "This section summarizes your site's performance. Monitor these numbers for user engagement insights. More detailed reports and charts can be added in future updates."}
        </p>
        <div className="mt-4 flex items-center text-sm text-slate-500">
          <CalendarDays className="w-4 h-4 mr-2"/>
          Last updated: {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;