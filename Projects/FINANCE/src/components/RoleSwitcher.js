import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRole } from '../context/RoleContext';

const RoleSwitcherContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const RoleLabel = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const ToggleSwitch = styled(motion.button)`
  background: ${({ isAdmin }) => isAdmin ? '#43cea2' : '#f357a8'};
  border: none;
  border-radius: 0.6rem;
  padding: 0.4rem 0.8rem;
  color: #fff;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px ${({ isAdmin }) => isAdmin ? 'rgba(67, 206, 162, 0.3)' : 'rgba(243, 87, 168, 0.3)'};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const RoleBadge = styled(motion.span)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  padding: 0.3rem 0.8rem;
  background: ${({ isAdmin }) => isAdmin ? 'rgba(67, 206, 162, 0.2)' : 'rgba(243, 87, 168, 0.2)'};
  border-radius: 0.5rem;
`;

export default function RoleSwitcher() {
  const { role, toggleRole, isAdmin } = useRole();

  return (
    <RoleSwitcherContainer>
      <RoleBadge
        isAdmin={isAdmin}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        key={role}
        transition={{ duration: 0.2 }}
      >
        <span>{isAdmin ? '👤' : '👁️'}</span>
        <span>{isAdmin ? 'ADMIN' : 'VIEWER'}</span>
      </RoleBadge>
      
      <ToggleSwitch
        isAdmin={isAdmin}
        onClick={toggleRole}
        whileTap={{ scale: 0.95 }}
        title={`Switch to ${isAdmin ? 'Viewer' : 'Admin'} role`}
      >
        Switch
      </ToggleSwitch>
    </RoleSwitcherContainer>
  );
}
