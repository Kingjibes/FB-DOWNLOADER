import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Play, ExternalLink, Trash2, Fish, Database, ImageOff } from 'lucide-react';

const RecentDownloadsSection = ({ recentDownloads, onClearRecent, recentDownloadsTable }) => {
  const { toast } = useToast();

  const clearRecentSupabase = async () => {
    try {
      const { error } = await supabase
        .from(recentDownloadsTable)
        .delete()
        .neq('id', -1); 

      if (error) throw error;
      onClearRecent(); 
      toast({
        title: "🗑️ Recent downloads cleared!",
        description: "All download history has been removed from the cloud.",
      });
    } catch (error) {
      console.error('Error clearing recent downloads from Supabase:', error.message);
      toast({
        title: "DB Clear Error 💥",
        description: `Could not clear download history: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  const downloadFile = (url, filename) => {
    if (!url) {
      toast({ title: "Download Error", description: "No valid URL found for this download.", variant: "destructive" });
      return;
    }
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
       toast({ title: "Download Error", description: "Could not initiate download.", variant: "destructive" });
       console.error("Download initiation error:", e);
    }
  };

  const isValidHttpUrl = (string) => {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-2"
    >
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
            <Database className="w-5 h-5" />
            Recent Downloads
          </h3>
          {recentDownloads.length > 0 && (
            <Button
              onClick={clearRecentSupabase}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-3 max-h-[calc(100vh-20rem)] overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence>
            {recentDownloads.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-slate-400"
              >
                <Fish className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No cloud downloads yet</p>
                <p className="text-sm">Your recent downloads will appear here</p>
              </motion.div>
            ) : (
              recentDownloads.map((download) => {
                const thumbnailSrc = download.thumbnail && isValidHttpUrl(download.thumbnail) 
                  ? download.thumbnail 
                  : `https://images.unsplash.com/photo-1611162616805-6a4093048d6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBwbGFjZWhvbGRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60`;
                
                return (
                  <motion.div
                    key={download.id || download.originalUrl} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="download-item glass-card rounded-lg p-3 sm:p-4"
                  >
                    <div className="flex gap-3">
                      {isValidHttpUrl(thumbnailSrc) ? (
                        <img
                          src={thumbnailSrc}
                          alt="Video thumbnail"
                          className="w-16 h-16 rounded-lg object-cover border border-cyan-500/20 shrink-0"
                          onError={(e) => { 
                            e.target.onerror = null; // prevents infinite loop if placeholder also fails
                            e.target.src = `https://images.unsplash.com/photo-1611162616805-6a4093048d6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBwbGFjZWhvbGRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60`;
                            e.target.alt = "Thumbnail unavailable";
                          }}
                        />
                      ) : (
                         <div className="w-16 h-16 rounded-lg border border-cyan-500/20 shrink-0 flex items-center justify-center bg-slate-700">
                           <ImageOff className="w-8 h-8 text-slate-500" />
                         </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate mb-1 sm:mb-2" title={download.title || 'Untitled Video'}>
                          {download.title || 'Untitled Video'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => downloadFile(download.low_quality_url, `${(download.title || 'video').replace(/[^a-zA-Z0-9._-]/g, '_')}_low.mp4`)}
                            size="sm"
                            variant="outline"
                            className="text-xs border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                            disabled={!download.low_quality_url}
                          >
                            <Play className="w-3 h-3 mr-1" />
                            Low
                          </Button>
                          <Button
                            onClick={() => downloadFile(download.high_quality_url, `${(download.title || 'video').replace(/[^a-zA-Z0-9._-]/g, '_')}_high.mp4`)}
                            size="sm"
                            className="text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                            disabled={!download.high_quality_url}
                          >
                            <ExternalLink className="w-3 h-3 mr-1" />
                            HD
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
            })
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default RecentDownloadsSection;