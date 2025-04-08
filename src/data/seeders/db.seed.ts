import prisma from "@/utils/dbconfig";
import bcrypt from "bcryptjs";

async function main() {
  const adminEmail = 'admin@organisation.com';
  const adminPassword = 'password123'; 

  // Hash the password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Upsert the admin user to ensure idempotency
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword, 
      role: 'admin',
      phone: '0774567890',
      address: 'Head Quarters',
      ecno: "12345678",
      idno: "317498134589",
      status: "active",
      bankname: "Access",
      branch: "New",
      accountNumber: "0924657494877",
      department: "Administration",
    },
  });

  console.log('Admin account seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding admin account:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
