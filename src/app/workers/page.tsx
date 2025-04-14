// app/workers/page.tsx
    'use client';
    import { useEffect, useState } from 'react';
    import axiosInstance from '../lib/axiosInstance';
    import { useForm } from 'react-hook-form';
    import { toast } from 'react-toast';
    import { motion } from 'framer-motion';

    type Worker = {
        id: number;
        fecha_ingreso: string;
        nombre: string;
        salario: string;
    };

    const WorkersPage = () => {
        const [workers, setWorkers] = useState<Worker[]>([]);
        const { register, handleSubmit, reset } = useForm<Partial<Worker>>();
        const [editing, setEditing] = useState<boolean>(false);
        const [currentWorker, setCurrentWorker] = useState<Worker | null>(null);
        const [loading, setLoading] = useState<boolean>(true);

        // Cargar la lista de empleados
        const loadWorkers = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get('/workers');
                setWorkers(res.data);
            } catch (error) {
                console.error(error);
                toast('Error cargando empleados');
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            loadWorkers();
        }, []);

        // Manejo del submit para creación o edición
        const onSubmit = async (data: Partial<Worker>) => {
            try {
                if (editing && currentWorker) {
                    await axiosInstance.put(`/workers/${currentWorker.id}`, data);
                    toast('Empleado actualizado');
                } else {
                    await axiosInstance.post('/workers', data);
                    toast('Empleado creado');
                }
                reset();
                setEditing(false);
                setCurrentWorker(null);
                loadWorkers();
            } catch (error) {
                console.error(error);
                toast('Error en la operación');
            }
        };

        const handleEdit = (worker: Worker) => {
            setEditing(true);
            setCurrentWorker(worker);
            reset(worker);
        };

        const handleDelete = async (id: number) => {
            try {
                await axiosInstance.delete(`/workers/${id}`);
                toast('Empleado eliminado');
                loadWorkers();
            } catch (error) {
                console.error(error);
                toast('Error al eliminar');
            }
        };

        const containerVariants = {
            hidden: { opacity: 0 },
            visible: {
                opacity: 1,
                transition: {
                    staggerChildren: 0.1
                }
            }
        };

        const itemVariants = {
            hidden: { y: 20, opacity: 0 },
            visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.4 }
            }
        };

        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.h2
                    className="text-3xl font-bold text-gray-800 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Gestión de Empleados
                </motion.h2>

                <motion.div
                    className="bg-white rounded-xl shadow-lg p-6 mb-8"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                        {editing ? 'Editar Empleado' : 'Crear Nuevo Empleado'}
                    </h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Fecha de Ingreso:</label>
                                <input
                                    type="date"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    {...register('fecha_ingreso', { required: true })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Nombre:</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    {...register('nombre', { required: true })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">Salario:</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    {...register('salario', { required: true })}
                                />
                            </div>
                        </div>
                        <motion.button
                            type="submit"
                            className={`px-4 py-2 rounded-md text-white font-medium ${editing ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'} transition-colors shadow-md`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            {editing ? 'Actualizar Empleado' : 'Crear Empleado'}
                        </motion.button>
                        {editing && (
                            <motion.button
                                type="button"
                                onClick={() => {
                                    setEditing(false);
                                    setCurrentWorker(null);
                                    reset({});
                                }}
                                className="ml-2 px-4 py-2 rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors font-medium shadow-md"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Cancelar
                            </motion.button>
                        )}
                    </form>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-800">Lista de Empleados</h3>
                        <button
                            onClick={loadWorkers}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Actualizar
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-12">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
                            />
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {workers.length === 0 ? (
                                <p className="text-gray-500 col-span-full text-center py-8">No hay empleados registrados</p>
                            ) : (
                                workers.map((worker) => (
                                    <motion.div
                                        key={worker.id}
                                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100"
                                        variants={itemVariants}
                                        layout
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-bold text-lg text-gray-800">{worker.nombre}</h4>
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">ID: {worker.id}</span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm">{worker.fecha_ingreso}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-sm">${worker.salario}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <motion.button
                                                onClick={() => handleEdit(worker)}
                                                className="flex-1 px-3 py-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 transition-colors text-sm font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Editar
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleDelete(worker.id)}
                                                className="flex-1 px-3 py-1.5 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
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

    export default WorkersPage;