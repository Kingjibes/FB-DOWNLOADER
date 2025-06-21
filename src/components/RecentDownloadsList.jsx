import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink, Trash2, Fish, Database } from 'lucide-react';

const RecentDownloadsList = ({ recentDownloads, onClearRecentDownloads, onTriggerDownload }) => {
  
  const cleanFileName = (title) => (title || 'video').replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);

  return (
    <section className="z-10 mt-10 w-full max-w-xl">
      <div className="glass-card rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-2xl font-bold text-cyan-300 flex items-center gap-3 drop-shadow-md">
            <Database className="w-6 h-6" />
            Download History
          </h3>
          {recentDownloads.length > 0 && (
            <Button
              onClick={onClearRecentDownloads}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/20 hover:text-red-300 px-3 py-1 rounded-lg transition-colors duration-300"
            >
              <Trash2 className="w-4 h-4 mr-1.5 sm:mr-2" /> Clear
            </Button>
          )}
        </div>
        <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence>
            {recentDownloads.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8 text-slate-400"
              >
                <Fish className="w-12 h-12 mx-auto mb-3 opacity-60" />
                <p className="text-sm">Your download history is currently empty.</p>
                <p className="text-xs mt-1">Downloaded videos will appear here.</p>
              </motion.div>
            ) : (
              recentDownloads.map((download) => (
                <motion.div
                  key={download.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                  className="download-item bg-slate-800/50 rounded-xl p-4 text-left shadow-lg border border-slate-700"
                >
                  <p 
                    className="text-base font-medium text-slate-100 truncate mb-2" 
                    title={download.title || 'Untitled Video'}
                  >
                    {download.title || 'Untitled Video'}
                  </p>
                  <p 
                    className="text-xs text-slate-400 mb-3 whitespace-pre-wrap break-words custom-scrollbar" 
                    style={{ maxHeight: '60px', overflowY: 'auto' }}
                    title={`Original URL: ${download.original_url || "N/A"}`}
                  >
                    {download.original_url ? `Source: ${new URL(download.original_url).hostname}` : "Source: N/A"}
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      onClick={() => onTriggerDownload(download.low_quality_url, `${cleanFileName(download.title)}_low.mp4`)}
                      size="sm"
                      variant="outline"
                      className="text-xs border-cyan-600 text-cyan-300 hover:bg-cyan-500/25 hover:border-cyan-400 px-3 py-1.5 rounded-md transition-all duration-300"
                      disabled={!download.low_quality_url}
                    >
                      <Play className="w-3.5 h-3.5 mr-1.5" />SD
                    </Button>
                    <Button
                      onClick={() => onTriggerDownload(download.high_quality_url, `${cleanFileName(download.title)}_high.mp4`)}
                      size="sm"
                      className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-1.5 rounded-md transition-all duration-300 shadow-md hover:shadow-pink-500/30"
                      disabled={!download.high_quality_url}
                    >
                      <ExternalLink className="w-3.5 h-3.5 mr-1.5" />HD
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default RecentDownloadsList;