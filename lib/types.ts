// Row shapes for the tables in supabase/migrations/20261001000000_initial_schema.sql.

import type { MoodValue } from "./moods";

export type Profile = {
  id: string;
  display_name: string;
  partner_id: string | null;
};

export type MoodRow = {
  user_id: string;
  mood: MoodValue;
  note: string | null;
  updated_at: string;
};

export type LocationRow = {
  user_id: string;
  latitude: number;
  longitude: number;
  accuracy_m: number | null;
  updated_at: string;
};
