import React, { useEffect, useState } from 'react';
import { getUsuarios, deleteUsuario, createUsuario } from '../services/usuarioService';
import { Modal, Button, Form } from 'react-bootstrap';

const UsuariosPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [nuevoUser, setNuevoUser] = useState({ username: '', password_hash: '', id_rol: '' });

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const res = await getUsuarios();
            setUsuarios(res.data);
        } catch (err) {
            console.error("Error al cargar oficiales:", err);
        }
    };

    const handleEliminar = async (id) => {
        if (window.confirm("¿ESTÁ SEGURO DE REVOCAR EL ACCESO A ESTE OFICIAL?")) {
            await deleteUsuario(id);
            cargarUsuarios();
        }
    };

    const handleGuardar = async () => {
        if (!nuevoUser.id_rol) {
            alert("Por favor, seleccione un rol para el oficial.");
            return;
        }
        try {
            await createUsuario(nuevoUser);
            setShowModal(false);
            setNuevoUser({ username: '', password_hash: '', id_rol: '' });
            cargarUsuarios();
        } catch (err) {
            alert("Error al crear oficial. Verifique los datos.");
        }
    };

    return (
        <div className="p-4 h-100 bg-dark text-white">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold"><span className="text-danger">|</span> REGISTRO DE PERSONAL</h2>
                <Button variant="outline-danger" onClick={() => setShowModal(true)}>
                    + ALTA DE OFICIAL
                </Button>
            </div>

            <div className="table-responsive bg-secondary-dark rounded">
                <table className="table table-dark table-hover mb-0">
                    <thead className="text-muted">
                        <tr>
                            <th>IDENTIFICADOR</th>
                            <th>NOMBRE DE USUARIO</th>
                            <th>ID ROL</th>
                            <th>ESTADO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id} className="align-middle">
                                <td className="font-monospace text-info">{u.id.substring(18)}</td>
                                <td>{u.username}</td>
                                <td>{u.id_rol}</td>
                                <td><span className="badge bg-success">ACTIVO</span></td>
                                <td>
                                    <button className="btn btn-sm btn-outline-light me-2">EDITAR</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleEliminar(u.id)}>BORRAR</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL PARA CREAR USUARIO */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered contentClassName="bg-dark text-white border-secondary">
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>REGISTRAR NUEVO OFICIAL</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Matrícula / Username</Form.Label>
                            <Form.Control 
                                type="text" 
                                className="bg-dark text-white border-secondary"
                                value={nuevoUser.username}
                                onChange={(e) => setNuevoUser({...nuevoUser, username: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Clave de Acceso</Form.Label>
                            <Form.Control 
                                type="password" 
                                className="bg-dark text-white border-secondary"
                                value={nuevoUser.password_hash}
                                onChange={(e) => setNuevoUser({...nuevoUser, password_hash: e.target.value})}
                            />
                        </Form.Group>
                        
                        {/* CAMBIO DE INPUT A SELECT */}
                        <Form.Group className="mb-3">
                            <Form.Label>Rol del Oficial</Form.Label>
                            <Form.Select 
                                className="bg-dark text-white border-secondary"
                                value={nuevoUser.id_rol}
                                onChange={(e) => setNuevoUser({...nuevoUser, id_rol: e.target.value})}
                            >
                                <option value="">— Seleccione un Rol —</option>
                                {/* REEMPLAZA ESTOS ID POR LOS QUE TIENES EN COMPASS */}
                                <option value="65f1a2b3c4d5e6f7a8b9c0d1">Administrador</option>
                                <option value="65f1a2b3c4d5e6f7a8b9c0d2">Oficial de Guardia</option>
                                <option value="65f1a2b3c4d5e6f7a8b9c0d3">Operador Técnico</option>
                            </Form.Select>
                            <Form.Text className="text-muted">
                                Seleccione el nivel de privilegio en el sistema.
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>CANCELAR</Button>
                    <Button variant="danger" onClick={handleGuardar}>GUARDAR EN BASE DE DATOS</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UsuariosPage;