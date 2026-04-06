import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

/* ================= STYLES ================= */

const AuthBg = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 1rem;
`;

const AuthCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e2e8f0;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  margin-bottom: 0.8rem;

  &:focus {
    outline: none;
    border-color: #6366f1;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.9rem;
  border-radius: 8px;
  border: none;
  background: #6366f1;
  color: white;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    background: #4f46e5;
  }
`;

const GoogleButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    background: #f1f5f9;
  }
`;

const ErrorMsg = styled.div`
  color: #ef4444;
  font-size: 0.9rem;
  text-align: center;
`;

const SwitchText = styled.div`
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;

  span {
    color: #6366f1;
    cursor: pointer;
    font-weight: 600;
  }
`;

/* ================= COMPONENT ================= */

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [regError, setRegError] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [isRegister, setIsRegister] = useState(false);

  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  /* ===== LOGIN ===== */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await login({ email, password });

    setSubmitting(false);
    if (!result.success) setError(result.error);
  };

  /* ===== REGISTER ===== */
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    setSubmitting(true);

    const result = await login({
      name: regName,
      email: regEmail,
      password: regPassword,
    });

    setSubmitting(false);
    if (!result.success) setRegError(result.error);
  };

  /* ===== GOOGLE ===== */
  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);

      const backendRes = await login({
        email: result.user.email,
        name: result.user.displayName,
        avatar: result.user.photoURL,
      });

      if (!backendRes.success) setError(backendRes.error);
    } catch {
      setError('Google sign-in failed');
    } finally {
      setGoogleLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <AuthBg>
      <AuthCard>
        <Title>{isRegister ? "Create Account" : "Sign in to FinDash"}</Title>

        {/* ERROR */}
        {(error || regError) && (
          <ErrorMsg>{error || regError}</ErrorMsg>
        )}

        {/* LOGIN */}
        {!isRegister ? (
          <form onSubmit={handleLogin}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button type="submit">
              {submitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        ) : (
          /* REGISTER */
          <form onSubmit={handleRegister}>
            <Input
              type="text"
              placeholder="Full Name"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />

            <Input
              type="email"
              placeholder="Email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />

            <Button type="submit">
              {submitting ? "Creating..." : "Create Account"}
            </Button>
          </form>
        )}

        {/* GOOGLE */}
        <GoogleButton onClick={handleGoogleLogin}>
          {googleLoading ? "Please wait..." : "Continue with Google"}
        </GoogleButton>

        {/* SWITCH */}
        <SwitchText>
          {isRegister ? (
            <>
              Already have an account?{" "}
              <span onClick={() => setIsRegister(false)}>Sign In</span>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setIsRegister(true)}>Register</span>
            </>
          )}
        </SwitchText>
      </AuthCard>
    </AuthBg>
  );
}

export default Login;