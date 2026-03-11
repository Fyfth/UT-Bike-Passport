import { promises as fs } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type PassportStatus = "Protected" | "Stolen" | "Recovered";
export type ReceiptStatus = "Uploaded" | "Pending";
export type HeroTone = "burnt" | "sage" | "steel";
export type MissingReportStatus = "Fresh report" | "Community search" | "Possible lead";
export type FoundPostStatus = "Open lead" | "Matched lead";
export type NotificationStatus = "Unread" | "Read";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type BikeRecord = {
  id: string;
  slug: string;
  ownerId: string;
  nickname: string;
  make: string;
  model: string;
  color: string;
  frameSize: string;
  serialNumber: string;
  lockType: string;
  commonParking: string;
  purchaseDate: string;
  purchaseSource: string;
  receiptReference: string;
  photoSummary: string;
  receiptStatus: ReceiptStatus;
  status: PassportStatus;
  lastSeen: string;
  reportedAt: string;
  note: string;
  heroTone: HeroTone;
  createdAt: string;
  updatedAt: string;
};

export type MissingReportRecord = {
  id: string;
  title: string;
  bikeType: string;
  zone: string;
  landmark: string;
  reportedAt: string;
  status: MissingReportStatus;
  summary: string;
  x: string;
  y: string;
  lat: string;
  lng: string;
  passportSlug: string;
  createdAt: string;
  updatedAt: string;
};

