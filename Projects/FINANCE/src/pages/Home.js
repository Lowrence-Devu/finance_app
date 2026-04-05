import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Enhanced background with animated gradient
const HomeBg = styled(motion.div)`
  min-height: 100vh;
  width: 100vw;
  padding-top: 68px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.background || 'linear-gradient(135deg, #f8ffae 0%, #a18cd1 40%, #fbc2eb 70%, #43c6ac 100%)'};
  position: relative;
  overflow-x: hidden;
`;

const SplashCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2.5rem;
  justify-content: center;
  margin: 2.5rem 5vw 0 5vw;
`;

const SplashCard = styled(motion.div)`
  background: ${({ bg }) => bg};
  color: #fff;
  border-radius: 2rem;
  box-shadow: 0 8px 40px rgba(80,80,180,0.13);
  padding: 2.2rem 2.2rem 1.7rem 2.2rem;
  min-width: 270px;
  max-width: 320px;
  flex: 1 1 270px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.3s;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.7rem 0;
  letter-spacing: 1px;
  color: #fff;
`;

const CardDesc = styled.p`
  font-size: 1.08rem;
  color: #f8ffae;
  margin: 0 0 1.2rem 0;
  font-weight: 500;
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-top: auto;
  align-self: flex-end;
  color: #fff;
  opacity: 0.85;
`;

const AnimatedWave = styled(motion.div)`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 60px;
  background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%);
  border-radius: 0 0 2rem 2rem;
  z-index: 1;
`;

// Animated AI robot logo (same as Navbar)
function AnimatedRobotLogo({ size = 90 }) {
  return (
    <motion.svg
      width={size} height={size} viewBox="0 0 38 38" fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 7, -7, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      style={{ marginBottom: 18 }}
    >
      <defs>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#43cea2" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#7b2ff2" stopOpacity="0.2" />
        </radialGradient>
        <linearGradient id="face" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7b2ff2" />
          <stop offset="1" stopColor="#43cea2" />
        </linearGradient>
      </defs>
      <circle cx="19" cy="19" r="18" fill="url(#glow)" />
      <ellipse cx="19" cy="20" rx="13" ry="12" fill="url(#face)" stroke="#fff" strokeWidth="2.2" />
      <rect x="17.2" y="6" width="3.6" height="7" rx="1.5" fill="#fff" />
      <circle cx="19" cy="5.5" r="2.1" fill="#43cea2" stroke="#fff" strokeWidth="1.1" />
      <text x="12.2" y="24.5" fontSize="7.5" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="monospace">$</text>
      <text x="25.8" y="24.5" fontSize="7.5" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="monospace">$</text>
      <path d="M14.5 27 Q19 31 23.5 27" stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}

const Hero = styled(motion.section)`
  width: 100vw;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 5.5rem;
  padding-bottom: 2.5rem;
  position: relative;
  z-index: 2;
`;
const GradientHeadline = styled(motion.h1)`
  font-size: 3.2rem;
  font-weight: 900;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #7b2ff2 0%, #43cea2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 8px 32px rgba(67,206,162,0.18);
  margin-bottom: 1.1rem;
  text-align: center;
`;
const AnimatedTagline = styled(motion.div)`
  font-size: 1.35rem;
  color: #232526;
  font-weight: 600;
  margin-bottom: 2.2rem;
  letter-spacing: 1px;
  text-align: center;
`;
const GetStartedBtn = styled(motion.a)`
  display: inline-block;
  background: linear-gradient(90deg, #7b2ff2 0%, #43cea2 100%);
  color: #fff;
  font-weight: 700;
  font-size: 1.18rem;
  border-radius: 1.5rem;
  padding: 0.85rem 2.5rem;
  box-shadow: 0 4px 24px #7b2ff244;
  text-decoration: none;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: linear-gradient(90deg, #43cea2 0%, #7b2ff2 100%);
    color: #fff;
    transform: scale(1.06);
  }
`;
const AnimatedBg = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(120deg, #f7f7fa 0%, #e0e7ff 40%, #a18cd1 80%, #43cea2 100%);
  opacity: 0.7;
  filter: blur(32px);
`;

function Home() {
  const splashCards = [
    {
      title: 'Track Expenses',
      desc: 'Monitor your spending with beautiful charts.',
      bg: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
      icon: <i className="fas fa-chart-pie"></i>,
    },
    {
      title: 'Set Budgets',
      desc: 'Plan and manage your monthly budgets easily.',
      bg: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
      icon: <i className="fas fa-wallet"></i>,
    },
    {
      title: 'Grow Investments',
      desc: 'Visualize your investment growth.',
      bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      icon: <i className="fas fa-chart-line"></i>,
    },
    {
      title: 'Financial Insights',
      desc: 'Get AI-powered insights for your finances.',
      bg: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      icon: <i className="fas fa-lightbulb"></i>,
    },
    {
      title: 'Credit Score',
      desc: 'Check and improve your credit score.',
      bg: 'linear-gradient(135deg, #ff5858 0%, #f09819 100%)',
      icon: <i className="fas fa-star"></i>,
    },
    {
      title: 'Savings Goals',
      desc: 'Set and track your savings targets.',
      bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      icon: <i className="fas fa-piggy-bank"></i>,
    },
    {
      title: 'Bill Reminders',
      desc: 'Never miss a payment with timely reminders.',
      bg: 'linear-gradient(135deg, #fc5c7d 0%, #6a82fb 100%)',
      icon: <i className="fas fa-bell"></i>,
    },
    {
      title: 'Reports & Export',
      desc: 'Export your data and generate reports.',
      bg: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)',
      icon: <i className="fas fa-file-export"></i>,
    },
  ];

  return (
    <HomeBg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      style={{position:'relative'}}
    >
      <AnimatedBg
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 1.2 }}
      />
      <Hero
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, type: 'spring', stiffness: 80 }}
      >
        <AnimatedRobotLogo size={90} />
        <GradientHeadline
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to FinDash
        </GradientHeadline>
        <AnimatedTagline
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Your AI-powered path to financial freedom.
        </AnimatedTagline>
        <GetStartedBtn
          href="/dashboard"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.97 }}
        >
          Get Started
        </GetStartedBtn>
      </Hero>
      <SplashCards>
        {splashCards.map((card, idx) => (
          <SplashCard
            key={card.title}
            bg={card.bg}
            whileHover={{
              scale: 1.07,
              boxShadow: '0 16px 48px rgba(80,80,180,0.18)',
              y: -8
            }}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: idx * 0.10, duration: 0.6, type: 'spring', stiffness: 80 }}
          >
            <CardTitle>{card.title}</CardTitle>
            <CardDesc>{card.desc}</CardDesc>
            <CardIcon>{card.icon}</CardIcon>
            <AnimatedWave
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + idx * 0.08, duration: 0.7, type: 'spring', stiffness: 60 }}
            />
          </SplashCard>
        ))}
      </SplashCards>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
        style={{
          marginTop: '4rem',
          color: '#7b2ff2',
          fontWeight: 600,
          fontSize: '1.2rem',
          letterSpacing: '1px',
          textAlign: 'center'
        }}
      >
        <i className="fas fa-magic" style={{ marginRight: 10 }} />
        Experience finance like never before.
      </motion.div>
    </HomeBg>
  );
}

export default Home;
