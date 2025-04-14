// app/requests/page.tsx
'use client';
import {useEffect, useState} from 'react';
import axiosInstance from '../lib/axiosInstance';
import {useForm} from 'react-hook-form';
import {toast} from 'react-toast';
import {motion} from 'framer-motion';

import { sanitize, validate } from '../utils/security';

type RequestType = {
    id: number;
    codigo: string;
    descripcion: string;
    resumen: string;
    id_empleado: number;
};

type Worker = {
    id: number;
    nombre: string;
};

const RequestsPage = () => {
    const [requests, setRequests] = useState<RequestType[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const {register, handleSubmit, reset} = useForm<Partial<RequestType>>();
    const [editing, setEditing] = useState<boolean>(false);
    const [currentRequest, setCurrentRequest] = useState<RequestType | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadRequests = async () => {
        setLoading(true);
        try {
            const res = await axiosInstance.get('/requests');
            setRequests(res.data);
        } catch (error) {
            console.error(error);
            toast('Error cargando solicitudes');
        } finally {
            setLoading(false);
        }
    };

    const loadWorkers = async () => {
        try {
            const res = await axiosInstance.get('/workers');
            setWorkers(res.data);
        } catch (error) {
            console.error(error);
            toast('Error cargando empleados');
        }
    };

    useEffect(() => {
        Promise.all([loadRequests(), loadWorkers()]);
    }, []);

    const onSubmit = async (data: Partial<RequestType>) => {
    try {
        // Validate critical fields
        if (!validate.isNotEmpty(data.codigo) || !validate.isValidCode(data.codigo)) {
            toast('Código inválido');
            return;
        }

        // Sanitize inputs
        const sanitizedData = {
            codigo: sanitize.string(data.codigo),
            descripcion: sanitize.string(data.descripcion),
            resumen: sanitize.string(data.resumen),
            id_empleado: sanitize.number(data.id_empleado)
        };

        if (editing && currentRequest) {
            await axiosInstance.put(`/requests/${currentRequest.id}`, sanitizedData);
            toast('Solicitud actualizada');
        } else {
            await axiosInstance.post('/requests', sanitizedData);
            toast('Solicitud creada');
        }
        reset();
        setEditing(false);
        setCurrentRequest(null);
        loadRequests();
    } catch (error) {
        console.error(error);
        toast('Error en la operación');
    }
};

    const handleEdit = (req: RequestType) => {
        setEditing(true);
        setCurrentRequest(req);
        reset(req);
    };

    const handleDelete = async (id: number) => {
        try {
            await axiosInstance.delete(`/requests/${id}`);
            toast('Solicitud eliminada');
            loadRequests();
        } catch (error) {
            console.error(error);
            toast('Error al eliminar');
        }
    };

    const getWorkerName = (id_empleado: number) => {
        const worker = workers.find((w) => w.id === id_empleado);
        return worker ? worker.nombre : 'N/D';
    };

    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08
            }
        }
    };

    const itemVariants = {
        hidden: {x: -20, opacity: 0},
        visible: {
            x: 0,
            opacity: 1,
            transition: {duration: 0.4}
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <motion.h2
                className="text-3xl font-bold text-gray-800 mb-6"
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
            >
                Gestión de Solicitudes
            </motion.h2>

            <motion.div
                className="bg-white rounded-xl shadow-lg p-6 mb-8"
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.4}}
            >
                <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    {editing ? 'Editar Solicitud' : 'Nueva Solicitud'}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Código:</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                {...register('codigo', {required: true})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Empleado:</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                {...register('id_empleado', {required: true})}
                            >
                                <option value="">Seleccione un empleado</option>
                                {workers.map((worker) => (
                                    <option key={worker.id} value={worker.id}>
                                        {worker.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Descripción:</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                {...register('descripcion', {required: true})}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Resumen:</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                {...register('resumen', {required: true})}
                            />
                        </div>
                    </div>

                    <div className="flex items-center">
                        <motion.button
                            type="submit"
                            className={`px-4 py-2 rounded-md text-white font-medium ${editing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'} transition-colors shadow-md`}
                            whileHover={{scale: 1.03}}
                            whileTap={{scale: 0.97}}
                        >
                            {editing ? 'Actualizar Solicitud' : 'Crear Solicitud'}
                        </motion.button>

                        {editing && (
                            <motion.button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setCurrentRequest(null);
                                    reset({});
                                }}
                                className="ml-2 px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-medium shadow-md"
                                whileHover={{scale: 1.03}}
                                whileTap={{scale: 0.97}}
                            >
                                Cancelar
                            </motion.button>
                        )}
                    </div>
                </form>
            </motion.div>

            <motion.div
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: 0.2}}
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">Lista de Solicitudes</h3>
                    <button
                        onClick={loadRequests}
                        className="text-purple-600 hover:text-purple-800 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                             stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Actualizar
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <motion.div
                            animate={{rotate: 360}}
                            transition={{duration: 1, repeat: Infinity, ease: "linear"}}
                            className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"
                        />
                    </div>
                ) : (
                    <motion.div
                        className="space-y-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {requests.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No hay solicitudes registradas</p>
                        ) : (
                            requests.map((req) => (
                                <motion.div
                                    key={req.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100"
                                    variants={itemVariants}
                                    layout
                                >
                                    <div className="flex flex-wrap justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center">
                                                    <span
                                                        className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full mr-2">
                                                        Código: {req.codigo}
                                                    </span>
                                                <h4 className="font-medium text-gray-800">{req.descripcion}</h4>
                                            </div>
                                            <div className="mt-1.5">
                                                <span className="text-sm text-gray-600">{req.resumen}</span>
                                            </div>
                                        </div>
                                        <span
                                            className="inline-flex items-center px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1"
                                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                                </svg>
                                            {getWorkerName(req.id_empleado)}
                                            </span>
                                    </div>

                                    <div className="flex space-x-2 mt-3">
                                        <motion.button
                                            onClick={() => handleEdit(req)}
                                            className="flex-1 px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition-colors text-sm font-medium"
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                        >
                                            Editar
                                        </motion.button>
                                        <motion.button
                                            onClick={() => handleDelete(req.id)}
                                            className="flex-1 px-3 py-1.5 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                                            whileHover={{scale: 1.05}}
                                            whileTap={{scale: 0.95}}
                                        >
                                            Eliminar
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default RequestsPage;