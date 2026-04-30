-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Updated_at trigger function (Supabase standard)
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Organizations (tenants)
create table organizations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table organizations enable row level security;

create policy "Users can view own org" on organizations
  for select using (id in (select org_id from profiles where id = auth.uid()));

-- Profiles (mapped to Supabase auth, separate from auth.users)
create table profiles (
  id uuid primary key references auth.users(id),
  org_id uuid not null references organizations(id),
  role text not null default 'coach' check (role in ('admin', 'coach', 'viewer')),
  full_name text,
  email text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Allow users to insert their own profile on signup
create policy "Users can insert own profile" on profiles
  for insert with check (id = auth.uid());

-- Allow users to view their own org's profiles
create policy "Users can view own org profiles" on profiles
  for select using (org_id in (select org_id from profiles where id = auth.uid()));

-- Allow admins to update profiles in their org
create policy "Admins can update org profiles" on profiles
  for update using (
    org_id in (select org_id from profiles where id = auth.uid() and role = 'admin')
  );

-- Clients
create table clients (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id),
  first_name text not null,
  last_name text not null,
  email text,
  phone text not null,
  date_of_birth date,
  license_type text check (license_type in ('learner', 'provisional', 'full', 'none')),
  experience_level text not null default 'beginner' check (experience_level in ('beginner', 'intermediate', 'advanced')),
  notes text,
  total_sessions integer default 0,
  total_paid numeric(10,2) default 0,
  status text not null default 'active' check (status in ('active', 'inactive', 'winback')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table clients enable row level security;

create policy "Org members full access clients" on clients
  for all using (org_id in (select org_id from profiles where id = auth.uid()));

-- Indexes for common query patterns
create index idx_clients_org_id on clients(org_id);
create index idx_clients_status on clients(status);
create index idx_clients_org_status on clients(org_id, status);

create trigger set_clients_updated_at before update on clients
  for each row execute function set_updated_at();

-- Sessions
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id),
  client_id uuid not null references clients(id),
  session_type text not null check (session_type in ('private', 'cornering_clinic', 'platinum_ride', 'corporate')),
  scheduled_start timestamptz not null,
  scheduled_end timestamptz not null,
  location text,
  status text not null default 'scheduled' check (status in ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show')),
  skill_scores jsonb default '{}',
  payment_amount numeric(10,2),
  payment_method text check (payment_method in ('stripe', 'cash', 'eft', 'invoice')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table sessions enable row level security;

create policy "Org members full access sessions" on sessions
  for all using (org_id in (select org_id from profiles where id = auth.uid()));

-- Indexes for calendar and dashboard queries
create index idx_sessions_org_id on sessions(org_id);
create index idx_sessions_client_id on sessions(client_id);
create index idx_sessions_scheduled_start on sessions(scheduled_start);
create index idx_sessions_org_start on sessions(org_id, scheduled_start);
create index idx_sessions_org_status on sessions(org_id, status);

create trigger set_sessions_updated_at before update on sessions
  for each row execute function set_updated_at();

-- Skill definitions
create table skills (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id),
  name text not null,
  category text not null check (category in ('cornering', 'emergency', 'vision', 'control', 'awareness')),
  description text,
  created_at timestamptz default now(),
  unique(org_id, name)
);

alter table skills enable row level security;

create policy "Org members full access skills" on skills
  for all using (org_id in (select org_id from profiles where id = auth.uid()));

create index idx_skills_org_id on skills(org_id);

-- Session skill scores (many-to-many)
create table session_skills (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references sessions(id) on delete cascade,
  skill_id uuid not null references skills(id),
  score integer not null check (score between 1 and 10),
  coach_note text,
  unique(session_id, skill_id)
);

alter table session_skills enable row level security;

create policy "Org members full access session skills" on session_skills
  for all using (
    session_id in (select id from sessions where org_id in (select org_id from profiles where id = auth.uid()))
  );

create index idx_session_skills_session_id on session_skills(session_id);
create index idx_session_skills_skill_id on session_skills(skill_id);

-- Follow-ups
create table follow_ups (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id),
  client_id uuid not null references clients(id),
  session_id uuid references sessions(id),
  type text not null check (type in ('rebook', 'post_session', 'winback', 'platinum_invite')),
  due_at timestamptz not null,
  completed_at timestamptz,
  notes text,
  created_at timestamptz default now()
);

alter table follow_ups enable row level security;

create policy "Org members full access follow-ups" on follow_ups
  for all using (org_id in (select org_id from profiles where id = auth.uid()));

create index idx_follow_ups_org_id on follow_ups(org_id);
create index idx_follow_ups_org_due on follow_ups(org_id, due_at);
create index idx_follow_ups_completed on follow_ups(completed_at);

-- Reminder log
create table reminder_log (
  id uuid primary key default uuid_generate_v4(),
  org_id uuid not null references organizations(id),
  type text not null check (type in ('pre_session_24h', 'post_session_2h', 'rebooking_7d', 'winback_30d', 'platinum_invite')),
  client_id uuid references clients(id),
  session_id uuid references sessions(id),
  sent_at timestamptz default now(),
  channel text default 'email'
);

alter table reminder_log enable row level security;

create policy "Org members full access reminders" on reminder_log
  for all using (org_id in (select org_id from profiles where id = auth.uid()));

create index idx_reminder_log_org_id on reminder_log(org_id);
