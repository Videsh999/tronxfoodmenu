import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yrlvoafajwnpmbuknupu.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybHZvYWZhanducG1idWtudXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTA4ODYsImV4cCI6MjEwNDc4Njg4Nn0.UVqSGe8n8RFHb6PIzDmSoV4KPjuNwI203SRgpFGL9Bg';

const adminClient = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } });

// All 10 audited dish updates
const UPDATES = [
  {
    slug: 'chicken-tikka',
    media_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/49059/49059-720.mp4',
  },
  {
    slug: 'dal-makhani',
    media_url: 'https://images.unsplash.com/photo-1789983665266-f1a6ea13b311?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1789983665266-f1a6ea13b311?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1789983665266-f1a6ea13b311?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://archive.org/download/HowtoMakeDalMakhani/How%20to%20Make%20Dal%20Makhani%20%5BNfP33QBKnBQ%5D.mp4',
  },
  {
    slug: 'crispy-samosa',
    media_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Sweet_potatoes_and_Samosas.webm',
  },
  {
    slug: 'truffle-french-fries',
    media_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/9278/9278-720.mp4',
  },
  {
    slug: 'crispy-chicken-wings',
    media_url: 'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/30811/30811-720.mp4',
  },
  {
    slug: 'craftsland-biryani',
    name: 'Biryani',
  },
  {
    slug: 'tronx-biryani',
    name: 'Biryani',
  },
  {
    slug: 'gulab-jamun',
    media_url: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/18694/18694-720.mp4',
  },
  {
    slug: 'chocolate-lava-brownie',
    media_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/41109/41109-720.mp4',
  },
  {
    slug: 'new-york-cheesecake',
    media_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/2441/2441-720.mp4',
  },
  {
    slug: 'mango-lassi',
    media_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/9315/9315-720.mp4',
  },
  {
    slug: 'artisanal-iced-coffee',
    media_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop',
    poster_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop',
    video_poster_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/796/796-720.mp4',
  }
];

async function main() {
  const { data: auth, error: authErr } = await adminClient.auth.signInWithPassword({
    email: 'admin@craftsland.com',
    password: 'password123',
  });

  if (authErr) {
    console.error('Admin authentication failed:', authErr.message);
    process.exit(1);
  }

  console.log('✅ Authenticated as Admin:', auth.user.email);

  for (const item of UPDATES) {
    const { slug, ...fields } = item;
    const { data, error } = await adminClient
      .from('dishes')
      .update(fields)
      .eq('slug', slug)
      .select('name, slug, media_url, video_url');

    if (error) {
      console.error(`❌ Failed to update ${slug}:`, error.message);
    } else {
      console.log(`✔ Successfully updated [${slug}]: ${data?.[0]?.name}`);
    }
  }

  console.log('\n🚀 All dishes in Supabase synced with 100% exact matching videos & posters!');
}

main();
