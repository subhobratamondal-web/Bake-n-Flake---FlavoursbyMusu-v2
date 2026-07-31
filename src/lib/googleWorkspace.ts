import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Provider with Google Calendar and Google Tasks Scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/calendar');
provider.addScope('https://www.googleapis.com/auth/calendar.events');
provider.addScope('https://www.googleapis.com/auth/tasks');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Cached token lost on reload; prompt sign-in when requested
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve Google Access Token from Auth Provider.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const googleSignOut = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// ==================== GOOGLE CALENDAR API ====================

export interface GCalEvent {
  id: string;
  summary: string;
  description?: string;
  start: { date?: string; dateTime?: string };
  end?: { date?: string; dateTime?: string };
  htmlLink?: string;
}

export const fetchGoogleCalendarEvents = async (token: string): Promise<GCalEvent[]> => {
  try {
    const timeMin = new Date().toISOString();
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&singleEvents=true&orderBy=startTime&maxResults=50`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    if (!res.ok) {
      const errText = await res.text();
      console.error('Fetch Calendar Error:', errText);
      throw new Error(`Google Calendar API Error (${res.status})`);
    }
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error('Failed to fetch Google Calendar events:', err);
    throw err;
  }
};

export const createGoogleCalendarEvent = async (
  token: string,
  eventData: { title: string; description?: string; date: string }
): Promise<GCalEvent> => {
  try {
    const body = {
      summary: eventData.title,
      description: eventData.description || 'Bakery reminder created via Bake n Flake',
      start: { date: eventData.date },
      end: { date: eventData.date }
    };
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Create Calendar Event Error:', errText);
      throw new Error(`Google Calendar API Error (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to create Google Calendar event:', err);
    throw err;
  }
};

export const deleteGoogleCalendarEvent = async (token: string, eventId: string): Promise<boolean> => {
  const confirmed = window.confirm('Are you sure you want to delete this event from your Google Calendar?');
  if (!confirmed) return false;

  try {
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete Google Calendar event:', err);
    throw err;
  }
};

// ==================== GOOGLE TASKS API ====================

export interface GTask {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  updated?: string;
}

export const fetchGoogleTasks = async (token: string): Promise<GTask[]> => {
  try {
    const res = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=true&maxResults=50', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Fetch Tasks Error:', errText);
      throw new Error(`Google Tasks API Error (${res.status})`);
    }
    const data = await res.json();
    return data.items || [];
  } catch (err) {
    console.error('Failed to fetch Google Tasks:', err);
    throw err;
  }
};

export const createGoogleTask = async (
  token: string,
  taskData: { title: string; notes?: string; due?: string }
): Promise<GTask> => {
  try {
    const body: any = {
      title: taskData.title,
      notes: taskData.notes || 'Bake n Flake Bakery task'
    };
    if (taskData.due) {
      body.due = new Date(taskData.due).toISOString();
    }
    const res = await fetch('https://www.googleapis.com/tasks/v1/lists/@default/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Create Task Error:', errText);
      throw new Error(`Google Tasks API Error (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to create Google Task:', err);
    throw err;
  }
};

export const toggleGoogleTaskStatus = async (
  token: string,
  taskId: string,
  currentStatus: 'needsAction' | 'completed'
): Promise<GTask> => {
  const newStatus = currentStatus === 'completed' ? 'needsAction' : 'completed';
  try {
    const res = await fetch(`https://www.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Toggle Task Error:', errText);
      throw new Error(`Google Tasks API Error (${res.status})`);
    }
    return await res.json();
  } catch (err) {
    console.error('Failed to toggle Google Task status:', err);
    throw err;
  }
};

export const deleteGoogleTask = async (token: string, taskId: string): Promise<boolean> => {
  const confirmed = window.confirm('Are you sure you want to delete this task from Google Tasks?');
  if (!confirmed) return false;

  try {
    const res = await fetch(`https://www.googleapis.com/tasks/v1/lists/@default/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.ok;
  } catch (err) {
    console.error('Failed to delete Google Task:', err);
    throw err;
  }
};
