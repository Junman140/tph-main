const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Simple password hashing function (same as in auth route)
function simpleHash(password) {
  return Buffer.from(password).toString('base64');
}

async function createAdminUser() {
  try {
    // Check if any admin users exist
    const adminCount = await prisma.adminUser.count();
    
    if (adminCount > 0) {
      console.log('Admin user already exists. Skipping creation.');
      return;
    }

    // Create the admin user
    const admin = await prisma.adminUser.create({
      data: {
        email: 'thepeculiarhouseglobal@gmail.com',
        password: simpleHash('admin123'), // Default password
        name: 'Admin User',
        role: 'admin',
        isActive: true,
      },
    });

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    console.log('Name:', admin.name);
    console.log('\nPlease change the password after first login!');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();