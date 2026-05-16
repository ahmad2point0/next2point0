import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123", 10);

  const jane = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      name: "Jane Doe",
      passwordHash,
      bio: "Product engineer building tools for distributed teams.",
    },
  });

  await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      name: "John Smith",
      passwordHash,
      bio: "Designer who codes.",
    },
  });

  await prisma.project.deleteMany({ where: { ownerId: jane.id } });

  await prisma.project.createMany({
    data: [
      {
        name: "Aurora landing redesign",
        description: "Refresh the marketing site with a new motion system.",
        status: "active",
        members: 4,
        ownerId: jane.id,
      },
      {
        name: "Billing migration",
        description: "Move from monthly invoices to usage-based pricing.",
        status: "active",
        members: 2,
        ownerId: jane.id,
      },
      {
        name: "iOS launch",
        description: "Submit v1 to the App Store and prepare release notes.",
        status: "paused",
        members: 3,
        ownerId: jane.id,
      },
      {
        name: "Docs overhaul",
        description: "Rewrite the developer documentation with the new IA.",
        status: "completed",
        members: 5,
        ownerId: jane.id,
      },
    ],
  });

  console.log("Seed complete. Login as jane@example.com / Password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
