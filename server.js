const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const adminPg = {
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT ? Number(process.env.PG_PORT) : 5432,
  user: process.env.PG_ADMIN_USER || process.env.PG_USER || 'postgres',
  password: process.env.PG_ADMIN_PASSWORD || process.env.PG_PASSWORD || 'hhkk',
  database: process.env.PG_DATABASE || 'wx_database'
};

// ===== Login endpoint =====
app.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ success: false, message: 'Missing username or password' });

  const client = new Client({ ...adminPg, user: username, password });
  try {
    await client.connect();
    await client.end();

    // تحديد الدور حسب اسم المستخدم
    const role = username === 'waseem' ? 'employee' :
                 username === 'ali' ? 'manager' :
                 username === 'lina' ? 'director' : 'developer';

    return res.json({ success: true, message: 'Authenticated to database', username, role });
  } catch (err) {
    try { await client.end(); } catch (e) {}
    return res.status(401).json({ success: false, message: 'DB authentication failed: ' + (err.message || err) });
  }
});

// ===== API: projects by role =====
app.get('/api/projects', async (req, res) => {
  const { role, username } = req.query;
  if (!role) return res.status(400).json({ success: false, message: 'Missing role' });

  const client = new Client(adminPg);
  let query = '';
  let params = [];

  if (role === 'employee') {
    query = 'SELECT * FROM employee_projects_view'; // CURRENT_USER في DB يتولى الفلترة
  } else if (role === 'manager') {
    query = 'SELECT * FROM manager_projects_view'; // CURRENT_USER في DB يتولى الفلترة
  } else if (role === 'director') {
    query = 'SELECT * FROM director_department_view'; // CURRENT_USER في DB يتولى الفلترة
  } else {
    return res.status(403).json({ success: false, message: 'Role not allowed' });
  }

  try {
    await client.connect();
    const result = await client.query(query, params);
    await client.end();
    res.json(result.rows);
  } catch (err) {
    try { await client.end(); } catch(e) {}
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// ===== SPA fallback =====
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
