import React, { useState, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import DownloaderForm from '@/components/DownloaderForm.jsx';
import DownloadedVideoCard from '@/components/DownloadedVideoCard.jsx';
import RecentDownloadsList from '@/components/RecentDownloadsList.jsx';
import { isValidHttpUrl, triggerFileDownload } from '@/lib/downloadUtils.js'; 

const RECENT_DOWNLOADS_TABLE = 'recent_facebook_downloads';
const API_BASE_URL = 'https://api-aswin-sparky.koyeb.app/api/downloader/fbdl?url=';
const WHATSAPP_CONTACT_NUMBER = '+233557488116';

function App() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [downloadedVideo, setDownloadedVideo] = useState(null);
  const [downloadError, setDownloadError] = useState(null);
  const [recentDownloads, setRecentDownloads] = useState([]);

  const logVisitor = useCallback(async () => {
    try {
      const { error } = await supabase.from('visitor_logs').insert([{ 
        visited_at: new Date().toISOString(),
        user_agent: navigator.userAgent 
      }]);
      if (error) console.warn('Error logging visitor:', error.message);
    } catch (error) {
      console.warn('Error logging visitor:', error.message);
    }
  }, []);

  const fetchRecentDownloads = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from(RECENT_DOWNLOADS_TABLE)
        .select('*')
        .order('downloaded_at', { ascending: false })
        .limit(10);
      if (error) throw error;
      setRecentDownloads(data || []);
    } catch (error) {
      console.error('Error fetching recent downloads:', error.message);
      toast({
        title: "Error Fetching History",
        description: "Could not load your download history.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    logVisitor();
    fetchRecentDownloads();
  }, [logVisitor, fetchRecentDownloads]);

  const saveToSupabase = async (videoData) => {
    try {
      const { data: insertedData, error } = await supabase.from(RECENT_DOWNLOADS_TABLE).insert([
        {
          title: videoData.title,
          thumbnail: videoData.thumbnail, 
          low_quality_url: videoData.low,
          high_quality_url: videoData.high,
          original_url: videoData.originalUrl,
          downloaded_at: new Date().toISOString(),
        },
      ]).select();

      if (error) {
        throw error;
      }
      
      toast({
        title: "💾 Saved to Cloud",
        description: "Download details saved to your history.",
      });
      if (insertedData && insertedData.length > 0) {
        setRecentDownloads(prev => [insertedData[0], ...prev.slice(0, 9)]);
      } else {
        fetchRecentDownloads();
      }

    } catch (error) {
      console.error('Error saving to Supabase:', error.message);
      toast({
        title: "❌ Cloud Save Failed",
        description: `Could not save to history: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (urlToDownload) => {
    setIsLoading(true);
    setDownloadedVideo(null);
    setDownloadError(null);

    try {
      const response = await fetch(`${API_BASE_URL}${encodeURIComponent(urlToDownload)}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Network error or invalid JSON response" }));
        throw new Error(errorData.message || `API request failed: ${response.status}`);
      }
      const data = await response.json();

      if (data.status && data.data && data.data.low && data.data.high) {
        const videoDetails = { 
          ...data.data, 
          originalUrl: urlToDownload,
          thumbnail: data.data.thumbnail
        };
        
        setDownloadedVideo(videoDetails);
        toast({
          title: "🎉 Video Ready!",
          description: `${(videoDetails.title || 'Your video').substring(0,50)}... is ready for download.`,
        });
        await saveToSupabase(videoDetails);
      } else {
        throw new Error(data.message || 'Invalid API response format.');
      }
    } catch (error) {
      console.error('Download error:', error);
      const errorMessage = error.message || "An unknown error occurred.";
      setDownloadError(errorMessage);
      toast({
        title: "❌ Download Failed",
        description: (
          <div>
            <p>{errorMessage}</p>
            <button 
              className="p-0 h-auto text-cyan-400 hover:text-cyan-300 mt-2 bg-transparent border-none underline"
              onClick={() => window.open(`https://wa.me/${WHATSAPP_CONTACT_NUMBER}?text=${encodeURIComponent(`Hi, I had an issue downloading a video from URL: ${urlToDownload}. Error: ${errorMessage}`)}`, '_blank')}
            >
              Contact Support on WhatsApp
            </button>
          </div>
        ),
        variant: "destructive",
        duration: 10000, 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearRecentDownloads = async () => {
    try {
      const { error } = await supabase
        .from(RECENT_DOWNLOADS_TABLE)
        .delete()
        .neq('id', -1); 

      if (error) throw error;
      setRecentDownloads([]);
      toast({
        title: "🗑️ History Cleared!",
        description: "Your download history has been removed.",
      });
    } catch (error) {
      console.error('Error clearing recent downloads:', error.message);
      toast({
        title: "DB Clear Error",
        description: `Could not clear history: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>HackerPro FB Downloader | Ocean Edition</title>
        <meta name="description" content="The ultimate Facebook video downloader with a stunning ocean theme. Download your favorite videos in HD, brought to you by HackerPro." />
      </Helmet>
      <div className="min-h-screen ocean-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className={`fish fish-${i + 1}`}>{['🐠','🐟','🐡','🦈','🐙'][i % 5]}</div>
        ))}
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`bubble bubble-${i + 1}`}></div>
        ))}

        <main className="z-10 text-center glass-card p-6 sm:p-10 rounded-2xl shadow-2xl max-w-xl w-full pulse-glow">
          <img-replace  
            alt="HackerPro Logo - Stylized H and P" 
            class="w-28 h-28 mx-auto mb-6 rounded-full border-4 border-cyan-400 neon-glow object-cover" 
           />
          <h1 className="text-4xl sm:text-5xl font-black orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 mb-3">
            HackerPro Downloader
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Dive in and grab your Facebook videos! 🌊
          </p>
          
          <DownloaderForm 
            onDownload={handleDownload}
            isLoading={isLoading}
          />

          {downloadedVideo && (
            <DownloadedVideoCard 
              video={downloadedVideo} 
              onTriggerDownload={triggerFileDownload} 
            />
          )}
          
          {downloadError && !downloadedVideo && (
             <div
              className="mt-6 p-3 bg-red-900/30 border border-red-700/50 rounded-lg text-red-300 text-sm flex items-center justify-center gap-2"
            >
              <span>Download failed. Try again or contact support.</span>
            </div>
          )}
        </main>

        <RecentDownloadsList
          recentDownloads={recentDownloads}
          onClearRecentDownloads={clearRecentDownloads}
          onTriggerDownload={triggerFileDownload}
        />

        <footer className="z-10 mt-12 text-center text-slate-300/80">
          <p className="text-sm">
            Crafted with <span role="img" aria-label="love">💙</span> by HackerPro
          </p>
          <p className="text-xs mt-1">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </p>
        </footer>
      </div>
      <Toaster />
    </>
  );
}

export default App;