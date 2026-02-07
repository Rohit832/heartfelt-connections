-- Create a table for public profiles
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text,
  full_name text,
  avatar_url text,
  website text,
  phone text,
  
  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Handle User Creation Trigger
-- This ensures a row is created in public.profiles every time a user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url', new.phone);
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update bookings table to link to users
alter table public.bookings add column if not exists user_id uuid references auth.users(id);

-- Update RLS for bookings to allow users to view their own bookings
create policy "Users can select their own bookings."
  on bookings for select
  using ( auth.uid() = user_id );

-- Allow authenticated users to insert their own bookings
create policy "Users can insert their own bookings."
  on bookings for insert
  with check ( auth.uid() = user_id );
