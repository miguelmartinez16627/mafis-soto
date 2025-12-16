// import {baseDatos} from "../base_datos"
import { useState, useEffect } from 'react'
// fetch : es la funcion nativa del navegardor para hacerse peticiones http y traer o recivir datos de un servidor 
// QUE HACE : 1 dvuelve un Promise
//            2 por defecto hace un get pero puedes cambiar metodos, header, body, etc.
//            3 La respuesta la tienen que convertir a json 
//            4 se gestiona con .the .cap o con await
export default function Activos() {
  const [datos, setDatos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevoActivo, setNuevoActivo] = useState({
    nombreActivo: "",
    ubicacion: "",
    estado: "Activo"
  });

  const obtenerActivos = () => {
    fetch("http://localhost:5000/Activos")
      .then((res) => res.json())
      .then((data) => setDatos(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    obtenerActivos();
  }, []);

  const handleSubmit = () => {
    fetch("http://localhost:5000/Activos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoActivo),
    })
      .then((res) => res.json())
      .then(() => {
        obtenerActivos();
        setMostrarForm(false);
        setNuevoActivo({ nombreActivo: "", ubicacion: "", estado: "Activo" });
      })
      .catch((error) => console.error("Error creating active:", error));
  };

  const crear = async () => {
    if (!nuevoActivo.nombreActivo.trim() || !nuevoActivo.ubicacion.trim())
      return alert("Por favor, completa todos los campos")
    const res = await fetch("http://localhost:5000/Activos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoActivo)
    });
    if (!res.ok) return alert("Error al crear");
    const nueva = await fetch("http://localhost:5000/Activos").then((F) => F.json()
    );
    obtenerActivos();
    setMostrarForm(false);
    setNuevoActivo({ nombreActivo: "", ubicacion: "", estado: "Activo" });

  }

  return (
    <>
      <h2 className="mb-3">Activos</h2>
      <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>Agregar Activo</button>
      {mostrarForm && (

        <div className='card mb-3'>
          <div className='card-body'>
            <h5>Crear Activo</h5>
            <input className='form-control mb-2'
              placeholder='Nombre'
              value={nuevoActivo.nombreActivo}
              onChange={(e) =>
                setNuevoActivo({ ...nuevoActivo, nombreActivo: e.target.value })
              }
            />
            <input className='form-control mb-2'
              placeholder='Ubicacion'
              value={nuevoActivo.ubicacion}
              onChange={(e) =>
                setNuevoActivo({ ...nuevoActivo, ubicacion: e.target.value })
              }
            />
            <select className="form-control mb-2"
              value={nuevoActivo.estado}
              onChange={(e) =>
                setNuevoActivo({ ...nuevoActivo, estado: e.target.value })}
            >
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <button className="btn btn-success me-2 btn-sm">
              Guardar
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => setMostrarForm(false)}>
              Cancelar
            </button>
          </div>
        </div>

      )}
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Estado</th>
            <th scope="col">Ubicacion</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>

        <tbody>

          {datos.map((activo) => (
            <tr key={(activo.id)}>
              <td>{activo.id}</td>
              <td>{activo.nombreActivo}</td>
              <td>{activo.estado}</td>
              <td>{activo.ubicacion}</td>
            </tr>
          ))
          }

        </tbody>
      </table>
    </>
  )
}
