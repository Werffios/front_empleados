// app/workers/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toast';

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

    // Cargar la lista de empleados
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
        loadWorkers();
    }, []);

    // Manejo del submit para creación o edición
    const onSubmit = async (data: Partial<Worker>) => {
        try {
            if (editing && currentWorker) {
                // Actualizar empleado
                await axiosInstance.put(`/workers/${currentWorker.id}`, data);
                toast('Empleado actualizado');
            } else {
                // Crear empleado
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

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Gestión de Empleados</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Fecha de Ingreso:</label>
                    <input type="date" {...register('fecha_ingreso', { required: true })} />
                </div>
                <div>
                    <label>Nombre:</label>
                    <input type="text" {...register('nombre', { required: true })} />
                </div>
                <div>
                    <label>Salario:</label>
                    <input type="number" step="0.01" {...register('salario', { required: true })} />
                </div>
                <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
            </form>

            <hr />

            <h3>Lista de Empleados</h3>
            {workers.map((worker) => (
                <div key={worker.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                    <p>{worker.nombre} - {worker.fecha_ingreso} - ${worker.salario}</p>
                    <button onClick={() => handleEdit(worker)}>Editar</button>
                    <button onClick={() => handleDelete(worker.id)}>Eliminar</button>
                </div>
            ))}
        </div>
    );
};

export default WorkersPage;
