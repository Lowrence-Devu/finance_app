import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';

// Logo and header styles (reuse from Login.js)
const LogoWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
`;
const LogoIcon = styled(motion.div)`
  font-size: 2.2rem;
  filter: drop-shadow(0 0 8px #7b2ff2cc);
  margin-bottom: 0.1rem;
`;
const AppName = styled(motion.div)`
  font-family: 'Poppins', 'Montserrat', 'Segoe UI', Arial, sans-serif;
  font-size: 1.25rem;
  font-weight: 900;
  color: #7b2ff2;
  letter-spacing: 1.2px;
  text-shadow: 0 2px 8px #f357a855;
`;

const DashboardBg = styled(motion.div)`
  min-height: 100vh;
  width: 100%;
  padding-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme?.mode === 'dark' ? '#0f1419' : '#f9fafb'};
  position: relative;
  overflow-x: hidden;
  transition: background 0.2s ease;
  
  @media (max-width: 768px) {
    padding-top: 62px;
  }
  
  @media (max-width: 480px) {
    padding-top: 60px;
  }
`;

const DashboardContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1.8rem;

  @media (max-width: 1024px) {
    padding: 2rem 1.8rem;
    gap: 1.6rem;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 1.2rem;
    gap: 1.4rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 0.8rem;
    gap: 1rem;
  }
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  justify-items: center;
  margin-top: 2rem;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.8rem;
    margin-top: 1.8rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1.2rem;
    margin-top: 1.2rem;
  }
`;

const GlassCard = styled(motion.div)`
  position: relative;
  background: ${({ gradient, theme }) => gradient || (theme?.mode === 'dark' ? '#1a1f2e' : '#ffffff')};
  border-radius: 1rem;
  box-shadow: 0 1px 3px ${({ theme }) => theme?.mode === 'dark' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.08)'};
  border: 1px solid ${({ theme }) => theme?.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#e5e7eb'};
  min-width: 200px;
  min-height: 130px;
  transition: all 0.2s ease;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  overflow: hidden;

  @media (max-width: 1024px) {
    min-width: 180px;
    padding: 1.3rem;
  }
  
  @media (max-width: 768px) {
    min-width: 160px;
    min-height: 120px;
    padding: 1.2rem;
    border-radius: 0.8rem;
  }

  @media (max-width: 480px) {
    min-width: calc(50% - 0.4rem);
    padding: 1rem;
    border-radius: 0.8rem;
  }
  
  &:hover {
    box-shadow: 0 4px 12px ${({ theme }) => theme?.mode === 'dark' ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CardTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 600;
  color: rgba(123, 47, 242, 0.8);
  margin-bottom: 0.8rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: 'Montserrat', 'Segoe UI', sans-serif;

  @media (max-width: 768px) {
    font-size: 0.95rem;
    margin-bottom: 0.6rem;
  }
`;

const DashboardHeader = styled.div`
  width: 100%;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const HeaderTitle = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  color: ${({ theme }) => theme.text};
  margin: 0;
  letter-spacing: -0.8px;
  font-family: 'Poppins', 'Segoe UI', sans-serif;
  line-height: 1.2;
  
  @media (max-width: 1024px) {
    font-size: 2.4rem;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 1.05rem;
  color: ${({ theme }) => theme.text};
  opacity: 0.7;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.3px;
  
  @media (max-width: 768px) {
    font-size: 0.95rem;
  }
`;

const CardValue = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
  font-family: 'Poppins', sans-serif;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const CardFooter = styled.div`
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0.8rem 0 0 0;
  font-weight: 500;
  letter-spacing: 0.3px;
`;

const CardIcon = styled.div`
  font-size: 2.8rem;
  margin-top: auto;
  align-self: flex-end;
  color: #fff;
  opacity: 0.9;
  filter: drop-shadow(0 4px 12px rgba(123, 47, 242, 0.2));
  animation: float 3s ease-in-out infinite;
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-8px); }
  }
`;

const AnimatedWave = styled(motion.div)`
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 60px;
  background: linear-gradient(90deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%);
  border-radius: 0 0 2rem 2rem;
  z-index: 1;
`;

const ChartSection = styled(motion.div)`
  width: 100%;
  max-width: 1100px;
  margin: 3.5rem auto 0 auto;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.92) 100%);
  border-radius: 2.2rem;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.1), 0 0 1px rgba(255, 255, 255, 0.6) inset, 0 0 25px rgba(123, 47, 242, 0.1);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  padding: 2.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1.5px solid rgba(255, 255, 255, 0.7);

  &:hover {
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.12), 0 0 1px rgba(255, 255, 255, 0.7) inset, 0 0 35px rgba(123, 47, 242, 0.15);
  }

  @media (max-width: 1024px) {
    margin: 3rem auto 0 auto;
    padding: 2.2rem;
    border-radius: 2rem;
  }

  @media (max-width: 768px) {
    margin: 2.5rem auto 0 auto;
    padding: 1.8rem;
    border-radius: 1.8rem;
  }

  @media (max-width: 480px) {
    margin: 2rem auto 0 auto;
    padding: 1.5rem;
    border-radius: 1.5rem;
    max-width: 100%;
  }

  &:hover {
    box-shadow: 0 30px 80px rgba(67, 206, 162, 0.15), 0 0 1px rgba(255, 255, 255, 0.5) inset;
  }
`;

const AnimatedChartWrapper = styled(motion.div)`
  width: 100%;
  height: 320px;
  margin-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ToggleButton = styled(motion.button)`
  margin: 1.5rem auto 0 auto;
  display: block;
  background: linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%);
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.6rem 2rem;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(123,47,242,0.08);
  transition: background 0.3s, color 0.3s, transform 0.2s;
  &:hover {
    background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
    color: #fff;
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.97);
  }
`;

const Notification = styled(motion.div)`
  position: fixed;
  top: 90px;
  left: 50%;
  transform: translateX(-50%);
  background: #43cea2;
  color: #fff;
  padding: 1rem 2rem;
  border-radius: 1.2rem;
  font-weight: 600;
  box-shadow: 0 4px 24px rgba(67,206,162,0.18);
  z-index: 9999;
