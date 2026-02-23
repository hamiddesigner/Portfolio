-- ============================================================================
-- SEED PORTFOLIO DATA - Run this in Supabase SQL Editor
-- This will populate your database with existing portfolio content
-- ============================================================================

-- Clear existing data (optional - remove if you want to keep existing)
TRUNCATE TABLE case_studies, posts RESTART IDENTITY CASCADE;

-- ============================================================================
-- CASE STUDIES
-- ============================================================================

INSERT INTO case_studies (title, slug, description, thumbnail, content, tags, status, is_password_protected, password, featured, created_at, updated_at) VALUES

-- Case Study 1: SaaS Analytics Dashboard (Unlocked)
(
  'SaaS Analytics Dashboard',
  'saas-analytics-dashboard',
  'Redesigned a complex analytics platform, reducing task completion time by 40% through improved information architecture and data visualization.',
  'https://via.placeholder.com/800x500/dedef2/666666?text=SaaS+Analytics',
  '{"sections": [{"type": "text", "content": "Complete case study content here..."}]}',
  ARRAY['SaaS', 'Dashboard', 'Analytics', 'UX Design'],
  'published',
  false,
  null,
  true,
  '2024-01-15T00:00:00Z',
  '2024-03-20T00:00:00Z'
),

-- Case Study 2: FinTech Onboarding Flow (Password Protected)
(
  'FinTech Onboarding Flow',
  'fintech-onboarding-flow',
  'Streamlined user onboarding with progressive disclosure, reducing signup time by 60% while maintaining compliance requirements.',
  'https://via.placeholder.com/800x500/d9edeb/666666?text=FinTech+Onboarding',
  '{"sections": [{"type": "text", "content": "Protected case study content..."}]}',
  ARRAY['FinTech', 'Onboarding', 'UX Design', 'Mobile'],
  'published',
  true,
  'demo123',
  true,
  '2023-10-01T00:00:00Z',
  '2023-12-31T00:00:00Z'
),

-- Case Study 3: E-Commerce Mobile App (Unlocked)
(
  'E-Commerce Mobile App',
  'ecommerce-mobile-app',
  'Created a seamless shopping experience with personalized recommendations, increasing conversion rate by 35%.',
  'https://via.placeholder.com/800x500/f0e7ff/666666?text=E-Commerce+App',
  '{"sections": [{"type": "text", "content": "E-commerce case study content..."}]}',
  ARRAY['Mobile', 'E-Commerce', 'iOS', 'Android'],
  'published',
  false,
  null,
  true,
  '2023-06-01T00:00:00Z',
  '2023-09-30T00:00:00Z'
),

-- Case Study 4: Healthcare Patient Portal (Password Protected)
(
  'Healthcare Patient Portal',
  'healthcare-patient-portal',
  'Designed HIPAA-compliant patient portal with appointment scheduling, reducing administrative calls by 45%.',
  'https://via.placeholder.com/800x500/fae3d9/666666?text=Healthcare+Portal',
  '{"sections": [{"type": "text", "content": "Healthcare case study content..."}]}',
  ARRAY['Healthcare', 'Web Design', 'HIPAA', 'Portal'],
  'published',
  true,
  'health2024',
  false,
  '2024-01-01T00:00:00Z',
  '2024-05-31T00:00:00Z'
),

-- Case Study 5: Restaurant Booking Platform (Unlocked)
(
  'Restaurant Booking Platform',
  'restaurant-booking-platform',
  'Built intuitive reservation system with real-time availability, improving table turnover by 25%.',
  'https://via.placeholder.com/800x500/ffe8e8/666666?text=Restaurant+Booking',
  '{"sections": [{"type": "text", "content": "Restaurant booking case study..."}]}',
  ARRAY['Web Design', 'Booking System', 'Restaurant'],
  'published',
  false,
  null,
  false,
  '2023-03-01T00:00:00Z',
  '2023-05-31T00:00:00Z'
),

-- Case Study 6: Banking Dashboard (Password Protected)
(
  'Banking Dashboard',
  'banking-dashboard',
  'Modernized enterprise banking dashboard with unified design system, improving task efficiency by 50%.',
  'https://via.placeholder.com/800x500/e8f4f8/666666?text=Banking+Dashboard',
  '{"sections": [{"type": "text", "content": "Banking dashboard case study..."}]}',
  ARRAY['Banking', 'Dashboard', 'Enterprise', 'FinTech'],
  'published',
  true,
  'banking456',
  false,
  '2024-02-01T00:00:00Z',
  '2024-04-30T00:00:00Z'
),

