import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

// Simple password hashing function (replace with bcryptjs when available)
function simpleHash(password: string): string {
  return Buffer.from(password).toString('base64');
}

function simpleCompare(password: string, hash: string): boolean {
  return simpleHash(password) === hash;
}

// POST /api/admin/auth/login
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    // Only allow login with the specific admin email
    if (email.toLowerCase() !== 'thepeculiarhouseglobal@gmail.com') {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 401 }
      );
    }

    // Find admin user
    const admin = await prisma.adminUser.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 401 }
      );
    }

    // Verify password
    if (!simpleCompare(password, admin.password)) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 401 }
      );
    }

    // Return admin data (excluding password)
    const adminSafe = { ...admin } as Record<string, unknown>
    delete adminSafe.password

    return NextResponse.json({
      message: 'Login successful',
      admin: adminSafe,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}

// POST /api/admin/auth/register (for initial setup)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check if any admin users exist
    const adminCount = await prisma.adminUser.count();
    if (adminCount > 0) {
      return NextResponse.json(
        { error: 'Admin registration is only allowed when no admins exist' },
        { status: 403 }
      );
    }

    // Hash password
    const hashedPassword = simpleHash(password);

    // Create admin user
    const admin = await prisma.adminUser.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'admin',
      },
    });

    const adminSafe = { ...admin } as Record<string, unknown>
    delete adminSafe.password

    return NextResponse.json({
      message: 'Admin user created successfully',
      admin: adminSafe,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
