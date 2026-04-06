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
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;

  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const NavContent = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 0 1.5rem;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(Link)`
  font-size: 1.3rem;
  font-weight: 700;
  color: #0f172a;
  text-decoration: none;
`;

const Links = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;

    background: #ffffff;
    border-top: 1px solid #e2e8f0;

    display: flex;
    justify-content: space-around;
    align-items: center;
    z-index: 100;
  }
`;

const NavLink = styled(Link)`
  font-size: 0.9rem;
  color: ${({ active }) => (active ? "#6366f1" : "#64748b")};
  text-decoration: none;

  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    flex-direction: column;
  }

  &:hover {
    color: #0f172a;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: none;
  background: #6366f1;
  color: white;
  cursor: pointer;

  &:hover {
    background: #4f46e5;
  }

  @media (max-width: 768px) {
    display: none;
  }
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
      <Nav>
        <NavContent>

          {/* Brand */}
          <Brand to="/">FinDash</Brand>

          {/* Desktop Links */}
          <Links>
            {links.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                active={location.pathname === link.to ? 1 : 0}
              >
                {link.label}
              </NavLink>
            ))}
          </Links>

          {/* Right Side */}
          <Right>
            {/* Role Switcher (IMPORTANT) */}
            <RoleSwitcher />

            {user ? (
              <>
                <Avatar src={user.avatar} alt="user" />
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
    </>
  );
}

export default Navbar;