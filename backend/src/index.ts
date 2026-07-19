import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import requestRoutes from './routes/requests';
import aiRoutes from './routes/ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clarion-nexus';

// 1. Middlewares
app.use(cors({
  origin: '*', // For testing purposes, allows frontend connections from anywhere
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 2. Database Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch((err) => {
    console.error('MongoDB connection failure details:', err);
  });

// 3. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 4. API Routes Mapping
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ai', aiRoutes);

// 5. Root — Beautiful Admin Data Dashboard
app.get('/', async (req: Request, res: Response) => {
  try {
    const mongoose2 = await import('mongoose');
    const { Service } = await import('./models/Service');
    const { RequestModel } = await import('./models/Request');
    const { ChatHistory } = await import('./models/ChatHistory');
    const { User } = await import('./models/User');

    const [services, requests, chatHistories, users] = await Promise.all([
      Service.find().lean(),
      RequestModel.find().populate('user', 'name email avatarUrl').lean(),
      ChatHistory.find().populate('user', 'name email').lean(),
      User.find().select('-password').lean()
    ]);

    const statusColor: Record<string, string> = {
      pending: '#f59e0b',
      'in-progress': '#3b82f6',
      completed: '#22c55e',
      rejected: '#ef4444'
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Clarion Nexus — Backend Dashboard</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;background:#0a0a0f;color:#e2e8f0;min-height:100vh}
  header{background:linear-gradient(135deg,#1e3a5f,#2d1b69);padding:24px 40px;border-bottom:1px solid rgba(255,255,255,.08)}
  header h1{font-size:1.5rem;font-weight:700;color:#fff;letter-spacing:-.5px}
  header p{font-size:.8rem;color:rgba(255,255,255,.5);margin-top:4px}
  .badge{display:inline-block;background:rgba(59,130,246,.15);color:#60a5fa;border:1px solid rgba(59,130,246,.3);border-radius:20px;padding:3px 10px;font-size:.7rem;font-weight:700;margin-left:10px;vertical-align:middle}
  nav{display:flex;gap:12px;padding:16px 40px;background:#0d0d14;border-bottom:1px solid rgba(255,255,255,.06);flex-wrap:wrap}
  nav a{color:#94a3b8;text-decoration:none;font-size:.8rem;font-weight:600;padding:6px 14px;border-radius:8px;border:1px solid rgba(255,255,255,.08);transition:.2s}
  nav a:hover{color:#fff;background:rgba(255,255,255,.06)}
  main{padding:32px 40px;max-width:1400px;margin:0 auto}
  section{margin-bottom:48px}
  section h2{font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:16px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.07);display:flex;align-items:center;gap:10px}
  section h2 span.count{background:rgba(99,102,241,.15);color:#818cf8;border:1px solid rgba(99,102,241,.3);border-radius:12px;padding:2px 10px;font-size:.72rem;font-weight:700}
  .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:16px}
  .card{background:#111118;border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:18px;transition:.2s}
  .card:hover{border-color:rgba(99,102,241,.4);transform:translateY(-1px)}
  .card-title{font-size:.95rem;font-weight:700;color:#f1f5f9;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .card-sub{font-size:.72rem;color:#64748b;margin-bottom:10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
  .tag{display:inline-block;font-size:.63rem;font-weight:700;padding:2px 8px;border-radius:6px;text-transform:uppercase;letter-spacing:.5px;margin-right:6px;margin-top:4px}
  .tag-blue{background:rgba(59,130,246,.12);color:#60a5fa;border:1px solid rgba(59,130,246,.25)}
  .tag-green{background:rgba(34,197,94,.12);color:#4ade80;border:1px solid rgba(34,197,94,.25)}
  .tag-purple{background:rgba(139,92,246,.12);color:#a78bfa;border:1px solid rgba(139,92,246,.25)}
  .tag-yellow{background:rgba(245,158,11,.12);color:#fbbf24;border:1px solid rgba(245,158,11,.25)}
  .tag-red{background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.25)}
  .meta{font-size:.68rem;color:#475569;margin-top:8px}
  .stats-row{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:32px}
  .stat{background:#111118;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;text-align:center}
  .stat-val{font-size:1.8rem;font-weight:800;background:linear-gradient(135deg,#3b82f6,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .stat-lbl{font-size:.7rem;color:#64748b;margin-top:4px;font-weight:600;text-transform:uppercase;letter-spacing:.5px}
  .msg-bubble{padding:10px 14px;border-radius:10px;margin-bottom:8px;font-size:.75rem;line-height:1.5;max-width:90%;word-break:break-word}
  .msg-user{background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.2);color:#93c5fd;margin-left:auto;text-align:right}
  .msg-ai{background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.2);color:#c4b5fd}
  .msg-wrap{max-height:200px;overflow-y:auto;padding-right:4px}
  img.avatar{width:28px;height:28px;border-radius:50%;object-fit:cover;vertical-align:middle;margin-right:6px;border:2px solid rgba(255,255,255,.1)}
  .empty{color:#334155;text-align:center;padding:32px;font-size:.85rem;border:1px dashed rgba(255,255,255,.06);border-radius:12px}
  footer{text-align:center;padding:20px;color:#1e293b;font-size:.72rem;border-top:1px solid rgba(255,255,255,.04)}
</style>
</head>
<body>
<header>
  <h1>⚡ Clarion Nexus <span class="badge">Backend Admin</span></h1>
  <p>Live MongoDB Atlas data viewer — ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })} (BD Time)</p>
</header>
<nav>
  <a href="#services">📦 Services (${services.length})</a>
  <a href="#requests">📋 Requests (${requests.length})</a>
  <a href="#chats">💬 Chat Histories (${chatHistories.length})</a>
  <a href="#users">👥 Users (${users.length})</a>
  <a href="/api/health" target="_blank">🔗 Health Check</a>
  <a href="/api/services" target="_blank">🔗 /api/services</a>
  <a href="/api/requests" target="_blank">🔗 /api/requests (auth)</a>
</nav>
<main>
  <!-- Stats -->
  <div class="stats-row">
    <div class="stat"><div class="stat-val">${services.length}</div><div class="stat-lbl">Services</div></div>
    <div class="stat"><div class="stat-val">${requests.length}</div><div class="stat-lbl">Requests</div></div>
    <div class="stat"><div class="stat-val">${chatHistories.reduce((a: number, c: any) => a + (c.messages?.length || 0), 0)}</div><div class="stat-lbl">Chat Messages</div></div>
    <div class="stat"><div class="stat-val">${users.length}</div><div class="stat-lbl">Users</div></div>
    <div class="stat"><div class="stat-val">${requests.filter((r: any) => r.status === 'pending').length}</div><div class="stat-lbl">Pending</div></div>
    <div class="stat"><div class="stat-val">${requests.filter((r: any) => r.status === 'completed').length}</div><div class="stat-lbl">Completed</div></div>
  </div>

  <!-- Services -->
  <section id="services">
    <h2>📦 Services <span class="count">${services.length}</span></h2>
    ${services.length === 0 ? '<div class="empty">No services found in database.</div>' : `
    <div class="grid">
      ${services.map((s: any) => `
        <div class="card">
          <div class="card-title">${s.title}</div>
          <div class="card-sub">${s.shortDesc}</div>
          <span class="tag tag-blue">${s.category}</span>
          <span class="tag tag-green">$${s.priceFrom}+</span>
          <span class="tag tag-purple">${s.deliveryDays} days</span>
          <div class="meta">⭐ ${s.rating} · ${s.reviewCount} reviews · ID: ${s._id}</div>
        </div>`).join('')}
    </div>`}
  </section>

  <!-- Requests -->
  <section id="requests">
    <h2>📋 Project Requests <span class="count">${requests.length}</span></h2>
    ${requests.length === 0 ? '<div class="empty">No project requests yet.</div>' : `
    <div class="grid">
      ${requests.map((r: any) => {
      const u = r.user as any;
      const sc = { pending: 'tag-yellow', 'in-progress': 'tag-blue', completed: 'tag-green', rejected: 'tag-red' }[r.status as string] || 'tag-yellow';
      return `<div class="card">
          <div class="card-title">${r.title}</div>
          <div class="card-sub">${r.shortDesc}</div>
          ${u && typeof u === 'object' ? `<div style="margin-bottom:8px"><img class="avatar" src="${u.avatarUrl || ''}" onerror="this.style.display='none'"/><span style="font-size:.72rem;color:#94a3b8">${u.name} · ${u.email}</span></div>` : ''}
          <span class="tag ${sc}">${r.status}</span>
          <span class="tag tag-blue">$${r.budget?.toLocaleString()}</span>
          <div class="meta">📅 ${new Date(r.createdAt).toLocaleDateString('en-US')} · ID: ${r._id}</div>
        </div>`;
    }).join('')}
    </div>`}
  </section>

  <!-- Chat Histories -->
  <section id="chats">
    <h2>💬 Chat Histories <span class="count">${chatHistories.length}</span></h2>
    ${chatHistories.length === 0 ? '<div class="empty">No chat histories yet.</div>' : `
    <div class="grid">
      ${chatHistories.map((ch: any) => {
      const u = ch.user as any;
      return `<div class="card">
          <div class="card-title">${u?.name || 'Unknown User'} <span style="font-size:.68rem;color:#64748b">${u?.email || ''}</span></div>
          <div class="meta" style="margin-bottom:10px">${ch.messages?.length || 0} messages · Last: ${ch.updatedAt ? new Date(ch.updatedAt).toLocaleDateString() : '-'}</div>
          <div class="msg-wrap">
            ${(ch.messages || []).slice(-6).map((m: any) => `
              <div class="msg-bubble ${m.role === 'user' ? 'msg-user' : 'msg-ai'}">
                <strong style="font-size:.6rem;opacity:.6">${m.role === 'user' ? '👤 User' : '🤖 NexusAI'}</strong><br/>
                ${m.content?.slice(0, 200)}${m.content?.length > 200 ? '…' : ''}
              </div>`).join('')}
          </div>
        </div>`;
    }).join('')}
    </div>`}
  </section>

  <!-- Users -->
  <section id="users">
    <h2>👥 Users <span class="count">${users.length}</span></h2>
    ${users.length === 0 ? '<div class="empty">No users found.</div>' : `
    <div class="grid">
      ${users.map((u: any) => `
        <div class="card">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
            <img class="avatar" src="${u.avatarUrl || ''}" style="width:36px;height:36px" onerror="this.src='https://api.dicebear.com/7.x/avataaars/svg?seed=${u._id}'"/>
            <div>
              <div class="card-title" style="margin-bottom:2px">${u.name}</div>
              <div style="font-size:.68rem;color:#64748b">${u.email}</div>
            </div>
          </div>
          <span class="tag ${u.role === 'admin' ? 'tag-purple' : 'tag-blue'}">${u.role}</span>
          ${u.googleId ? '<span class="tag tag-green">Google OAuth</span>' : ''}
          <div class="meta">Joined: ${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'} · ID: ${u._id}</div>
        </div>`).join('')}
    </div>`}
  </section>
</main>
<footer>Clarion Nexus Backend · MongoDB Atlas Connected · ${new Date().getFullYear()}</footer>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.send(html);
  } catch (err: any) {
    res.status(500).json({ message: 'Dashboard error', error: err.message });
  }
});

// 6. Catch-all for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// 6. Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// 7. Start Server
app.listen(PORT, () => {
  console.log(`Clarion Nexus Backend running on http://localhost:${PORT}`);
});
