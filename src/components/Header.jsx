import React from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ profilePicUrl, userEmail, isAdmin, onAuth, onToggleDashboard, showAdminDashboard }) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <div className="flex items-center justify-center gap-4 mb-6 sm:mb-0">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full glass-card neon-glow flex items-center justify-center p-1">
            {profilePicUrl ? (
              <img src={profilePicUrl} alt="User profile picture" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-cyan-400" />
            )}
          </div>
          <div>
            <h1 className="text-4xl sm:text-5xl font-black orbitron text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              HackerPro
            </h1>
            <p className="text-cyan-300 text-md sm:text-lg font-medium">Facebook Video Downloader</p>
            {userEmail && <p className="text-xs text-slate-400">{userEmail}</p>}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAuth} variant="outline" className="text-cyan-300 border-cyan-500/50 hover:bg-cyan-500/20">
            {userEmail ? <LogOut className="mr-2 h-4 w-4" /> : <LogIn className="mr-2 h-4 w-4" />}
            {userEmail ? 'Sign Out' : 'Sign In'}
          </Button>
          {isAdmin && (
            <Button onClick={onToggleDashboard} variant="outline" className="text-purple-300 border-purple-500/50 hover:bg-purple-500/20">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              {showAdminDashboard ? "Hide Dashboard" : "Show Dashboard"}
            </Button>
          )}
        </div>
      </div>
      {!showAdminDashboard && (
         <p className="text-blue-200 text-lg text-center max-w-2xl mx-auto mt-6">
          Download Facebook videos in high quality with our advanced ocean-powered downloader! 🌊
        </p>
      )}
    </motion.header>
  );
};

export default Header;