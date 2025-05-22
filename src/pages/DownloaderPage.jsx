import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { useToast } from '@/components/ui/use-toast';
    import { Download, Film, AlertTriangle, Loader2, Link as LinkIcon, CheckCircle } from 'lucide-react';
    import { supabase } from '@/lib/supabaseClient';

    const DownloaderPage = () => {
      const [url, setUrl] = useState('');
      const [videoInfo, setVideoInfo] = useState(null);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
      const { toast } = useToast();

      const API_BASE_URL = 'https://apis.davidcyriltech.my.id/facebook2?url=';

      const isValidFacebookUrl = (testUrl) => {
        // Updated regex to include /share/v/, /reel/, /stories/ and other common FB video URL patterns
        const facebookRegex = /^(https?:\/\/)?(www\.)?(m\.)?(facebook|fb)\.com\/(?:watch\/?\?v=|video\.php\?v=|photo\.php\?v=|story\.php\?story_fbid=|share\/(v|r|s)\/|reel\/|stories\/|[\w.-]+\/(videos|posts|photos|reels|stories|live|watch)\/[\w.-]+|groups\/[\w.-]+\/permalink\/|[\w.-]+\/videos\/pcb.\d+\/|[\w.-]+\/videos\/vb.\d+\/|watch\/live\/\?v=)[\w.-]+(\/)?(\?[\w=&%-]*)?$/i;
        return facebookRegex.test(testUrl);
      };

      const logDownloadAttempt = async (videoUrl) => {
        try {
          const { error: logError } = await supabase
            .from('download_logs')
            .insert([{ url: videoUrl }]);
          if (logError) {
            console.error('Supabase log error:', logError.message);
          }
        } catch (e) {
          console.error('Supabase client-side log error:', e.message);
        }
      };

      const handleFetchVideoInfo = async () => {
        if (!url.trim()) {
          setError('Please paste a Facebook video URL.');
          toast({ title: 'Input Error', description: 'URL field cannot be empty.', variant: 'destructive' });
          return;
        }
        if (!isValidFacebookUrl(url)) {
          setError('Invalid Facebook video URL format. Please check the URL and try again.');
          toast({ title: 'Invalid URL', description: 'The provided URL does not seem to be a valid Facebook video link.', variant: 'destructive' });
          return;
        }

        setIsLoading(true);
        setError(null);
        setVideoInfo(null);
        
        logDownloadAttempt(url);

        try {
          const response = await fetch(`${API_BASE_URL}${encodeURIComponent(url)}`);
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: `HTTP error! Status: ${response.status}` }));
            throw new Error(errorData.message || `Failed to fetch video information. Server responded with ${response.status}`);
          }
          const data = await response.json();

          if (data.status && data.video && data.video.downloads && data.video.downloads.length > 0) {
            setVideoInfo(data.video);
            toast({ title: 'Video Found!', description: 'Download options are now available.', className: "bg-green-600 text-white border-green-700" });
          } else {
            throw new Error(data.message || 'Video not found or no downloadable links available. The video might be private, deleted, or the URL type is not supported by the API.');
          }
        } catch (err) {
          console.error("API Error:", err);
          setError(err.message || 'An unexpected error occurred. Please try again.');
          toast({ title: 'Error', description: err.message || 'Failed to fetch video details.', variant: 'destructive' });
        } finally {
          setIsLoading(false);
        }
      };
      
      const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } },
      };

      const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
      };

      return (
        <motion.div 
          className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="w-full max-w-2xl text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
              <span className="gradient-text">Facebook Video Downloader</span>
            </h1>
            <p className="text-lg text-slate-400">
              Easily download your favorite Facebook videos in HD or SD quality. Just paste the link below!
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full max-w-xl mb-8">
            <Card className="glassmorphism shadow-2xl border-primary/30 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-center gradient-text">
                  <LinkIcon className="mr-2 h-7 w-7" /> Paste Video Link
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="relative">
                  <Input
                    type="url"
                    value={url}
                    onChange={(e) => { setUrl(e.target.value); setError(null); }}
                    placeholder="https://www.facebook.com/watch/?v=1234567890"
                    className="w-full bg-slate-800/60 border-slate-700 text-white input-focus-gradient text-lg py-6 pl-4 pr-12 rounded-xl focus:ring-2 focus:ring-primary"
                    aria-label="Facebook Video URL"
                  />
                  {url && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                      onClick={() => { setUrl(''); setVideoInfo(null); setError(null);}}
                      aria-label="Clear input"
                    >
                      <motion.svg whileHover={{scale:1.2}} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></motion.svg>
                    </Button>
                  )}
                </div>
                <Button 
                  onClick={handleFetchVideoInfo} 
                  className="w-full btn-cyber text-xl py-6 rounded-xl" 
                  disabled={isLoading}
                  aria-live="polite"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-6 w-6" /> Get Video
                    </>
                  )}
                </Button>
                {error && (
                  <motion.p 
                    initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
                    className="text-red-400 text-sm flex items-center justify-center bg-red-900/30 p-3 rounded-md border border-red-700"
                  >
                    <AlertTriangle className="mr-2 h-5 w-5" /> {error}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {videoInfo && (
            <motion.div 
              variants={itemVariants} 
              className="w-full max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glassmorphism shadow-2xl border-secondary/30 overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl flex items-center gradient-text">
                    <Film className="mr-3 h-8 w-8" /> Video Details
                  </CardTitle>
                  <CardDescription className="text-slate-400 pt-1">
                    {videoInfo.title || 'Untitled Video'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {videoInfo.thumbnail && (
                    <div className="aspect-video rounded-lg overflow-hidden border-2 border-slate-700 shadow-md">
                      <img 
                        src={videoInfo.thumbnail} 
                        alt={videoInfo.title || 'Video thumbnail'} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-slate-200">Download Options:</h3>
                    {videoInfo.downloads.map((download, index) => (
                      <motion.a
                        key={index}
                        href={download.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="flex items-center justify-between w-full btn-cyber bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 hover:from-green-600 hover:via-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
                        whileHover={{boxShadow: "0px 0px 15px rgba(var(--primary-rgb), 0.5)"}}
                      >
                        <span className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Download {download.quality.toUpperCase()}
                        </span>
                        <Download className="h-5 w-5" />
                      </motion.a>
                    ))}
                  </div>
                  {videoInfo.creator && (
                    <p className="text-xs text-center text-slate-500 pt-2">
                      API Creator: {videoInfo.creator}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      );
    };

    export default DownloaderPage;