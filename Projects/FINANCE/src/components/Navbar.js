import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

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
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-size: 0.9rem;
  color: ${({ active }) => (active ? "#6366f1" : "#64748b")};
  text-decoration: none;

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
  cursor: pointer;
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
`;

const MenuBtn = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  right: ${({ open }) => (open ? "0" : "-100%")};
  width: 250px;
  height: 100vh;
  background: #ffffff;
  box-shadow: -2px 0 10px rgba(0,0,0,0.1);

  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  gap: 1.5rem;

  transition: 0.3s;
`;

const CloseBtn = styled.button`
  align-self: flex-end;
  background: none;
  border: none;
  font-size: 1.5rem;
`;

/* ================= COMPONENT ================= */

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

          {/* Right */}
          <Right>
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

            {/* Mobile menu button */}
            <MenuBtn onClick={() => setMenuOpen(true)}>
              <FaBars />
            </MenuBtn>
          </Right>

        </NavContent>
      </Nav>

      {/* Mobile Menu */}
      <MobileMenu open={menuOpen}>
        <CloseBtn onClick={() => setMenuOpen(false)}>
          <FaTimes />
        </CloseBtn>

        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}

        {user ? (
          <Button onClick={() => {
            logout();
            navigate('/login');
          }}>
            Logout
          </Button>
        ) : (
          <Button onClick={() => navigate('/login')}>
            Login
          </Button>
        )}
      </MobileMenu>
    </>
  );
}

export default Navbar;