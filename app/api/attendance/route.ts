import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

const attendanceSchema = z.object({
  serviceDate: z.string().min(1, "Service date is required"),
  serviceType: z.string().min(1, "Service type is required"),
  memberName: z.string().min(1, "Member name is required"),
  memberId: z.string().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  address: z.string().optional().nullable(),
  age: z.number().int().positive().optional().nullable(),
  gender: z.string().optional().nullable(),
  isVisitor: z.boolean().default(false),
  isFirstTime: z.boolean().default(false),
  notes: z.string().optional().nullable(),
  recordedBy: z.string().optional().nullable(),
});

// GET /api/attendance - Fetch all attendance records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceDate = searchParams.get('serviceDate');
    const serviceType = searchParams.get('serviceType');
    const memberName = searchParams.get('memberName');
    const isVisitor = searchParams.get('isVisitor');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    
    if (serviceDate) {
      const date = new Date(serviceDate);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      where.serviceDate = {
        gte: startOfDay,
        lte: endOfDay,
      };
    }
    
    if (serviceType) {
      where.serviceType = serviceType;
    }
    
    if (memberName) {
      where.memberName = {
        contains: memberName,
        mode: 'insensitive',
      };
    }
    
    if (isVisitor !== null) {
      where.isVisitor = isVisitor === 'true';
    }

    const [records, total] = await Promise.all([
      prisma.attendanceRecord.findMany({
        where,
        orderBy: { serviceDate: 'desc' },
        skip,
        take: limit,
      }),
      prisma.attendanceRecord.count({ where }),
    ]);

    return NextResponse.json({
      records,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get attendance records error:", error);
    return NextResponse.json({ 
      error: "Failed to fetch attendance records", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST /api/attendance - Create new attendance record
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = attendanceSchema.parse(body);

    const record = await prisma.attendanceRecord.create({
      data: {
        serviceDate: new Date(validatedData.serviceDate),
        serviceType: validatedData.serviceType,
        memberName: validatedData.memberName,
        memberId: validatedData.memberId || null,
        phoneNumber: validatedData.phoneNumber || null,
        email: validatedData.email || null,
        address: validatedData.address || null,
        age: validatedData.age || null,
        gender: validatedData.gender || null,
        isVisitor: validatedData.isVisitor,
        isFirstTime: validatedData.isFirstTime,
        notes: validatedData.notes || null,
        recordedBy: validatedData.recordedBy || null,
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Create attendance record error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      error: "Failed to create attendance record", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT /api/attendance - Update attendance record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    const validatedData = attendanceSchema.partial().parse(updateData);

    const record = await prisma.attendanceRecord.update({
      where: { id },
      data: {
        ...validatedData,
        serviceDate: validatedData.serviceDate ? new Date(validatedData.serviceDate) : undefined,
      },
    });

    return NextResponse.json(record);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update attendance record error:", error);
    return NextResponse.json({ 
      error: "Failed to update attendance record", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE /api/attendance - Delete attendance record
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    await prisma.attendanceRecord.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Attendance record deleted successfully" });
  } catch (error) {
    console.error("Delete attendance record error:", error);
    return NextResponse.json({ 
      error: "Failed to delete attendance record", 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
