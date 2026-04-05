import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from '../context/AuthContext';

// Complete theme object with all properties
const lightTheme = {
  mode: 'light',
  background: "#f8f9fc",
  card: "#ffffff",
  text: "#1a1a2e",
  accent: "#7b2ff2",
  button: "linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)",
  border: "#e8e8f0",
  inputBg: "#f3f4f9",
  inputBorder: "#d8d8e8",
  hover: "rgba(123,47,242,0.08)"
};
const darkTheme = {
  mode: 'dark',
  background: "#0f1117",
  card: "#1a1d2e",
  text: "#e4e9f0",
  accent: "#43cea2",
  button: "linear-gradient(90deg, #43cea2 0%, #7b2ff2 100%)",
  border: "#2d2d44",
  inputBg: "#232335",
  inputBorder: "#3d3d56",
  hover: "rgba(67,206,162,0.12)"
};

const ProfileMain = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.background};
  padding: 3rem 1.5rem 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: 768px) {
    padding: 2.5rem 1.2rem 2rem 1.2rem;
  }
  @media (max-width: 480px) {
    padding: 2rem 1rem;
  }
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.card};
  border-radius: 1.8rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) => theme.mode === 'dark' ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(123,47,242,0.12)'};
  border: 1px solid ${({ theme }) => theme.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(123,47,242,0.1)'};
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 520px;
  margin-bottom: 2rem;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: 600px) {
    padding: 2rem 1.5rem;
    border-radius: 1.5rem;
  }
  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const Tabs = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(26,29,46,0.6)' : 'rgba(248,249,252,0.6)'};
  padding: 1rem;
  border-radius: 1.2rem;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  @media (max-width: 600px) {
    gap: 0.8rem;
    padding: 0.8rem;
  }
`;

const Tab = styled.button`
  background: ${({ active, theme }) => active ? (theme.mode === 'dark' ? 'rgba(123,47,242,0.2)' : 'rgba(123,47,242,0.1)') : 'transparent'};
  border: 1.5px solid ${({ active, theme }) => active ? '#7b2ff2' : 'transparent'};
  color: ${({ active, theme }) => (active ? '#7b2ff2' : theme.text)};
  font-weight: 700;
  font-size: 1rem;
  border-radius: 0.8rem;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  @media (max-width: 600px) {
    font-size: 0.95rem;
    padding: 0.5rem 1.2rem;
  }
  &:hover {
    background: ${({ theme }) => theme.hover};
    transform: translateY(-2px);
  }
`;

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.accent};
  margin-bottom: 1rem;
  box-shadow: 0 8px 24px rgba(123,47,242,0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    border: 3px solid ${({ theme }) => theme.accent};
  }
  &:hover {
    transform: scale(1.05) rotateZ(2deg);
    box-shadow: 0 12px 32px rgba(123,47,242,0.35);
  }
`;

const AvatarInput = styled.input`
  display: none;
`;

const AvatarLabel = styled.label`
  background: linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%);
  color: #fff;
  border-radius: 0.8rem;
  padding: 0.6rem 1.6rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-block;
  text-align: center;
  box-shadow: 0 4px 12px rgba(123,47,242,0.3);
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(123,47,242,0.4);
  }
  &:active {
    transform: translateY(-1px);
  }
`;

const Section = styled(motion.div)`
  margin-bottom: 1.5rem;
  width: 100%;
  animation: fadeInUp 0.4s ease-out;
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.8rem;
  width: 100%;
  @media (max-width: 480px) {
    margin-bottom: 1.4rem;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 700;
  font-size: 0.95rem;
  color: ${({ theme }) => theme.text};
  margin-bottom: 0.6rem;
  text-transform: capitalize;
  letter-spacing: 0.3px;
  transition: color 0.3s ease;
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.85rem 1.2rem;
  border-radius: 0.8rem;
  border: 2px solid ${({ theme }) => theme.inputBorder};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
  &:focus {
    outline: none;
    border-color: #7b2ff2;
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(123,47,242,0.1)' : 'rgba(123,47,242,0.05)'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.mode === 'dark' ? 'rgba(123,47,242,0.2)' : 'rgba(123,47,242,0.1)'};
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)'};
  }
  &::placeholder {
    color: ${({ theme }) => theme.text};
    opacity: 0.5;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.85rem 1.2rem;
  border-radius: 0.8rem;
  border: 2px solid ${({ theme }) => theme.inputBorder};
  background: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.text};
  font-size: 1rem;
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%237b2ff2' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.2rem center;
  background-color: ${({ theme }) => theme.inputBg};
  padding-right: 2.8rem;
  @media (max-width: 480px) {
    padding: 0.75rem 2.5rem 0.75rem 1rem;
    font-size: 0.95rem;
  }
  &:focus {
    outline: none;
    border-color: #7b2ff2;
    background-color: ${({ theme }) => theme.mode === 'dark' ? 'rgba(123,47,242,0.1)' : 'rgba(123,47,242,0.05)'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.mode === 'dark' ? 'rgba(123,47,242,0.2)' : 'rgba(123,47,242,0.1)'};
  }
  option {
    background: ${({ theme }) => theme.card};
    color: ${({ theme }) => theme.text};
    padding: 0.6rem;
  }
`;

