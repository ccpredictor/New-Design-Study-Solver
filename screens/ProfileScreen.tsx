
import React, { useState, useEffect, useRef } from 'react';
import { doc, updateDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';
// Fixed: Corrected modular named exports for Firebase Auth services and added type keyword for User interface
import { updateProfile, type User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../services/firebase';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL?: string;
  phone?: string;
  dial_code?: string;
  dob?: string;
  gender?: string;
  grade?: string;
  semester?: string;
  schoolType?: string;
  medium?: string;
  city?: string;
  state?: string;
  country?: string;
  stats?: {
    problemsSolved: number;
  };
  lastActive?: any;
  createdAt?: any;
}

const ProfileScreen: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const user = auth.currentUser;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tempProfile, setTempProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    const profileRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(profileRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        if (!isEditing) {
          setTempProfile(data);
        }
      }
      setLoading(false);
    });

    const sessionsRef = collection(db, 'users', user.uid, 'chats');
    getDocs(sessionsRef).then(snap => setSessionCount(snap.size));

    return () => unsubscribeProfile();
  }, [user, isEditing]);

  const toggleEditing = () => {
    if (isEditing) {
      handleSaveAll();
    } else {
      setTempProfile(profile);
      setIsEditing(true);
    }
  };

  const handleLocalChange = (field: string, value: any) => {
    setTempProfile(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSaveAll = async () => {
    if (!user || !tempProfile) return;
    setSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { ...tempProfile });
      
      if (tempProfile.displayName !== user.displayName) {
        // Modular updateProfile takes the user instance as first argument
        await updateProfile(user, { displayName: tempProfile.displayName });
      }
      setIsEditing(false);
    } catch (e) {
      console.error("Save Error:", e);
      alert("Error saving profile changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setSaving(true);
    try {
      const storageRef = ref(storage, `profiles/${user.uid}/avatar`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Modular updateProfile takes the user instance as first argument
      await updateProfile(user, { photoURL: downloadURL });
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { photoURL: downloadURL });
    } catch (e) {
      console.error("Upload Error:", e);
      alert("Failed to upload image.");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    const date = timestamp.toMillis ? new Date(timestamp.toMillis()) : new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center bg-[#fcfdfe] dark:bg-charcoal-900">
      <div className="animate-pulse text-indigo-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing...</div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#fcfdfe] dark:bg-charcoal-900">
      <div className="max-w-5xl mx-auto px-6 py-12 pb-32">
        
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-500 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
          
          <button 
            onClick={toggleEditing}
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border ${isEditing ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-100 shadow-lg' : 'bg-white dark:bg-charcoal-800 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-white/5 hover:bg-indigo-50 dark:hover:bg-charcoal-800/80'}`}
          >
            {isEditing ? 'Save & Exit' : 'Edit Profile'}
          </button>
        </div>

        <div className="bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[40px] p-8 md:p-12 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-10">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 bg-gradient-to-tr from-[#a5a6f6] to-[#7c7ef1] rounded-[48px] flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-indigo-100 dark:shadow-none overflow-hidden ring-4 ring-white dark:ring-charcoal-900">
                {profile?.photoURL ? (
                  <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  profile?.displayName?.charAt(0) || 'S'
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>

            <div className="flex-1 text-center md:text-left">
              <InputWrapper 
                label="Full Name" 
                value={tempProfile?.displayName} 
                field="displayName" 
                isEditing={isEditing} 
                onChange={handleLocalChange}
                variant="title"
              />
              <p className="text-sm text-slate-400 font-medium mb-4 mt-2 uppercase tracking-tighter">{profile?.email}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 px-4 py-2 bg-slate-50 dark:bg-charcoal-900 text-slate-500 dark:text-slate-400 rounded-2xl text-[10px] font-bold uppercase tracking-widest border border-slate-100 dark:border-white/5 inline-flex">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Member Since {formatDate(profile?.createdAt || user?.metadata.creationTime)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[40px] p-10 shadow-sm">
            <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-8 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span> Personal 
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <InputWrapper label="Code" value={tempProfile?.dial_code} field="dial_code" isEditing={isEditing} onChange={handleLocalChange} />
                <div className="col-span-2">
                  <InputWrapper label="Phone" value={tempProfile?.phone} field="phone" isEditing={isEditing} onChange={handleLocalChange} />
                </div>
              </div>
              <InputWrapper label="Birth Date" value={tempProfile?.dob} field="dob" type="date" isEditing={isEditing} onChange={handleLocalChange} />
              <InputWrapper 
                label="Gender" 
                value={tempProfile?.gender} 
                field="gender" 
                type="select" 
                options={["Male", "Female", "Other"]} 
                isEditing={isEditing} 
                onChange={handleLocalChange} 
              />
            </div>
          </div>

          <div className="bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[40px] p-10 shadow-sm">
            <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-8 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span> Education
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <InputWrapper 
                  label="Grade" 
                  value={tempProfile?.grade} 
                  field="grade" 
                  type="select"
                  options={["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Undergraduate", "Postgraduate", "PhD"]}
                  isEditing={isEditing} 
                  onChange={handleLocalChange} 
                />
                <InputWrapper 
                  label="Semester" 
                  value={tempProfile?.semester} 
                  field="semester" 
                  type="select"
                  options={["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8", "N/A"]}
                  isEditing={isEditing} 
                  onChange={handleLocalChange} 
                />
              </div>
              <InputWrapper label="School/Univ" value={tempProfile?.schoolType} field="schoolType" isEditing={isEditing} onChange={handleLocalChange} />
              <InputWrapper 
                label="Medium" 
                value={tempProfile?.medium} 
                field="medium" 
                type="select" 
                options={["English", "Hindi", "Gujarati", "Marathi", "Tamil", "Telugu", "Bengali"]} 
                isEditing={isEditing} 
                onChange={handleLocalChange} 
              />
            </div>
          </div>

          <div className="bg-white dark:bg-charcoal-800 border border-slate-100 dark:border-white/5 rounded-[40px] p-10 shadow-sm lg:col-span-2">
            <h3 className="text-xs font-black text-indigo-500 uppercase tracking-widest mb-8 flex items-center">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span> Location Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <InputWrapper label="City" value={tempProfile?.city} field="city" isEditing={isEditing} onChange={handleLocalChange} />
              <InputWrapper label="State" value={tempProfile?.state} field="state" isEditing={isEditing} onChange={handleLocalChange} />
              <InputWrapper label="Country" value={tempProfile?.country} field="country" isEditing={isEditing} onChange={handleLocalChange} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface InputWrapperProps {
  label: string;
  value: any;
  field: string;
  isEditing: boolean;
  type?: string;
  options?: string[];
  onChange: (field: string, val: any) => void;
  variant?: 'default' | 'title';
}

const InputWrapper: React.FC<InputWrapperProps> = ({ 
  label, value, field, isEditing, type = "text", options = [], onChange, variant = 'default' 
}) => {
  if (!isEditing) {
    if (variant === 'title') {
      return <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">{value || 'Student User'}</h1>;
    }
    return (
      <div className="space-y-2">
        <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
        <div className="py-3 px-4 bg-slate-50 dark:bg-charcoal-900 rounded-2xl text-sm text-slate-700 dark:text-slate-300 font-bold border border-transparent">
          {value || <span className="text-slate-300 dark:text-slate-700 font-medium">Not set</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</label>
      {type === "select" ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl py-3 px-4 text-sm text-slate-800 dark:text-slate-200 font-bold focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
        >
          <option value="">Select {label}</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className={`w-full bg-slate-50 dark:bg-charcoal-900 border border-slate-100 dark:border-white/5 rounded-2xl py-3 px-4 text-slate-800 dark:text-white focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none ${variant === 'title' ? 'text-2xl font-black tracking-tight' : 'text-sm font-bold'}`}
        />
      )}
    </div>
  );
};

export default ProfileScreen;
