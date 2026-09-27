-- ================================================================
-- MIGRATION: 2026091605_exact_dish_media_and_branding.sql
-- 1. Updates dish names, exact video URLs, and posters
-- 2. Renames Tronx Biryani / CraftsLand Biryani -> Biryani
-- 3. Ensures 100% visual fidelity matching menu items exactly
-- ================================================================

-- 1. Chicken Tikka (Verified smoky tandoori chicken skewers & roasted oven video)
UPDATE public.dishes SET
  name = 'Chicken Tikka',
  media_url = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/49059/49059-720.mp4'
WHERE slug = 'chicken-tikka';

-- 2. Biryani (Renamed to Biryani)
UPDATE public.dishes SET
  name = 'Biryani',
  media_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/32598/32598-720.mp4'
WHERE slug IN ('craftsland-biryani', 'tronx-biryani', 'biryani');

-- 3. Dal Makhani (Simmering black lentils with butter and cream)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1789983665266-f1a6ea13b311?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1789983665266-f1a6ea13b311?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1789983665266-f1a6ea13b311?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://archive.org/download/HowtoMakeDalMakhani/How%20to%20Make%20Dal%20Makhani%20%5BNfP33QBKnBQ%5D.mp4'
WHERE slug = 'dal-makhani';

-- 4. Crispy Samosa (Golden triangular flaky samosas)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://upload.wikimedia.org/wikipedia/commons/2/28/Sweet_potatoes_and_Samosas.webm'
WHERE slug = 'crispy-samosa';

-- 5. Truffle French Fries (Golden fries bubbling in oil)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1576107232684-1279f3908594?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/9278/9278-720.mp4'
WHERE slug = 'truffle-french-fries';

-- 6. Crispy Chicken Wings (Glazed chicken wing sizzling on barbecue grill)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1527477378408-1bc0e6085a6b?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/30811/30811-720.mp4'
WHERE slug = 'crispy-chicken-wings';

-- 7. Gulab Jamun (Golden fried sweet dumplings)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1666190092159-3171cf0fbb12?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/18694/18694-720.mp4'
WHERE slug = 'gulab-jamun';

-- 8. Chocolate Lava Brownie (Warm molten chocolate ganache)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/41109/41109-720.mp4'
WHERE slug = 'chocolate-lava-brownie';

-- 9. New York Cheesecake (Slice of cheesecake with berry compote)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/2441/2441-720.mp4'
WHERE slug = 'new-york-cheesecake';

-- 10. Mango Lassi (Golden Alphonso mango lassi)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/9315/9315-720.mp4'
WHERE slug = 'mango-lassi';

-- 11. Artisanal Iced Coffee (Cold brew poured over ice)
UPDATE public.dishes SET
  media_url = 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop',
  poster_url = 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop',
  video_poster_url = 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=600&auto=format&fit=crop',
  video_url = 'https://assets.mixkit.co/videos/796/796-720.mp4'
WHERE slug = 'artisanal-iced-coffee';