`;

const RoleBadgeDash = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  background: ${({ isAdmin }) => isAdmin ? 'rgba(67, 206, 162, 0.15)' : 'rgba(243, 87, 168, 0.15)'};
  border: 2px solid ${({ isAdmin }) => isAdmin ? '#43cea2' : '#f357a8'};
  padding: 0.8rem 1.5rem;
  border-radius: 1rem;
  margin: 1.5rem auto 0 auto;
  font-weight: 600;
  color: ${({ isAdmin }) => isAdmin ? '#43cea2' : '#f357a8'};
  box-shadow: 0 4px 12px ${({ isAdmin }) => isAdmin ? 'rgba(67, 206, 162, 0.2)' : 'rgba(243, 87, 168, 0.2)'};
  font-size: 1.05rem;
`;

const ReadOnlyMessage = styled(motion.div)`
  background: linear-gradient(135deg, #f3e8ff 0%, #fce8e6 100%);
  border: 2px solid #f357a8;
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  margin: 1.5rem auto 0 auto;
  max-width: 500px;
  text-align: center;
  font-weight: 600;
  color: #7b2ff2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
`;

const TransactionForm = styled.form`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 255, 0.94) 100%);
  border-radius: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 0 1px rgba(255, 255, 255, 0.7) inset, 0 0 25px rgba(123, 47, 242, 0.12);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  margin: 2.5rem auto 1.5rem auto;
  max-width: 550px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    padding: 2rem 2rem 1.5rem 2rem;
    margin: 2rem auto 1.2rem auto;
    border-radius: 1.8rem;
    gap: 1.2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.5rem 1.2rem 1.5rem;
    margin: 1.5rem auto 1rem auto;
    border-radius: 1.5rem;
    gap: 1rem;
  }

  &:hover {
    box-shadow: 0 25px 80px rgba(67, 206, 162, 0.15), 0 0 1px rgba(255, 255, 255, 0.5) inset;
  }
`;

const TransactionList = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.97) 0%, rgba(250, 250, 252, 0.95) 100%);
  border-radius: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12), 0 0 1px rgba(255, 255, 255, 0.5) inset;
  padding: 2.5rem 2.5rem 1.8rem 2.5rem;
  margin: 1.5rem auto 2.5rem auto;
  max-width: 800px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 2rem 2rem 1.5rem 2rem;
    margin: 1.2rem auto 2rem auto;
    border-radius: 1.8rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.5rem 1.2rem 1.5rem;
    margin: 1rem auto 1.5rem auto;
    border-radius: 1.5rem;
    max-width: 100%;
  }

  &:hover {
    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.15), 0 0 1px rgba(255, 255, 255, 0.5) inset;
  }
`;

const TransactionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1.08rem;
  &:last-child { border-bottom: none; }
`;

const TransactionAmount = styled.span`
  font-weight: 700;
  color: ${({ type }) =>
    type === 'income' ? '#43cea2' :
    type === 'expense' ? '#f357a8' :
    type === 'investment' ? '#f7971e' :
    '#11998e'};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #7b2ff2;
  font-size: 1.1rem;
  margin-left: 0.7rem;
  cursor: pointer;
  &:hover { color: #f357a8; }
`;

const SearchBar = styled.input`
  width: 100%;
  max-width: 450px;
  margin: 1rem auto 1.5rem auto;
  display: block;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  border: 2px solid rgba(123, 47, 242, 0.15);
  font-size: 1rem;
  font-family: 'Segoe UI', sans-serif;
  background: rgba(255, 255, 255, 0.8);
  color: #1a1a2e;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(123, 47, 242, 0.4);
  }

  &:focus {
    outline: none;
    border-color: #43cea2;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(67, 206, 162, 0.1);
  }

  @media (max-width: 768px) {
    padding: 0.9rem 1.3rem;
    margin: 0.8rem auto 1.2rem auto;
    border-radius: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1.2rem;
    margin: 0.6rem auto 1rem auto;
    max-width: 100%;
    border-radius: 0.8rem;
  }
`;

const FormInput = styled.input`
  flex: 1;
  min-width: 100px;
  padding: 0.95rem 1.2rem;
  border-radius: 0.95rem;
  border: 2px solid rgba(123, 47, 242, 0.15);
  background: rgba(255, 255, 255, 0.9);
  color: #1a1a2e;
  font-size: 0.95rem;
  font-family: 'Segoe UI', sans-serif;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #43cea2;
    box-shadow: 0 0 0 3px rgba(67, 206, 162, 0.1);
    background: #fff;
  }

  @media (max-width: 480px) {
    padding: 0.85rem 1rem;
    border-radius: 0.85rem;
    font-size: 0.9rem;
  }
`;

const FormSelect = styled.select`
  flex: 1;
  min-width: 100px;
  padding: 0.95rem 1.2rem;
  border-radius: 0.95rem;
  border: 2px solid rgba(123, 47, 242, 0.15);
  background: rgba(255, 255, 255, 0.95);
  color: #1a1a2e;
  font-size: 0.95rem;
  font-family: 'Segoe UI', sans-serif;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #43cea2;
    box-shadow: 0 0 0 3px rgba(67, 206, 162, 0.1);
    background: #fff;
  }

  @media (max-width: 480px) {
    padding: 0.85rem 1rem;
    border-radius: 0.85rem;
    font-size: 0.9rem;
  }
`;

const DateFilterRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  background: rgba(67, 206, 162, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(67, 206, 162, 0.2);

  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-bottom: 1.2rem;
    padding: 1rem;
    border-radius: 0.9rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1rem;
    padding: 0.8rem;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
  padding: 1.2rem;
  background: rgba(123, 47, 242, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(123, 47, 242, 0.2);

  @media (max-width: 768px) {
    gap: 0.8rem;
    margin-bottom: 1.2rem;
    padding: 1rem;
    border-radius: 0.9rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
    margin-bottom: 1rem;
    padding: 0.8rem;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  background: #eee;
  border-radius: 1rem;
  overflow: hidden;
  margin-top: 0.5rem;
  height: 18px;
`;
const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #43cea2 0%, #7b2ff2 100%);
  transition: width 0.6s;
`;

const CurrencySelectorRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin: 2.5rem auto 2rem auto;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, rgba(123, 47, 242, 0.05) 0%, rgba(67, 206, 162, 0.05) 100%);
  border-radius: 1.2rem;
  border: 1px solid rgba(123, 47, 242, 0.2);

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    margin: 2rem auto 1.5rem auto;
    padding: 1.2rem 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 0.8rem;
    margin: 1.5rem auto 1rem auto;
    padding: 1rem 1.2rem;
  }
`;

const OnboardingModalBg = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(40,40,60,0.25);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const OnboardingModalCard = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 8px 40px rgba(80,80,180,0.18);
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  min-width: 320px;
  max-width: 95vw;
  color: #232526;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const TipsCard = styled.div`
  background: ${({ color }) => color || '#f8ffae'};
  color: #232526;
  border-radius: 1.2rem;
  box-shadow: 0 4px 24px rgba(80,80,180,0.10);
  padding: 1.5rem 2rem;
  margin: 2.5rem auto 0 auto;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.7rem;
`;

const ChartsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  justify-items: center;
  margin-top: 2.5rem;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.8rem;
    margin-top: 1.8rem;
  }

  @media (max-width: 480px) {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
`;
const ChartCard = styled(motion.div)`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 255, 0.94) 100%);
  border-radius: 1.8rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08), 0 0 1px rgba(255, 255, 255, 0.7) inset, 0 0 20px rgba(123, 47, 242, 0.1);
  padding: 2rem 1.8rem 1.8rem 1.8rem;
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1.5px solid rgba(255, 255, 255, 0.7);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.1), 0 0 1px rgba(255, 255, 255, 0.8) inset, 0 0 30px rgba(123, 47, 242, 0.15);
  }

  @media (max-width: 1024px) {
    padding: 1.8rem 1.6rem 1.6rem 1.6rem;
    max-width: 420px;
  }

  @media (max-width: 768px) {
    padding: 1.6rem 1.4rem 1.4rem 1.4rem;
    border-radius: 1.6rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 1.4rem 1.2rem 1.2rem 1.2rem;
    border-radius: 1.4rem;
  }

  &:hover {
    box-shadow: 0 25px 70px rgba(67, 206, 162, 0.2), 0 0 1px rgba(255, 255, 255, 0.5) inset;
    transform: translateY(-6px);
  }
`;
const ChartTitle = styled.div`
  font-size: 1.08rem;
  font-weight: 700;
  color: #7b2ff2;
  margin-bottom: 0.7rem;
`;
const COLORS = ['#7b2ff2', '#43cea2', '#f357a8', '#fbbc05', '#ea4335', '#00b894'];

// Sample transaction data
const sampleTransactions = [
  { id: 1, amount: 3000, type: 'income', category: 'Salary', date: '2024-06-01', description: 'June Salary' },
  { id: 2, amount: -1200, type: 'expense', category: 'Rent', date: '2024-06-02', description: 'Monthly Rent' },
  { id: 3, amount: -200, type: 'expense', category: 'Groceries', date: '2024-06-03', description: 'Groceries' },
  { id: 4, amount: -150, type: 'expense', category: 'Utilities', date: '2024-06-04', description: 'Electricity Bill' },
  { id: 5, amount: 500, type: 'investment', category: 'Stocks', date: '2024-06-05', description: 'Stock Purchase' },
  { id: 6, amount: 100, type: 'saving', category: 'Emergency Fund', date: '2024-06-06', description: 'Savings Deposit' },
  { id: 7, amount: 3000, type: 'income', category: 'Salary', date: '2024-05-01', description: 'May Salary' },
  { id: 8, amount: -1100, type: 'expense', category: 'Rent', date: '2024-05-02', description: 'Monthly Rent' },
  { id: 9, amount: -180, type: 'expense', category: 'Groceries', date: '2024-05-03', description: 'Groceries' },
  { id: 10, amount: 400, type: 'investment', category: 'Mutual Funds', date: '2024-05-10', description: 'Mutual Fund' },
  { id: 11, amount: 80, type: 'saving', category: 'Emergency Fund', date: '2024-05-15', description: 'Savings Deposit' },
];

// Calculation helpers
function getTotalBalance(transactions) {
  return transactions.reduce((acc, t) => acc + t.amount, 0);
}

function getMonthlySpend(transactions, month, year) {
  return transactions
    .filter(t => t.type === 'expense' && new Date(t.date).getMonth() === month && new Date(t.date).getFullYear() === year)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);
}

function getInvestments(transactions) {
  return transactions
    .filter(t => t.type === 'investment')
    .reduce((acc, t) => acc + t.amount, 0);
}

function getSavings(transactions) {
  return transactions
    .filter(t => t.type === 'saving')
    .reduce((acc, t) => acc + t.amount, 0);
}

