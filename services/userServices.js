import { supabase } from '@/framework/supabase';

export const getUserData = async (userId) => {
  try {
    // Try your custom users table first
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    if (data) {
      return { success: true, data };
    }

    // Fallback to auth.users if not found
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error.message || 'Unknown error' };
  }
};


export const updateUser = async (userId, updateData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)   // 🔹 change to 'user_id' if that’s your PK
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'User not found or no data updated' };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message || 'Unknown error' };
  }
};

