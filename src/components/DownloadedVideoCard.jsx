import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, ExternalLink } from 'lucide-react';

const DownloadedVideoCard = ({ video, onTriggerDownload }) => {
  if (!video) return null;

  const cleanFileName = (title) => (title || 'video').replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 p-5 sm:p-6 bg-slate-800/60 border border-slate-700 rounded-xl shadow-xl text-left"
    >
      <h3 className="text-xl font-semibold text-cyan-300 mb-3 drop-shadow-md">
        Video Ready:
      </h3>
      <p 
        className="text-slate-200 mb-5 text-sm whitespace-pre-wrap break-words custom-scrollbar" 
        style={{ maxHeight: '120px', overflowY: 'auto' }}
        title={video.title || "No description available."}
      >
        {video.title || "No description available."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
          <Button
            onClick={() => onTriggerDownload(video.low, `${cleanFileName(video.title)}_low.mp4`)}
            variant="outline"
            className="flex-1 text-cyan-400 border-cyan-600 hover:bg-cyan-500/20 hover:border-cyan-400 py-3 rounded-lg transition-all duration-300 shadow-sm hover:shadow-cyan-500/30"
            disabled={!video.low}
          >
            <Play className="mr-2 h-5 w-5" /> Download SD
          </Button>
          <Button
            onClick={() => onTriggerDownload(video.high, `${cleanFileName(video.title)}_high.mp4`)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-pink-500/40"
            disabled={!video.high}
          >
            <ExternalLink className="mr-2 h-5 w-5" /> Download HD
          </Button>
      </div>
    </motion.div>
  );
};

export default DownloadedVideoCard;