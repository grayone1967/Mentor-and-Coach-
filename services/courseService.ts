
import { supabase } from './supabaseClient';
import { Course, Week, Task, Persona, TaskType } from '../types';

// Helper to map DB snake_case types to UI Title Case types
const mapDbTaskTypeToUi = (dbType: string | null): TaskType => {
  if (!dbType) return 'Lesson';
  switch (dbType) {
    case 'daily_check_in': return 'Daily Check-in';
    case 'journaling': return 'Journaling';
    case 'reflection': return 'Reflection';
    case 'ai_conversation': return 'AI Conversation';
    case 'lesson': return 'Lesson';
    default: return 'Lesson';
  }
};

// Helper to map UI/LLM types to DB snake_case types (Strict Check Constraint)
const mapUiTaskTypeToDb = (uiType: string): string => {
   const lower = (uiType || '').toLowerCase().trim().replace(/_/g, ' ');
   
   if (lower.includes('check')) return 'daily_check_in';
   if (lower.includes('journal')) return 'journaling';
   if (lower.includes('reflect')) return 'reflection';
   if (lower.includes('conversation') || lower.includes('chat') || lower.includes('peer') || lower.includes('ai')) return 'ai_conversation';
   
   // Fallback for 'Practical_Application', 'Resource_Consumption', 'Lesson', etc.
   return 'lesson';
};

