import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  healthPermissionRequested: boolean;
  healthPermissionGranted: boolean;
  showHealthPermissionModal: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  setHealthPermissionGranted: (granted: boolean) => void;
  setHealthPermissionRequested: (requested: boolean) => void;
  setShowHealthPermissionModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [healthPermissionRequested, setHealthPermissionRequested] = useState(false);
  const [healthPermissionGranted, setHealthPermissionGranted] = useState(false);
  const [showHealthPermissionModal, setShowHealthPermissionModal] = useState(false);

  const login = async (email: string, password: string) => {

    await new Promise(resolve => setTimeout(resolve, 1000));
    

    const userData = {
      id: '1',
      firstName: 'Health',
      lastName: 'Warrior',
      email: email,
      age: 30,
      biologicalSex: 'M' as const,
      activityLevel: 'Moderate' as const,
      healthConditions: [],
      foodAllergies: [],
    };
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Show health permission modal after successful login if not already requested
    if (!healthPermissionRequested) {
      setTimeout(() => {
        setShowHealthPermissionModal(true);
      }, 1000); // Small delay to let the UI settle
    }
  };

  const register = async (userData: Partial<User>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(),
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      age: userData.age,
      biologicalSex: userData.biologicalSex,
      activityLevel: userData.activityLevel,
      healthConditions: userData.healthConditions || [],
      foodAllergies: userData.foodAllergies || [],
    };
    
    setUser(newUser);
    setIsAuthenticated(true);
    
    // Show health permission modal after successful registration if not already requested
    if (!healthPermissionRequested) {
      setTimeout(() => {
        setShowHealthPermissionModal(true);
      }, 1000); // Small delay to let the UI settle
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Reset health permission states on logout
    setHealthPermissionRequested(false);
    setHealthPermissionGranted(false);
    setShowHealthPermissionModal(false);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      healthPermissionRequested,
      healthPermissionGranted,
      showHealthPermissionModal,
      login,
      register,
      logout,
      updateUser,
      setHealthPermissionGranted,
      setHealthPermissionRequested,
      setShowHealthPermissionModal,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
