const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const PORT = process.env.PORT ;

// Middleware for JWT Verification
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.sendStatus(401);
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ id: result.insertId, username });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    try {
        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];

        if (!user) return res.status(400).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    } catch (err) {
    console.error("GET TASKS ERROR:", err);
    res.status(500).json({
        error: err.message
    });
}
});

// Task Routes
app.get('/api/tasks/stats', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.execute(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'Pending' OR status = 'In Progress' THEN 1 ELSE 0 END) as pending
            FROM tasks 
            WHERE user_id = ?
        `, [userId]);
        
        const row = rows[0];
        res.json({
            total: parseInt(row.total) || 0,
            completed: parseInt(row.completed) || 0,
            pending: parseInt(row.pending) || 0
        });
    } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({
        error: err.message
    });
}
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const { status, search, sort } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = ?';
    let params = [userId];

    if (status) {
        query += ' AND status = ?';
        params.push(status);
    }

    if (search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }

    if (sort === 'oldest') {
        query += ' ORDER BY created_at ASC';
    } else {
        query += ' ORDER BY created_at DESC';
    }

    try {
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
    const { title, description, status } = req.body;
    const userId = req.user.id;
    const taskStatus = status || 'Pending';

    if (!title || !description) return res.status(400).json({ error: 'Title and description are required' });

    try {
        const [result] = await db.execute(
            'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
            [userId, title, description, taskStatus]
        );
        const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
    const { status } = req.body;
    const userId = req.user.id;
    const taskId = req.params.id;

    if (!status) return res.status(400).json({ error: 'Status is required' });

    try {
        const [result] = await db.execute(
            'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
            [status, taskId, userId]
        );
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found or unauthorized' });
        
        const [rows] = await db.execute('SELECT * FROM tasks WHERE id = ?', [taskId]);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
    const userId = req.user.id;
    const taskId = req.params.id;

    try {
        const [result] = await db.execute(
            'DELETE FROM tasks WHERE id = ? AND user_id = ?',
            [taskId, userId]
        );
        
        if (result.affectedRows === 0) return res.status(404).json({ error: 'Task not found or unauthorized' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Only start the server if this file is run directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
