import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Authentication Middleware
const authenticate = async (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Health Check
app.get('/health', async (req, res) => {
  try {
    await prisma.$connect();
    const userCount = await prisma.user.count();
    const propertyCount = await prisma.property.count();
    
    res.json({
      status: 'OK',
      database: 'Connected',
      stats: {
        users: userCount,
        properties: propertyCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ status: 'Error', database: 'Disconnected' });
  }
});

// Register User
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone: phone || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true
      }
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: 'Registration successful',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login User
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' } as jwt.SignOptions
    );

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticate, async (req: any, res) => {
  res.json({ success: true, user: req.user });
});

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ 
      success: true, 
      properties,
      count: properties.length
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
app.get('/api/properties/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Increment view count
    await prisma.property.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });

    res.json({ success: true, property });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property (protected)
app.post('/api/properties', authenticate, async (req: any, res) => {
  try {
    const propertyData = {
      ...req.body,
      userId: req.user.id
    };

    const property = await prisma.property.create({
      data: propertyData,
      include: {
        images: true,
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    res.json({ 
      success: true, 
      message: 'Property created successfully',
      property 
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property (protected)
app.put('/api/properties/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findFirst({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!existingProperty) {
      return res.status(404).json({ error: 'Property not found or unauthorized' });
    }

    const property = await prisma.property.update({
      where: { id },
      data: req.body,
      include: { images: true }
    });

    res.json({ 
      success: true, 
      message: 'Property updated successfully',
      property 
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property (protected)
app.delete('/api/properties/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    // Check if property exists and belongs to user
    const existingProperty = await prisma.property.findFirst({
      where: { 
        id,
        userId: req.user.id
      }
    });

    if (!existingProperty) {
      return res.status(404).json({ error: 'Property not found or unauthorized' });
    }

    await prisma.property.delete({
      where: { id }
    });

    res.json({ 
      success: true, 
      message: 'Property deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: `Route ${req.originalUrl} not found`,
    message: 'Available routes: /health, /api/auth/*, /api/properties'
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Register: POST http://localhost:${PORT}/api/auth/register`);
  console.log(`🔑 Login: POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🏠 Properties: GET http://localhost:${PORT}/api/properties`);
  console.log(`📊 Prisma Studio: npx prisma studio\n`);
});