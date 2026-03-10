import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpsert() {
  const { data, error } = await supabase
    .from('settings')
    .upsert({
      key: 'site_content',
      value: { test: 'data' },
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' })
    .select();

  if (error) {
    console.error('SERVER UPSERT ERROR:', error);
  } else {
    console.log('SERVER UPSERT SUCCESS:', data);
  }

  // Now test with Anon key (simulating authenticated but maybe lacking auth token here, let's just see anon)
  const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const { error: anonError } = await supabaseAnon
    .from('settings')
    .upsert({
      key: 'site_content',
      value: { test: 'data2' },
      updated_at: new Date().toISOString()
    }, { onConflict: 'key' })
    
  if (anonError) {
    console.error('ANON UPSERT ERROR:', anonError);
  }
}

testUpsert();
