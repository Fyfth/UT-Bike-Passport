export type PassportStatus = "Protected" | "Stolen" | "Recovered";
export type MatchConfidence = "High" | "Medium" | "Needs review";

export type Passport = {
  id: string;
  nickname: string;
  ownerName: string;
  make: string;
  model: string;
  color: string;
  frameSize: string;
  serialNumber: string;
  lockType: string;
  commonParking: string[];
  purchaseDate: string;
  purchaseSource: string;
  receiptStatus: "Uploaded" | "Pending";
  status: PassportStatus;
  lastSeen?: string;
  reportedAt?: string;
  note: string;
  heroTone: "burnt" | "sage" | "steel";
};

export type Incident = {
  id: string;
  zone: string;
  timestamp: string;
  bikeType: string;
  status: "Open" | "Recovered lead" | "Escalated";
  note: string;
};

export type RecoveredBike = {
  id: string;
  title: string;
  foundAt: string;
  zone: string;
  holdStatus: string;
  note: string;
  matchCandidates: {
    passportId: string;
    confidence: MatchConfidence;
    reason: string;
  }[];
};

export const passports: Passport[] = [
  {
    id: "burnt-commuter",
    nickname: "Burnt Orange Commuter",
    ownerName: "Maya Chen",
    make: "Trek",
    model: "FX 2 Disc",
    color: "Burnt orange",
    frameSize: "Medium",
    serialNumber: "WTU2485MUT26",
    lockType: "U-lock + braided cable",
    commonParking: ["PCL racks", "Speedway Mall", "Welch Hall"],
    purchaseDate: "August 2025",
    purchaseSource: "Bicycle Sport Shop",
    receiptStatus: "Uploaded",
    status: "Stolen",
    lastSeen: "March 8, 2026 at 6:20 PM",
    reportedAt: "March 8, 2026 at 7:05 PM",
    note: "Bottle cage has a small Longhorn sticker and a hidden QR ownership tag.",
    heroTone: "burnt",
  },
  {
    id: "midnight-fixie",
    nickname: "Midnight Fixie",
    ownerName: "Jordan Alvarez",
    make: "State Bicycle Co.",
    model: "4130 Single Speed",
    color: "Matte black",
    frameSize: "Large",
    serialNumber: "SBC4130ATX92",
    lockType: "Kryptonite New-U lock",
    commonParking: ["Jester racks", "Greg Gym", "East Campus Garage"],
    purchaseDate: "January 2026",
    purchaseSource: "Facebook Marketplace",
    receiptStatus: "Pending",
    status: "Protected",
    note: "Front wheel quick release replaced with security skewers.",
    heroTone: "sage",
  },
  {
    id: "silver-hauler",
    nickname: "Silver Hauler",
    ownerName: "Priya Raman",
    make: "Specialized",
    model: "Sirrus X 3.0",
    color: "Silver mist",
    frameSize: "Small",
    serialNumber: "WSBC604ATX18",
    lockType: "Folding lock",
    commonParking: ["Student Activity Center", "GDC", "San Antonio Garage"],
    purchaseDate: "June 2024",
    purchaseSource: "REI",
    receiptStatus: "Uploaded",
    status: "Recovered",
    lastSeen: "February 27, 2026 at 3:45 PM",
    reportedAt: "February 27, 2026 at 4:12 PM",
    note: "Rear rack and milk-crate mount make this easy to identify.",
    heroTone: "steel",
  },
];

export const incidents: Incident[] = [
  {
    id: "inc-01",
    zone: "West Campus edge",
    timestamp: "Tonight, 8:10 PM",
    bikeType: "Hybrid commuter",
    status: "Open",
    note: "Reported near the outer racks by 21st and Speedway.",
  },
  {
    id: "inc-02",
    zone: "Dobie garage corridor",
    timestamp: "Today, 2:35 PM",
    bikeType: "Road bike",
    status: "Escalated",
    note: "Owner uploaded passport, receipt, and last-seen details within seven minutes.",
  },
  {
    id: "inc-03",
    zone: "San Antonio Garage",
    timestamp: "Yesterday, 9:05 AM",
    bikeType: "Cargo e-bike",
    status: "Recovered lead",
    note: "A recovered-bike intake created a possible match before the auction pipeline.",
  },
];

export const recoveredBikes: RecoveredBike[] = [
  {
    id: "rec-101",
    title: "Recovered commuter bike",
    foundAt: "March 10, 2026",
    zone: "San Antonio Garage",
    holdStatus: "Awaiting owner response",
    note: "Orange frame, city tires, bottle cage scuff marks.",
    matchCandidates: [
      {
        passportId: "burnt-commuter",
        confidence: "High",
        reason: "Exact color profile, matching rack location history, and matching accessories.",
      },
    ],
  },
  {
    id: "rec-102",
    title: "Recovered silver hybrid",
    foundAt: "March 7, 2026",
    zone: "East Campus perimeter",
    holdStatus: "Needs owner review",
    note: "Rear rack installed, silver frame, front light mount missing.",
    matchCandidates: [
      {
        passportId: "silver-hauler",
        confidence: "Medium",
        reason: "Strong visual overlap, but serial number not yet confirmed.",
      },
    ],
  },
  {
    id: "rec-103",
    title: "Recovered black single-speed",
    foundAt: "March 5, 2026",
    zone: "Dobie loading zone",
    holdStatus: "No clean match yet",
    note: "Matte black frame with security skewers and flat pedals.",
    matchCandidates: [
      {
        passportId: "midnight-fixie",
        confidence: "Needs review",
        reason: "Wheel setup matches, but the stem and seatpost differ from the uploaded photos.",
      },
    ],
  },
];

export const zoneSummaries = [
  {
    name: "West Campus edge",
    risk: "High watch",
    guidance: "Push riders toward crowded racks or indoor storage after dusk.",
  },
  {
    name: "Dobie corridor",
    risk: "Active reports",
    guidance: "Best place for a passport-based rapid reporting flow demo.",
  },
  {
    name: "San Antonio Garage",
    risk: "Recovery hotspot",
    guidance: "Good pilot location for recovered-bike intake and owner matching.",
  },
];

export function getPassportById(passportId: string) {
  return passports.find((passport) => passport.id === passportId);
}

export function getRecoveredMatchesForPassport(passportId: string) {
  return recoveredBikes.filter((bike) =>
    bike.matchCandidates.some((candidate) => candidate.passportId === passportId),
  );
}
