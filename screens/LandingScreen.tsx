import React, { useState, useEffect } from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import LandingHome from '../components/landing/LandingHome';
import LandingFeatures from '../components/landing/LandingFeatures';
import LandingAbout from '../components/landing/LandingAbout';
import LandingContact from '../components/landing/LandingContact';
import LandingRoadmap from '../components/landing/LandingRoadmap';
import LandingSuccessStories from '../components/landing/LandingSuccessStories';
import LandingPrivacyTerms from '../components/landing/LandingPrivacyTerms';
import LandingSupport from '../components/landing/LandingSupport';
import LandingContactTech from '../components/landing/LandingContactTech';

interface LandingScreenProps {
  onGetStarted: () => void;
}

export type LandingView = 'home' | 'features' | 'about' | 'contact' | 'roadmap' | 'success' | 'privacy' | 'support' | 'contact-tech';

const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted }) => {
  const [currentView, setCurrentView] = useState<LandingView>('home');

  // Dynamic Metadata for Landing Views
  useEffect(() => {
    const metaData: Record<LandingView, { title: string; desc: string; keywords: string }> = {
      home: {
        title: 'AI Study Solver - Master Any Subject',
        desc: 'Master Math, Physics, and more with Socratic AI solutions in English, Hindi, and Gujarati.',
        keywords: 'AI tutor, study assistant, socratic learning, homework helper'
      },
      features: {
        title: 'Features | AI Study Solver',
        desc: 'Explore advanced Vision AI, symbolic reasoning, and automated exam generation tools.',
        keywords: 'AI features, vision AI, math OCR, exam generator tech'
      },
      about: {
        title: 'Our Mission | AI Study Solver',
        desc: 'We are redefining pedagogy through context-aware AI. Learn about our Socratic approach.',
        keywords: 'about us, AI education mission, pedagogical AI'
      },
      contact: {
        title: 'Contact Support | AI Study Solver',
        desc: 'Reach out to our academic and technical support teams for help with your studies.',
        keywords: 'contact AI solver, support desk, student help'
      },
      roadmap: {
        title: 'Academic Roadmap | AI Study Solver',
        desc: 'A structured journey from initial doubt to professional-level subject mastery.',
        keywords: 'learning path, academic roadmap, study strategy'
      },
      success: {
        title: 'Success Stories | AI Study Solver',
        desc: 'See how thousands of students improved their grades and confidence with AI Study Solver.',
        keywords: 'student reviews, case studies, academic success'
      },
      privacy: {
        title: 'Privacy & Terms | AI Study Solver',
        desc: 'Our commitment to student data security, privacy by design, and ethical AI usage.',
        keywords: 'privacy policy, terms of service, ethical AI'
      },
      support: {
        title: 'Help Center | AI Study Solver',
        desc: 'Detailed documentation, FAQs, and STEM guides for mastering the platform.',
        keywords: 'help center, documentation, AI study tips'
      },
      'contact-tech': {
        title: 'Tech Command Center | AI Study Solver',
        desc: 'Developer access, API latency monitoring, and infrastructure transparency reports.',
        keywords: 'developer support, API status, system infrastructure'
      }
    };

    const current = metaData[currentView] || metaData['home'];
    document.title = current.title;
    
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', current.desc);
    
    const keywordsTag = document.querySelector('meta[name="keywords"]');
    if (keywordsTag) keywordsTag.setAttribute('content', current.keywords);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', current.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', current.desc);
  }, [currentView]);

  const renderContent = () => {
    switch (currentView) {
      case 'home': return <LandingHome onGetStarted={onGetStarted} />;
      case 'features': return <LandingFeatures />;
      case 'about': return <LandingAbout />;
      case 'contact': return <LandingContact />;
      case 'roadmap': return <LandingRoadmap />;
      case 'success': return <LandingSuccessStories />;
      case 'privacy': return <LandingPrivacyTerms />;
      case 'support': return <LandingSupport />;
      case 'contact-tech': return <LandingContactTech />;
      default: return <LandingHome onGetStarted={onGetStarted} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] dark:bg-charcoal-950 overflow-x-hidden selection:bg-indigo-500 selection:text-white transition-colors flex flex-col">
      <LandingHeader 
        currentView={currentView} 
        onNavigate={(v) => { setCurrentView(v as LandingView); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
        onGetStarted={onGetStarted} 
      />
      
      <main className="flex-1">
        {renderContent()}
      </main>

      <LandingFooter onNavigate={(v) => { setCurrentView(v as LandingView); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
    </div>
  );
};

export default LandingScreen;