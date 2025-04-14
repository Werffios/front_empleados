// context/AuthContext.tsx
'use client';
import { createContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type AuthContextType = {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
    token: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) setToken(storedToken);
    }, []);

    const login = (token: string) => {
        setToken(token);
        localStorage.setItem('token', token);
        router.push('/'); // redirigir al dashboard o página de inicio
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
