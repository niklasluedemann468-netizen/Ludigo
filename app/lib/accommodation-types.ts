export type SearchResult = {
  id: number;

  name: string;
  slug?: string | null;

  city?: string | null;
  region?: string | null;
  country?: string | null;

  accommodation_type?: string | null;

  description?: string | null;
  image_url?: string | null;

  price_min?: number | null;
  price_max?: number | null;
  partner_price?: number | null;
  currency?: string | null;

pool?: boolean;
wifi?: boolean;
apartment_has_kitchen?: boolean;
apartment_has_washing_machine?: boolean;
parking?: boolean;
breakfast?: boolean;
restaurant?: boolean;
air_conditioning?: boolean;
kitchen?: boolean;
washing_machine?: boolean;

  review_score?: number | null;
  review_count?: number | null;

  hotel_stars?: number | null;

  max_guests?: number | null;
  apartment_bedrooms?: number | null;

  near_sea?: boolean | null;
  near_lake?: boolean | null;
  near_mountains?: boolean | null;

  dogs_allowed?: boolean | null;
  family_friendly?: boolean | null;
  accessible?: boolean | null;
  quiet_place?: boolean | null;
  
  has_pool?: boolean | null;
  has_wifi?: boolean | null;
  has_parking?: boolean | null;
  has_restaurant?: boolean | null;
  has_breakfast?: boolean | null;
  has_air_conditioning?: boolean | null;

  is_featured?: boolean | null;

  provider_name?: string | null;

  affiliate_url?: string | null;
  booking_url?: string | null;
  website_url?: string | null;
};

export type AccommodationType = "campsite" | "holiday_apartment" | "hotel" | null;
export type SortOption = "best" | "price_asc" | "price_desc" | "rating";