export const courseService = {
  /**
   * Fetches all courses for the current practitioner
   */
  async getCourses(practitionerId: string): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select(`
        *,
        course_personas (
          persona:personas (*)
        ),
        weeks:course_weeks (
          *,
          tasks:course_tasks (*)
        )
      `)
      .eq('practitioner_id', practitionerId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    // Map DB structure to UI Course type
    return data.map((dbCourse: any) => {
      // Map DB pricing model to UI model
      let uiPricingModel: 'Free' | 'OneTime' | 'Subscription' = 'Free';
      if (dbCourse.pricing_model === 'one_time') uiPricingModel = 'OneTime';
      else if (dbCourse.pricing_model === 'monthly') uiPricingModel = 'Subscription';

      // Map status
      let uiStatus: 'Published' | 'Draft' | 'Archived' = 'Draft';
      if (dbCourse.status === 'published') uiStatus = 'Published';
      else if (dbCourse.status === 'archived') uiStatus = 'Archived';

      return {
        id: dbCourse.id,
        title: dbCourse.title,
        description: dbCourse.description || '',
        category: dbCourse.category || 'General',
        duration: `${dbCourse.duration_weeks || 4} Weeks`,
        durationValue: dbCourse.duration_weeks || 4,
        durationUnit: 'Weeks',
        enrolled: 0, // Need to count enrollments separately if needed
        status: uiStatus,
        creationStage: dbCourse.creation_stage || 1,
        revenue: '$0', // Calculate from enrollments * price
        image: dbCourse.cover_image_url || '',
        pricingModel: uiPricingModel,
        price: dbCourse.price || 0,
        // Map new fields safely (assuming they exist or will exist)
        trialEnabled: dbCourse.trial_enabled || false,
        trialDays: dbCourse.trial_days || 0,
        maxEnrollments: dbCourse.max_enrollments || 0,
        startDate: dbCourse.start_date || '',
        
        // Map joined relations
        personas: dbCourse.course_personas.map((cp: any) => ({
          id: cp.persona.id,
          name: cp.persona.name,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cp.persona.name}`, 
          tags: cp.persona.tone_tags || [],
          toneStyle: cp.persona.tone_tags || [],
          responseStyle: cp.persona.response_style || 'Conversational',
          systemPrompt: cp.persona.system_prompt || '',
        })),
        
        weeks: dbCourse.weeks.map((w: any) => ({
          id: w.id,
          weekNumber: w.week_number,
          title: w.title,
          overview: w.overview,
          objectives: Array.isArray(w.objectives) ? w.objectives : (typeof w.objectives === 'string' ? JSON.parse(w.objectives) : []),
          isExpanded: false,
          tasks: w.tasks.map((t: any) => ({
            id: t.id,
            title: t.title,
            type: mapDbTaskTypeToUi(t.task_type), // Map DB -> UI
            description: t.description || '',
            objective: t.task_objective || '',
            context: t.task_context || '',
            coachNotes: t.coach_notes || '',
            aiInstructions: t.ai_instructions || ''
          }))
        })).sort((a: any, b: any) => a.weekNumber - b.weekNumber)
      };
    });
  },

  /**
   * Step 1: Create Basic Course
   * UPDATED: Accepts optional materialIds to link immediately
   */
  async createCourse(practitionerId: string, courseData: Partial<Course>, materialIds: string[] = []): Promise<Course> {
    // 1. Insert Course
    const { data, error } = await supabase
      .from('courses')
      .insert({
        practitioner_id: practitionerId,
        title: courseData.title || 'Untitled Course',
        description: courseData.description,
        category: courseData.category,
        duration_weeks: courseData.durationValue,
        creation_stage: 1,
        status: 'draft',
        cover_image_url: courseData.image,
        pricing_model: 'free', 
        price: 0
      })
      .select()
      .single();

    if (error) throw new Error(error.message);

    // 2. Insert Materials if any
    if (materialIds.length > 0) {
      const materialInserts = materialIds.map(matId => ({
        course_id: data.id,
        material_id: matId
      }));
      
      const { error: matError } = await supabase
        .from('course_materials')
        .insert(materialInserts);
        
      if (matError) console.error("Failed to link materials on creation:", matError);
    }

    return {
      ...courseData,
      id: data.id,
      creationStage: 1,
      status: 'Draft',
      pricingModel: 'Free'
    } as Course;
  },

  /**
   * Update Course Details (Metadata)
   */
  async updateCourseDetails(courseId: string, updates: Partial<Course>) {
    const { error } = await supabase
      .from('courses')
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.category,
        duration_weeks: updates.durationValue,
        cover_image_url: updates.image,
      })
      .eq('id', courseId);
    
    if (error) throw error;
  },

  /**
   * Step 2: Invoke Edge Function to Build Structure
   */
  async invokeBuildCourseStructure(courseId: string, weeksStructure: any) {
    const { data, error } = await supabase.functions.invoke('build-course-structure', {
      body: {
        course_id: courseId,
        weeks: weeksStructure
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Update Course Stage manually
   */
  async updateCourseStage(courseId: string, stage: number) {
    const { error } = await supabase
      .from('courses')
      .update({ creation_stage: stage })
      .eq('id', courseId);
    
    if (error) throw error;
  },

  /**
   * Step 3: Save Course Structure (Weeks & Tasks)
   */
  async saveCourseStructure(courseId: string, weeks: Week[]): Promise<void> {
    // 1. Manually cascade delete to ensure no foreign key violations
    // Get existing week IDs
    const { data: existingWeeks } = await supabase
      .from('course_weeks')
      .select('id')
      .eq('course_id', courseId);
    
    const existingWeekIds = existingWeeks?.map(w => w.id) || [];

    if (existingWeekIds.length > 0) {
        // Delete tasks belonging to these weeks
        await supabase.from('course_tasks').delete().in('week_id', existingWeekIds);
        // Delete weeks
        await supabase.from('course_weeks').delete().eq('course_id', courseId);
    } else {
        // Fallback cleanup
        await supabase.from('course_weeks').delete().eq('course_id', courseId);
    }

    // 2. Insert Weeks & Tasks
    for (const week of weeks) {
      const { data: savedWeek, error: weekError } = await supabase
        .from('course_weeks')
        .insert({
          course_id: courseId,
          week_number: week.weekNumber,
          title: week.title,
          overview: week.overview,
          objectives: week.objectives // Passed as array directly
        })
        .select()
        .single();

      if (weekError) throw new Error(`Week Save Failed: ${weekError.message}`);

      if (week.tasks && week.tasks.length > 0) {
        const tasksPayload = week.tasks.map(t => ({
          week_id: savedWeek.id,
          title: t.title,
          task_type: mapUiTaskTypeToDb(t.type), // Map DB snake_case
          description: t.description,
          task_objective: t.objective,
          task_context: t.context,
          coach_notes: t.coachNotes,
          ai_instructions: t.aiInstructions || ''
        }));
        
        const { error: taskError } = await supabase.from('course_tasks').insert(tasksPayload);
        if (taskError) throw new Error(`Task Save Failed: ${taskError.message}`);
      }
    }
  },

  /**
   * Step 4: Toggle Material Assignment
   */
  async toggleCourseMaterial(courseId: string, materialId: string, isSelected: boolean) {
    if (isSelected) {
      await supabase.from('course_materials').upsert({ course_id: courseId, material_id: materialId });
    } else {
      await supabase.from('course_materials').delete().match({ course_id: courseId, material_id: materialId });
    }
  },

  async getCourseMaterials(courseId: string): Promise<string[]> {
    const { data } = await supabase.from('course_materials').select('material_id').eq('course_id', courseId);
    return data?.map(m => m.material_id) || [];
  },

  /**
   * Step 5: Toggle Persona Assignment
   */
  async toggleCoursePersona(courseId: string, personaId: string, isSelected: boolean) {
     if (isSelected) {
       await supabase.from('course_personas').upsert({ course_id: courseId, persona_id: personaId });
     } else {
       await supabase.from('course_personas').delete().match({ course_id: courseId, persona_id: personaId });
     }
  },

  /**
   * Step 6: Publish/Save Course Settings
   */
  async publishCourse(courseId: string, settings: any) {
    let dbModel = 'free';
    if (settings.pricingModel === 'OneTime') dbModel = 'one_time';
    else if (settings.pricingModel === 'Subscription') dbModel = 'monthly';

    const status = settings.status === 'Published' ? 'published' : 'draft';

    const payload: any = {
        status: status,
        creation_stage: 6,
        pricing_model: dbModel,
        price: isNaN(Number(settings.price)) ? 0 : Number(settings.price),
        // Using loose casting for extended fields not in initial schema
        trial_enabled: settings.trialEnabled,
        trial_days: isNaN(Number(settings.trialDays)) ? 0 : Number(settings.trialDays),
        max_enrollments: isNaN(Number(settings.maxEnrollments)) ? 0 : Number(settings.maxEnrollments),
        start_date: settings.startDate || null,
    };

    const { error } = await supabase
      .from('courses')
      .update(payload)
      .eq('id', courseId);
    
    if (error) throw error;
  }
};
