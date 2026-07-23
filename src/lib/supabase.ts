import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// Projet Supabase « bam ». La clé publishable est publique par design —
// la sécurité est assurée par les policies RLS côté base.
const SUPABASE_URL = 'https://hhljshajbgzemusaseyg.supabase.co';
const SUPABASE_KEY = 'sb_publishable_WyEqwn3WIDBg9dHJYZbDZA_rbPb5mI0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
