import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, 'salary_data.db');
const db = new sqlite3.Database(dbPath);

// API Routes
app.get('/api/countries', (req, res) => {
  db.all('SELECT DISTINCT country FROM salaries ORDER BY country', (err, rows) => {
    if (err) {
      console.error('Error fetching countries:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows.map(row => row.country));
    }
  });
});

app.get('/api/languages', (req, res) => {
  db.all('SELECT DISTINCT language FROM salaries ORDER BY language', (err, rows) => {
    if (err) {
      console.error('Error fetching languages:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows.map(row => row.language));
    }
  });
});

app.get('/api/experience-levels', (req, res) => {
  db.all('SELECT DISTINCT experience FROM salaries ORDER BY experience', (err, rows) => {
    if (err) {
      console.error('Error fetching experience levels:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      const experiences = rows.map(row => row.experience.trim()).filter(exp => exp);
      // Sort experience levels in logical order
      const order = ['<1 year', '1–2 years', '3–5 years', '6–10 years', '11–16 years', '16+ years'];
      const sorted = experiences.sort((a, b) => {
        const aIndex = order.indexOf(a);
        const bIndex = order.indexOf(b);
        return aIndex - bIndex;
      });
      res.json(sorted);
    }
  });
});

app.get('/api/salaries', (req, res) => {
  const { country, language, experience } = req.query;
  
  let query = 'SELECT * FROM salaries WHERE 1=1';
  const params = [];
  
  if (country) {
    query += ' AND country = ?';
    params.push(country);
  }
  
  if (language) {
    query += ' AND language = ?';
    params.push(language);
  }
  
  if (experience) {
    query += ' AND experience = ?';
    params.push(experience);
  }
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching salaries:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});

app.get('/api/salary-stats', (req, res) => {
  const { country, language, experience } = req.query;
  
  let query = `
    SELECT 
      AVG(salary) as average,
      MIN(salary) as minimum,
      MAX(salary) as maximum,
      COUNT(*) as count
    FROM salaries WHERE 1=1
  `;
  const params = [];
  
  if (country) {
    query += ' AND country = ?';
    params.push(country);
  }
  
  if (language) {
    query += ' AND language = ?';
    params.push(language);
  }
  
  if (experience) {
    query += ' AND experience = ?';
    params.push(experience);
  }
  
  db.get(query, params, (err, row) => {
    if (err) {
      console.error('Error fetching salary stats:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json({
        average: Math.round(row.average || 0),
        minimum: row.minimum || 0,
        maximum: row.maximum || 0,
        count: row.count || 0
      });
    }
  });
});

app.get('/api/salary-distribution', (req, res) => {
  const { country, language, experience } = req.query;
  
  let query = `
    SELECT 
      CASE 
        WHEN salary < 30 THEN '0-30k'
        WHEN salary < 60 THEN '30-60k'
        WHEN salary < 90 THEN '60-90k'
        WHEN salary < 120 THEN '90-120k'
        WHEN salary < 150 THEN '120-150k'
        ELSE '150k+'
      END as range,
      COUNT(*) as count
    FROM salaries WHERE 1=1
  `;
  const params = [];
  
  if (country) {
    query += ' AND country = ?';
    params.push(country);
  }
  
  if (language) {
    query += ' AND language = ?';
    params.push(language);
  }
  
  if (experience) {
    query += ' AND experience = ?';
    params.push(experience);
  }
  
  query += ' GROUP BY range ORDER BY MIN(salary)';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching salary distribution:', err);
      res.status(500).json({ error: 'Database error' });
    } else {
      res.json(rows);
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database path: ${dbPath}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Closing database connection...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});