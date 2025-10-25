import { supabase } from '@/framework/supabase';
import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';

const SUPABASE_URL = 'https://yeikybgysbuyruwqmuml.supabase.co';
const DEFAULT_USER_IMAGE = require('@/assets/images/user.png');

/**
 * Returns a valid image source for Image or Avatar components.
 */
export const getUserImageSource = (imagePath) => {
  const url = imagePath ? getSupabaseFileUrl(imagePath) : DEFAULT_USER_IMAGE;

  // If url starts with http/https, return { uri: url }, else assume it's a local require
  if (typeof url === 'string' && (url.startsWith('http') || url.startsWith('https'))) {
    return { uri: url };
  }

  return url; // local require
};


/**
 * Builds a public URL for a Supabase file.
 */
export const getSupabaseFileUrl = (filePath) => {
  if (!filePath) return null;
  const SUPABASE_URL = 'https://yeikybgysbuyruwqmuml.supabase.co'; // replace with your Supabase URL
  return `${SUPABASE_URL}/storage/v1/object/public/uploads/${filePath}`;
};

/**
 * Detects MIME type from file extension.
 */
const getMimeType = (fileUri, isImage = true) => {
  const ext = fileUri.split('.').pop()?.toLowerCase();

  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
    return `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  }
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) {
    return `video/${ext}`;
  }

  return isImage ? 'image/png' : 'video/mp4'; // fallback
};

/**
 * Builds a unique file path and determines its content type.
 */
const buildStoragePath = (folderName, fileUri, isImage) => {
  const ext = fileUri.split('.').pop()?.toLowerCase() || (isImage ? 'png' : 'mp4');
  const path = `${folderName}/${Date.now()}.${ext}`;
  const contentType = getMimeType(fileUri, isImage);
  return { path, contentType };
};

/**
 * Uploads a file to Supabase Storage.
 */
export const uploadFile = async (folderName, fileUri, isImage = true) => {
  if (!fileUri) {
    return { success: false, msg: 'File URI is missing' };
  }

  try {
    const { path, contentType } = buildStoragePath(folderName, fileUri, isImage);

    // Read file as base64 and convert to binary
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: 'base64',
    });
    const fileBuffer = Buffer.from(base64, 'base64');
    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(path, fileBuffer, {
        cacheControl: '3600',
        upsert: false,
        contentType,
      });

    if (error) {
      console.error('Upload failed:', error.message);
      return { success: false, msg: 'Could not upload media' };
    }

    return { success: true, data: data?.path };
  } catch (err) {
    console.error('Unexpected upload error:', err);
    return { success: false, msg: 'Could not upload media' };
  }
};

