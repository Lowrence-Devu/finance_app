import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const bgAnim = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AuthBg = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(270deg, #43cea2, #7b2ff2, #f357a8, #43cea2);
  background-size: 600% 600%;
  animation: ${bgAnim} 12s ease-in-out infinite;
  position: relative;
`;

const FlipContainer = styled.div`
  perspective: 1200px;
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FlipCard = styled.div`
  width: 370px;
  max-width: 98vw;
  height: 500px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.9s cubic-bezier(.77,0,.18,1);
  ${({ flipped }) => flipped && 'transform: rotateY(180deg);'}
  @media (max-width: 600px) {
    width: 98vw;
    height: 98vw;
    min-height: 420px;
    max-height: 98vw;
  }
`;

const CardFace = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CardBack = styled(CardFace)`
  transform: rotateY(180deg);
`;

const AuthCard = styled(motion.div)`
  background: rgba(255,255,255,0.97);
  border-radius: 2.5rem;
  box-shadow: 0 16px 56px rgba(80,80,180,0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  width: 100%;
  min-width: 320px;
  max-width: 370px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  @media (max-width: 600px) {
    min-width: 98vw;
    max-width: 98vw;
    padding: 1.2rem 0.2rem 1rem 0.2rem;
    border-radius: 1.2rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 800;
  color: #7b2ff2;
  margin-bottom: 1.1rem;
  letter-spacing: 1px;
`;

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 1.2rem;
`;

const FloatingLabel = styled.label`
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  font-size: 1.13rem;
  pointer-events: none;
  transition: 0.2s;
  ${({ active }) => active && css`
    top: 0.2rem;
    left: 1.1rem;
    font-size: 0.95rem;
    color: #7b2ff2;
    background: #fff;
    padding: 0 0.3rem;
    border-radius: 0.5rem;
  `}
  @media (max-width: 600px) {
    font-size: 1rem;
    ${({ active }) => active && css`
      font-size: 0.9rem;
    `}
  }
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 1.1rem 1.2rem;
  border: 1.5px solid #e0e0e0;
  border-radius: 1.1rem;
  font-size: 1.13rem;
  background: #fafaff;
  transition: border 0.2s;
  @media (max-width: 600px) {
    font-size: 1rem;
    padding: 1rem 1rem;
  }
  &:focus {
    border: 1.5px solid #43cea2;
    outline: none;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.9rem 1.2rem;
  background: linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%);
  color: #fff;
  border: none;
  border-radius: 1.1rem;
  font-size: 1.18rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s, box-shadow 0.3s, transform 0.2s;
  box-shadow: 0 2px 8px rgba(123,47,242,0.08);
  margin-bottom: 0.7rem;
  &:hover {
    background: linear-gradient(90deg, #43cea2 0%, #7b2ff2 100%);
    box-shadow: 0 8px 24px rgba(67,206,162,0.13);
    transform: scale(1.04);
  }
  &:active {
    transform: scale(0.97);
  }
`;

const GoogleButton = styled(Button)`
  background: linear-gradient(90deg, #fbbc05 0%, #ea4335 75%);
  color: #fff;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  &:hover {
    background: linear-gradient(90deg, #ea4335 0%, #fbbc05 100%);
    color: #fff;
  }
`;

const ErrorMsg = styled(motion.div)`
  color: #ff5858;
  font-weight: 600;
  margin-bottom: 1rem;
  min-height: 24px;
`;

const Spinner = styled.div`
  border: 3px solid #eee;
  border-top: 3px solid #7b2ff2;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.2rem auto;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const FlipButton = styled.button`
  background: none;
  border: none;
  color: #7b2ff2;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 1.2rem;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #f357a8; }
`;

// Add logo styled component
const LogoWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.7rem;
`;
const LogoIcon = styled(motion.div)`
  font-size: 2.7rem;
  filter: drop-shadow(0 0 8px #7b2ff2cc);
  margin-bottom: 0.2rem;
`;
const AppName = styled(motion.div)`
  font-family: 'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif;
  font-size: 1.45rem;
  font-weight: 900;
  color: #7b2ff2;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 8px #f357a855;
`;

function Login() {
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('');
  const [regError, setRegError] = useState('');
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regGoogleLoading, setRegGoogleLoading] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  // Flip state
  const [flipped, setFlipped] = useState(false);
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  // Login handler
  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login({ email, password });
    setSubmitting(false);
    if (!result.success) {
      setError(result.error);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const backendRes = await login({
        email: result.user.email,
        name: result.user.displayName,
        avatar: result.user.photoURL
      });
      if (!backendRes.success) {
        setError(backendRes.error);
      }
    } catch (err) {
      setError('Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  // Register handler
  const handleRegister = async e => {
    e.preventDefault();
    setRegError('');
    setRegSubmitting(true);
    const result = await login({
      name: regName,
      email: regEmail,
      password: regPassword,
      avatar: regAvatar
    });
    setRegSubmitting(false);
    if (!result.success) {
      setRegError(result.error);
    }
  };

  // Google register
  const handleGoogleRegister = async () => {
    setRegError('');
    setRegGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const backendRes = await login({
        email: result.user.email,
        name: result.user.displayName,
        avatar: result.user.photoURL
      });
      if (!backendRes.success) {
        setRegError(backendRes.error);
      }
    } catch (err) {
      setRegError('Google sign-in failed');
    } finally {
      setRegGoogleLoading(false);
    }
  };

  return (
    <AuthBg>
      <FlipContainer>
        <FlipCard flipped={flipped}>
          {/* Front: Login */}
          <CardFace>
            <AuthCard
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
            >
              <LogoWrapper
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 90 }}
              >
                <LogoIcon
                  animate={{
                    filter: [
                      'drop-shadow(0 0 8px #7b2ff2cc)',
                      'drop-shadow(0 0 16px #f357a8cc)',
                      'drop-shadow(0 0 8px #7b2ff2cc)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                >
                  💸
                </LogoIcon>
                <AppName>FinDash</AppName>
              </LogoWrapper>
              <Title>Sign In to FinDash</Title>
              {(submitting || googleLoading) && <Spinner />}
                  <AnimatePresence>
                    {error && (
                      <ErrorMsg
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
                        {error}
                      </ErrorMsg>
                    )}
                  </AnimatePresence>
              <form onSubmit={handleLogin} style={{ width: '100%' }} autoComplete="on">
                <InputWrapper>
                  <Input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    autoComplete="email"
                    whileFocus={{ boxShadow: '0 0 0 2px #7b2ff244' }}
                  />
                  <FloatingLabel active={!!email}>Email</FloatingLabel>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    style={{ paddingRight: 40 }}
                    autoComplete="current-password"
                    whileFocus={{ boxShadow: '0 0 0 2px #43cea244' }}
                  />
                  <FloatingLabel active={!!password}>Password</FloatingLabel>
                  <span
                    onClick={() => setShowLoginPassword(v => !v)}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa', fontSize: 18 }}
                    title={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas fa-eye${showLoginPassword ? '' : '-slash'}`}></i>
                  </span>
                </InputWrapper>
                  <Button
                    type="submit"
                  whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #7b2ff233' }}
                    whileTap={{ scale: 0.97 }}
                  disabled={submitting || googleLoading}
                  >
                  {submitting ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
                <GoogleButton
                  type="button"
                whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #ea433533' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleGoogleLogin}
                disabled={submitting || googleLoading}
                >
                  <i className="fab fa-google" style={{ marginRight: 8 }}></i>
                {googleLoading ? 'Signing In...' : 'Sign in with Google'}
                </GoogleButton>
              <FlipButton type="button" onClick={() => setFlipped(true)}>
                Don&apos;t have an account? Register
              </FlipButton>
            </AuthCard>
          </CardFace>
          {/* Back: Register */}
          <CardBack>
            <AuthCard
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
            >
              <LogoWrapper
                initial={{ opacity: 0, y: -30, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1, type: 'spring', stiffness: 90 }}
              >
                <LogoIcon
                  animate={{
                    filter: [
                      'drop-shadow(0 0 8px #7b2ff2cc)',
                      'drop-shadow(0 0 16px #f357a8cc)',
                      'drop-shadow(0 0 8px #7b2ff2cc)'
                    ]
                  }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
                >
                  💸
                </LogoIcon>
                <AppName>FinDash</AppName>
              </LogoWrapper>
              <Title>Register for FinDash</Title>
              {(regSubmitting || regGoogleLoading) && <Spinner />}
              <AnimatePresence>
                {regError && (
                  <ErrorMsg
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className="fas fa-exclamation-circle" style={{ marginRight: 8 }} />
                    {regError}
                  </ErrorMsg>
                )}
              </AnimatePresence>
              <form onSubmit={handleRegister} style={{ width: '100%' }} autoComplete="on">
                <InputWrapper>
                  <Input
                    type="text"
                    value={regName}
                    onChange={e => setRegName(e.target.value)}
                    required
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    autoComplete="name"
                    whileFocus={{ boxShadow: '0 0 0 2px #7b2ff244' }}
                  />
                  <FloatingLabel active={!!regName}>Full Name</FloatingLabel>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type="email"
                    value={regEmail}
                    onChange={e => setRegEmail(e.target.value)}
                    required
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25, duration: 0.4 }}
                    autoComplete="email"
                    whileFocus={{ boxShadow: '0 0 0 2px #7b2ff244' }}
                  />
                  <FloatingLabel active={!!regEmail}>Email</FloatingLabel>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={e => setRegPassword(e.target.value)}
                    required
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    style={{ paddingRight: 40 }}
                    autoComplete="new-password"
                    whileFocus={{ boxShadow: '0 0 0 2px #43cea244' }}
                  />
                  <FloatingLabel active={!!regPassword}>Password</FloatingLabel>
                  <span
                    onClick={() => setShowRegisterPassword(v => !v)}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: '#aaa', fontSize: 18 }}
                    title={showRegisterPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas fa-eye${showRegisterPassword ? '' : '-slash'}`}></i>
                  </span>
                </InputWrapper>
                <InputWrapper>
                  <Input
                    type="url"
                    value={regAvatar}
                    onChange={e => setRegAvatar(e.target.value)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35, duration: 0.4 }}
                    autoComplete="off"
                    whileFocus={{ boxShadow: '0 0 0 2px #43cea244' }}
                  />
                  <FloatingLabel active={!!regAvatar}>Avatar URL (optional)</FloatingLabel>
                </InputWrapper>
                <Button
                  type="submit"
                  whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #7b2ff233' }}
                  whileTap={{ scale: 0.97 }}
                  disabled={regSubmitting || regGoogleLoading}
                >
                  {regSubmitting ? 'Registering...' : 'Register'}
                </Button>
              </form>
              <GoogleButton
                type="button"
                whileHover={{ scale: 1.07, boxShadow: '0 4px 16px #ea433533' }}
                whileTap={{ scale: 0.97 }}
                onClick={handleGoogleRegister}
                disabled={regSubmitting || regGoogleLoading}
              >
                <i className="fab fa-google" style={{ marginRight: 8 }}></i>
                {regGoogleLoading ? 'Signing Up...' : 'Sign up with Google'}
              </GoogleButton>
              <FlipButton type="button" onClick={() => setFlipped(false)}>
                Already have an account? Sign In
              </FlipButton>
            </AuthCard>
          </CardBack>
        </FlipCard>
      </FlipContainer>
    </AuthBg>
  );
}

export default Login;
