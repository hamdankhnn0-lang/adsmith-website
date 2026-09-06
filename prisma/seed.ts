import { PrismaClient, type FeedbackCategory, type FeedbackStatus, type ReviewTopicName, type Sentiment } from "@prisma/client";
import bcrypt from "bcryptjs";
import { BRANCH_SEED } from "../src/lib/constants";
import { analyzeReview } from "../src/lib/ai/sentiment";

const prisma = new PrismaClient();

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(randomInt(9, 22), randomInt(0, 59), 0, 0);
  return d;
}

const REVIEWER_NAMES = [
  "Ahmed Khan", "Fatima Ali", "Bilal Hussain", "Sara Malik", "Usman Tariq",
  "Ayesha Noor", "Hamza Sheikh", "Zainab Iqbal", "Ali Raza", "Mahnoor Aftab",
  "Faizan Ahmed", "Sana Yousaf", "Omar Farooq", "Hina Shah", "Tariq Mehmood",
  "Nida Baig", "Asad Jamil", "Rabia Zafar", "Kamran Afridi", "Sadia Gul",
  "Junaid Wazir", "Mariam Durrani", "Shahid Rehman", "Alina Khattak", "Waqas Yousafzai",
];

const POSITIVE_TEMPLATES = [
  "The pizza was absolutely delicious, fresh and hot! Delivery was fast too. Highly recommend.",
  "Best pizza in Peshawar, hands down. Great taste and generous quantity for the price.",
  "Staff was very friendly and the packaging was neat. Loved the wings as well!",
  "Amazing food quality, the burger was juicy and the fries were crispy. Will order again.",
  "Fast delivery and the pizza arrived hot. Great value for money.",
  "Excellent customer service and the pasta was so tasty. Clean and well presented.",
  "Great experience overall, the sauces were fantastic and staff behavior was excellent.",
  "The pizza taste is unmatched, quantity was generous and packaging kept everything fresh.",
  "Ordered wings and pizza, both were amazing. Quick delivery, very happy with the service.",
  "Clean restaurant, polite staff and delicious food. Best pizza place in the city.",
];

const MIXED_TEMPLATES = [
  "Pizza was delicious but the delivery was a bit late tonight.",
  "Great taste but the packaging was slightly damaged when it arrived.",
  "Food quality is good but the waiting time at the branch was longer than expected.",
  "Loved the pizza, but the price feels a little high for the quantity.",
  "Staff was friendly but the delivery time could be improved.",
];

const NEGATIVE_TEMPLATES = [
  "Delivery was very late and the pizza arrived cold. Not happy with the experience.",
  "Staff behavior was rude and unprofessional. Disappointed with the service.",
  "The pizza was cold by the time it reached us. Packaging was also soggy.",
  "Waited way too long for a simple order. Delivery time needs serious improvement.",
  "Quality has gone down, the pizza tasted stale and the quantity was small for the price.",
  "Very disappointed, the order was wrong and the staff didn't apologize properly.",
  "Cold food, late delivery, and poor packaging. Expected much better.",
  "The wings were burnt and the sauces tasted off. Not up to the usual standard.",
];

const REPLY_TEMPLATES_POSITIVE = [
  "Thank you so much for your kind words! We're thrilled you enjoyed your visit and hope to see you again soon. — Pizza Box Peshawar Team",
];
const REPLY_TEMPLATES_NEGATIVE = [
  "We're sorry to hear about your experience. This isn't the standard we aim for. Please contact us directly so we can make things right. — Pizza Box Peshawar Team",
];

const FEEDBACK_CATEGORIES = [
  "FOOD_QUALITY", "DELIVERY", "STAFF_BEHAVIOR", "CLEANLINESS", "PACKAGING", "WAITING_TIME", "OVERALL_EXPERIENCE",
] as const;

