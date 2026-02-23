# Supabase Database Schema

This document defines the database schema for the portfolio admin panel.

## Tables

### 1. case_studies

Stores case study projects with details.

```sql
create table case_studies (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  subtitle text,
  description text,
  client text,
  year text,
  role text,
  duration text,
  tags text[], -- Array of tags
  hero_image_url text,
  thumbnail_url text,
  password_protected boolean default false,
  password text, -- Individual case study password
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on slug for faster lookups
create index case_studies_slug_idx on case_studies(slug);

-- Create index on status
create index case_studies_status_idx on case_studies(status);

-- Auto-update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_case_studies_updated_at
  before update on case_studies
  for each row
  execute function update_updated_at_column();
```

### 2. case_study_sections

Stores content sections for each case study (challenge, solution, results, etc.)

```sql
create table case_study_sections (
  id uuid default gen_random_uuid() primary key,
  case_study_id uuid not null references case_studies(id) on delete cascade,
  section_type text not null check (section_type in ('overview', 'challenge', 'solution', 'process', 'results', 'features', 'testimonial', 'custom')),
  title text not null,
  content text, -- Rich text/HTML content
  order_index integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster queries by case study
create index case_study_sections_case_study_id_idx on case_study_sections(case_study_id);

-- Auto-update timestamp
create trigger update_case_study_sections_updated_at
  before update on case_study_sections
  for each row
  execute function update_updated_at_column();
```

### 3. case_study_images

Stores images/media for case studies

```sql
create table case_study_images (
  id uuid default gen_random_uuid() primary key,
  case_study_id uuid not null references case_studies(id) on delete cascade,
  section_id uuid references case_study_sections(id) on delete set null,
  image_url text not null,
  caption text,
  alt_text text,
  order_index integer default 0,
  width integer,
  height integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for faster queries
create index case_study_images_case_study_id_idx on case_study_images(case_study_id);
create index case_study_images_section_id_idx on case_study_images(section_id);
```

### 4. blog_posts

Stores blog posts/articles

```sql
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text, -- Rich text/HTML content
  featured_image_url text,
  thumbnail_url text,
  author text default 'Hamid',
  category text,
  tags text[], -- Array of tags
  read_time integer, -- Minutes
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamp with time zone,
  views integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index on slug
create index blog_posts_slug_idx on blog_posts(slug);

-- Create index on status and published_at
create index blog_posts_status_published_idx on blog_posts(status, published_at desc);

-- Auto-update timestamp
create trigger update_blog_posts_updated_at
  before update on blog_posts
  for each row
  execute function update_updated_at_column();
```

### 5. page_content

Stores editable content for static pages (About, Home, etc.)

```sql
create table page_content (
  id uuid default gen_random_uuid() primary key,
  page_name text unique not null check (page_name in ('home', 'about', 'work', 'contact')),
  section_key text not null, -- e.g., 'hero_title', 'about_bio', 'contact_email'
  content text not null,
  content_type text default 'text' check (content_type in ('text', 'html', 'markdown', 'url', 'json')),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Unique constraint on page and section
create unique index page_content_page_section_idx on page_content(page_name, section_key);

-- Auto-update timestamp
create trigger update_page_content_updated_at
  before update on page_content
  for each row
  execute function update_updated_at_column();
```

### 6. availability

Stores availability status for freelance work

```sql
create table availability (
  id uuid default gen_random_uuid() primary key,
  status text not null check (status in ('available', 'busy', 'unavailable')),
  message text,
  available_from date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Only allow one row
create unique index availability_singleton_idx on availability((true));

-- Auto-update timestamp
create trigger update_availability_updated_at
  before update on availability
  for each row
  execute function update_updated_at_column();

-- Insert default row
insert into availability (status, message) 
values ('available', 'Available for new projects');
```

### 7. certifications

Stores certifications to display on the website

