import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const applications = [
  { companyName: "Google", jobTitle: "Software Engineer Intern", jobType: "Internship", status: "Applied", appliedDate: new Date("2026-06-01"), notes: "Applied through referral" },
  { companyName: "Meta", jobTitle: "Frontend Developer", jobType: "Full-time", status: "Interviewing", appliedDate: new Date("2026-05-28"), notes: "Phone screen scheduled" },
  { companyName: "Stripe", jobTitle: "Backend Engineer", jobType: "Full-time", status: "Offer", appliedDate: new Date("2026-05-15"), notes: "Received offer letter" },
  { companyName: "Airbnb", jobTitle: "Full Stack Developer", jobType: "Full-time", status: "Rejected", appliedDate: new Date("2026-05-10"), notes: "Rejected after final round" },
  { companyName: "Shopify", jobTitle: "Frontend Developer Intern", jobType: "Internship", status: "Interviewing", appliedDate: new Date("2026-06-05"), notes: "Technical interview next week" },
  { companyName: "Netflix", jobTitle: "UI Engineer", jobType: "Part-time", status: "Applied", appliedDate: new Date("2026-06-10"), notes: "" },
  { companyName: "Spotify", jobTitle: "Backend Developer", jobType: "Full-time", status: "Offer", appliedDate: new Date("2026-05-20"), notes: "Negotiating offer" },
  { companyName: "Microsoft", jobTitle: "Software Engineer", jobType: "Full-time", status: "Interviewing", appliedDate: new Date("2026-06-02"), notes: "Preparing for system design round" },
  { companyName: "Amazon", jobTitle: "SDE Intern", jobType: "Internship", status: "Rejected", appliedDate: new Date("2026-04-20"), notes: "Did not pass OA" },
  { companyName: "Apple", jobTitle: "iOS Developer", jobType: "Full-time", status: "Applied", appliedDate: new Date("2026-06-12"), notes: "Waiting for response" },
];

async function seed() {
  console.log("Seeding database...");
  for (const app of applications) {
    await prisma.application.create({ data: app });
  }
  console.log("Seed completed!");
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
