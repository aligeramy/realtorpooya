export interface TREBListing {
  id: string;
  listing_key: string;
  unparsed_address: string;
  street_number: string;
  street_name: string;
  street_suffix: string;
  unit_number?: string;
  city: string;
  province: string;
  postal_code: string;
  country: string;
  county_or_parish?: string;
  latitude?: number;
  longitude?: number;
  property_type: string;
  property_sub_type?: string;
  transaction_type: string;
  contract_status: string;
  standard_status: string;
  building_name?: string;
  year_built?: number;
  lot_size_area?: number;
  lot_size_units?: string;
  living_area?: number;
  above_grade_finished_area?: number;
  below_grade_finished_area?: number;
  lot_width?: number;
  lot_depth?: number;
  lot_frontage?: string;
  bedrooms_total?: number;
  bedrooms_above_grade?: number;
  bedrooms_below_grade?: number;
  bathrooms_total?: number;
  bathrooms_total_integer?: number;
  kitchens_total?: number;
  rooms_total?: number;
  interior_features?: string[];
  exterior_features?: string[];
  parking_features?: string[];
  water_features?: string[];
  zoning?: string;
  business_type?: string[];
  list_price?: number;
  original_list_price?: number;
  close_price?: number;
  association_fee?: number;
  tax_annual_amount?: number;
  tax_year?: number;
  media_keys?: string[];
  preferred_media_key?: string;
  virtual_tour_url?: string;
  public_remarks?: string;
  private_remarks?: string;
  tax_legal_description?: string;
  directions?: string;
  list_date?: Date;
  expiration_date?: Date;
  close_date?: Date;
  modification_timestamp?: Date;
  media_change_timestamp?: Date;
  originating_system_id?: string;
  originating_system_name?: string;
  created_at?: Date;
  updated_at?: Date;
  formattedaddress?: string;
  location?: any;
}

export interface ListingMedia {
  media_key: string;
  listing_id: string;
  media_type: string;
  media_category: string;
  media_url: string;
  media_status: string;
  image_height?: number;
  image_width?: number;
  is_preferred?: boolean;
  display_order?: number;
}

export interface SearchResult {
  listings: TREBListing[];
  total: number;
  page: number;
  pageSize: number;
  suggestions?: SearchSuggestion[];
}

export interface SearchSuggestion {
  type: 'city' | 'neighborhood' | 'street' | 'property_type';
  value: string;
  count: number;
}

export interface SearchFilters {
  query?: string;
  city?: string;
  property_type?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  max_bedrooms?: number;
  min_bathrooms?: number;
  max_bathrooms?: number;
  min_area?: number;
  max_area?: number;
  status?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc';
  page?: number;
  page_size?: number;
} 