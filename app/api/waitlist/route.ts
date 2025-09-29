import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.waitlist.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Looks like u have already registerd!' },
        { status: 409 }
      );
    }

    // Add email to waitlist
    const waitlistEntry = await prisma.waitlist.create({
      data: {
        email: email.toLowerCase(),
      },
    });

    return NextResponse.json(
      {
        message: 'Successfully joined the waitlist!',
        id: waitlistEntry.id
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
