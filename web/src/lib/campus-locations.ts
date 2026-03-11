export type CampusLocation = {
  id: string;
  zone: string;
  landmark: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
};

export const campusLocations: CampusLocation[] = [
  {
    id: "speedway-21st",
    zone: "West Campus edge",
    landmark: "21st and Speedway racks",
    lat: 30.2854,
    lng: -97.7421,
    x: 18,
    y: 30,
  },
  {
    id: "dobie-garage",
    zone: "Dobie corridor",
    landmark: "Dobie garage entrance",
    lat: 30.2872,
    lng: -97.7369,
    x: 40,
    y: 48,
  },
  {
    id: "pcl-north",
    zone: "PCL racks",
    landmark: "PCL north racks",
    lat: 30.2838,
    lng: -97.7377,
    x: 57,
    y: 33,
  },
  {
    id: "san-antonio-bike-room",
    zone: "San Antonio Garage",
    landmark: "Garage bike room",
    lat: 30.2824,
    lng: -97.7412,
    x: 68,
    y: 65,
  },
  {
    id: "jester-east",
    zone: "Jester racks",
    landmark: "Jester east racks",
    lat: 30.2834,
    lng: -97.736,
    x: 74,
    y: 38,
  },
  {
    id: "greg-gym",
    zone: "Greg Gym",
    landmark: "Gregory Gym south racks",
    lat: 30.2831,
    lng: -97.7366,
    x: 70,
    y: 44,
  },
];

export function getCampusLocationById(locationId: string) {
  return campusLocations.find((location) => location.id === locationId) ?? campusLocations[0];
}
