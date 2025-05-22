import React from 'react';
    import { motion } from 'framer-motion';

    const Footer = () => (
      <footer className="bg-slate-900/50 text-slate-400 py-8 border-t-2 border-primary/20 mt-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <img-replace src="/h-logo.svg" alt="HackerPro Logo" class="h-10 w-10 mx-auto mb-2" />HackerPro Logo small version
            <p className="text-sm font-semibold gradient-text">HACKERPRO'S FACEBOOK DOWNLOADER</p>
          </motion.div>
          <motion.p 
            className="text-xs text-slate-500 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            This website is an independent tool and is not affiliated with, endorsed by, or in any way officially connected with Facebook or its parent company Meta Platforms, Inc.
          </motion.p>
          <motion.p 
            className="text-xs text-slate-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            &copy; {new Date().getFullYear()} HACKERPRO'S FACEBOOK DOWNLOADER. All Rights Reserved.
          </motion.p>
        </div>
      </footer>
    );

    export default Footer;