export type FoundPostRecord = {
  id: string;
  reporterName: string;
  reporterContact: string;
  zone: string;
  landmark: string;
  serialNumber: string;
  make: string;
  model: string;
  color: string;
  keywords: string;
  notes: string;
  x: string;
  y: string;
  lat: string;
  lng: string;
  status: FoundPostStatus;
  matchCount: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationRecord = {
  id: string;
  userId: string;
  bikeSlug: string;
  foundPostId: string;
  missingReportId: string;
  title: string;
  message: string;
  reason: string;
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
};

export const USER_SESSION_COOKIE = "utbp_user_id";

const dataDirectory = path.join(process.cwd(), "data");
const usersCsvPath = path.join(dataDirectory, "users.csv");
const bikesCsvPath = path.join(dataDirectory, "bikes.csv");
const missingReportsCsvPath = path.join(dataDirectory, "missing-reports.csv");
const foundPostsCsvPath = path.join(dataDirectory, "found-posts.csv");
const notificationsCsvPath = path.join(dataDirectory, "notifications.csv");

const userHeaders = ["id", "name", "email", "createdAt", "updatedAt"] as const;
const bikeHeaders = [
  "id",
  "slug",
  "ownerId",
  "nickname",
  "make",
  "model",
  "color",
  "frameSize",
  "serialNumber",
  "lockType",
  "commonParking",
  "purchaseDate",
  "purchaseSource",
  "receiptReference",
  "photoSummary",
  "receiptStatus",
  "status",
  "lastSeen",
  "reportedAt",
  "note",
  "heroTone",
  "createdAt",
  "updatedAt",
] as const;
const missingReportHeaders = [
  "id",
  "title",
  "bikeType",
  "zone",
  "landmark",
  "reportedAt",
  "status",
  "summary",
  "x",
  "y",
  "lat",
  "lng",
  "passportSlug",
  "createdAt",
  "updatedAt",
] as const;
const foundPostHeaders = [
  "id",
  "reporterName",
  "reporterContact",
  "zone",
  "landmark",
  "serialNumber",
  "make",
  "model",
  "color",
  "keywords",
  "notes",
  "x",
  "y",
  "lat",
  "lng",
  "status",
  "matchCount",
  "createdAt",
  "updatedAt",
] as const;
const notificationHeaders = [
  "id",
  "userId",
  "bikeSlug",
  "foundPostId",
  "missingReportId",
  "title",
  "message",
  "reason",
  "status",
  "createdAt",
  "updatedAt",
] as const;

const seedUsers: UserRecord[] = [
  {
    id: "user-maya",
    name: "Maya Chen",
    email: "maya@utexas.edu",
    createdAt: "2026-03-08T19:05:00.000Z",
    updatedAt: "2026-03-08T19:05:00.000Z",
  },
  {
    id: "user-jordan",
    name: "Jordan Alvarez",
    email: "jordan@utexas.edu",
    createdAt: "2026-03-05T18:25:00.000Z",
    updatedAt: "2026-03-05T18:25:00.000Z",
  },
  {
    id: "user-priya",
    name: "Priya Raman",
    email: "priya@utexas.edu",
    createdAt: "2026-02-27T21:12:00.000Z",
    updatedAt: "2026-02-27T21:12:00.000Z",
  },
];

const seedBikes: BikeRecord[] = [
  {
    id: "bike-burnt-commuter",
    slug: "burnt-commuter",
    ownerId: "user-maya",
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
    receiptStatus: "Uploaded",
    status: "Stolen",
    lastSeen: "March 8, 2026 at 6:20 PM",
    reportedAt: "March 8, 2026 at 7:05 PM",
    note: "Bottle cage has a small Longhorn sticker and a hidden QR ownership tag.",
    heroTone: "burnt",
    createdAt: "2026-03-08T19:05:00.000Z",
    updatedAt: "2026-03-08T19:05:00.000Z",
  },
  {
    id: "bike-midnight-fixie",
    slug: "midnight-fixie",
    ownerId: "user-jordan",
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
    receiptStatus: "Pending",
    status: "Protected",
    lastSeen: "",
    reportedAt: "",
    note: "Front wheel quick release replaced with security skewers.",
    heroTone: "sage",
    createdAt: "2026-03-05T18:25:00.000Z",
    updatedAt: "2026-03-05T18:25:00.000Z",
  },
  {
    id: "bike-silver-hauler",
    slug: "silver-hauler",
    ownerId: "user-priya",
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
    receiptStatus: "Uploaded",
    status: "Recovered",
    lastSeen: "February 27, 2026 at 3:45 PM",
    reportedAt: "February 27, 2026 at 4:12 PM",
    note: "Rear rack and milk-crate mount make this easy to identify.",
    heroTone: "steel",
    createdAt: "2026-02-27T21:12:00.000Z",
    updatedAt: "2026-02-27T21:12:00.000Z",
  },
];

const seedMissingReports: MissingReportRecord[] = [
  {
    id: "missing-burnt-commuter",
    title: "Burnt Orange Commuter",
    bikeType: "Hybrid commuter",
    zone: "West Campus edge",
    landmark: "21st and Speedway racks",
    reportedAt: "Reported 42 minutes ago",
    status: "Fresh report",
    summary: "Orange Trek commuter with Longhorn bottle cage sticker last seen locked near the outer racks.",
    x: "18",
    y: "30",
    lat: "30.2854",
    lng: "-97.7421",
    passportSlug: "burnt-commuter",
    createdAt: "2026-03-10T20:10:00.000Z",
    updatedAt: "2026-03-10T20:10:00.000Z",
  },
  {
    id: "missing-dobie-road-bike",
    title: "Blue campus road bike",
    bikeType: "Road bike",
    zone: "Dobie corridor",
    landmark: "Dobie garage entrance",
    reportedAt: "Reported today at 2:35 PM",
    status: "Community search",
    summary: "Blue drop-bar road bike with a silver bottle cage and scuffed right brake hood.",
    x: "40",
    y: "48",
    lat: "30.2872",
    lng: "-97.7369",
    passportSlug: "",
    createdAt: "2026-03-10T20:15:00.000Z",
    updatedAt: "2026-03-10T20:15:00.000Z",
  },
  {
    id: "missing-cargo-ebike",
    title: "Family cargo e-bike",
    bikeType: "Cargo e-bike",
    zone: "San Antonio Garage",
    landmark: "Garage bike room",
    reportedAt: "Reported yesterday at 9:05 AM",
    status: "Possible lead",
    summary: "Long-tail cargo e-bike with side pannier rails and a faded rear seat pad.",
    x: "68",
    y: "65",
    lat: "30.2824",
    lng: "-97.7412",
    passportSlug: "",
    createdAt: "2026-03-09T15:05:00.000Z",
    updatedAt: "2026-03-09T15:05:00.000Z",
  },
  {
    id: "missing-library-cruiser",
    title: "Black step-through cruiser",
    bikeType: "Step-through cruiser",
    zone: "PCL racks",
    landmark: "PCL north racks",
    reportedAt: "Reported today at 11:10 AM",
    status: "Community search",
    summary: "Black cruiser with wicker basket, yellow bell, and a cracked left pedal reflector.",
    x: "57",
    y: "33",
    lat: "30.2838",
    lng: "-97.7377",
    passportSlug: "",
    createdAt: "2026-03-10T17:10:00.000Z",
    updatedAt: "2026-03-10T17:10:00.000Z",
  },
];

const seedFoundPosts: FoundPostRecord[] = [];
const seedNotifications: NotificationRecord[] = [];

type CsvRow = Record<string, string>;

function escapeCsvValue(value: string) {
  const normalized = value.replace(/\r\n/g, " ").replace(/[\r\n]+/g, " ");
  if (/[",]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

function toCsv(rows: CsvRow[], headers: readonly string[]) {
  const headerLine = headers.join(",");
  const body = rows
    .map((row) => headers.map((header) => escapeCsvValue(row[header] ?? "")).join(","))
    .join("\n");

  return body ? `${headerLine}\n${body}\n` : `${headerLine}\n`;
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let currentField = "";
  let currentRow: string[] = [];
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (insideQuotes) {
      if (char === '"') {
        if (text[index + 1] === '"') {
          currentField += '"';
          index += 1;
        } else {
          insideQuotes = false;
        }
      } else {
        currentField += char;
      }
      continue;
    }

    if (char === '"') {
      insideQuotes = true;
      continue;
    }

    if (char === ",") {
      currentRow.push(currentField);
      currentField = "";
      continue;
    }

    if (char === "\n") {
      currentRow.push(currentField.replace(/\r$/, ""));
      rows.push(currentRow);
      currentField = "";
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.replace(/\r$/, ""));
    rows.push(currentRow);
  }

  return rows.filter((row) => row.some((value) => value.length > 0));
}

function rowsToRecords(rows: string[][]) {
  if (!rows.length) {
    return [] as CsvRow[];
  }

  const [headerRow, ...dataRows] = rows;
  return dataRows.map((row) => {
    const record: CsvRow = {};
    headerRow.forEach((header, index) => {
      record[header] = row[index] ?? "";
    });
    return record;
  });
}

async function ensureCsvFiles() {
  await fs.mkdir(dataDirectory, { recursive: true });

  try {
    await fs.access(usersCsvPath);
  } catch {
    await fs.writeFile(usersCsvPath, toCsv(seedUsers, userHeaders), "utf8");
  }

  try {
    await fs.access(bikesCsvPath);
  } catch {
    await fs.writeFile(bikesCsvPath, toCsv(seedBikes, bikeHeaders), "utf8");
  }

  try {
    await fs.access(missingReportsCsvPath);
  } catch {
    await fs.writeFile(missingReportsCsvPath, toCsv(seedMissingReports, missingReportHeaders), "utf8");
  }

  try {
    await fs.access(foundPostsCsvPath);
  } catch {
    await fs.writeFile(foundPostsCsvPath, toCsv(seedFoundPosts, foundPostHeaders), "utf8");
  }

  try {
    await fs.access(notificationsCsvPath);
  } catch {
    await fs.writeFile(notificationsCsvPath, toCsv(seedNotifications, notificationHeaders), "utf8");
  }
}

async function readCsvRecords(filePath: string) {
  await ensureCsvFiles();
  const raw = await fs.readFile(filePath, "utf8");
  return rowsToRecords(parseCsv(raw));
}

async function writeCsvRecords(filePath: string, headers: readonly string[], rows: CsvRow[]) {
  await ensureCsvFiles();
  await fs.writeFile(filePath, toCsv(rows, headers), "utf8");
}

export async function readUsers() {
  return (await readCsvRecords(usersCsvPath)) as UserRecord[];
}

export async function writeUsers(users: UserRecord[]) {
  await writeCsvRecords(usersCsvPath, userHeaders, users);
}

export async function readBikes() {
  return (await readCsvRecords(bikesCsvPath)) as BikeRecord[];
}

export async function writeBikes(bikes: BikeRecord[]) {
  await writeCsvRecords(bikesCsvPath, bikeHeaders, bikes);
}

export async function readMissingReports() {
  return (await readCsvRecords(missingReportsCsvPath)) as MissingReportRecord[];
}

export async function writeMissingReports(reports: MissingReportRecord[]) {
  await writeCsvRecords(missingReportsCsvPath, missingReportHeaders, reports);
}

export async function readFoundPosts() {
  return (await readCsvRecords(foundPostsCsvPath)) as FoundPostRecord[];
}

export async function writeFoundPosts(posts: FoundPostRecord[]) {
  await writeCsvRecords(foundPostsCsvPath, foundPostHeaders, posts);
}

export async function readNotifications() {
  return (await readCsvRecords(notificationsCsvPath)) as NotificationRecord[];
}

export async function writeNotifications(notifications: NotificationRecord[]) {
  await writeCsvRecords(notificationsCsvPath, notificationHeaders, notifications);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(USER_SESSION_COOKIE)?.value;

  if (!userId) {
    return null;
  }

  const users = await readUsers();
  return users.find((user) => user.id === userId) ?? null;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return user;
}
