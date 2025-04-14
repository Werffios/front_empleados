// components/NavBar.tsx
'use client';
import Link from 'next/link';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
    const { token, logout } = useContext(AuthContext);

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="font-bold text-xl">GestionApp</Link>
                    {token && (
                        <div className="hidden md:flex space-x-4">
                            <Link href="/workers" className="hover:text-blue-300 transition-colors">
                                Empleados
                            </Link>
                            <Link href="/requests" className="hover:text-blue-300 transition-colors">
                                Solicitudes
                            </Link>
                        </div>
                    )}
                </div>
                <div>
                    {token ? (
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    ) : (
                        <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                            Iniciar Sesión
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;