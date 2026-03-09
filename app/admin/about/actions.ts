'use server'

import { createClient } from '@supabase/supabase-js'

export async function saveAdminProfile(profileData: any, settingsData: any) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: profileError } = await supabase
    .from('profile')
    .update(profileData)
    .eq('id', profileData.id)

  const { error: settingsError } = await supabase
    .from('settings')
    .upsert({
      key: 'site_content',
      value: settingsData,
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' })

  if (profileError) console.error('Profile Save Error:', profileError)
  if (settingsError) console.error('Settings Save Error:', settingsError)

  return { 
    success: !profileError && !settingsError, 
    profileError: profileError ? profileError.message : null, 
    settingsError: settingsError ? settingsError.message : null 
  }
}
