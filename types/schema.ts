
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'super_admin' | 'practitioner' | 'client'
          full_name: string | null
          email: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string | null
          business_name: string | null
          niche: string | null
          linkedin_url: string | null
          instagram_handle: string | null
        }
        Insert: {
          id: string
          role: 'super_admin' | 'practitioner' | 'client'
          full_name?: string | null
          email?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
          business_name?: string | null
          niche?: string | null
          linkedin_url?: string | null
          instagram_handle?: string | null
        }
        Update: {
          id?: string
          role?: 'super_admin' | 'practitioner' | 'client'
          full_name?: string | null
          email?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string | null
          business_name?: string | null
          niche?: string | null
          linkedin_url?: string | null
          instagram_handle?: string | null
        }
      }
      practitioner_applications: {
        Row: {
          id: string
          practitioner_id: string
          business_name: string | null
          coaching_niche: string | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          practitioner_id: string
          business_name?: string | null
          coaching_niche?: string | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          practitioner_id?: string
          business_name?: string | null
          coaching_niche?: string | null
          status?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          practitioner_id: string
          title: string
          description: string | null
          category: string | null
          duration_weeks: number | null
          pricing_model: 'free' | 'one_time' | 'subscription' | null
          price: number | null
          cover_image_url: string | null
          status: string | null
          creation_stage: number
          created_at: string
          tags: string[] | null
          trial_enabled: boolean | null
          trial_days: number | null
          max_enrollments: number | null
          start_date: string | null
        }
        Insert: {
          id?: string
          practitioner_id: string
          title: string
          description?: string | null
          category?: string | null
          duration_weeks?: number | null
          pricing_model?: 'free' | 'one_time' | 'subscription' | null
          price?: number | null
          cover_image_url?: string | null
          status?: string | null
          creation_stage?: number
          created_at?: string
          tags?: string[] | null
          trial_enabled?: boolean | null
          trial_days?: number | null
          max_enrollments?: number | null
          start_date?: string | null
        }
        Update: {
          id?: string
          practitioner_id?: string
          title?: string
          description?: string | null
          category?: string | null
          duration_weeks?: number | null
          pricing_model?: 'free' | 'one_time' | 'subscription' | null
          price?: number | null
          cover_image_url?: string | null
          status?: string | null
          creation_stage?: number
          created_at?: string
          tags?: string[] | null
          trial_enabled?: boolean | null
          trial_days?: number | null
          max_enrollments?: number | null
          start_date?: string | null
        }
      }
      course_weeks: {
        Row: {
          id: string
          course_id: string
          week_number: number
          title: string | null
          overview: string | null
          objectives: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          week_number: number
          title?: string | null
          overview?: string | null
          objectives?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          week_number?: number
          title?: string | null
          overview?: string | null
          objectives?: string[] | null
          created_at?: string
        }
      }
      course_tasks: {
        Row: {
          id: string
          week_id: string
          task_type: string | null
          task_title: string
          description: string | null
          task_objective: string | null
          task_context: string | null
          coach_notes: string | null
          ai_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          week_id: string
          task_type?: string | null
          task_title: string
          description?: string | null
          task_objective?: string | null
          task_context?: string | null
          coach_notes?: string | null
          ai_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          week_id?: string
          task_type?: string | null
          task_title?: string
          description?: string | null
          task_objective?: string | null
          task_context?: string | null
          coach_notes?: string | null
          ai_instructions?: string | null
          created_at?: string
        }
      }
      materials: {
        Row: {
          id: string
          practitioner_id: string | null
          title: string
          description: string | null
          category: string[] | null
          material_type: 'audio' | 'video' | 'pdf' | 'text' | null
          url: string | null
          file_path: string | null
          file_type: string | null
          duration_seconds: number | null
          tags: string[] | null
          source: string | null
          created_at: string
          updated_at: string | null
          is_global: boolean | null
          used_in_count: number | null
        }
        Insert: {
          id?: string
          practitioner_id?: string | null
          title: string
          description?: string | null
          category?: string[] | null
          material_type?: 'audio' | 'video' | 'pdf' | 'text' | null
          url?: string | null
          file_path?: string | null
          file_type?: string | null
          duration_seconds?: number | null
          tags?: string[] | null
          source?: string | null
          created_at?: string
          updated_at?: string | null
          is_global?: boolean | null
          used_in_count?: number | null
        }
        Update: {
          id?: string
          practitioner_id?: string | null
          title?: string
          description?: string | null
          category?: string[] | null
          material_type?: 'audio' | 'video' | 'pdf' | 'text' | null
          url?: string | null
          file_path?: string | null
          file_type?: string | null
          duration_seconds?: number | null
          tags?: string[] | null
          source?: string | null
          created_at?: string
          updated_at?: string | null
          is_global?: boolean | null
          used_in_count?: number | null
        }
      }
      course_materials: {
        Row: {
          course_id: string
          material_id: string
          created_at: string
        }
        Insert: {
          course_id: string
          material_id: string
          created_at?: string
        }
        Update: {
          course_id?: string
          material_id?: string
          created_at?: string
        }
      }
      personas: {
        Row: {
          id: string
          practitioner_id: string
          name: string
          description: string | null
          tone_tags: string[] | null
          response_style: string | null
          system_prompt: string | null
          example_phrases: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          practitioner_id: string
          name: string
          description?: string | null
          tone_tags?: string[] | null
          response_style?: string | null
          system_prompt?: string | null
          example_phrases?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          practitioner_id?: string
          name?: string
          description?: string | null
          tone_tags?: string[] | null
          response_style?: string | null
          system_prompt?: string | null
          example_phrases?: string[] | null
          created_at?: string
        }
      }
      course_personas: {
        Row: {
          id: string
          course_id: string
          persona_id: string
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          persona_id: string
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          persona_id?: string
          created_at?: string
        }
        Delete: {
          id?: string
          course_id?: string
          persona_id?: string
        }
      }
      course_enrollments: {
        Row: {
          id: string
          course_id: string
          client_id: string
          enrolled_at: string
        }
        Insert: {
          id?: string
          course_id: string
          client_id: string
          enrolled_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          client_id?: string
          enrolled_at?: string
        }
      }
      journal_entries: {
        Row: {
          id: string
          client_id: string
          task_id: string | null
          content: string | null
          mood: number | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          task_id?: string | null
          content?: string | null
          mood?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          task_id?: string | null
          content?: string | null
          mood?: number | null
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          course_id: string
          content: string | null
          attachments: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          course_id: string
          content?: string | null
          attachments?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          course_id?: string
          content?: string | null
          attachments?: string[] | null
          created_at?: string
        }
      }
      red_flags: {
        Row: {
          id: string
          client_id: string
          course_id: string
          alert_type: string | null
          severity: 'critical' | 'warning' | null
          context: string | null
          resolved: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          course_id: string
          alert_type?: string | null
          severity?: 'critical' | 'warning' | null
          context?: string | null
          resolved?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          course_id?: string
          alert_type?: string | null
          severity?: 'critical' | 'warning' | null
          context?: string | null
          resolved?: boolean | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