// Spending trends: aggregate expenses by month
function getMonthlyExpenseTrends(transactions) {
  const monthly = {};
  transactions.forEach(tx => {
    if (tx.type === 'expense') {
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      monthly[key] = (monthly[key] || 0) + Math.abs(tx.amount);
    }
  });
  // Convert to array sorted by date
  return Object.entries(monthly)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// Category breakdown: aggregate expenses by category (use filteredTransactions for current view)
function getCategoryBreakdown(transactions) {
  const cat = {};
  transactions.forEach(tx => {
    if (tx.type === 'expense') {
      cat[tx.category] = (cat[tx.category] || 0) + Math.abs(tx.amount);
    }
  });
  return Object.entries(cat).map(([category, total]) => ({ category, total }));
}

const tipsByType = {
  employee: {
    color: '#e0f7fa',
    icon: <i className="fas fa-briefcase" style={{color:'#43cea2',fontSize:'1.5rem',marginRight:10}}></i>,
    title: 'Smart Salary Management',
    tips: [
      'Try to save at least 20% of your salary each month.',
      'Track your monthly expenses to avoid overspending.',
      'Set up an emergency fund for unexpected events.'
    ],
    welcome: 'Welcome, Employee! Manage your salary, expenses, and savings with ease.'
  },
  business: {
    color: '#fff3e0',
    icon: <i className="fas fa-briefcase" style={{color:'#f7971e',fontSize:'1.5rem',marginRight:10}}></i>,
    title: 'Business Finance Insights',
    tips: [
      'Track your profits by separating business and personal expenses.',
      'Review your profit margin monthly for better planning.',
      'Optimize your business spending for higher savings.'
    ],
    welcome: 'Welcome, Business Owner! Track profits, business expenses, and personal savings.'
  },
  student: {
    color: '#f3e0ff',
    icon: <i className="fas fa-graduation-cap" style={{color:'#7b2ff2',fontSize:'1.5rem',marginRight:10}}></i>,
    title: 'Pocket Money Tips',
    tips: [
      'Set a weekly budget for snacks and outings.',
      'Try to save a portion of your pocket money every month.',
      'Track your top spending categories to find savings.'
    ],
    welcome: 'Welcome, Student! Track your pocket money, expenses, and savings easily.'
  }
};

function Dashboard() {
  const { user, token } = useAuth();
  const { isAdmin } = useRole();
  const userId = user?._id;

  // Helper to get/set user-specific localStorage keys
  const getLS = (key, fallback) => {
    const val = localStorage.getItem(`${key}_${userId}`);
    if (val === null || val === undefined) return fallback;
    if (typeof fallback === 'number') return parseFloat(val);
    try { return JSON.parse(val); } catch { return val; }
  };
  const setLS = (key, value) => {
    localStorage.setItem(`${key}_${userId}`, typeof value === 'string' ? value : JSON.stringify(value));
  };

  // Transactions state
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);

  // Fetch transactions from backend on mount and poll every 7 seconds
  useEffect(() => {
    if (!userId || !token) return;
    let isMounted = true;
    const fetchTx = async () => {
      setLoadingTx(true);
      try {
        const res = await fetch(`http://localhost:5000/api/transactions`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (isMounted) {
          // Handle both array and object response formats
          const txs = Array.isArray(data) ? data : (data?.data || []);
          setTransactions(txs);
          setLoadingTx(false);
        }
      } catch (err) {
        if (isMounted) {
          setTransactions([]);
          setLoadingTx(false);
        }
      }
    };
    fetchTx();
    const interval = setInterval(fetchTx, 7000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [userId, token]);

  // Form state
  const [form, setForm] = useState({
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().slice(0,10),
    description: ''
  });

  // Handle form input
  const handleFormChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const formRef = useRef();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Get unique categories for dropdown
  const uniqueCategories = Array.from(new Set(transactions.map(tx => tx.category))).filter(Boolean);

  // Edit handler: populate form with transaction data
  const handleEdit = tx => {
    setForm({
      amount: Math.abs(tx.amount),
      type: tx.type,
      category: tx.category,
      date: tx.date.slice(0,10),
      description: tx.description || ''
    });
    setEditId(tx._id);
    // Scroll to form for better UX
    setTimeout(() => {
      if (formRef.current) formRef.current.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Delete handler
  const handleDelete = async id => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(ts => ts.filter(t => t._id !== id));
      if (editId === id) setEditId(null);
    }
  };

  // Add or update transaction
  const handleFormSubmit = async e => {
    try {
      e.preventDefault();
      if (!form.amount || !form.type || !form.category || !form.date) return;
      const amount = parseFloat(form.amount);
      if (isNaN(amount) || amount <= 0) return;
      if (editId) {
        // Edit mode
        const res = await fetch(`http://localhost:5000/api/transactions/${editId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: Math.abs(amount),
          type: form.type,
          category: form.category,
          date: form.date,
          description: form.description
        })
      });
      const updated = await res.json();
      const updatedTx = updated?.data || updated;
      setTransactions(ts => ts.map(t => t._id === editId ? updatedTx : t));
      setEditId(null);
    } else {
      // Add mode
      const res = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          user: userId,
          amount: Math.abs(amount),
          type: form.type,
          category: form.category,
          date: form.date,
          description: form.description
        })
      });
      const created = await res.json();
      if (!res.ok) {
        console.error('Transaction POST failed:', created);
        return;
      }
      const createdTx = created?.data || created;
      setTransactions(ts => [createdTx, ...ts]);
      setForm({ amount: '', type: 'expense', category: '', date: new Date().toISOString().slice(0,10), description: '' });
    }
  } catch (err) {
    console.error('Form submission error:', err);
  }
};

  // Filter transactions by search
  const filteredTransactions = transactions.filter(tx => {
    const q = search.toLowerCase();
    const txDate = new Date(tx.date);
    let inRange = true;
    if (startDate) inRange = inRange && txDate >= new Date(startDate);
    if (endDate) inRange = inRange && txDate <= new Date(endDate);
    let amountOk = true;
    if (minAmount !== '') amountOk = amountOk && Math.abs(tx.amount) >= parseFloat(minAmount);
    if (maxAmount !== '') amountOk = amountOk && Math.abs(tx.amount) <= parseFloat(maxAmount);
    let categoryOk = !categoryFilter || tx.category === categoryFilter;
    let typeOk = !typeFilter || tx.type === typeFilter;
    return (
      inRange && amountOk && categoryOk && typeOk && (
        (tx.category && tx.category.toLowerCase().includes(q)) ||
        (tx.description && tx.description.toLowerCase().includes(q)) ||
        (tx.type && tx.type.toLowerCase().includes(q))
      )
    );
  });

  // Calculations
  const now = new Date();
  const totalBalance = getTotalBalance(transactions);
  const monthlySpend = getMonthlySpend(transactions, now.getMonth(), now.getFullYear());
  const investments = getInvestments(transactions);
  const savings = getSavings(transactions);

  // Currency
  const [currency, setCurrency] = useState(() => getLS('currency', 'USD'));
  useEffect(() => { setLS('currency', currency); }, [currency]);
  const currencySymbols = { USD: '$', EUR: '€', INR: '₹', GBP: '£', JPY: '¥', CAD: 'C$' };
  const currencySymbol = currencySymbols[currency] || currency;

  // Savings Goal
  const [savingsGoal, setSavingsGoal] = useState(() => getLS('savingsGoal', 0));
  useEffect(() => { setLS('savingsGoal', savingsGoal); }, [savingsGoal]);
  const totalSavings = getSavings(transactions);
  const savingsProgress = savingsGoal > 0 ? Math.min(100, (totalSavings / savingsGoal) * 100) : 0;

  // User Type
  const [userType, setUserType] = useState(() => getLS('userType', 'employee'));
  useEffect(() => { setLS('userType', userType); }, [userType]);

  // Dynamic labels and logic based on userType
  let incomeLabel = 'Income';
  let savingsLabel = 'Savings';
  let incomeValue = 0;
  let savingsValue = 0;

  if (userType === 'employee') {
    incomeLabel = 'Salary';
    savingsLabel = 'Savings';
    incomeValue = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    savingsValue = getSavings(transactions);
  } else if (userType === 'business') {
    incomeLabel = 'Profits';
    savingsLabel = 'Personal Savings';
    // Profits = income - business expenses (type: 'income' - category: 'Business Expense')
    const businessIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const businessExpenses = transactions.filter(t => t.type === 'expense' && t.category && t.category.toLowerCase().includes('business')).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    incomeValue = businessIncome - businessExpenses;
    // Personal savings = profits - personal expenses (category not including 'business')
    const personalExpenses = transactions.filter(t => t.type === 'expense' && (!t.category || !t.category.toLowerCase().includes('business'))).reduce((acc, t) => acc + Math.abs(t.amount), 0);
    savingsValue = incomeValue - personalExpenses;
  } else if (userType === 'student') {
    incomeLabel = 'Pocket Money';
    savingsLabel = 'Saved Pocket Money';
    incomeValue = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    savingsValue = incomeValue - transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + Math.abs(t.amount), 0);
  }

  // Update cards array to use currencySymbol
  const cards = [
    {
      title: 'Total Balance',
      value: `${currencySymbol}${totalBalance.toLocaleString()}`,
      footer: 'Across all accounts',
      bg: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
      icon: <i className="fas fa-wallet"></i>,
    },
    {
      title: incomeLabel,
      value: `${currencySymbol}${incomeValue.toLocaleString()}`,
      footer: userType === 'business' ? 'Profits (Income - Business Expenses)' : (userType === 'student' ? 'Total pocket money received' : 'Total salary/income'),
      bg: 'linear-gradient(135deg, #7b2ff2 0%, #f357a8 100%)',
      icon: <i className="fas fa-credit-card"></i>,
    },
    {
      title: 'Investments',
      value: `${currencySymbol}${investments.toLocaleString()}`,
      footer: 'Stocks & funds',
      bg: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
      icon: <i className="fas fa-chart-line"></i>,
    },
    {
      title: savingsLabel,
      value: `${currencySymbol}${savingsValue.toLocaleString()}`,
      footer: userType === 'business' ? 'Profits - Personal Expenses' : (userType === 'student' ? 'Pocket money left after expenses' : 'Emergency fund'),
      bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      icon: <i className="fas fa-piggy-bank"></i>,
    },
  ];

  // Example animated chart data
  const chartData = [
    { month: 'Jan', balance: 9000, spend: 1200 },
    { month: 'Feb', balance: 9500, spend: 1300 },
    { month: 'Mar', balance: 10200, spend: 1100 },
    { month: 'Apr', balance: 11000, spend: 1400 },
    { month: 'May', balance: 11700, spend: 1250 },
    { month: 'Jun', balance: 12500, spend: 1350 },
  ];

  // Dynamic features state
  const [showBar, setShowBar] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  // Simulate a notification (e.g., new transaction)
  const triggerNotif = () => {
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 2200);
  };

  // Spending trends: aggregate expenses by month
  const monthlyTrends = getMonthlyExpenseTrends(transactions);

  // Category breakdown: aggregate expenses by category (use filteredTransactions for current view)
  const categoryBreakdown = getCategoryBreakdown(filteredTransactions);
  const pieColors = ['#7b2ff2', '#43cea2', '#f357a8', '#f7971e', '#ffd200', '#11998e', '#38ef7d', '#185a9d'];

  // AI Spending Prediction (simple moving average of last 3 months)
  const aiSpendingPrediction = useMemo(() => {
    // Group expenses by month
    const monthly = {};
    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        const d = new Date(tx.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        monthly[key] = (monthly[key] || 0) + Math.abs(tx.amount);
      }
    });
    const months = Object.keys(monthly).sort();
    if (months.length < 2) return null;
    const last3 = months.slice(-3).map(m => monthly[m]);
    const avg = last3.reduce((a, b) => a + b, 0) / last3.length;
    return Math.round(avg);
  }, [transactions]);

  // Smart Tip (basic logic)
  const smartTip = useMemo(() => {
    if (!transactions.length) return 'Start tracking your expenses to get personalized tips!';
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + Math.abs(t.amount), 0);
    if (totalExpenses > totalIncome) return 'You are spending more than you earn. Consider reviewing your expenses!';
    if (totalExpenses < totalIncome * 0.7) return 'Great job! You are saving a healthy portion of your income.';
    if (transactions.some(t => t.category && t.category.toLowerCase().includes('food'))) return 'Tip: Try meal planning to save on food expenses.';
    return 'Keep tracking your finances for more insights!';
  }, [transactions]);

  // Highest spending category
  const highestSpendingCategory = useMemo(() => {
    const categories = {};
    transactions.forEach(tx => {
      if (tx.type === 'expense' && tx.category) {
        categories[tx.category] = (categories[tx.category] || 0) + Math.abs(tx.amount);
      }
    });
    if (Object.keys(categories).length === 0) return null;
    return Object.entries(categories).reduce((a, b) => a[1] > b[1] ? a : b);
  }, [transactions]);

  // Monthly comparison (current month vs previous month)
  const monthlyComparison = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    let currentMonthExpense = 0;
    let previousMonthExpense = 0;
    
    transactions.forEach(tx => {
      if (tx.type === 'expense') {
        const txDate = new Date(tx.date);
        if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
          currentMonthExpense += Math.abs(tx.amount);
        } else if (txDate.getMonth() === (currentMonth - 1 + 12) % 12 && txDate.getFullYear() === (currentMonth === 0 ? currentYear - 1 : currentYear)) {
          previousMonthExpense += Math.abs(tx.amount);
        }
      }
    });
    
    if (previousMonthExpense === 0) return null;
    const percentageChange = ((currentMonthExpense - previousMonthExpense) / previousMonthExpense) * 100;
    return { currentMonth: currentMonthExpense, previousMonth: previousMonthExpense, percentageChange };
  }, [transactions]);

  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem('hasSeenOnboarding'));
  useEffect(() => {
    if (showOnboarding === false) {
      localStorage.setItem('hasSeenOnboarding', '1');
    }
  }, [showOnboarding]);

  const tips = tipsByType[userType] || tipsByType.employee;

  // Sample data for charts
  const spendingTrends = [
    { month: 'Jan', spend: 1200 },
    { month: 'Feb', spend: 900 },
    { month: 'Mar', spend: 1400 },
    { month: 'Apr', spend: 1100 },
    { month: 'May', spend: 1700 },
    { month: 'Jun', spend: 1300 },
  ];
  const categoryData = [
    { name: 'Food', value: 400 },
    { name: 'Rent', value: 700 },
    { name: 'Shopping', value: 300 },
    { name: 'Travel', value: 200 },
    { name: 'Bills', value: 250 },
    { name: 'Other', value: 150 },
  ];

  return (
    <DashboardBg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      <DashboardContainer>
        {/* Professional Header */}
        <DashboardHeader>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <HeaderTitle>Dashboard</HeaderTitle>
            <HeaderSubtitle>Welcome back, {user?.name || 'User'}. Here's your financial overview.</HeaderSubtitle>
          </motion.div>
        </DashboardHeader>

        {/* Role Badge */}
        <RoleBadgeDash
          isAdmin={isAdmin}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span>{isAdmin ? '👤' : '👁️'}</span>
          <span>{isAdmin ? 'Admin Mode - Full Access' : 'Viewer Mode - Read Only'}</span>
        </RoleBadgeDash>

        {/* Transaction Entry Form - Admin Only */}
        {isAdmin ? (
          <TransactionForm onSubmit={handleFormSubmit} ref={formRef}>
            <h3 style={{marginBottom:'1.2rem', color: '#1a1a2e', fontSize: '1.3rem', fontWeight: 700}}>
              {editId ? '✏️ Edit Transaction' : '➕ Add Transaction'}
            </h3>
            <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', alignItems:'flex-start'}}>
              <FormInput
                type="number"
                name="amount"
                placeholder="Amount"
                value={form.amount}
                onChange={handleFormChange}
                required
              />
              <FormSelect
                name="type"
                value={form.type}
                onChange={handleFormChange}
                required
              >
                <option value="income">💰 Income</option>
                <option value="expense">💸 Expense</option>
                <option value="investment">📈 Investment</option>
                <option value="saving">🏦 Saving</option>
              </FormSelect>
              <FormSelect
                name="category"
                value={form.category}
                onChange={handleFormChange}
                required
              >
                <option value="">-- Select Category --</option>
                <option value="salary">💰 Salary</option>
                <option value="freelance">💻 Freelance</option>
                <option value="shopping">🛍️ Shopping</option>
                <option value="food">🍔 Food</option>
                <option value="transport">🚗 Transport</option>
                <option value="utilities">⚡ Utilities</option>
                <option value="healthcare">🏥 Healthcare</option>
                <option value="entertainment">🎬 Entertainment</option>
                <option value="investment">📈 Investment</option>
                <option value="savings">🏦 Savings</option>
                <option value="other">📌 Other</option>
              </FormSelect>
              <FormInput
                type="date"
                name="date"
                value={form.date}
                onChange={handleFormChange}
                required
              />
            </div>
            <FormInput
              type="text"
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleFormChange}
              style={{width: '100%'}}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                marginTop: '1rem',
                background: 'linear-gradient(135deg, #43cea2 0%, #11998e 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '1rem',
                padding: '1rem 2rem',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 20px rgba(67, 206, 162, 0.3)',
                fontFamily: 'Segoe UI, sans-serif'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 28px rgba(67, 206, 162, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 20px rgba(67, 206, 162, 0.3)';
              }}
            >
              {editId ? '✓ Update Transaction' : '➕ Add Transaction'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={() => { setEditId(null); setForm({ amount: '', type: 'expense', category: '', date: new Date().toISOString().slice(0,10), description: '' }); }}
                style={{
                  width: '100%',
                  marginTop: '0.5rem',
                  background: 'rgba(123, 47, 242, 0.1)',
                  color: '#7b2ff2',
                  border: '2px solid #7b2ff2',
                  borderRadius: '1rem',
                  padding: '0.8rem 1.5rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Segoe UI, sans-serif'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#7b2ff2';
                  e.target.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'rgba(123, 47, 242, 0.1)';
                  e.target.style.color = '#7b2ff2';
                }}
              >
                ✕ Cancel Edit
              </button>
            )}
        </TransactionForm>
        ) : (
          <ReadOnlyMessage
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <i className="fas fa-lock" style={{fontSize:'1.2rem'}}></i>
            <span>You're in Viewer mode. Switch to Admin mode to add or edit transactions.</span>
          </ReadOnlyMessage>
        )}

        {/* Date Range Filter */}
        <DateFilterRow>
          <label style={{fontWeight: 600, color: '#1a1a2e'}}>📅 Date Range:</label>
          <FormInput
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={{maxWidth: '150px'}}
          />
          <span style={{color: '#999', fontWeight: 600}}>→</span>
          <FormInput
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={{maxWidth: '150px'}}
          />
          {(startDate || endDate) && (
            <button
              type="button"
              onClick={() => { setStartDate(''); setEndDate(''); }}
              style={{
                marginLeft: '1rem',
                background: 'rgba(123, 47, 242, 0.1)',
                color: '#7b2ff2',
                border: '2px solid #7b2ff2',
                borderRadius: '0.8rem',
                padding: '0.6rem 1.2rem',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#7b2ff2';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(123, 47, 242, 0.1)';
                e.target.style.color = '#7b2ff2';
              }}
            >
              Clear
            </button>
          )}
        </DateFilterRow>

        {/* Advanced Filters */}
        <FilterRow>
          <label style={{fontWeight: 600, color: '#1a1a2e'}}>💰 Amount:</label>
          <FormInput
            type="number"
            placeholder="Min"
            value={minAmount}
            onChange={e => setMinAmount(e.target.value)}
            style={{maxWidth: '100px'}}
          />
          <span style={{color: '#999', fontWeight: 600}}>→</span>
          <FormInput
            type="number"
            placeholder="Max"
            value={maxAmount}
            onChange={e => setMaxAmount(e.target.value)}
            style={{maxWidth: '100px'}}
          />
          <label style={{fontWeight: 600, color: '#1a1a2e'}}>📁 Category:</label>
          <FormSelect
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </FormSelect>
          <label style={{fontWeight: 600, color: '#1a1a2e'}}>🏷️ Type:</label>
          <FormSelect
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expense</option>
            <option value="investment">📈 Investment</option>
            <option value="saving">🏦 Saving</option>
          </FormSelect>
          {(minAmount || maxAmount || categoryFilter || typeFilter) && (
            <button
              type="button"
              onClick={() => { setMinAmount(''); setMaxAmount(''); setCategoryFilter(''); setTypeFilter(''); }}
              style={{
                background: 'rgba(243, 87, 168, 0.1)',
                color: '#f357a8',
                border: '2px solid #f357a8',
                borderRadius: '0.8rem',
                padding: '0.6rem 1.2rem',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f357a8';
                e.target.style.color = '#fff';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'rgba(243, 87, 168, 0.1)';
                e.target.style.color = '#f357a8';
              }}
            >
              Clear All Filters
            </button>
          )}
        </FilterRow>

        {/* Search Bar */}
        <SearchBar
          type="text"
          placeholder="Search by category, description, or type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        {/* Transaction List */}
        <TransactionList>
          <h3 style={{marginBottom:'1rem'}}>Transactions</h3>
          {loadingTx ? (
            <div style={{color:'#888',textAlign:'center',padding:'1.5rem'}}>
              <span className="shimmer" style={{display:'inline-block',width:120,height:18,background:'linear-gradient(90deg,#eee 25%,#f3f3f3 50%,#eee 75%)',backgroundSize:'200% 100%',animation:'shimmer 1.2s linear infinite',borderRadius:8}}></span>
              <style>{`@keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }`}</style>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div style={{color:'#888',textAlign:'center',padding:'1.5rem'}}>No transactions found.</div>
          ) : (
            filteredTransactions.map(tx => (
              <TransactionRow key={tx._id}>
                <span>{tx.date}</span>
                <span>{tx.category}</span>
                <span>{tx.description}</span>
                <TransactionAmount type={tx.type}>
                  {tx.type === 'expense' ? '-' : '+'}${Math.abs(tx.amount).toLocaleString()}
                </TransactionAmount>
                <span style={{fontSize:'0.95rem',color:'#aaa'}}>{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</span>
                <span>
                  {isAdmin && (
                    <>
                      <ActionButton title="Edit" onClick={() => handleEdit(tx)}><i className="fas fa-edit"></i></ActionButton>
                      <ActionButton title="Delete" onClick={() => handleDelete(tx._id)}><i className="fas fa-trash"></i></ActionButton>
                    </>
                  )}
                </span>
              </TransactionRow>
            ))
          )}
        </TransactionList>

        <CurrencySelectorRow>
          <label style={{fontWeight: 600, color: '#1a1a2e', fontSize: '1rem'}}>💱 Currency:</label>
          <FormSelect
            value={currency}
            onChange={e => {
              setCurrency(e.target.value);
              setLS('currency', e.target.value);
            }}
          >
            <option value="USD">🇺🇸 USD ($)</option>
            <option value="EUR">🇪🇺 EUR (€)</option>
            <option value="INR">🇮🇳 INR (₹)</option>
            <option value="GBP">🇬🇧 GBP (£)</option>
            <option value="JPY">🇯🇵 JPY (¥)</option>
            <option value="CAD">🇨🇦 CAD (C$)</option>
          </FormSelect>
        </CurrencySelectorRow>

        <CardsRow>
          {cards.map((card, idx) => (
            <GlassCard
              key={card.title}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.12, duration: 0.6, type: 'spring', stiffness: 80 }}
              whileHover={{ scale: 1.04, boxShadow: '0 12px 36px 0 rgba(67,206,162,0.18)' }}
          >
            <CardTitle>{card.title}</CardTitle>
            <CardValue>{card.value}</CardValue>
            <CardFooter>{card.footer}</CardFooter>
            <CardIcon>{card.icon}</CardIcon>
            <AnimatedWave
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 + idx * 0.08, duration: 0.7, type: 'spring', stiffness: 60 }}
            />
            </GlassCard>
        ))}
      </CardsRow>
        {savingsGoal > 0 && (
          <div style={{maxWidth:400,margin:'2rem auto 0 auto',background:'#fff',borderRadius:'1.5rem',boxShadow:'0 4px 24px rgba(80,80,180,0.10)',padding:'1.5rem 2rem'}}>
            <h3 style={{marginBottom:8}}>Savings Goal Progress</h3>
            <div style={{fontWeight:600,marginBottom:6}}>
              {currencySymbol}{totalSavings.toLocaleString()} / {currencySymbol}{savingsGoal.toLocaleString()}
            </div>
            <ProgressBar>
              <ProgressFill style={{width: `${savingsProgress}%`}} />
            </ProgressBar>
            <div style={{marginTop:8,fontWeight:500,color:'#43cea2'}}>
              {savingsProgress >= 100 ? 'Goal reached! 🎉' : `${savingsProgress.toFixed(1)}% of goal`}
            </div>
          </div>
        )}
      <ToggleButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowBar(v => !v)}
      >
        {showBar ? 'Show Line Chart' : 'Show Spend Bar Chart'}
      </ToggleButton>
      <ToggleButton
        style={{ marginTop: '0.7rem', background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)' }}
        whileHover={{ scale: 1.05, background: 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)' }}
        whileTap={{ scale: 0.97 }}
        onClick={triggerNotif}
      >
        Simulate Notification
      </ToggleButton>
      <ChartSection
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            color: '#7b2ff2',
            fontWeight: 700,
            fontSize: '1.5rem',
            marginBottom: '1.2rem',
            letterSpacing: '1px'
          }}
        >
          {showBar ? 'Monthly Spend (Bar Chart)' : 'Balance Growth (Line Chart)'}
        </motion.h2>
        <AnimatedChartWrapper
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.7 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            {showBar ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar
                  dataKey="spend"
                  fill="url(#barColor)"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
                <defs>
                  <linearGradient id="barColor" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f357a8" />
                    <stop offset="100%" stopColor="#7b2ff2" />
                  </linearGradient>
                </defs>
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <defs>
                  <linearGradient id="colorLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7b2ff2" />
                    <stop offset="100%" stopColor="#43cea2" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="balance"
                  stroke="url(#colorLine)"
                  strokeWidth={4}
                  dot={{ r: 7, fill: "#fff", stroke: "#7b2ff2", strokeWidth: 2 }}
                  activeDot={{ r: 10 }}
                  isAnimationActive={true}
                  animationDuration={1200}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </AnimatedChartWrapper>
      </ChartSection>
      <AnimatePresence>
        {showNotif && (
          <Notification
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <i className="fas fa-bell" style={{ marginRight: 10 }} />
            New transaction added!
          </Notification>
        )}
      </AnimatePresence>
        <ChartsRow>
          <ChartCard
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: 'spring', stiffness: 80 }}
          >
            <ChartTitle>Spending Trends</ChartTitle>
            <ResponsiveContainer width="100%" height={220} minWidth={280}>
              <LineChart data={spendingTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#aaa" fontSize={13} />
                <YAxis stroke="#aaa" fontSize={13} />
                <Tooltip />
                <Line type="monotone" dataKey="spend" stroke="#7b2ff2" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
          <ChartCard
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, type: 'spring', stiffness: 80 }}
          >
            <ChartTitle>Category Breakdown</ChartTitle>
            <ResponsiveContainer width="100%" height={220} minWidth={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  fill="#7b2ff2"
                  label
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>
        </ChartsRow>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, type: 'spring', stiffness: 80 }}
          style={{ width: '100%', maxWidth: 900, margin: '2.5rem auto 0 auto', background: '#fff', borderRadius: '2rem', boxShadow: '0 8px 40px rgba(80,80,180,0.13)', padding: '2rem 2rem 2.5rem 2rem' }}
        >
          <h2 style={{ color: '#43cea2', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.2rem', letterSpacing: '1px' }}>AI Insights</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem', justifyContent: 'center' }}>
            <div style={{ flex: '1 1 320px', minWidth: 320, maxWidth: 420, background: '#e0f7fa', borderRadius: '1.2rem', padding: '1.5rem 2rem', boxShadow: '0 2px 8px #43cea233', marginBottom: 16 }}>
              <h4 style={{ color: '#7b2ff2', marginBottom: 8 }}>Spending Prediction</h4>
              {aiSpendingPrediction !== null ? (
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#43cea2', marginBottom: 6 }}>{currencySymbol}{aiSpendingPrediction.toLocaleString()}</div>
              ) : (
                <div style={{ color: '#888' }}>Not enough data yet</div>
              )}
              <div style={{ fontSize: '1.05rem', color: '#888' }}>Predicted expenses for next month (AI-powered)</div>
            </div>
            <div style={{ flex: '1 1 320px', minWidth: 320, maxWidth: 420, background: '#fff3e0', borderRadius: '1.2rem', padding: '1.5rem 2rem', boxShadow: '0 2px 8px #f7971e33', marginBottom: 16 }}>
              <h4 style={{ color: '#f7971e', marginBottom: 8 }}>Smart Tip</h4>
              <div style={{ fontSize: '1.15rem', color: '#232526', fontWeight: 600 }}>{smartTip}</div>
            </div>
            {highestSpendingCategory && (
              <div style={{ flex: '1 1 320px', minWidth: 320, maxWidth: 420, background: '#f3e8ff', borderRadius: '1.2rem', padding: '1.5rem 2rem', boxShadow: '0 2px 8px #7b2ff233', marginBottom: 16 }}>
                <h4 style={{ color: '#7b2ff2', marginBottom: 8 }}>Highest Spending Category</h4>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f357a8', marginBottom: 6 }}>{highestSpendingCategory[0]}</div>
                <div style={{ fontSize: '1.15rem', color: '#232526', fontWeight: 600 }}>{currencySymbol}{highestSpendingCategory[1].toLocaleString()}</div>
              </div>
            )}
            {monthlyComparison && (
              <div style={{ flex: '1 1 320px', minWidth: 320, maxWidth: 420, background: '#e0ffe0', borderRadius: '1.2rem', padding: '1.5rem 2rem', boxShadow: '0 2px 8px #43cea233', marginBottom: 16 }}>
                <h4 style={{ color: '#185a9d', marginBottom: 8 }}>Monthly Comparison</h4>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: monthlyComparison.percentageChange > 0 ? '#f357a8' : '#43cea2', marginBottom: 6 }}>
                  {monthlyComparison.percentageChange > 0 ? '↑' : '↓'} {Math.abs(monthlyComparison.percentageChange).toFixed(1)}%
                </div>
                <div style={{ fontSize: '0.95rem', color: '#232526' }}>
                  This month: {currencySymbol}{monthlyComparison.currentMonth.toLocaleString()} vs Last month: {currencySymbol}{monthlyComparison.previousMonth.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </motion.div>
        {showOnboarding && (
          <OnboardingModalBg>
            <OnboardingModalCard>
              <div style={{fontSize:'2rem',marginBottom:12}}>{tips.icon}</div>
              <h2 style={{color:'#7b2ff2',marginBottom:10}}>Welcome!</h2>
              <div style={{fontWeight:600,marginBottom:18}}>{tips.welcome}</div>
              <ul style={{marginBottom:18}}>
                {tips.tips.map((t, i) => <li key={i} style={{marginBottom:6}}>{t}</li>)}
              </ul>
              <button
                style={{background:'#43cea2',color:'#fff',border:'none',borderRadius:'0.7rem',padding:'0.7rem 1.5rem',fontWeight:700,fontSize:'1.1rem',cursor:'pointer'}}
                onClick={() => setShowOnboarding(false)}
              >Get Started</button>
            </OnboardingModalCard>
          </OnboardingModalBg>
        )}

        <TipsCard color={tips.color}>
          <div style={{display:'flex',alignItems:'center',marginBottom:6}}>{tips.icon}<span style={{fontWeight:700,fontSize:'1.1rem'}}>{tips.title}</span></div>
          <ul style={{margin:0,paddingLeft:18}}>
            {tips.tips.map((t, i) => <li key={i} style={{marginBottom:4}}>{t}</li>)}
          </ul>
        </TipsCard>
      </DashboardContainer>
    </DashboardBg>
  );
}

export default Dashboard;