```sql
create table certifications (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  issuer text not null,
  issue_date date,
  expiry_date date,
  credential_id text,
  credential_url text,
  image_url text,
  description text,
  order_index integer default 0,
  visible boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for ordering
create index certifications_order_idx on certifications(order_index);

-- Auto-update timestamp
create trigger update_certifications_updated_at
  before update on certifications
  for each row
  execute function update_updated_at_column();
```

### 8. contact_submissions

Stores contact form submissions

```sql
create table contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  status text default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  ip_address text,
  user_agent text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for filtering by status
create index contact_submissions_status_idx on contact_submissions(status);

-- Index for sorting by date
create index contact_submissions_created_at_idx on contact_submissions(created_at desc);
```

## Row Level Security (RLS)

For now, we'll use the anon key and disable RLS since the admin panel handles authentication client-side. In Phase 2, we can add proper RLS policies.

```sql
-- Disable RLS for now (admin panel handles auth)
alter table case_studies disable row level security;
alter table case_study_sections disable row level security;
alter table case_study_images disable row level security;
alter table blog_posts disable row level security;
alter table page_content disable row level security;
alter table availability disable row level security;
alter table certifications disable row level security;
alter table contact_submissions disable row level security;
```

## Storage Buckets

Create storage buckets for images:

1. **case-study-images** - For case study screenshots and images
2. **blog-images** - For blog post images
3. **general-images** - For profile pictures, certification images, etc.

```sql
-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
  ('case-study-images', 'case-study-images', true),
  ('blog-images', 'blog-images', true),
  ('general-images', 'general-images', true);

-- Set storage policies (allow public read, authenticated write)
create policy "Public read access"
  on storage.objects for select
  using (bucket_id in ('case-study-images', 'blog-images', 'general-images'));

create policy "Authenticated users can upload"
  on storage.objects for insert
  with check (bucket_id in ('case-study-images', 'blog-images', 'general-images'));

create policy "Authenticated users can update"
  on storage.objects for update
  using (bucket_id in ('case-study-images', 'blog-images', 'general-images'));

create policy "Authenticated users can delete"
  on storage.objects for delete
  using (bucket_id in ('case-study-images', 'blog-images', 'general-images'));
```

## Seed Data

### Sample page content

```sql
-- Home page content
insert into page_content (page_name, section_key, content, content_type) values
('home', 'hero_title', 'Hi, I''m Hamid', 'text'),
('home', 'hero_subtitle', 'UX/UI Designer & Product Designer', 'text'),
('home', 'hero_description', 'I create thoughtful digital experiences that people love to use.', 'text'),
('about', 'bio', 'Your bio content here', 'html'),
('contact', 'email', 'hamid.designer50@gmail.com', 'text'),
('contact', 'linkedin', 'https://linkedin.com/in/your-profile', 'url');
```

## API Endpoints (to implement)

### Case Studies
- `GET /api/case-studies` - List all published case studies
- `GET /api/case-studies/:slug` - Get single case study with sections and images
- `POST /api/case-studies` - Create new case study (admin)
- `PUT /api/case-studies/:id` - Update case study (admin)
- `DELETE /api/case-studies/:id` - Delete case study (admin)

### Blog Posts
- `GET /api/posts` - List all published posts
- `GET /api/posts/:slug` - Get single post
- `POST /api/posts` - Create new post (admin)
- `PUT /api/posts/:id` - Update post (admin)
- `DELETE /api/posts/:id` - Delete post (admin)

### Page Content
- `GET /api/content/:page` - Get all content for a page
- `PUT /api/content/:page/:section` - Update specific section (admin)

### Availability
- `GET /api/availability` - Get current availability status
- `PUT /api/availability` - Update availability (admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact/submissions` - List all submissions (admin)

## Next Steps

1. Create a Supabase project at https://supabase.com
2. Run the SQL above in the Supabase SQL Editor
3. Get your project URL and anon key
4. Update `.env` with your Supabase credentials
5. Test the database connection in the admin panel
