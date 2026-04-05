import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import styled, { ThemeContext } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import RoleSwitcher from './RoleSwitcher';
import { FaSun, FaMoon, FaBell, FaPlus, FaBars, FaTimes } from 'react-icons/fa';

// const useAuth = () => {
//   const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('loggedIn'));
//   const [user] = useState({
//     name: 'Lowrence',
//     avatar: 'https://i.pravatar.cc/40?img=8'
//   });

//   const login = () => {
//     setLoggedIn(true);
//     localStorage.setItem('loggedIn', '1');
//   };
//   const logout = () => {
//     setLoggedIn(false);
//     localStorage.removeItem('loggedIn');
//   };
//   return { loggedIn, user, login, logout };
// };

const Nav = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 100;
  background: ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(15, 17, 23, 0.95)' 
    : 'rgba(255, 255, 255, 0.98)'};
  color: ${({ theme }) => theme.text};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 2px 8px ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(0, 0, 0, 0.25)' 
    : 'rgba(0, 0, 0, 0.08)'};
  border-bottom: 1px solid ${({ theme }) => theme.mode === 'dark' 
    ? 'rgba(255, 255, 255, 0.06)' 
    : 'rgba(123, 47, 242, 0.08)'};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 72px;
  padding: 0 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    height: 68px;
    padding: 0 1.5rem;
  }
  
  @media (max-width: 480px) {
    height: 64px;
    padding: 0 1rem;
  }
`;

const NavContent = styled.div`
  width: 100%;
  max-width: 1400px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const Brand = styled(Link)`
  font-size: 1.4rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.3s ease;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  letter-spacing: -0.5px;
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex: 1;
  justify-content: center;
  
  @media (max-width: 800px) {
    gap: 1rem;
  }
  
  @media (max-width: 600px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  position: relative;
  font-size: 0.95rem;
  font-weight: 500;
  color: ${({ active, theme }) => (active ? '#7b2ff2' : theme.text)};
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ active }) => (active ? 1 : 0.75)};
  
  &:hover {
    opacity: 1;
    background: ${({ theme }) => theme.mode === 'dark' 
      ? 'rgba(123, 47, 242, 0.1)' 
      : 'rgba(123, 47, 242, 0.08)'};
    color: #7b2ff2;
  }
  
  @media (max-width: 800px) {
    font-size: 1.1rem;
    padding: 0.6rem 1rem;
  }
  &:hover {
    color: #f357a8;
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(123,47,242,0.12)' : 'rgba(123,47,242,0.08)'};
    transform: translateY(-2px);
  }
`;

const Underline = styled(motion.div)`
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 3px;
  width: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%);
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const AvatarImg = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: 2px solid ${({ theme }) => theme.accent && theme.accent.startsWith('linear') ? '#7b2ff2' : theme.accent};
  object-fit: cover;
  transition: border 0.2s;
  background: ${({ theme }) => theme.box};
  &:hover {
    border: 2px solid ${({ theme }) => theme.button && theme.button.startsWith('linear') ? '#f357a8' : theme.button};
  }
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 50px;
  right: 0;
  min-width: 200px;
  background: ${({ theme }) => theme.mode === 'dark' ? '#1a1d2b' : 'rgba(255,255,255,0.95)'};
  border-radius: 1.2rem;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: ${({ theme }) => theme.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(123,47,242,0.15)'};
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(123,47,242,0.1)'};
  padding: 0.8rem 0.6rem;
  display: flex;
  flex-direction: column;
  z-index: 200;
`;

const DropdownItem = styled(Link)`
  padding: 0.8rem 1.2rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.8rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(123,47,242,0.2)' : 'rgba(123,47,242,0.12)'};
    color: #f357a8;
    transform: translateX(4px);
  }
`;

const DropdownButton = styled.button`
  padding: 0.8rem 1.2rem;
  color: ${({ theme }) => theme.text};
  background: none;
  border: none;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 0.8rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(243,87,168,0.2)' : 'rgba(243,87,168,0.12)'};
    color: #f357a8;
    transform: translateX(4px);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.8rem;
  margin-left: 1rem;
  cursor: pointer;
  z-index: 202;
  padding: 0.6rem;
  border-radius: 0.6rem;
  transition: all 0.3s ease;
  @media (max-width: 800px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &:hover {
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(123,47,242,0.12)' : 'rgba(123,47,242,0.08)'};
    color: #7b2ff2;
    transform: scale(1.08);
  }
`;
const SlideMenuBg = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(30,32,40,0.18);
  z-index: 201;
  display: flex;
  @media (min-width: 801px) { display: none; }
