# How to Seed Your Portfolio Database

Your portfolio is now connected to Supabase! Follow these steps to populate it with your existing content.

## Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project: `abccckkwbaihnjtrvosu`
3. Click on "SQL Editor" in the left sidebar

## Step 2: Run the Seed Script

1. Copy all the content from `seed-portfolio-data.sql` file
2. Paste it into the Supabase SQL Editor
3. Click the "Run" button (or press Cmd/Ctrl + Enter)

## Step 3: Verify the Data

You should see a success message showing:
- 12 case studies added
- 8 blog posts added

## Step 4: View Your Portfolio

Now when you visit your portfolio:
- **Work page**: Shows all 12 case studies (some password-protected)
- **Posts page**: Shows all 8 blog posts
- **Admin panel**: You can edit all this content!

## Password Protected Case Studies

Some case studies are password-protected for demonstration:
- **FinTech Onboarding Flow**: Password = `demo123`
- **Healthcare Patient Portal**: Password = `health2024`
- **Banking Dashboard**: Password = `banking456`
- **Insurance Claims Portal**: Password = `insure789`
- **Real Estate Platform**: Password = `realestate2023`
- **Education Learning Platform**: Password = `edu2022`

You can change these passwords or remove protection from the admin panel!

## Managing Content from Admin

After seeding:
1. Go to https://melodious-treacle-5f7379.netlify.app/admin
2. Login with: `admin` / `Hamid123589@@0687`
3. Edit any case study or post
4. Add new content
5. Upload your CV
6. All changes appear instantly on your portfolio!

## Troubleshooting

**If case studies don't appear:**
1. Check browser console (F12) for errors
2. Verify data in Supabase: Tables > case_studies
3. Make sure status is 'published'

**If you need to re-seed:**
1. The SQL script starts with `TRUNCATE` which clears old data
2. Just run it again to reset everything

---

**Need help?** Your database is already connected and working. Just run the seed script to see all your content!
