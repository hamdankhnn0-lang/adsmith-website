import { PrismaClient } from "@prisma/client";
import { seedDemoData } from "../src/lib/seed-demo-data";

const prisma = new PrismaClient();

seedDemoData(prisma)
  .then(() => {
    console.log("\nDemo login credentials (password for all: PizzaBox@123):");
    console.log("  Super Admin:     admin@pizzabox.pk");
    console.log("  Analyst:         analyst@pizzabox.pk");
    console.log("  Branch Manager:  manager.hayatabad@pizzabox.pk (etc. per branch)");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