const SaveButton = styled.button`
  background: linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%);
  background-size: 200% 200%;
  color: #fff;
  border: none;
  border-radius: 0.9rem;
  padding: 0.75rem 2.2rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1.6rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(123,47,242,0.3);
  display: inline-block;
  width: 100%;
  text-align: center;
  @media (max-width: 480px) {
    padding: 0.7rem 1.8rem;
    font-size: 0.95rem;
  }
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(123,47,242,0.45);
    background-position: right center;
  }
  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function Profile() {
  const { user, token } = useAuth();
  const [theme, setTheme] = useState("light");
  const [tab, setTab] = useState("Profile");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [name, setName] = useState(user?.name || "Your Name");
  const [email, setEmail] = useState(user?.email || "you@email.com");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  // Settings state
  const [currency, setCurrency] = useState(user?.currency || "USD");
  const [goal, setGoal] = useState(user?.savingsGoal || "");
  const [userType, setUserType] = useState(user?.userType || "employee");

  // Avatar upload handler
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Save profile handler (with backend logic)
  const handleSaveProfile = async () => {
    setSaving(true);
    setError("");
    try {
      let avatarUrl = user?.avatar;
      // TODO: Implement avatar upload to backend or storage if needed
      // For now, use avatarPreview if set, else keep existing
      if (avatarPreview) avatarUrl = avatarPreview;
      const res = await fetch('http://localhost:5000/api/users/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          name,
          avatar: avatarUrl,
          userType,
          currency,
          savingsGoal: goal
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setName(data.user.name);
        setError("");
      } else {
        setError(data.error || 'Failed to save profile.');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  // Save settings handler (with backend logic)
  const handleSaveSettings = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch('http://localhost:5000/api/users/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          name,
          avatar: user?.avatar,
          userType,
          currency,
          savingsGoal: goal
        })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setCurrency(data.user.currency);
        setUserType(data.user.userType);
        setGoal(data.user.savingsGoal);
        setError("");
      } else {
        setError(data.error || 'Failed to save settings.');
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setSaving(false);
    }
  };

  // Tab content
  const renderTab = () => {
    switch (tab) {
      case "Profile":
        return (
          <Section
            key="profile"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <AvatarWrapper>
              <Avatar
                src={avatarPreview || user?.avatar || "/default-avatar.png"}
                alt="Avatar"
                theme={theme === "light" ? lightTheme : darkTheme}
                onError={e => { e.target.onerror = null; e.target.src = "/default-avatar.png"; }}
              />
              <AvatarLabel theme={theme === "light" ? lightTheme : darkTheme} htmlFor="avatar-upload">
                📷 Change Avatar
                <AvatarInput
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </AvatarLabel>
            </AvatarWrapper>
            <FormGroup>
              <FormLabel theme={theme === "light" ? lightTheme : darkTheme}>👤 Name</FormLabel>
              <FormInput
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                theme={theme === "light" ? lightTheme : darkTheme}
                placeholder="Your full name"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel theme={theme === "light" ? lightTheme : darkTheme}>📧 Email</FormLabel>
              <FormInput
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                theme={theme === "light" ? lightTheme : darkTheme}
                disabled
                placeholder="your@email.com"
              />
            </FormGroup>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#f87171',
                  color: '#fff',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '0.8rem',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}
            <SaveButton
              theme={theme === "light" ? lightTheme : darkTheme}
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? "💾 Saving..." : "✓ Save Profile"}
            </SaveButton>
          </Section>
        );
      case "Settings":
        return (
          <Section
            key="settings"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <FormGroup>
              <FormLabel theme={theme === "light" ? lightTheme : darkTheme}>👨‍💼 User Type</FormLabel>
              <FormSelect
                value={userType}
                onChange={e => setUserType(e.target.value)}
                theme={theme === "light" ? lightTheme : darkTheme}
              >
                <option value="employee">👔 Employee</option>
                <option value="business">🏢 Business Owner</option>
                <option value="student">🎓 Student (Pocket Money)</option>
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel theme={theme === "light" ? lightTheme : darkTheme}>💱 Preferred Currency</FormLabel>
              <FormSelect
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                theme={theme === "light" ? lightTheme : darkTheme}
              >
                <option value="USD">🇺🇸 USD ($)</option>
                <option value="EUR">🇪🇺 EUR (€)</option>
                <option value="INR">🇮🇳 INR (₹)</option>
                <option value="GBP">🇬🇧 GBP (£)</option>
                <option value="JPY">🇯🇵 JPY (¥)</option>
                <option value="CAD">🇨🇦 CAD (C$)</option>
              </FormSelect>
            </FormGroup>
            <FormGroup>
              <FormLabel theme={theme === "light" ? lightTheme : darkTheme}>🎯 Savings Goal</FormLabel>
              <FormInput
                type="number"
                value={goal}
                onChange={e => setGoal(e.target.value)}
                theme={theme === "light" ? lightTheme : darkTheme}
                placeholder="e.g. 5000"
              />
            </FormGroup>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#f87171',
                  color: '#fff',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '0.8rem',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                ⚠️ {error}
              </motion.div>
            )}
            <SaveButton
              theme={theme === "light" ? lightTheme : darkTheme}
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? "💾 Saving..." : "✓ Save Settings"}
            </SaveButton>
          </Section>
        );
      case "Security":
        return (
          <Section
            key="security"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
          >
            <FormGroup>
              <FormLabel theme={theme === "light" ? lightTheme : darkTheme}>🔐 Password</FormLabel>
              <FormInput
                type="password"
                value="••••••••"
                disabled
                theme={theme === "light" ? lightTheme : darkTheme}
              />
            </FormGroup>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  background: '#fbbf24',
                  color: '#000',
                  padding: '0.8rem 1.2rem',
                  borderRadius: '0.8rem',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  fontWeight: 600
                }}
              >
                ℹ️ Feature coming soon
              </motion.div>
            )}
            <SaveButton
              theme={theme === "light" ? lightTheme : darkTheme}
              style={{
                background: 'linear-gradient(90deg, #94a3b8 0%, #64748b 100%)',
                opacity: 0.7,
                cursor: 'not-allowed'
              }}
              disabled
            >
                🔒 Change Password (Coming Soon)
            </SaveButton>
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
      <ProfileMain theme={theme === "light" ? lightTheme : darkTheme}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '1.5rem', textAlign: 'center' }}
        >
          <h1 style={{
            fontSize: '2.2rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #7b2ff2 0%, #f357a8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            ⚙️ Settings & Profile
          </h1>
          <p style={{ color: theme === "light" ? lightTheme.text : darkTheme.text, opacity: 0.6, marginTop: '0.5rem' }}>
            Manage your account preferences and security
          </p>
        </motion.div>
        <Tabs theme={theme === "light" ? lightTheme : darkTheme}>
          {["Profile", "Settings", "Security"].map((t) => (
            <Tab
              key={t}
              active={tab === t}
              theme={theme === "light" ? lightTheme : darkTheme}
              onClick={() => setTab(t)}
            >
              {t === "Profile" && "👤"}
              {t === "Settings" && "⚙️"}
              {t === "Security" && "🔐"}
              {" "}{t}
            </Tab>
          ))}
          <Tab
            as="button"
            theme={theme === "light" ? lightTheme : darkTheme}
            style={{ marginLeft: "auto" }}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </Tab>
        </Tabs>
        <Card
          theme={theme === "light" ? lightTheme : darkTheme}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <AnimatePresence mode="wait">{renderTab()}</AnimatePresence>
        </Card>
      </ProfileMain>
    </ThemeProvider>
  );
}