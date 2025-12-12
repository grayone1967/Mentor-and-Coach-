import { supabase } from './supabaseClient';
import { Database } from '../types/schema';

type Profile = Database['public']['Tables']['profiles']['Row'];

export const authService = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  /**
   * Log out the current user
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current session
   */
  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  /**
   * Fetch the user's profile to determine role
   */
  async getUserProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Row not found
        return null;
      }
      console.error("Error fetching profile:", JSON.stringify(error, null, 2));
      return null;
    }
    return data;
  },

  /**
   * Sign up a new practitioner (Step 1)
   */
  async signUpPractitioner(data: {
    email: string;
    password: string;
    fullName: string;
    businessName: string;
    niche: string;
  }) {
    // 1. Create Auth User with Metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: window.location.origin, 
        data: {
          full_name: data.fullName,
          business_name: data.businessName,
          niche: data.niche,
          role: 'practitioner'
        }
      }
    });

    if (authError) throw authError;

    if (authData.user && authData.session) {
      // If session exists immediately, try to init data
      await this.initializePractitionerData(authData.user.id, {
        fullName: data.fullName,
        businessName: data.businessName,
        niche: data.niche,
        email: data.email
      });
    }

    return authData;
  },

  /**
   * Resend Verification Email
   */
  async resendVerificationEmail(email: string) {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: window.location.origin
      }
    });
    if (error) throw error;
  },

  /**
   * Checks if profile exists, if not, creates it using User Metadata.
   */
  async ensureProfileInitialized(user: any) {
    if (!user) return;

    // 1. Check if profile exists
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    // PGRST116 means no rows returned (which is what we want to catch)
    if (!profile || (error && error.code === 'PGRST116')) {
      console.log('Profile missing, initializing from metadata...');
      const { full_name, business_name, niche } = user.user_metadata || {};
      
      await this.initializePractitionerData(user.id, {
        fullName: full_name || '',
        businessName: business_name || '',
        niche: niche || '',
        email: user.email || ''
      });
    } else if (error) {
        console.error("Error checking profile existence:", JSON.stringify(error, null, 2));
    }
  },

  /**
   * Helper to insert initial data. Handles idempotency.
   */
  async initializePractitionerData(userId: string, data: { fullName: string; businessName: string; niche: string; email: string }) {
      console.log("Initializing data for:", userId);
      
      // 1. Try to get profile to decide on Insert vs Update
      // This helps avoid "new row violates row-level security policy" if the row was already created by a trigger
      const { data: profile } = await supabase.from('profiles').select('id').eq('id', userId).single();
      
      if (profile) {
        // Update existing profile (created by trigger)
        const { error: updateError } = await supabase.from('profiles').update({
          full_name: data.fullName,
          business_name: data.businessName,
          niche: data.niche
        }).eq('id', userId);
        
        if (updateError) console.error('Profile update failed:', updateError);
      } else {
        // Insert new profile
        const { error: insertError } = await supabase.from('profiles').insert({
          id: userId,
          role: 'practitioner',
          full_name: data.fullName,
          email: data.email,
          business_name: data.businessName,
          niche: data.niche
        });
        
        if (insertError) {
             console.error('Profile insert failed:', insertError);
             // Fallback to update if insert failed due to race condition
             await supabase.from('profiles').update({
                full_name: data.fullName,
                business_name: data.businessName,
                niche: data.niche
             }).eq('id', userId);
        }
      }

      // 2. Insert Application Row if not exists
      const { data: existingApp } = await supabase
        .from('practitioner_applications')
        .select('id')
        .eq('practitioner_id', userId)
        .single();

      if (!existingApp) {
         const { error: appError } = await supabase
           .from('practitioner_applications')
           .insert({
              practitioner_id: userId,
              status: 'pending'
           });
         if (appError) console.error('Application creation failed:', appError);
      }
  },

  /**
   * Upload Avatar to Supabase Storage
   */
  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    if (!userId) throw new Error("User ID is required for upload.");

    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Storage Upload Error:', JSON.stringify(uploadError, null, 2));
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return publicUrl;
  },

  /**
   * Complete Practitioner Profile (Step 2)
   */
  async completePractitionerProfile(userId: string, updates: {
     bio: string;
     avatarUrl?: string;
     linkedinUrl?: string;
     instagramHandle?: string;
  }) {
    // Update Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        bio: updates.bio,
        avatar_url: updates.avatarUrl,
        linkedin_url: updates.linkedinUrl,
        instagram_handle: updates.instagramHandle,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (profileError) {
        console.error("Profile update failed:", JSON.stringify(profileError, null, 2));
        throw profileError;
    }

    // Mark Application as Completed
    const { error: appError } = await supabase
      .from('practitioner_applications')
      .update({ status: 'completed' })
      .eq('practitioner_id', userId);

    if (appError) {
        console.error("Application status update failed:", JSON.stringify(appError, null, 2));
        throw appError;
    }
  },

  /**
   * Check Application Status
   */
  async getPractitionerApplicationStatus(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('practitioner_applications')
      .select('status')
      .eq('practitioner_id', userId)
      .single();
    
    if (error) return null;
    return data.status;
  }
};