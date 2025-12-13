import { useState } from 'react';
import { supabase } from '../../config/supabase.config';

interface UploadResult {
  url: string | null;
  error: Error | null;
}

interface UseSupabaseStorageReturn {
  uploadFile: (file: File, bucket: string, folder?: string) => Promise<UploadResult>;
  deleteFile: (filePath: string, bucket: string) => Promise<{ error: Error | null }>;
  getPublicUrl: (filePath: string, bucket: string) => string | null;
  uploading: boolean;
  uploadProgress: number;
}

/**
 * Custom hook for interacting with Supabase Storage
 * Handles file upload, deletion, and URL retrieval
 */
export const useSupabaseStorage = (): UseSupabaseStorageReturn => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  /**
   * Upload a file to Supabase Storage
   * @param file - The file to upload
   * @param bucket - The storage bucket name (default: 'Kiremon')
   * @param folder - Optional folder path within the bucket
   * @returns Object containing the public URL or error
   */
  const uploadFile = async (
    file: File,
    bucket: string = 'Kiremon',
    folder: string = ''
  ): Promise<UploadResult> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Generate unique filename with timestamp
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      setUploadProgress(30);

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        throw error;
      }

      setUploadProgress(70);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      setUploadProgress(100);

      return {
        url: urlData.publicUrl,
        error: null,
      };
    } catch (error) {
      console.error('Error uploading file:', error);
      return {
        url: null,
        error: error as Error,
      };
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  /**
   * Delete a file from Supabase Storage
   * @param filePath - The path of the file to delete
   * @param bucket - The storage bucket name (default: 'Kiremon')
   * @returns Object containing error if any
   */
  const deleteFile = async (
    filePath: string,
    bucket: string = 'Kiremon'
  ): Promise<{ error: Error | null }> => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([filePath]);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { error: error as Error };
    }
  };

  /**
   * Get public URL for a file
   * @param filePath - The path of the file
   * @param bucket - The storage bucket name (default: 'Kiremon')
   * @returns Public URL string or null
   */
  const getPublicUrl = (filePath: string, bucket: string = 'Kiremon'): string | null => {
    try {
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error getting public URL:', error);
      return null;
    }
  };

  return {
    uploadFile,
    deleteFile,
    getPublicUrl,
    uploading,
    uploadProgress,
  };
};
