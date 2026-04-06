import React from 'react';
import styled from 'styled-components';
import { useRole } from '../context/RoleContext';

/* ===== STYLES ===== */

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.3rem;
  }
`;

const Badge = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;

  background: ${({ isAdmin }) => (isAdmin ? '#dcfce7' : '#f1f5f9')};
  color: ${({ isAdmin }) => (isAdmin ? '#166534' : '#475569')};

  @media (max-width: 768px) {
    display: none; /* hide text on small screens */
  }
`;

const SwitchBtn = styled.button`
  border: none;
  padding: 0.4rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  cursor: pointer;

  background: #6366f1;
  color: white;

  &:hover {
    background: #4f46e5;
  }
`;

/* ===== COMPONENT ===== */

export default function RoleSwitcher() {
  const { role, toggleRole, isAdmin } = useRole();

  return (
    <Container>
      <Badge isAdmin={isAdmin}>
        {isAdmin ? 'Admin' : 'Viewer'}
      </Badge>

      <SwitchBtn onClick={toggleRole}>
        Switch
      </SwitchBtn>
    </Container>
  );
}