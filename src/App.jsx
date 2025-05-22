import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    import { AnimatePresence } from 'framer-motion';
    import { Toaster } from '@/components/ui/toaster';
    
    import Navbar from '@/components/layout/Navbar';
    import Footer from '@/components/layout/Footer';
    import DownloaderPage from '@/pages/DownloaderPage';
    
    const App = () => {
      return (
        <Router>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 text-slate-100">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<DownloaderPage />} />
                  <Route path="*" element={<DownloaderPage />} /> {/* Fallback to downloader page */}
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
            <Toaster />
          </div>
        </Router>
      );
    };

    export default App;