-- Case Study 7: Travel Planning App (Unlocked)
(
  'Travel Planning App',
  'travel-planning-app',
  'Designed collaborative trip planning tool with itinerary sharing, increasing user engagement by 55%.',
  'https://via.placeholder.com/800x500/fff4e6/666666?text=Travel+App',
  '{"sections": [{"type": "text", "content": "Travel app case study..."}]}',
  ARRAY['Mobile', 'Travel', 'Social Features'],
  'published',
  false,
  null,
  false,
  '2023-08-01T00:00:00Z',
  '2023-10-31T00:00:00Z'
),

-- Case Study 8: Insurance Claims Portal (Password Protected)
(
  'Insurance Claims Portal',
  'insurance-claims-portal',
  'Streamlined insurance claims submission process, reducing processing time by 65% and improving customer satisfaction.',
  'https://via.placeholder.com/800x500/e8f5e9/666666?text=Insurance+Portal',
  '{"sections": [{"type": "text", "content": "Insurance portal case study..."}]}',
  ARRAY['Insurance', 'Portal', 'Claims', 'Web Design'],
  'published',
  true,
  'insure789',
  false,
  '2023-11-01T00:00:00Z',
  '2024-01-31T00:00:00Z'
),

-- Case Study 9: Fitness Tracking App (Unlocked)
(
  'Fitness Tracking App',
  'fitness-tracking-app',
  'Created motivating workout tracker with social features, achieving 4.8 star rating and 100k+ downloads.',
  'https://via.placeholder.com/800x500/fce4ec/666666?text=Fitness+App',
  '{"sections": [{"type": "text", "content": "Fitness app case study..."}]}',
  ARRAY['Mobile', 'Fitness', 'Health', 'Social'],
  'published',
  false,
  null,
  false,
  '2023-05-01T00:00:00Z',
  '2023-07-31T00:00:00Z'
),

-- Case Study 10: Real Estate Platform (Password Protected)
(
  'Real Estate Platform',
  'real-estate-platform',
  'Built comprehensive property search platform with virtual tours, increasing qualified leads by 70%.',
  'https://via.placeholder.com/800x500/f3e5f5/666666?text=Real+Estate',
  '{"sections": [{"type": "text", "content": "Real estate platform case study..."}]}',
  ARRAY['Real Estate', 'Web Design', 'Search', 'Virtual Tour'],
  'published',
  true,
  'realestate2023',
  false,
  '2023-04-01T00:00:00Z',
  '2023-06-30T00:00:00Z'
),

-- Case Study 11: Project Management Tool (Unlocked)
(
  'Project Management Tool',
  'project-management-tool',
  'Designed collaborative project management suite with Kanban boards, reducing team coordination time by 45%.',
  'https://via.placeholder.com/800x500/e0f2f1/666666?text=Project+Management',
  '{"sections": [{"type": "text", "content": "Project management case study..."}]}',
  ARRAY['SaaS', 'Project Management', 'Collaboration'],
  'published',
  false,
  null,
  false,
  '2022-12-01T00:00:00Z',
  '2023-02-28T00:00:00Z'
),

-- Case Study 12: Education Learning Platform (Password Protected)
(
  'Education Learning Platform',
  'education-learning-platform',
  'Created interactive online learning platform with progress tracking, achieving 90% course completion rate.',
  'https://via.placeholder.com/800x500/fff9c4/666666?text=Education+Platform',
  '{"sections": [{"type": "text", "content": "Education platform case study..."}]}',
  ARRAY['Education', 'E-Learning', 'Web Design'],
  'published',
  true,
  'edu2022',
  false,
  '2022-09-01T00:00:00Z',
  '2022-11-30T00:00:00Z'
);

-- ============================================================================
-- BLOG POSTS
-- ============================================================================

INSERT INTO posts (title, slug, excerpt, content, thumbnail, tags, status, featured, created_at, updated_at) VALUES

-- Post 1
(
  'Why designers should think like product managers',
  'designers-think-like-pms',
  'Redesigned a complex analytics platform, reducing task completion time by 40%...',
  '{"sections": [{"type": "text", "content": "Redesigned a complex analytics platform, reducing task completion time by 40% through improved information architecture, streamlined workflows, and data visualization enhancements. Collaborated with cross-functional teams to deliver a user-centered solution that increased user satisfaction by 60%."}]}',
  'https://via.placeholder.com/800x400/dedef2/666666?text=Product+Thinking',
  ARRAY['Product Design', 'Strategy', 'UX'],
  'published',
  true,
  '2024-02-15T00:00:00Z',
  '2024-02-15T00:00:00Z'
),

