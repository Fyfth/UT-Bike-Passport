import {
  BikePassportStatus,
  HeroTone,
  MatchConfidence,
  PrismaClient,
  ReceiptStatus,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.recoveryMatch.deleteMany();
  await prisma.recoveredBike.deleteMany();
  await prisma.bikePassport.deleteMany();
  await prisma.owner.deleteMany();

  const maya = await prisma.owner.create({
    data: {
      name: "Maya Chen",
      email: "maya@utexas.edu",
    },
  });

  const jordan = await prisma.owner.create({
    data: {
      name: "Jordan Alvarez",
      email: "jordan@utexas.edu",
    },
  });

  const priya = await prisma.owner.create({
    data: {
      name: "Priya Raman",
      email: "priya@utexas.edu",
    },
  });

  const burntCommuter = await prisma.bikePassport.create({
    data: {
      ownerId: maya.id,
      slug: "burnt-commuter",
      nickname: "Burnt Orange Commuter",
      make: "Trek",
      model: "FX 2 Disc",
      color: "Burnt orange",
      frameSize: "Medium",
      serialNumber: "WTU2485MUT26",
      lockType: "U-lock + braided cable",
      commonParking: "PCL racks, Speedway Mall, Welch Hall",
      purchaseDate: "August 2025",
      purchaseSource: "Bicycle Sport Shop",
      receiptReference: "Printed receipt uploaded during orientation week.",
      photoSummary: "Three full-bike shots plus a close-up of the Longhorn bottle cage sticker.",
      receiptStatus: ReceiptStatus.UPLOADED,
      status: BikePassportStatus.STOLEN,
      lastSeen: "March 8, 2026 at 6:20 PM",
      reportedAt: "March 8, 2026 at 7:05 PM",
      note: "Bottle cage has a small Longhorn sticker and a hidden QR ownership tag.",
      heroTone: HeroTone.BURNT,
    },
  });

  const midnightFixie = await prisma.bikePassport.create({
    data: {
      ownerId: jordan.id,
      slug: "midnight-fixie",
      nickname: "Midnight Fixie",
      make: "State Bicycle Co.",
      model: "4130 Single Speed",
      color: "Matte black",
      frameSize: "Large",
      serialNumber: "SBC4130ATX92",
      lockType: "Kryptonite New-U lock",
      commonParking: "Jester racks, Greg Gym, East Campus Garage",
      purchaseDate: "January 2026",
      purchaseSource: "Facebook Marketplace",
      receiptReference: "Bill of sale screenshot saved in account.",
      photoSummary: "Two side profiles and a drivetrain close-up.",
      receiptStatus: ReceiptStatus.PENDING,
      status: BikePassportStatus.PROTECTED,
      note: "Front wheel quick release replaced with security skewers.",
      heroTone: HeroTone.SAGE,
    },
  });

  const silverHauler = await prisma.bikePassport.create({
    data: {
      ownerId: priya.id,
      slug: "silver-hauler",
      nickname: "Silver Hauler",
      make: "Specialized",
      model: "Sirrus X 3.0",
      color: "Silver mist",
      frameSize: "Small",
      serialNumber: "WSBC604ATX18",
      lockType: "Folding lock",
      commonParking: "Student Activity Center, GDC, San Antonio Garage",
      purchaseDate: "June 2024",
      purchaseSource: "REI",
      receiptReference: "Digital REI receipt linked in account.",
      photoSummary: "Full-bike shot, rear rack close-up, and milk-crate mount detail.",
      receiptStatus: ReceiptStatus.UPLOADED,
      status: BikePassportStatus.RECOVERED,
      lastSeen: "February 27, 2026 at 3:45 PM",
      reportedAt: "February 27, 2026 at 4:12 PM",
      note: "Rear rack and milk-crate mount make this easy to identify.",
      heroTone: HeroTone.STEEL,
    },
  });

  const recoveredCommuter = await prisma.recoveredBike.create({
    data: {
      title: "Recovered commuter bike",
      foundAt: "March 10, 2026",
      zone: "San Antonio Garage",
      holdStatus: "Awaiting owner response",
      note: "Orange frame, city tires, bottle cage scuff marks.",
      matches: {
        create: {
          bikePassportId: burntCommuter.id,
          confidence: MatchConfidence.HIGH,
          reason: "Exact color profile, matching rack location history, and matching accessories.",
        },
      },
    },
  });

  const recoveredHybrid = await prisma.recoveredBike.create({
    data: {
      title: "Recovered silver hybrid",
      foundAt: "March 7, 2026",
      zone: "East Campus perimeter",
      holdStatus: "Needs owner review",
      note: "Rear rack installed, silver frame, front light mount missing.",
      matches: {
        create: {
          bikePassportId: silverHauler.id,
          confidence: MatchConfidence.MEDIUM,
          reason: "Strong visual overlap, but serial number not yet confirmed.",
        },
      },
    },
  });

  const recoveredSingleSpeed = await prisma.recoveredBike.create({
    data: {
      title: "Recovered black single-speed",
      foundAt: "March 5, 2026",
      zone: "Dobie loading zone",
      holdStatus: "No clean match yet",
      note: "Matte black frame with security skewers and flat pedals.",
      matches: {
        create: {
          bikePassportId: midnightFixie.id,
          confidence: MatchConfidence.NEEDS_REVIEW,
          reason: "Wheel setup matches, but the stem and seatpost differ from the uploaded photos.",
        },
      },
    },
  });

  console.log(
    `Seeded ${[burntCommuter, midnightFixie, silverHauler].length} passports and ${[
      recoveredCommuter,
      recoveredHybrid,
      recoveredSingleSpeed,
    ].length} recovered-bike records.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });