import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pnapyabmvxwnxqytoubs.supabase.co';
const supabaseKey = 'sb_publishable_Xv3ZfsbsIWzT1A2HSx9H-A_cevUm9iz';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing connection...");
  const { data, error } = await supabase.from('admin').select('*');
  
  if (error) {
    console.error("Error querying table:", error);
  } else {
    console.log("Data returned:", data);
  }
}

test();