-- Post 2
(
  '5 things I learned designing for FinTech',
  'designing-for-fintech',
  'Security and trust are paramount. Users need to feel confident...',
  '{"sections": [{"type": "text", "content": "Security and trust are paramount. Users need to feel confident their financial data is safe. This means designing transparent security features, clear feedback, and building trust through consistent, professional design patterns. Working in FinTech taught me the critical balance between innovation and regulatory compliance."}]}',
  'https://via.placeholder.com/800x400/d9edeb/666666?text=FinTech+Design',
  ARRAY['FinTech', 'Design', 'Security'],
  'published',
  true,
  '2024-02-10T00:00:00Z',
  '2024-02-10T00:00:00Z'
),

-- Post 3
(
  'Design systems are a team sport',
  'design-systems-team-sport',
  'Building a design system isn''t just about creating components...',
  '{"sections": [{"type": "text", "content": "Building a design system isn''t just about creating components and guidelines. It''s about fostering collaboration across design, engineering, and product teams. The most successful design systems are built through continuous communication, regular feedback loops, and shared ownership of the system''s evolution."}]}',
  'https://via.placeholder.com/800x400/fae3d9/666666?text=Design+Systems',
  ARRAY['Design Systems', 'Collaboration', 'Components'],
  'published',
  true,
  '2024-02-05T00:00:00Z',
  '2024-02-05T00:00:00Z'
),

-- Post 4
(
  'The power of micro-interactions',
  'power-of-micro-interactions',
  'Small details make a huge difference in user experience...',
  '{"sections": [{"type": "text", "content": "Small details make a huge difference in user experience. Micro-interactions provide feedback, guide users, and add delight to every touchpoint. From button states to loading animations, these subtle moments of interaction can transform a functional interface into an engaging experience that users love."}]}',
  'https://via.placeholder.com/800x400/f0e7ff/666666?text=Micro-interactions',
  ARRAY['Interaction Design', 'UX', 'Animation'],
  'published',
  false,
  '2024-01-30T00:00:00Z',
  '2024-01-30T00:00:00Z'
),

-- Post 5
(
  'How to conduct better user research',
  'better-user-research',
  'User research is the foundation of great design decisions...',
  '{"sections": [{"type": "text", "content": "User research is the foundation of great design decisions. Learn to ask the right questions, observe without bias, and synthesize insights that drive meaningful product improvements. Effective research combines qualitative and quantitative methods to build a complete picture of user needs and behaviors."}]}',
  'https://via.placeholder.com/800x400/ffe8e8/666666?text=User+Research',
  ARRAY['Research', 'UX', 'Methods'],
  'published',
  false,
  '2024-01-25T00:00:00Z',
  '2024-01-25T00:00:00Z'
),

-- Post 6
(
  'Designing for accessibility from day one',
  'accessibility-from-day-one',
  'Accessibility isn''t an afterthought, it''s a core design principle...',
  '{"sections": [{"type": "text", "content": "Accessibility isn''t an afterthought, it''s a core design principle. By considering diverse user needs from the start, we create products that work better for everyone. This includes proper color contrast, keyboard navigation, screen reader support, and semantic HTML structure."}]}',
  'https://via.placeholder.com/800x400/e8f4f8/666666?text=Accessibility',
  ARRAY['Accessibility', 'Inclusive Design', 'WCAG'],
  'published',
  false,
  '2024-01-20T00:00:00Z',
  '2024-01-20T00:00:00Z'
),

-- Post 7
(
  'Mobile-first design strategies',
  'mobile-first-design',
  'Starting with mobile constraints forces better design decisions...',
  '{"sections": [{"type": "text", "content": "Starting with mobile constraints forces better design decisions. When you design for the smallest screen first, you prioritize content, simplify navigation, and focus on essential features. This approach creates cleaner, more focused experiences that scale beautifully to larger screens."}]}',
  'https://via.placeholder.com/800x400/fff4e6/666666?text=Mobile+First',
  ARRAY['Mobile Design', 'Responsive', 'Strategy'],
  'published',
  false,
  '2024-01-15T00:00:00Z',
  '2024-01-15T00:00:00Z'
),

-- Post 8
(
  'Color psychology in digital products',
  'color-psychology-digital',
  'Colors evoke emotions and influence user behavior in subtle ways...',
  '{"sections": [{"type": "text", "content": "Colors evoke emotions and influence user behavior in subtle ways. Understanding color psychology helps designers make intentional choices that align with brand values and user expectations. From building trust with blues to creating urgency with reds, color plays a crucial role in digital product success."}]}',
  'https://via.placeholder.com/800x400/e8f5e9/666666?text=Color+Psychology',
  ARRAY['Visual Design', 'Color Theory', 'Psychology'],
  'published',
  false,
  '2024-01-10T00:00:00Z',
  '2024-01-10T00:00:00Z'
);

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

SELECT 'Portfolio data seeded successfully!' as message,
       (SELECT COUNT(*) FROM case_studies) as case_studies_count,
       (SELECT COUNT(*) FROM posts) as posts_count;
