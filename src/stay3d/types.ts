export interface Furniture {
  kind: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
  y?: number;
}
export interface StayPhoto {
  id: string;
  kind: "atlas" | "upload" | "render";
  url?: string;
  roomId?: string;
  view?: number;
  alt?: string;
  generated?: boolean;
  columns?: number;
  rows?: number;
  col?: number;
  row?: number;
  imageWidth?: number;
  imageHeight?: number;
}
export interface StayRoom {
  id: string;
  type: string;
  name: string;
  floor: number;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  area: number;
  doorSide?: string;
  windowSide?: string;
  furniture: Furniture[];
  photos: StayPhoto[];
}
export interface StayLocation {
  lat: number;
  lng: number;
  label: string;
  note: string;
  precision?: string;
  roadType?: string;
  roadMapped?: boolean;
  verifiedEntrance?: boolean;
  sourceUrl?: string;
  sourceNode?: string;
  sourceDate?: string;
}
export interface StayListing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  country: string;
  city: string;
  neighborhood: string;
  price: number;
  currency: string;
  bedrooms: number;
  floors: number;
  guests: number;
  bathrooms: number;
  roomCount: number;
  area: number;
  balconyArea: number;
  amenities: string[];
  palette: string[];
  style: string;
  propertyType: string;
  propertyTypeLabel: string;
  rooms: StayRoom[];
  exterior?: {
    id: string;
    type: "exterior";
    name: string;
    photos: StayPhoto[];
  };
  photoNotice?: string;
  location: StayLocation;
  version: number;
  updatedAt: string;
  demo: boolean;
}
export interface StayUser {
  id: string;
  email: string;
  name: string;
  role: "seller";
}
export interface ListingChanges {
  title?: string;
  description?: string;
  price?: number;
  guests?: number;
  location?: Pick<StayLocation, "lat" | "lng" | "label">;
}
