// app/layout.tsx
import './globals.css';
import {AuthProvider} from './context/AuthContext';
import NavBar from './components/NavBar';

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es">
        <body className="min-h-screen bg-gray-50">
        <AuthProvider>
            <div className="flex flex-col min-h-screen">
                <NavBar/>
                <main className="flex-1 container mx-auto px-4 py-8">
                    {children}
                </main>
                <footer className="bg-gray-800 text-white text-center py-4">
                    <p className="text-sm">© {new Date().getFullYear()} - Sistema de Gestión</p>
                </footer>
            </div>
        </AuthProvider>
        </body>
        </html>
    );
}