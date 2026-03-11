export const problemSignals = [
  {
    title: "Fear changes behavior",
    detail:
      "Students want to bike, but fear of theft changes where they park, when they ride, and whether they bring a bike to campus at all.",
  },
  {
    title: "Reports feel fragmented",
    detail:
      "Ownership proof, police reporting, and community awareness live in different places, so the first hour after a theft feels chaotic.",
  },
  {
    title: "Recovered bikes still go cold",
    detail:
      "Even when bikes are found, weak ownership records make it harder to reconnect them with the right rider before they disappear into a dead-end workflow.",
  },
];

export const registrationSignals = [
  {
    title: "Identity",
    detail: "Serial, make, model, and color create the cleanest recovery signal.",
  },
  {
    title: "Proof",
    detail: "Receipts, purchase notes, and photo summaries prove ownership before the stressful part starts.",
  },
  {
    title: "Context",
    detail: "Lock setup and common parking habits help recovery teams judge whether a listing looks plausible.",
  },
];

export const incidents = [
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

export const zoneSummaries = [
  {
    name: "West Campus edge",
    risk: "High watch",
    guidance: "Push riders toward crowded racks or indoor storage after dusk.",
  },
  {
    name: "Dobie corridor",
    risk: "Active reports",
    guidance: "Good pilot location for rapid reporting and notification handoff.",
  },
  {
    name: "San Antonio Garage",
    risk: "Recovery hotspot",
    guidance: "Good candidate for recovered-bike intake and owner matching.",
  },
];