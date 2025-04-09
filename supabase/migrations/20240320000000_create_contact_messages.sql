-- Create contact_messages table
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;

-- Create policy to allow anonymous users to insert messages
create policy "Enable insert for anonymous users"
  on public.contact_messages
  for insert
  to anon
  with check (true);

-- Create policy to allow authenticated users to insert messages
create policy "Enable insert for authenticated users"
  on public.contact_messages
  for insert
  to authenticated
  with check (true);

-- Create policy to allow admin users to view contact messages
create policy "Enable select for admin users"
  on public.contact_messages
  for select
  to authenticated
  using (
    auth.uid() in (
      select user_id 
      from public.profiles 
      where role = 'admin'
    )
  );

-- Grant necessary permissions
grant insert on public.contact_messages to anon, authenticated;
grant select on public.contact_messages to authenticated; 