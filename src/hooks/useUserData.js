import { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const useUserData = (userId) => {
  const [entries, setEntries] = useState({});
  const [userSettings, setUserSettings] = useState({
    theme: 'default',
    displayName: '',
    visibleCategories: {
      productive: true,
      healthy: true,
      social: true,
      creative: true,
      kind: true,
      mindful: true
    },
    customNames: {
      productive: 'Productive',
      healthy: 'Healthy',
      social: 'Social',
      creative: 'Creative',
      kind: 'Kind',
      mindful: 'Mindful'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserData(userId);
    }
  }, [userId]);

  const loadUserData = async (uid) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        
        if (data.entries) {
          setEntries(data.entries);
        }
        
        if (data.settings) {
          setUserSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setLoading(false);
  };

  const saveEntry = async (uid, dateKey, entry) => {
    try {
      const newEntries = { ...entries, [dateKey]: entry };
      setEntries(newEntries);
      
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { entries: newEntries }, { merge: true });
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const saveSettings = async (uid, settings) => {
    try {
      setUserSettings(settings);
      
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { settings: settings }, { merge: true });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return {
    entries,
    userSettings,
    loading,
    saveEntry,
    saveSettings,
    setUserSettings
  };
};