async function main() {
  console.log("Seeding Pizza Box Peshawar demo data...");

  // --- Users -----------------------------------------------------------
  const passwordHash = await bcrypt.hash("PizzaBox@123", 10);

  await prisma.user.upsert({
    where: { email: "admin@pizzabox.pk" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@pizzabox.pk",
      passwordHash,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "analyst@pizzabox.pk" },
    update: {},
    create: {
      name: "Reputation Analyst",
      email: "analyst@pizzabox.pk",
      passwordHash,
      role: "ANALYST",
    },
  });

  // --- Branches ----------------------------------------------------------
  const branches = [];
  for (const b of BRANCH_SEED) {
    const branch = await prisma.branch.upsert({
      where: { slug: b.slug },
      update: {},
      create: {
        name: b.name,
        slug: b.slug,
        address: `${b.name}, Peshawar, Khyber Pakhtunkhwa`,
        targetRating: 4.5,
        googleReviewUrl: `https://search.google.com/local/writereview?placeid=DEMO_PLACE_ID_${b.slug.toUpperCase()}`,
      },
    });
    branches.push(branch);

    await prisma.googleLocation.upsert({
      where: { branchId: branch.id },
      update: {},
      create: {
        branchId: branch.id,
        locationName: `Pizza Box Peshawar - ${b.name}`,
        connected: false,
      },
    });

    const managerEmail = `manager.${b.slug}@pizzabox.pk`;
    await prisma.user.upsert({
      where: { email: managerEmail },
      update: {},
      create: {
        name: `${b.name} Branch Manager`,
        email: managerEmail,
        passwordHash,
        role: "BRANCH_MANAGER",
        branchId: branch.id,
      },
    });
  }

  // --- Demo Google Reviews -------------------------------------------------
  console.log("Generating demo Google reviews...");
  let reviewCounter = 0;

  for (const branch of branches) {
    const googleLocation = await prisma.googleLocation.findUniqueOrThrow({ where: { branchId: branch.id } });
    const reviewCount = randomInt(30, 45);

    for (let i = 0; i < reviewCount; i++) {
      const roll = Math.random();
      let rating: number;
      let template: string;

      if (roll < 0.55) {
        rating = 5;
        template = pick(POSITIVE_TEMPLATES);
      } else if (roll < 0.75) {
        rating = 4;
        template = pick(POSITIVE_TEMPLATES.concat(MIXED_TEMPLATES));
      } else if (roll < 0.87) {
        rating = 3;
        template = pick(MIXED_TEMPLATES);
      } else if (roll < 0.95) {
        rating = 2;
        template = pick(NEGATIVE_TEMPLATES);
      } else {
        rating = 1;
        template = pick(NEGATIVE_TEMPLATES);
      }

      const createTime = daysAgo(randomInt(0, 365));
      const reviewerName = pick(REVIEWER_NAMES);
      const hasReply = rating >= 4 ? Math.random() < 0.55 : Math.random() < 0.35;

      reviewCounter += 1;
      const googleReviewId = `demo-review-${branch.slug}-${reviewCounter}-${Date.now()}`;

      const review = await prisma.googleReview.create({
        data: {
          googleLocationId: googleLocation.id,
          googleReviewId,
          reviewerName,
          rating,
          comment: template,
          createTime,
          source: "DEMO",
          replyComment: hasReply ? pick(rating >= 4 ? REPLY_TEMPLATES_POSITIVE : REPLY_TEMPLATES_NEGATIVE) : null,
          replyUpdateTime: hasReply ? new Date(createTime.getTime() + 1000 * 60 * 60 * 12) : null,
        },
      });

      const analysis = await analyzeReview(template, rating);
      await prisma.reviewAnalysis.create({
        data: {
          googleReviewId: review.id,
          sentiment: analysis.sentiment,
          summary: analysis.summary,
          model: analysis.model,
          topics: {
            create: analysis.topics.map((t) => ({
              topic: t.topic as ReviewTopicName,
              sentiment: t.sentiment as Sentiment,
              mentionText: t.mentionText,
            })),
          },
        },
      });
    }

    console.log(`  ${branch.name}: ${reviewCount} reviews generated`);
  }

  // --- Demo private customer feedback (QR flow) ---------------------------
  console.log("Generating demo private customer feedback...");
  for (const branch of branches) {
    const feedbackCount = randomInt(12, 20);
    for (let i = 0; i < feedbackCount; i++) {
      const rating = randomInt(1, 5);
      const hasText = Math.random() < 0.7;
      await prisma.customerFeedback.create({
        data: {
          branchId: branch.id,
          rating,
          feedbackText: hasText ? pick(rating >= 4 ? POSITIVE_TEMPLATES : rating === 3 ? MIXED_TEMPLATES : NEGATIVE_TEMPLATES) : null,
          customerName: Math.random() < 0.4 ? pick(REVIEWER_NAMES) : null,
          customerPhone: Math.random() < 0.3 ? `03${randomInt(10, 99)}${randomInt(1000000, 9999999)}` : null,
          foodQualityRating: randomInt(3, 5),
          deliveryRating: randomInt(2, 5),
          staffRating: randomInt(3, 5),
          cleanlinessRating: randomInt(3, 5),
          packagingRating: randomInt(3, 5),
          waitingTimeRating: randomInt(2, 5),
          category: pick([...FEEDBACK_CATEGORIES]) as FeedbackCategory,
          status: (rating <= 2 ? pick(["NEW", "IN_PROGRESS"]) : "NEW") as FeedbackStatus,
          wentToGoogle: Math.random() < 0.3,
          createdAt: daysAgo(randomInt(0, 90)),
        },
      });
    }
  }

  // --- Demo competitors ----------------------------------------------------
  console.log("Generating demo competitor data...");
  const competitorDefs = [
    { name: "Broadway Pizza", rating: 4.4, reviews: 1950, growth: 120 },
    { name: "Pizza Hut", rating: 4.2, reviews: 3100, growth: 90 },
    { name: "Domino's Pizza", rating: 4.3, reviews: 2680, growth: 105 },
    { name: "Peshawar Pizza House (Local)", rating: 4.0, reviews: 640, growth: 40 },
  ];

  for (const c of competitorDefs) {
    const competitor = await prisma.competitor.create({
      data: { name: c.name, notes: "Demo Data — manually entered for benchmarking." },
    });

    for (const branch of branches.slice(0, 3)) {
      const location = await prisma.competitorLocation.create({
        data: {
          competitorId: competitor.id,
          branchId: branch.id,
          locationLabel: `${c.name} - near ${branch.name}`,
          rating: c.rating + (Math.random() * 0.4 - 0.2),
          reviewCount: Math.round(c.reviews / 3) + randomInt(-50, 50),
          monthlyGrowth: Math.round(c.growth / 3) + randomInt(-10, 10),
          source: "DEMO",
        },
      });

      for (let i = 0; i < 8; i++) {
        const rating = randomInt(1, 5);
        await prisma.competitorReview.create({
          data: {
            competitorLocationId: location.id,
            rating,
            comment: rating >= 4 ? pick(POSITIVE_TEMPLATES) : pick(NEGATIVE_TEMPLATES),
            sentiment: rating >= 4 ? "POSITIVE" : rating === 3 ? "NEUTRAL" : "NEGATIVE",
            reviewDate: daysAgo(randomInt(0, 180)),
            source: "DEMO",
          },
        });
      }
    }
  }

  // --- Sample alerts ---------------------------------------------------
  console.log("Generating sample alerts...");
  const worstBranch = branches[branches.length - 1];
  await prisma.alert.create({
    data: {
      branchId: worstBranch.id,
      type: "NEW_ONE_STAR",
      severity: "CRITICAL",
      title: `${worstBranch.name} received a new 1-star review`,
      description: "A customer reported a cold pizza and late delivery.",
      recommendedAction: "Contact the customer privately and review delivery times for this branch.",
      createdAt: daysAgo(0),
    },
  });
  await prisma.alert.create({
    data: {
      branchId: worstBranch.id,
      type: "BRANCH_BELOW_TARGET",
      severity: "WARNING",
      title: `${worstBranch.name} rating is below target`,
      description: `Current average rating is below the ${worstBranch.targetRating}★ target.`,
      recommendedAction: "Review recent complaints and coach staff on service quality.",
      createdAt: daysAgo(1),
    },
  });

  console.log("Seed complete.");
  console.log("\nDemo login credentials (password for all: PizzaBox@123):");
  console.log("  Super Admin:     admin@pizzabox.pk");
  console.log("  Analyst:         analyst@pizzabox.pk");
  console.log("  Branch Manager:  manager.hayatabad@pizzabox.pk (etc. per branch)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
