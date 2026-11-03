import { listings as models } from "./listings.ts";
import type { Listing } from "../data";

const propertyNames: Record<string, [string, string]> = {
  villa: ["Villa", "Вилла"],
  apartment: ["Apartment", "Квартира"],
  house: ["House", "Дом"],
};
export const modelListings: Listing[] = models.map((model) => ({
  id: `model-${model.id}`,
  modelId: model.id,
  country:
    model.country === "Azərbaycan"
      ? "AZ"
      : model.country === "Türkiyə"
        ? "TR"
        : "US",
  title: {
    az: model.title,
    en: `${model.city} · ${propertyNames[model.propertyType]?.[0] || "Home"}`,
    ru: `${model.city} · ${propertyNames[model.propertyType]?.[1] || "Дом"}`,
  },
  description: {
    az: model.description,
    en: "Explore this demo home room by room with its interactive 3D floor plan. The model and location are illustrative.",
    ru: "Изучите демонстрационный дом по комнатам на интерактивном 3D-плане. Модель и местоположение — примеры.",
  },
  city: model.city,
  area: model.neighborhood,
  type:
    model.propertyType === "villa"
      ? "villa"
      : model.propertyType === "apartment"
        ? "apartment"
        : "cottage",
  price: model.price,
  currency: "USD",
  guests: model.guests,
  bedrooms: model.bedrooms,
  beds: model.bedrooms,
  rating: 0,
  reviews: 0,
  host: "Zzzlep Demo",
  amenities: ["wifi", "kitchen"],
  images: [
    "/images/interior-1.jpg",
    "/images/interior-2.jpg",
    "/images/interior-3.jpg",
  ],
}));
