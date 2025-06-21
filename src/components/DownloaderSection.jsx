import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import ReactPlayer from 'react-player/lazy';
import { Download, Upload, Trash2, Fish, Eye, EyeOff, Link as LinkIcon } from 'lucide-react';

const DownloaderSection = ({ onDownloadSuccess, recentDownloadsTable }) => {
  const [urls, setUrls] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (urls[0].trim() && ReactPlayer.canPlay(urls[0].trim())) {
      setVideoPreviewUrl(urls[0].trim());
    } else {
      setVideoPreviewUrl('');
    }
  }, [urls[0]]);

  const addUrlField = () => {
    setUrls([...urls, '']);
    setVideoPreviewUrl('');
    setShowPreview(false);
    setIsPlayerReady(false);
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
    if (index === 0 && urls.length === 1) {
      setVideoPreviewUrl('');
      setShowPreview(false);
      setIsPlayerReady(false);
    }
  };

  const updateUrl = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
    if (index === 0) {
      const trimmedValue = value.trim();
      if (trimmedValue && ReactPlayer.canPlay(trimmedValue)) {
        setVideoPreviewUrl(trimmedValue);
        setShowPreview(!!trimmedValue);
      } else {
        setVideoPreviewUrl('');
        setShowPreview(false);
      }
      setIsPlayerReady(false); 
    }
  };

  const togglePreview = () => {
    if (urls[0].trim()) {
      if (ReactPlayer.canPlay(urls[0].trim())) {
        setShowPreview(prev => !prev);
      } else {
        toast({ title: "Unsupported URL", description: "This URL might not be directly playable for preview. Try downloading.", variant: "destructive" });
        setShowPreview(false);
      }
    } else {
      toast({ title: "No URL", description: "Please enter a URL to preview.", variant: "destructive" });
    }
  };

  const saveToRecentSupabase = async (downloadData) => {
    try {
      const { error: insertError } = await supabase
        .from(recentDownloadsTable)
        .insert([
          {
            title: downloadData.title,
            thumbnail: downloadData.thumbnail,
            low_quality_url: downloadData.lowQuality,
            high_quality_url: downloadData.highQuality,
            downloaded_at: downloadData.downloadedAt,
            original_url: downloadData.originalUrl,
          },
        ]);

      if (insertError) throw insertError;
      onDownloadSuccess();
    } catch (error) {
      console.error('Error saving download to Supabase:', error.message);
      toast({
        title: "DB Save Error 💾",
        description: `Failed to save download history: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const downloadVideo = async (url, index = 0) => {
    if (!url.trim()) {
      toast({
        title: "⚠️ URL Required",
        description: "Please enter a Facebook video URL to download.",
        variant: "destructive"
      });
      return null;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=${encodeURIComponent(url)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network error or invalid JSON response" }));
        throw new Error(errorData.message || `API request failed with status ${response.status}`);
      }
      const data = await response.json();

      if (data.status && data.data && data.data.low && data.data.high) {
        const downloadData = {
          title: data.data.title || 'Untitled Video',
          thumbnail: data.data.thumbnail || `https://images.unsplash.com/photo-1611162616805-6a4093048d6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlkZW8lMjBwbGFjZWhvbGRlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60`, // Default thumbnail
          lowQuality: data.data.low,
          highQuality: data.data.high,
          downloadedAt: new Date().toISOString(),
          originalUrl: url
        };

        await saveToRecentSupabase(downloadData);

        toast({
          title: "🎉 Download Ready!",
          description: `${downloadData.title.substring(0, 50)}...`,
        });
        return downloadData;
      } else {
        throw new Error(data.message || 'Invalid or incomplete data from API');
      }
    } catch (error) {
      console.error('Download error:', error.message);
      toast({
        title: "❌ Download Failed",
        description: `Unable to process URL. ${error.message}`,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDownload = async () => {
    const validUrls = urls.filter(url => url.trim());
    if (validUrls.length === 0) {
      toast({ title: "⚠️ No URLs Found", description: "Please add at least one Facebook video URL.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    let successCount = 0;
    for (let i = 0; i < validUrls.length; i++) {
      const result = await downloadVideo(validUrls[i], i);
      if (result) successCount++;
      if (i < validUrls.length - 1) await new Promise(resolve => setTimeout(resolve, 1000));
    }
    toast({ title: `🚀 Batch Download Complete!`, description: `Successfully processed ${successCount} out of ${validUrls.length} videos.` });
    setIsLoading(false);
    setUrls(['']); // Reset to one empty field
    setShowPreview(false);
    setVideoPreviewUrl('');
    setIsPlayerReady(false);
  };

  const handleSingleDownload = () => {
    downloadVideo(urls[0]);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-3"
    >
      <div className="glass-card rounded-2xl p-6 sm:p-8 pulse-glow">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center gap-3">
          <LinkIcon className="w-6 h-6" />
          Video Downloader
        </h2>

        <div className="space-y-4 mb-6">
          {urls.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="url"
                placeholder="Paste Facebook video URL here..."
                value={url}
                onChange={(e) => updateUrl(index, e.target.value)}
                className="flex-1 px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
              />
              {urls.length > 1 && (
                <Button
                  onClick={() => removeUrlField(index)}
                  variant="outline"
                  size="icon"
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 self-end sm:self-center"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>

        {videoPreviewUrl && urls.length === 1 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: showPreview ? 1 : 0, height: showPreview ? 'auto' : 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className={`aspect-video bg-black rounded-lg overflow-hidden border border-cyan-500/30 transition-opacity duration-300 ${isPlayerReady ? 'opacity-100' : 'opacity-70'}`}>
              {showPreview && (
                <ReactPlayer
                  url={videoPreviewUrl}
                  playing={false}
                  controls
                  width="100%"
                  height="100%"
                  onReady={() => setIsPlayerReady(true)}
                  onError={(e) => {
                    console.warn("ReactPlayer Error:", e, "URL:", videoPreviewUrl);
                    toast({ title: "Preview Error", description: "Could not load video preview. The URL might be invalid, private, or unsupported for direct playback.", variant: "destructive"});
                    setShowPreview(false);
                    setIsPlayerReady(false);
                  }}
                  config={{
                    facebook: {
                      appId: '12345' // Dummy App ID, may help sometimes
                    }
                  }}
                />
              )}
            </div>
            {!isPlayerReady && showPreview && (
              <p className="text-xs text-center text-slate-400 mt-2">Loading preview... If it takes too long, the video might not be playable here.</p>
            )}
          </motion.div>
        )}

        <div className="flex flex-wrap gap-3 sm:gap-4">
          <Button
            onClick={addUrlField}
            variant="outline"
            className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add URL
          </Button>

          <Button
            onClick={urls.length === 1 ? handleSingleDownload : handleBatchDownload}
            disabled={isLoading || urls.every(u => !u.trim())}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold px-6"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                <Fish className="w-4 h-4" />
              </motion.div>
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Processing...' : urls.length === 1 ? 'Download Video' : 'Batch Download'}
          </Button>
          {urls.length === 1 && urls[0].trim() && (
            <Button
              onClick={togglePreview}
              variant="outline"
              className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
            >
              {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DownloaderSection;