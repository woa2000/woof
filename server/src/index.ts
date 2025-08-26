import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import next from 'next';
import path from 'path';
import { createServerClient } from '@supabase/ssr';

const dev = process.env.NODE_ENV !== 'production';
const port = Number(process.env.PORT ?? 3000);
const clientDir = path.resolve(process.cwd(), '../client');

// Initialize Next.js app
const app = next({ dev, dir: clientDir });
const handle = app.getRequestHandler();

async function main() {
  console.log('🚀 Starting Woof Marketing server...');
  
  // Prepare Next.js
  await app.prepare();
  console.log('✅ Next.js prepared');
  
  // Create Express server
  const server = express();
  
  // Trust proxy (for Vercel/production)
  server.set('trust proxy', 1);
  
  // Middleware stack
  server.use(compression());
  
  // CORS configuration
  if (process.env.CORS_ORIGIN) {
    server.use(cors({ 
      origin: process.env.CORS_ORIGIN.split(',').map(o => o.trim()),
      credentials: true 
    }));
  }
  
  // Body parsing
  server.use(express.json({ limit: '10mb' }));
  server.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Request logging
  server.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
  
  // Health check endpoint
  server.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok',
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: '1.0.0'
    });
  });
  
  // Example API endpoint
  server.get('/api/example', (req, res) => {
    res.json({ 
      message: 'Hello from Express API - Woof Marketing',
      timestamp: new Date().toISOString()
    });
  });
  
  // Auth middleware for protected API routes
  const requireAuth = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ error: 'Token required' });
      }
      
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get: () => '', // Will be handled by Next.js middleware
            set: () => {},
            remove: () => {}
          }
        }
      );
      
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
      
      (req as any).user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };
  
  // Protected API routes (example)
  server.get('/api/user/profile', requireAuth, (req, res) => {
    res.json({ 
      user: (req as any).user,
      message: 'Protected route - User profile'
    });
  });
  
  // All other routes go to Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Error handling
  server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: dev ? err.message : 'Something went wrong'
    });
  });
  
  // Graceful shutdown
  const shutdown = () => {
    console.log('🛑 Shutting down server...');
    process.exit(0);
  };
  
  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
  
  // Start server
  server.listen(port, () => {
    console.log(`✅ Woof Marketing server ready at http://localhost:${port}`);
    console.log(`📱 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 Client dir: ${clientDir}`);
  });
}

// Handle startup errors
main().catch((err) => {
  console.error('❌ Fatal error starting server:', err);
  process.exit(1);
});