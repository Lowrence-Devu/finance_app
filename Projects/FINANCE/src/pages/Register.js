import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from '../context/AuthContext';

const RegisterContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
`;

const RegisterBox = styled.div`
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  min-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.7rem 1rem;
  margin-bottom: 1.2rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.7rem;
  font-size: 1rem;
  background: #fafafa;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.7rem 1rem;
  background: linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%);
  color: #fff;
  border: none;
  border-radius: 0.7rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
`;

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleRegister = async e => {
    e.preventDefault();
    setError('');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, {
        displayName: name,
        photoURL: avatar || 'https://i.pravatar.cc/40?img=8'
      });
      login({
        name,
        avatar: avatar || 'https://i.pravatar.cc/40?img=8'
      });
      navigate('/');
    } catch (err) {
      setError('Registration failed. Try a different email.');
    }
  };

  return (
    <RegisterContainer>
      <RegisterBox>
        <h2 style={{ color: '#7b2ff2', marginBottom: '1rem' }}>Register</h2>
        {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input
            type="url"
            placeholder="Avatar URL (optional)"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
          />
          <Button type="submit">Create Account</Button>
        </form>
        <div style={{ marginTop: 18, textAlign: 'center' }}>
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: '#7b2ff2', fontWeight: 600 }}>Login</Link>
        </div>
      </RegisterBox>
    </RegisterContainer>
  );
}

export default Register;
