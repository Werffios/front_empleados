// app/requests/page.tsx
'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toast';

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
    const { register, handleSubmit, reset } = useForm<Partial<RequestType>>();
    const [editing, setEditing] = useState<boolean>(false);
    const [currentRequest, setCurrentRequest] = useState<RequestType | null>(null);

    const loadRequests = async () => {
        try {
            const res = await axiosInstance.get('/requests');
            setRequests(res.data);
        } catch (error) {
            toast('Error cargando solicitudes');
        }
    };

    const loadWorkers = async () => {
        try {
            const res = await axiosInstance.get('/workers');
            setWorkers(res.data);
        } catch (error) {
            toast('Error cargando empleados');
        }
    };

    useEffect(() => {
        loadRequests();
        loadWorkers();
    }, []);

    const onSubmit = async (data: Partial<RequestType>) => {
        try {
            if (editing && currentRequest) {
                await axiosInstance.put(`/requests/${currentRequest.id}`, data);
                toast('Solicitud actualizada');
            } else {
                await axiosInstance.post('/requests', data);
                toast('Solicitud creada');
            }
            reset();
            setEditing(false);
            setCurrentRequest(null);
            loadRequests();
        } catch (error) {
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
            toast('Error al eliminar');
        }
    };

    // Función auxiliar para obtener el nombre del empleado
    const getWorkerName = (id_empleado: number) => {
        const worker = workers.find((w) => w.id === id_empleado);
        return worker ? worker.nombre : 'N/D';
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Gestión de Solicitudes</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Código:</label>
                    <input type="text" {...register('codigo', { required: true })} />
                </div>
                <div>
                    <label>Descripción:</label>
                    <input type="text" {...register('descripcion', { required: true })} />
                </div>
                <div>
                    <label>Resumen:</label>
                    <input type="text" {...register('resumen', { required: true })} />
                </div>
                <div>
                    <label>ID Empleado:</label>
                    {/* Puedes mejorar la UX usando un select */}
                    <select {...register('id_empleado', { required: true })}>
                        <option value="">Seleccione un empleado</option>
                        {workers.map((worker) => (
                            <option key={worker.id} value={worker.id}>
                                {worker.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">{editing ? 'Actualizar' : 'Crear'}</button>
            </form>

            <hr />

            <h3>Lista de Solicitudes</h3>
            {requests.map((req) => (
                <div key={req.id} style={{ borderBottom: '1px solid #ccc', padding: '0.5rem' }}>
                    <p>
                        <strong>{req.codigo}</strong>: {req.descripcion} - {req.resumen} - Empleado: {getWorkerName(req.id_empleado)}
                    </p>
                    <button onClick={() => handleEdit(req)}>Editar</button>
                    <button onClick={() => handleDelete(req.id)}>Eliminar</button>
                </div>
            ))}
        </div>
    );
};

export default RequestsPage;
