
import React, { useState, useEffect } from 'react';
// Fixed: Corrected modular imports for Firebase Auth by ensuring named exports are used correctly and adding type for User
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from './services/firebase';
import StudySolverScreen from './screens/StudySolverScreen';
import AuthScreen from './screens/AuthScreen';
import LandingScreen from './screens/LandingScreen';

type AppState = 'landing' | 'auth' | 'app';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<AppState>('landing');

  useEffect(() => {
    // Modular onAuthStateChanged takes auth instance as first argument
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setView('app');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-charcoal-950">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Initializing Workspace</p>
        </div>
      </div>
    );
  }

  // If logged in, always show app
  if (user) return <StudySolverScreen />;

  // Switch between landing and auth for non-logged-in users
  return view === 'landing' ? (
    <LandingScreen onGetStarted={() => setView('auth')} />
  ) : (
    <AuthScreen onBackToLanding={() => setView('landing')} />
  );
};

export default App;
