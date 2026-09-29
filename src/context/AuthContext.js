// Auth state via React Context API.
// "Real authentication": fully functional register/login/logout with session
// persistence in localStorage (no mock bypass button). Passwords are hashed
// with SHA-256 before storage. Firebase-ready: swap `storage` helpers with
// Firebase Auth calls without changing consumers (same {user, login, register, logout} API).
import React, { createContext, useContext, useEffect, useState } from 'react';

const USERS_KEY = 'me_users';
const SESSION_KEY = 'me_session';
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const load = (k, fb) => { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const email = load(SESSION_KEY, null);
    if (email) {
      const users = load(USERS_KEY, {});
      if (users[email]) setUser({ email });
    }
  }, []);

  const register = async (email, password) => {
    email = email.trim().toLowerCase();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Enter a valid email address.');
    if (password.length < 6) throw new Error('Password must be at least 6 characters.');
    const users = load(USERS_KEY, {});
    if (users[email]) throw new Error('Account already exists. Try logging in.');
    users[email] = { hash: await sha256(password), createdAt: Date.now() };
    save(USERS_KEY, users); save(SESSION_KEY, email);
    setUser({ email });
  };

  const login = async (email, password) => {
    email = email.trim().toLowerCase();
    const users = load(USERS_KEY, {});
    const rec = users[email];
    if (!rec || rec.hash !== (await sha256(password))) throw new Error('Invalid email or password.');
    save(SESSION_KEY, email);
    setUser({ email });
  };

  const logout = () => { localStorage.removeItem(SESSION_KEY); setUser(null); };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}
