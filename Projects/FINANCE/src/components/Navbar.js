import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import RoleSwitcher from './RoleSwitcher';

/* ================= STYLES ================= */

const Nav = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 64px;
  background: white;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const NavContent = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 1rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(Link)`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
`;

const DesktopLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-size: 0.9rem;
  color: ${({ active, theme }) =>
    active ? theme.primary : theme.subText};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const Avatar = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
`;

const Button = styled.button`
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* ================= MOBILE BOTTOM NAV ================= */

const BottomNav = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 60px;

    background: white;
    border-top: 1px solid ${({ theme }) => theme.border};

    justify-content: space-around;
    align-items: center;
    z-index: 100;
  }
`;

const BottomItem = styled(Link)`
  font-size: 0.7rem;
  text-decoration: none;
  color: ${({ active, theme }) =>
    active ? theme.primary : theme.subText};
  background: ${({ active, theme }) =>
    active ? theme.primary + '20' : 'transparent'} ;
    padding: 0.3rem 0.6rem;
  

  border-radius: 6px;

  &:hover {
    color: ${({ theme }) => theme.text};
  }

  display: flex;
  flex-direction: column;
  align-items: center;
`;

/* ================= COMPONENT ================= */

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/profile", label: "Profile" }
  ];

  return (
    <>
      {/* TOP NAV */}
      <Nav>
        <NavContent>

          <Brand to="/">FinDash</Brand>

          {/* Desktop */}
          <DesktopLinks>
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                active={location.pathname === link.to ? 1 : 0}
              >
                {link.label}
              </NavLink>
            ))}
          </DesktopLinks>

          {/* Right */}
          <Right>
            <RoleSwitcher />

            {user ? (
              <>
                <Avatar src={user.avatar} />
                <Button onClick={() => {
                  logout();
                  navigate('/login');
                }}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate('/login')}>
                Login
              </Button>
            )}
          </Right>

        </NavContent>
      </Nav>

      {/* MOBILE BOTTOM NAV */}
      <BottomNav>
        {links.map(link => (
          <BottomItem
            key={link.to}
            to={link.to}
            active={location.pathname === link.to ? 1 : 0}
          >
            {link.label}
          </BottomItem>
        ))}
      </BottomNav>
    </>
  );
}

export default Navbar;