import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const SplashBg = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(135deg, #232526 0%, #43cea2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const AppName = styled(motion.h1)`
  font-size: 3.5rem;
  font-weight: 900;
  letter-spacing: 2px;
  color: #fff;
  margin-bottom: 1.2rem;
  text-shadow: 0 8px 32px rgba(67,206,162,0.18);
  background: linear-gradient(90deg, #7b2ff2 0%, #43cea2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 2.5s linear infinite;
`;

const Tagline = styled(motion.div)`
  font-size: 1.3rem;
  color: #f8ffae;
  font-weight: 500;
  margin-bottom: 2.5rem;
  letter-spacing: 1px;
`;

const AIGlow = styled(motion.div)`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, #43cea2 0%, #7b2ff2 80%, transparent 100%);
  box-shadow: 0 0 32px 12px #43cea2aa, 0 0 64px 24px #7b2ff288;
  margin-bottom: 2.2rem;
  filter: blur(1px);
`;

function SplashScreen({ onFinish }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1800);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SplashBg>
      <AnimatePresence>
        <AIGlow
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.7, opacity: 0 }}
          transition={{ duration: 1.1, type: 'spring', stiffness: 80 }}
        />
        <AppName
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 1.1, type: 'spring', stiffness: 80 }}
        >
          FinDash
        </AppName>
        <Tagline
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Your Smart Path to Financial Freedom
        </Tagline>
      </AnimatePresence>
    </SplashBg>
  );
}

export default SplashScreen; 