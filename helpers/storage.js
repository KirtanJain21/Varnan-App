// helpers/storage.js
import { supabase } from "@/framework/supabase";
import * as FileSystem from "expo-file-system/legacy";

/**
 * Upload a file (image/video) to Supabase Storage
 * @param {string} folder - folder inside the "uploads" bucket
 * @param {string} uri - local file URI
 * @returns {Object} { success: boolean, data: string (storage path) | msg: string }
 */
export const uploadFile = async (folder, uri) => {
  try {
    // Check if file exists
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) return { success: false, msg: "File does not exist" };

    // Generate filename
    const ext = uri.split(".").pop();
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `posts/${fileName}`;

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });

    // Convert base64 to Uint8Array
    const buffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    // Determine content type
    let contentType = "application/octet-stream";
    if (["jpg", "jpeg", "png"].includes(ext.toLowerCase())) contentType = `image/${ext}`;
    if (["mp4", "mov"].includes(ext.toLowerCase())) contentType = "video/mp4";

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, buffer, { contentType });

    if (error) {
      console.error("Supabase upload error:", error);
      return { success: false, msg: error.message };
    }

    return { success: true, data: data.path }; // storage path
  } catch (err) {
    console.error("uploadFile exception:", err);
    return { success: false, msg: err.message };
  }
};

/**
 * Get public URL for a file in Supabase Storage
 * @param {string} path - storage path returned by uploadFile
 * @returns {string} public URL
 */
export const getPublicUrl = (path) => {
  const { publicUrl } = supabase.storage.from("uploads").getPublicUrl(path);
  return data.publicUrl;
};
