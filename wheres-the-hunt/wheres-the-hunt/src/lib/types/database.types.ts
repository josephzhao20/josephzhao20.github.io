// Hand-written mirror of the Supabase schema. If you change the SQL in
// supabase/migrations, update this file too (or generate it with
// `supabase gen types typescript --linked > src/lib/types/database.types.ts`).
//
// Shape note: @supabase/postgrest-js infers query-builder types structurally
// against `GenericTable = { Row; Insert; Update; Relationships }` and
// `GenericSchema = { Tables; Views; Functions }`. Omitting any of those keys
// (even with an empty value) makes the whole table's Insert/Update silently
// collapse to `never` — so every table and view below repeats the same four
// keys on purpose, and `Functions` is declared even though it's unused.

export type PrivacyMode = 'exact' | 'region' | 'country' | 'hidden';

type UsersRow = {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  is_admin: boolean;
  upload_approved: boolean;
  upload_requested: boolean;
  suspended: boolean;
  created_at: string;
}

type AdventuresRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  privacy_mode: PrivacyMode;
  real_latitude: number;
  real_longitude: number;
  display_latitude: number | null;
  display_longitude: number | null;
  country: string | null;
  country_code: string | null;
  region: string | null;
  date_visited: string | null;
  is_featured: boolean;
  featured_at: string | null;
  created_at: string;
  updated_at: string;
}

type AdventurePhotosRow = {
  id: string;
  adventure_id: string;
  image_url: string;
  sort_order: number;
  exif_latitude: number | null;
  exif_longitude: number | null;
  created_at: string;
}

type LikesRow = {
  id: string;
  user_id: string;
  adventure_id: string;
  created_at: string;
}

type AdventuresWithStatsRow = AdventuresRow & {
  username: string;
  user_avatar_url: string | null;
  like_count: number;
  photo_count: number;
};

type CountryHeatmapRow = {
  country_code: string;
  country: string | null;
  adventure_count: number;
}

type UserCountryHeatmapRow = {
  user_id: string;
  country_code: string;
  country: string | null;
  adventure_count: number;
}

type UserStatsRow = {
  user_id: string;
  total_adventures: number;
  countries_visited: number;
  total_photos: number;
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: UsersRow;
        Insert: Partial<UsersRow> & Pick<UsersRow, 'id' | 'email' | 'username'>;
        Update: Partial<UsersRow>;
        Relationships: [];
      };
      adventures: {
        Row: AdventuresRow;
        Insert: Partial<AdventuresRow> &
          Pick<AdventuresRow, 'user_id' | 'title' | 'real_latitude' | 'real_longitude'>;
        Update: Partial<AdventuresRow>;
        Relationships: [];
      };
      adventure_photos: {
        Row: AdventurePhotosRow;
        Insert: Partial<AdventurePhotosRow> & Pick<AdventurePhotosRow, 'adventure_id' | 'image_url'>;
        Update: Partial<AdventurePhotosRow>;
        Relationships: [];
      };
      likes: {
        Row: LikesRow;
        Insert: Pick<LikesRow, 'user_id' | 'adventure_id'>;
        Update: Partial<LikesRow>;
        Relationships: [];
      };
    };
    Views: {
      adventures_with_stats: {
        Row: AdventuresWithStatsRow;
        Relationships: [];
      };
      country_heatmap: {
        Row: CountryHeatmapRow;
        Relationships: [];
      };
      user_country_heatmap: {
        Row: UserCountryHeatmapRow;
        Relationships: [];
      };
      user_stats: {
        Row: UserStatsRow;
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
  };
};

export type UserRow = UsersRow;
export type AdventureRow = AdventuresRow;
export type AdventurePhotoRow = AdventurePhotosRow;
export type LikeRow = LikesRow;
export type AdventureWithStats = AdventuresWithStatsRow;
export type { CountryHeatmapRow, UserCountryHeatmapRow, UserStatsRow };
