const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Configuración de CORS permitiendo explícitamente el puerto de tu frontend
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Configuración de la conexión a PostgreSQL con tus datos reales
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'catoreportes',
  password: process.env.DB_PASSWORD || 'bebetter2',
  port: process.env.DB_PORT || 5432,
});

// 1. Ruta para guardar u obtener pacientes y citas (POST)
app.post('/api/citas', async (req, res) => {
  try {
    const { 
      identificacion, 
      nombreCompleto, 
      fechaNacimiento, 
      genero, 
      telefono, 
      sintomasSeleccionados, 
      diagnosticoPreliminar, 
      prioridad, 
      requiereAsistencia 
    } = req.body;
    
    // Insertar o actualizar datos básicos del paciente
    const pacienteRes = await pool.query(
      `INSERT INTO pacientes (identificacion, nombre_completo, fecha_nacimiento, genero, telefono) 
       VALUES ($1, $2, $3, $4, $5) 
       ON CONFLICT (identificacion) DO UPDATE SET nombre_completo = $2, fecha_nacimiento = $3, genero = $4, telefono = $5
       RETURNING id`,
      [identificacion, nombreCompleto, fechaNacimiento, genero, telefono]
    );
    
    const pacienteId = pacienteRes.rows[0].id;
    const fechaCita = new Date().toISOString().split('T')[0];
    const horaCita = new Date().toLocaleTimeString('en-US', { hour12: false });
    const sintomasText = Array.isArray(sintomasSeleccionados) ? sintomasSeleccionados.join(', ') : 'Sin síntomas especificados';

    // Insertar la cita médica unificada vinculada al paciente
    await pool.query(
      `INSERT INTO citas_medicas (paciente_id, fecha_cita, hora_cita, sintomas, prioridad, requiere_asistencia, diagnostico_preliminar, estado) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pendiente')`,
      [pacienteId, fechaCita, horaCita, sintomasText, prioridad || 'Baja', requiereAsistencia || false, diagnosticoPreliminar || '']
    );

    res.status(201).json({ mensaje: 'Cita registrada con éxito' });
  } catch (error) {
    console.error("Error en POST /api/citas:", error.message);
    res.status(500).json({ error: 'Error al registrar la cita en la base de datos' });
  }
});

// 2. Ruta para obtener el listado histórico de citas médicas (GET)
app.get('/api/citas', async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT c.*, p.nombre_completo AS paciente_nombre, u.nombre_completo AS medico_nombre 
      FROM citas_medicas c
      JOIN pacientes p ON c.paciente_id = p.id
      LEFT JOIN usuarios u ON c.medico_id = u.id
      ORDER BY c.fecha_cita DESC, c.hora_cita DESC
    `);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Error en GET /api/citas:", error.message);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en el puerto ${port}`);
});