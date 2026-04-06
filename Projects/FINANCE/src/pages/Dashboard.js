import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { useRole } from '../context/RoleContext';
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts';

/* ================= CLEAN UI ================= */

const Wrapper = styled.div`
  min-height: 100vh;
  padding: 80px 16px 80px;
  background: ${({ theme }) => theme.mode === 'dark' ? '#0b0f14' : '#f5f7fb'};
`;

const Container = styled.div`
  max-width: 1100px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 700;
`;

const Subtitle = styled.span`
  font-size: 13px;
  color: ${({ theme }) => theme.subText};
`;

/* ================= CARDS ================= */

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const CardLabel = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.subText};
`;

const CardValue = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

/* ================= CHART ================= */

const ChartBox = styled.div`
  background: ${({ theme }) => theme.card};
  padding: 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`;

/* ================= LIST ================= */

const List = styled.div`
  background: ${({ theme }) => theme.card};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 10px;
  font-size: 13px;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  @media(max-width:600px){
    grid-template-columns: 1fr 1fr;
  }
`;

const Amount = styled.span`
  color: ${({ type }) =>
    type === 'income' ? '#16a34a' :
    type === 'expense' ? '#dc2626' : '#2563eb'};
`;

/* ================= DASHBOARD ================= */

function Dashboard() {
  const { user, token } = useAuth();
  const { isAdmin } = useRole();

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!token) return;

    fetch('http://localhost:5000/api/transactions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTransactions(data?.data || data || []));
  }, [token]);

  /* ================= CALCULATIONS ================= */

  const total = useMemo(() =>
    transactions.reduce((a, t) => a + t.amount, 0),
    [transactions]
  );

  const income = useMemo(() =>
    transactions.filter(t => t.type === 'income')
      .reduce((a, t) => a + t.amount, 0),
    [transactions]
  );

  const expense = useMemo(() =>
    transactions.filter(t => t.type === 'expense')
      .reduce((a, t) => a + Math.abs(t.amount), 0),
    [transactions]
  );

  const chartData = transactions.map(t => ({
    date: t.date,
    amount: t.amount
  }));

  return (
    <Wrapper>
      <Container>

        {/* HEADER */}
        <Header>
          <Title>Dashboard</Title>
          <Subtitle>
            Welcome {user?.name || 'User'}
          </Subtitle>
        </Header>

        {/* CARDS */}
        <CardGrid>
          <Card>
            <CardLabel>Total Balance</CardLabel>
            <CardValue>${total}</CardValue>
          </Card>

          <Card>
            <CardLabel>Income</CardLabel>
            <CardValue>${income}</CardValue>
          </Card>

          <Card>
            <CardLabel>Expenses</CardLabel>
            <CardValue>${expense}</CardValue>
          </Card>
        </CardGrid>

        {/* CHART */}
        <ChartBox>
          <h4>Overview</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" />
            </LineChart>
          </ResponsiveContainer>
        </ChartBox>

        {/* TRANSACTIONS */}
        <List>
          {transactions.map(tx => (
            <Row key={tx._id}>
              <span>{tx.category}</span>
              <Amount type={tx.type}>
                {tx.type === 'expense' ? '-' : '+'}${tx.amount}
                {tx.type === 'transfer' && ' (Transfer)'}
                {tx.type === 'investment' && ' (Investment)'}
                {tx.type === 'saving' && ' (Saving)'}
                
              </Amount>
              <span>{tx.date}</span>
            </Row>
          ))}
        </List>

      </Container>
    </Wrapper>
  );
}

export default Dashboard;