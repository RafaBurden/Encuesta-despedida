const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

// Ignorar errores de certificado SSL a nivel de proceso (útil para proxies corporativos)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const app = express();
const port = process.env.PORT || 3000;

// Configuración de la base de datos con bypass de certificado SSL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Permite conectar a pesar del error de cadena de certificado
  }
});


app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Servir archivos estáticos (index.html, etc.)

// Endpoint para guardar respuestas
app.post('/api/save', async (req, res) => {
  const { nombre, apellidos, email, opcion } = req.body;
  
  try {
    const query = `
      INSERT INTO respuestas_formulario (nombre, apellido, email, tipo_evento)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [nombre, apellidos, email, opcion];
    const result = await pool.query(query, values);
    
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error al guardar:', err);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
});

// Endpoint para obtener resultados
app.get('/api/results', async (req, res) => {
  try {
    // Obtener todos los votos individualmente
    const allVotesQuery = 'SELECT nombre, apellido, tipo_evento, fecha_registro FROM respuestas_formulario ORDER BY fecha_registro DESC';
    const allVotes = await pool.query(allVotesQuery);
    
    // Obtener resumen para el gráfico
    const summaryQuery = `
      SELECT tipo_evento, COUNT(*) as total 
      FROM respuestas_formulario 
      GROUP BY tipo_evento;
    `;
    const summary = await pool.query(summaryQuery);
    
    res.json({
      votes: allVotes.rows,
      summary: summary.rows
    });
  } catch (err) {
    console.error('Error al obtener resultados:', err);
    res.status(500).json({ success: false, error: 'Error del servidor' });
  }
});

// Endpoint para apagar el servidor
app.post('/api/shutdown', (req, res) => {
  res.json({ success: true, message: 'Apagando servidor...' });
  console.log('Solicitud de apagado recibida. Cerrando...');
  setTimeout(() => {
    process.exit(0);
  }, 1000);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