`;
const SlideMenu = styled(motion.nav)`
  width: 80vw;
  max-width: 340px;
  height: 100vh;
  background: ${({ theme }) => theme.box};
  box-shadow: ${({ theme }) => theme.mode === 'dark' ? '2px 0 32px rgba(0,0,0,0.4)' : '2px 0 32px rgba(123,47,242,0.2)'};
  display: flex;
  flex-direction: column;
  padding: 2.5rem 1.5rem 1.5rem 1.5rem;
  position: relative;
  overflow-y: auto;
  scroll-behavior: smooth;
  transition: background 0.4s ease;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(123,47,242,0.3);
    border-radius: 3px;
    &:hover {
      background: rgba(123,47,242,0.5);
    }
  }
`;
const SlideMenuClose = styled.button`
  background: none; border: none; color: ${({ theme }) => theme.text}; font-size: 2rem; position: absolute; top: 1.2rem; right: 1.2rem; cursor: pointer;
`;
const NotificationButton = styled.button`
  background: none; border: none; color: ${({ theme }) => theme.text}; font-size: 1.6rem; margin-left: 1.2rem; cursor: pointer; position: relative; display: flex; align-items: center;
  &:hover { color: ${({ theme }) => theme.accent}; }
`;
const NotificationBadge = styled(motion.div)`
  position: absolute; top: -6px; right: -6px; background: #f357a8; color: #fff; border-radius: 50%; font-size: 0.8rem; padding: 2px 6px; font-weight: bold; box-shadow: 0 2px 8px #f357a855;
`;
const Greeting = styled.div`
  font-size: 1.1rem; font-weight: 600; color: ${({ theme }) => theme.text}; margin-right: 1.5rem; @media (max-width: 800px) { display: none; }
