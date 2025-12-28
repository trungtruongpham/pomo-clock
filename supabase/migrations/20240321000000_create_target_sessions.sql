-- Create target_sessions table to track focus sessions by target
create table public.target_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  target_id text not null,
  target_label text not null,
  target_icon text not null,
  target_color text not null,
  completed_pomodoros integer default 0 not null,
  total_focus_minutes numeric(10, 2) default 0 not null,
  session_date date default current_date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  -- Unique constraint to ensure one record per user per target per day
  constraint unique_user_target_date unique (user_id, target_id, session_date)
);

-- Enable RLS
alter table public.target_sessions enable row level security;

-- Create policy to allow authenticated users to insert their own records
create policy "Users can insert their own target sessions"
  on public.target_sessions
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Create policy to allow authenticated users to update their own records
create policy "Users can update their own target sessions"
  on public.target_sessions
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Create policy to allow authenticated users to select their own records
create policy "Users can select their own target sessions"
  on public.target_sessions
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Create policy to allow authenticated users to delete their own records
create policy "Users can delete their own target sessions"
  on public.target_sessions
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Create index for faster queries
create index idx_target_sessions_user_id on public.target_sessions(user_id);
create index idx_target_sessions_user_target_date on public.target_sessions(user_id, target_id, session_date);
create index idx_target_sessions_session_date on public.target_sessions(session_date);

-- Grant necessary permissions
grant insert, update, select, delete on public.target_sessions to authenticated;

-- Create function to update updated_at timestamp
create or replace function public.handle_target_sessions_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger on_target_sessions_updated
  before update on public.target_sessions
  for each row
  execute function public.handle_target_sessions_updated_at();

