// supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://yeikybgysbuyruwqmuml.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllaWt5Ymd5c2J1eXJ1d3FtdW1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTQyNDgsImV4cCI6MjA2OTY5MDI0OH0.4eD5pYTZeLC0bKnO_GoSausysA3Is-CAOQDeRG-0f2s"; // public-safe

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
