// app/login/page.tsx
'use client';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toast';
import axiosInstance from '../lib/axiosInstance';

type FormData = {
    username: string;
    password: string;
};

const LoginPage = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { login } = useContext(AuthContext);
    const router = useRouter();

    const onSubmit = async (data: FormData) => {
        try {
            const response = await axiosInstance.post('/login', data);
            if (response.data && response.data.token) {
                login(response.data.token);
                toast('Login exitoso!');
                router.push('/');
            } else {
                toast('Error: Respuesta del servidor inválida');
            }
        } catch (error) {
            console.error('Error en login', error);
            toast('Error en login, verifica tus credenciales');
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-md mt-10">
            <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
                    <p className="text-gray-500 mt-2">Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
                        <input
                            type="text"
                            {...register('username', { required: 'Este campo es requerido' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese su usuario"
                        />
                        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Este campo es requerido' })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Ingrese su contraseña"
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
                    >
                        Ingresar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;