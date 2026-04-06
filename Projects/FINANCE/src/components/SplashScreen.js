import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

/* ================= STYLES ================= */

const SplashBg = styled.div`
  position: fixed;
  inset: 0;
  background: #0f172a; /* clean dark fintech bg */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const LogoCircle = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
`;

const LogoText = styled.div`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
`;

const AppName = styled(motion.h1)`
  font-size: 1.8rem;
  font-weight: 700;
  color: #e2e8f0;
`;

const Tagline = styled(motion.div)`
  font-size: 0.9rem;
  color: #94a3b8;
`;

const Loader = styled(motion.div)`
  width: 120px;
  height: 4px;
  background: #1e293b;
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1rem;
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: #6366f1;
  border-radius: 10px;
`;

/* ================= COMPONENT ================= */

function SplashScreen({ onFinish }) {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinish && onFinish();
    }, 1500); // faster & smoother

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SplashBg>
      <Container>

        {/* Logo */}
        <LogoCircle
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <LogoText>₹</LogoText>
        </LogoCircle>

        {/* App Name */}
        <AppName
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          FinDash
        </AppName>

        {/* Tagline */}
        <Tagline
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Smart finance, simplified
        </Tagline>

        {/* Loader */}
        <Loader>
          <Progress
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        </Loader>

      </Container>
    </SplashBg>
  );
}

export default SplashScreen;