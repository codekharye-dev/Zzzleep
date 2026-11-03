import type { StayListing } from '../types';
export class HomeViewer {
  constructor(container: HTMLElement, options?: { onRoomSelect?: (id: string) => void });
  home(listing: StayListing, floor?: number): void;
  room(listing: StayListing, roomId: string, view?: number): void;
  rotate(value: boolean): void;
  top(): void;
  capture(): string;
  dispose(): void;
}
export function renderRoomPhoto(listing: StayListing, roomId: string, view?: number): string;
