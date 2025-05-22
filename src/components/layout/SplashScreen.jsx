import React from 'react';
    import { motion } from 'framer-motion';

    const SplashScreen = () => {
      return (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 3.5 }} /* Show for 3.5s, fade out for 0.5s */
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, hsl(var(--background)), hsl(var(--primary) / 0.3))',
            zIndex: 9999,
          }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 15,
              duration: 1.5,
              delay: 0.2,
            }}
          >
            <img-replace src="/h-logo.svg" alt="HackerPro Loader Logo" class="w-32 h-32 md:w-48 md:w-48" />Animated H logo for splash screen
          </motion.div>
        </motion.div>
      );
    };

    export default SplashScreen;