import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Download, Fish, Link as LinkIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const DownloaderForm = ({ onDownload, isLoading }) => {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({
        title: "⚠️ URL Required",
        description: "Please paste a Facebook video URL.",
        variant: "destructive",
      });
      return;
    }
    onDownload(url);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative group">
        <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-cyan-400/70 group-focus-within:text-cyan-300 transition-colors duration-300" />
        <input
          type="url"
          placeholder="Paste Facebook video URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-slate-800/70 border-2 border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all duration-300 shadow-md focus:shadow-cyan-500/30"
          aria-label="Facebook video URL input"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit"
        className="w-full bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-600 hover:via-blue-700 hover:to-purple-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105 active:scale-95"
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 mr-3"
          >
            <Fish className="w-full h-full animate-pulse" />
          </motion.div>
        ) : (
          <Download className="mr-3 h-6 w-6" />
        )}
        {isLoading ? 'Processing Deep Dive...' : 'Grab Video'}
      </Button>
    </form>
  );
};

export default DownloaderForm;