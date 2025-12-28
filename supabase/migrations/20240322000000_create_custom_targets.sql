-- Create custom_targets table to store user-defined targets
create table public.custom_targets (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  target_id text not null,
  label text not null,
  description text,
  icon text not null,
  color text not null,
  is_active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Unique constraint to ensure unique target_id per user
  constraint unique_user_target_id unique (user_id, target_id)
);

-- Enable RLS
alter table public.custom_targets enable row level security;

-- Create policy to allow authenticated users to insert their own records
create policy "Users can insert their own custom targets"
  on public.custom_targets
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Create policy to allow authenticated users to update their own records
create policy "Users can update their own custom targets"
  on public.custom_targets
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy to allow authenticated users to select their own records
create policy "Users can select their own custom targets"
  on public.custom_targets
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Create policy to allow authenticated users to delete their own records
create policy "Users can delete their own custom targets"
  on public.custom_targets
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create index for faster queries
create index idx_custom_targets_user_id on public.custom_targets(user_id);
create index idx_custom_targets_user_active on public.custom_targets(user_id, is_active);

-- Grant necessary permissions
grant insert, update, select, delete on public.custom_targets to authenticated;

-- Create function to update updated_at timestamp
create or replace function public.handle_custom_targets_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger on_custom_targets_updated
  before update on public.custom_targets
  for each row
  execute function public.handle_custom_targets_updated_at();

