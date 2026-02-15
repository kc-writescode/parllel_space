
-- 1. Hotels (Tenants)
create table hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone_number text unique, -- The Twilio/Retell number assigned
  website_url text,
  clover_merchant_id text,
  voice_id text default 'female-1',
  created_at timestamptz default now()
);

-- 2. Menu Items
create table menu_items (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  name text not null,
  description text,
  price decimal(10, 2),
  category text,
  is_available boolean default true, -- For "86ing" items
  external_id text, -- ID from Clover or Scraping
  created_at timestamptz default now()
);

-- 3. Orders
create table orders (
  id uuid primary key default gen_random_uuid(),
  hotel_id uuid references hotels(id) on delete cascade,
  room_number text not null,
  status text check (status in ('pending', 'processing', 'completed', 'cancelled')) default 'pending',
  total_amount decimal(10, 2),
  transcript_summary text, -- AI summary of the call
  created_at timestamptz default now()
);

-- 4. Order Items (Join table)
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  menu_item_id uuid references menu_items(id),
  quantity integer default 1,
  notes text -- "No mayo", etc.
);

-- Realtime: Enable listening to new orders
alter publication supabase_realtime add table orders;