`;
const QuickActionBtn = styled(motion.button)`
  position: fixed; bottom: 2.2rem; right: 2.2rem; z-index: 300;
  background: linear-gradient(90deg, #7b2ff2 0%, #43cea2 100%);
  color: #fff; border: none; border-radius: 50%; width: 60px; height: 60px; font-size: 2rem; box-shadow: 0 4px 24px #7b2ff244;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; outline: none;
  transition: background 0.2s;
  &:hover { background: linear-gradient(90deg, #43cea2 0%, #7b2ff2 100%); }
`;

function AnimatedBrandIcon() {
  // AI robot head with dollar sign eyes, animated
  return (
    <motion.svg
      width="38" height="38" viewBox="0 0 38 38" fill="none"
      initial={{ rotate: 0 }}
      animate={{ rotate: [0, 7, -7, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      style={{ marginRight: 8 }}
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
      {/* Glow */}
      <circle cx="19" cy="19" r="18" fill="url(#glow)" />
      {/* Robot head */}
      <ellipse cx="19" cy="20" rx="13" ry="12" fill="url(#face)" stroke="#fff" strokeWidth="2.2" />
      {/* Antenna */}
      <rect x="17.2" y="6" width="3.6" height="7" rx="1.5" fill="#fff" />
      <circle cx="19" cy="5.5" r="2.1" fill="#43cea2" stroke="#fff" strokeWidth="1.1" />
      {/* Eyes (dollar signs) */}
      <text x="12.2" y="24.5" fontSize="7.5" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="monospace">$</text>
      <text x="25.8" y="24.5" fontSize="7.5" fontWeight="bold" fill="#fff" textAnchor="middle" fontFamily="monospace">$</text>
      {/* Smile */}
      <path d="M14.5 27 Q19 31 23.5 27" stroke="#fff" strokeWidth="1.7" fill="none" strokeLinecap="round" />
    </motion.svg>
  );
}

const GlowBg = styled(motion.div)`
  position: absolute;
  left: 0; top: 0; width: 100vw; height: 100%;
  z-index: 0;
  pointer-events: none;
  background: radial-gradient(circle at 20% 40%, #7b2ff2 0%, #43cea2 60%, transparent 100%);
  opacity: 0.18;
  filter: blur(32px);
`;
const ThemeToggle = styled.button`
  background: none;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.text};
  font-size: 1.4rem;
  margin-left: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.6rem;
  padding: 0.6rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: 800px) {
    margin-left: 0.8rem;
  }
  &:hover {
    color: #f357a8;
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(123,47,242,0.12)' : 'rgba(243,87,168,0.08)'};
    transform: scale(1.1) rotate(15deg);
  }
`;

function getGreeting(name) {
  const hour = new Date().getHours();
  let greet = 'Hello';
  if (hour < 12) greet = 'Good morning';
  else if (hour < 18) greet = 'Good afternoon';
  else greet = 'Good evening';
  return `${greet}${name ? ', ' + name.split(' ')[0] : ''}!`;
}

const defaultTheme = {
  mode: 'light',
  box: '#fff',
  text: '#232526',
  accent: '#7b2ff2',
  button: '#7b2ff2',
};

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, theme: contextTheme, setTheme } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  let theme = useContext(ThemeContext);
  if (!theme || typeof theme !== 'object') {
    const isDark = contextTheme === 'dark';
    theme = isDark ? {
      mode: 'dark',
      box: '#1a1d2e',
      text: '#e4e9f0',
      accent: '#43cea2',
      button: '#43cea2',
    } : {
      mode: 'light',
      box: '#ffffff',
      text: '#1a1a2e',
      accent: '#7b2ff2',
      button: '#7b2ff2',
    };
  }
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(3);

  const links = [
    { to: '/', label: 'Home', icon: <i className="fas fa-home"></i> },
    { to: '/dashboard', label: 'Dashboard', icon: <i className="fas fa-chart-line"></i> },
    { to: '/profile', label: 'Profile', icon: <i className="fas fa-user"></i> }
  ];

  const handleLogout = () => {
    logout();
    setDropdown(false);
    navigate('/login');
  };
  
  const handleThemeToggle = () => {
    if (setTheme) setTheme(contextTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <>
      <Nav
        theme={theme}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 80, damping: 18 }}
        style={{backdropFilter:'blur(18px)', background: theme.mode === 'dark' ? 'rgba(30,32,40,0.85)' : 'rgba(255,255,255,0.75)', borderBottom: theme.mode === 'dark' ? '1.5px solid #232526' : '1.5px solid #eaeaea'}}
      >
        <GlowBg
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.18 }}
          transition={{ duration: 1.2 }}
        />
        <NavContent>
          <Brand to="/" theme={theme} style={{position:'relative',zIndex:2}}>
            <AnimatedBrandIcon />
            <motion.span
              initial={{ letterSpacing: 0, color: '#7b2ff2' }}
              animate={{ letterSpacing: [0, 2, 0], color: [theme.text, theme.accent, theme.text] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ fontWeight: 900, fontSize: '2rem', fontFamily: 'Poppins, Montserrat, Segoe UI, Arial, sans-serif', background: 'linear-gradient(90deg, #7b2ff2 0%, #43cea2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
            >
              FinDash
            </motion.span>
          </Brand>
          <Greeting theme={theme}>{getGreeting(user?.name)}</Greeting>
          <NavLinks style={{zIndex:2}}>
            <MobileMenuButton theme={theme} aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <FaBars />
            </MobileMenuButton>
            {user && links.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <NavLink key={link.to} to={link.to} active={isActive ? 1 : 0} theme={theme} style={{display:'flex',alignItems:'center',gap:8}}>
                  <motion.span
                    whileHover={{ scale: 1.18 }}
                    whileTap={{ scale: 0.95 }}
                    style={{display:'flex',alignItems:'center'}}
                  >
                    {link.icon} {link.label}
                  </motion.span>
                  {isActive && (
                    <Underline
                      layoutId="nav-underline"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
            <ThemeToggle theme={theme} aria-label="Toggle theme" onClick={handleThemeToggle}>\n              {contextTheme === 'light' ? <FaMoon /> : <FaSun />}\n            </ThemeToggle>\n            <NotificationButton theme={theme} aria-label="Notifications">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: notifCount > 0 ? Infinity : 0, duration: 2, ease: 'easeInOut' }}
              >
                <FaBell />
              </motion.span>
              {notifCount > 0 && (
                <NotificationBadge
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >{notifCount}</NotificationBadge>
              )}
            </NotificationButton>
            {user && <RoleSwitcher />}
            {!user ? (
              <NavLink
                to="/login"
                active={location.pathname === '/login' ? 1 : 0}
                theme={theme}
                style={{
                  background: 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)',
                  color: '#fff',
                  borderRadius: '1.2rem',
                  padding: '0.5rem 1.3rem',
                  marginLeft: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(123,47,242,0.08)'
                }}
              >
                Login
                {location.pathname === '/login' && (
                  <Underline
                    layoutId="nav-underline"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </NavLink>
            ) : (
              <AvatarWrapper
                tabIndex={0}
                onClick={() => setDropdown(v => !v)}
                onBlur={() => setTimeout(() => setDropdown(false), 120)}
                style={{marginLeft:16,boxShadow:'0 2px 12px #7b2ff233',borderRadius:'50%',position:'relative'}}
              >
                <motion.div
                  initial={{ boxShadow: '0 0 0 0 #7b2ff2' }}
                  animate={{ boxShadow: dropdown ? '0 0 0 6px #7b2ff244' : '0 0 0 0 #7b2ff2' }}
                  transition={{ duration: 0.3 }}
                  style={{ borderRadius: '50%' }}
                >
                  <AvatarImg src={user.avatar} alt="User" theme={theme} style={{boxShadow:'0 2px 8px #43cea244'}} />
                </motion.div>
                <AnimatePresence>
                  {dropdown && (
                    <DropdownMenu
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.18 }}
                      style={{background: theme.mode === 'dark' ? '#232526' : '#fff', color: theme.text, border: theme.mode === 'dark' ? '1px solid #333' : '1px solid #eee'}}
                    >
                      <DropdownItem to="/profile">
                        <i className="fas fa-user"></i> Profile
                      </DropdownItem>
                      <DropdownItem to="/profile?edit=1">
                        <i className="fas fa-edit"></i> Edit Profile
                      </DropdownItem>
                      <DropdownButton onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i> Log out
                      </DropdownButton>
                    </DropdownMenu>
                  )}
                </AnimatePresence>
              </AvatarWrapper>
            )}
          </NavLinks>
        </NavContent>
      </Nav>
      <AnimatePresence>
        {mobileOpen && (
          <SlideMenuBg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          >
            <SlideMenu
              theme={theme}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <SlideMenuClose theme={theme} aria-label="Close menu" onClick={() => setMobileOpen(false)}><FaTimes /></SlideMenuClose>
              <Brand to="/" theme={theme} style={{marginBottom:32}} onClick={() => setMobileOpen(false)}>
                <AnimatedBrandIcon />
                <span style={{ fontWeight: 900, fontSize: '2rem', fontFamily: 'Poppins, Montserrat, Segoe UI, Arial, sans-serif', background: 'linear-gradient(90deg, #7b2ff2 0%, #43cea2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>FinDash</span>
              </Brand>
              {user && links.map(link => (
                <NavLink key={link.to} to={link.to} theme={theme} style={{fontSize:'1.3rem',marginBottom:18}} onClick={() => setMobileOpen(false)}>
                  {link.icon} {link.label}
                </NavLink>
              ))}
              <ThemeToggle theme={theme} aria-label="Toggle theme" onClick={handleThemeToggle} style={{marginTop:24}}>
                {contextTheme === 'light' ? <FaMoon /> : <FaSun />}
              </ThemeToggle>
              <NotificationButton theme={theme} aria-label="Notifications" style={{marginTop:18}}>
                <FaBell />
                {notifCount > 0 && (
                  <NotificationBadge
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  >{notifCount}</NotificationBadge>
                )}
              </NotificationButton>
              {!user && (
                <NavLink
                  to="/login"
                  theme={theme}
                  style={{
                    background: 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)',
                    color: '#fff',
                    borderRadius: '1.2rem',
                    padding: '0.5rem 1.3rem',
                    marginTop: '1.5rem',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(123,47,242,0.08)'
                  }}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </NavLink>
              )}
            </SlideMenu>
          </SlideMenuBg>
        )}
      </AnimatePresence>
      {user && (
        <QuickActionBtn
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.13 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          aria-label="Add transaction"
          onClick={() => window.location.href = '/dashboard?add=1'}
        >
          <FaPlus />
        </QuickActionBtn>
      )}
    </>
  );
}

export default Navbar;
