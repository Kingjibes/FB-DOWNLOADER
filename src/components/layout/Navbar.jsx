import React from 'react';
    import { Link } from 'react-router-dom';
    import { Facebook, DownloadCloud } from 'lucide-react';

    const Navbar = () => (
      <nav className="sticky top-0 z-50 w-full glassmorphism shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link to="/" className="flex items-center">
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold gradient-text">
                  HACKERPRO'S FACEBOOK DOWNLOADER
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 hidden md:block">Your one-click solution for Facebook videos!</p>
              </div>
            </Link>
            <div className="flex items-center space-x-2">
                <Facebook className="h-6 w-6 text-blue-500" />
                <DownloadCloud className="h-6 w-6 text-primary" />
                <p className="text-xs text-slate-500 hidden sm:block">Made by HACKERPRO</p>
            </div>
          </div>
           <p className="text-xs sm:text-sm text-slate-400 text-center pb-2 md:hidden">Your one-click solution for Facebook videos!</p>
        </div>
      </nav>
    );

    export default Navbar;