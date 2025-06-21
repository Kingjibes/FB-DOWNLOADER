import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="text-center mt-12 py-6 text-slate-400 border-t border-slate-700/50"
    >
      <p className="text-sm">
        Made with 💙 by HackerPro | Powered by Ocean Technology 🌊 & Supabase
      </p>
      <p className="text-xs mt-1">
        &copy; {new Date().getFullYear()} HackerPro Downloader. All Rights Reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;