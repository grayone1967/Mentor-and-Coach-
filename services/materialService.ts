
import { supabase } from './supabaseClient';
import { Database } from '../types/schema';

type MaterialInsert = Database['public']['Tables']['materials']['Insert'];

export const materialService = {
  /**
   * Uploads a file to Supabase Storage bucket 'materials'
   */
  async uploadFile(userId: string, file: File) {
    const materialUuid = crypto.randomUUID();
    const filePath = `${userId}/${materialUuid}/${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('materials')
      .upload(filePath, file, {
        upsert: true
      });

    if (error) {
      throw new Error(`Storage upload failed: ${error.message}`);
    }

    return { path: data.path, materialUuid };
  },

  /**
   * Deletes a file from Supabase Storage (used for rollback)
   */
  async deleteFile(path: string) {
    const { error } = await supabase.storage
      .from('materials')
      .remove([path]);
    
    if (error) {
      console.error('Failed to rollback file upload:', error);
    }
  },

  /**
   * Inserts a material record into the database
   */
  async createMaterial(materialData: MaterialInsert) {
    const { data, error } = await supabase
      .from('materials')
      .insert(materialData as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Database insert failed: ${error.message}`);
    }

    return data;
  },

  /**
   * Fetch materials for a specific practitioner (including global ones)
   */
  async getMaterials(userId: string) {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      // Fetch own materials OR global materials
      .or(`practitioner_id.eq.${userId},is_global.eq.true`)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Error fetching materials: ${error.message}`);
    }

    return data || [];
  }
};
