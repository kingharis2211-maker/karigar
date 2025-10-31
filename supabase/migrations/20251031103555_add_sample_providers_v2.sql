/*
  # Add Sample Provider Data

  1. Purpose
    - Populate the database with sample provider profiles for testing
    - Add providers across four main categories: plumbing, electrical, carpentry, painting
    - Each provider has realistic Pakistani names, ratings, and prices

  2. Sample Data
    - Creates 12 provider profiles (3 per category)
    - Each provider has a full name, email, role (provider), rating, and phone
    - Creates corresponding services for each provider with category-specific offerings

  3. Notes
    - Uses DO block to check if sample data already exists
    - Avatar URLs use placeholder images (UI Avatars service)
    - Prices are in PKR and realistic for Pakistani market
*/

DO $$
BEGIN
  -- Check if sample data already exists
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE email = 'ahmed.plumber@example.com') THEN
    
    -- Create sample provider profiles
    INSERT INTO user_profiles (full_name, email, role, rating, phone, avatar_url, bio)
    VALUES
      ('Ahmed Khan', 'ahmed.plumber@example.com', 'provider', 4.8, '+92-300-1234567', 'https://ui-avatars.com/api/?name=Ahmed+Khan&background=0D8ABC&color=fff', 'Expert plumber with 10+ years experience'),
      ('Bilal Hassan', 'bilal.plumber@example.com', 'provider', 4.5, '+92-301-2345678', 'https://ui-avatars.com/api/?name=Bilal+Hassan&background=0D8ABC&color=fff', 'Specialized in bathroom and kitchen plumbing'),
      ('Imran Malik', 'imran.plumber@example.com', 'provider', 4.9, '+92-302-3456789', 'https://ui-avatars.com/api/?name=Imran+Malik&background=0D8ABC&color=fff', 'Professional plumbing services for homes and offices'),
      
      ('Zahid Iqbal', 'zahid.electrician@example.com', 'provider', 4.7, '+92-303-4567890', 'https://ui-avatars.com/api/?name=Zahid+Iqbal&background=F59E0B&color=fff', 'Licensed electrician, residential and commercial'),
      ('Farhan Ali', 'farhan.electrician@example.com', 'provider', 4.6, '+92-304-5678901', 'https://ui-avatars.com/api/?name=Farhan+Ali&background=F59E0B&color=fff', 'Electrical wiring and repair specialist'),
      ('Naveed Ahmed', 'naveed.electrician@example.com', 'provider', 4.9, '+92-305-6789012', 'https://ui-avatars.com/api/?name=Naveed+Ahmed&background=F59E0B&color=fff', '15 years experience in electrical installations'),
      
      ('Rashid Mahmood', 'rashid.carpenter@example.com', 'provider', 4.8, '+92-306-7890123', 'https://ui-avatars.com/api/?name=Rashid+Mahmood&background=10B981&color=fff', 'Custom furniture and woodwork expert'),
      ('Kamran Shah', 'kamran.carpenter@example.com', 'provider', 4.4, '+92-307-8901234', 'https://ui-avatars.com/api/?name=Kamran+Shah&background=10B981&color=fff', 'Specialist in doors, windows, and cabinets'),
      ('Shahid Raza', 'shahid.carpenter@example.com', 'provider', 4.7, '+92-308-9012345', 'https://ui-avatars.com/api/?name=Shahid+Raza&background=10B981&color=fff', 'Fine carpentry and furniture restoration'),
      
      ('Asif Hussain', 'asif.painter@example.com', 'provider', 4.6, '+92-309-0123456', 'https://ui-avatars.com/api/?name=Asif+Hussain&background=EF4444&color=fff', 'Professional interior and exterior painting'),
      ('Tariq Jamil', 'tariq.painter@example.com', 'provider', 4.8, '+92-310-1234567', 'https://ui-avatars.com/api/?name=Tariq+Jamil&background=EF4444&color=fff', 'High-quality painting services for homes'),
      ('Wasim Akram', 'wasim.painter@example.com', 'provider', 4.9, '+92-311-2345678', 'https://ui-avatars.com/api/?name=Wasim+Akram&background=EF4444&color=fff', 'Expert painter with attention to detail');

    -- Create sample services for each provider
    INSERT INTO services (provider_id, category, title, description, price_pkr, availability)
    VALUES
      -- Plumbers
      ((SELECT id FROM user_profiles WHERE email = 'ahmed.plumber@example.com'), 'plumbing', 'Complete Plumbing Services', 'Pipe fitting, leak repairs, bathroom installations', 3500, true),
      ((SELECT id FROM user_profiles WHERE email = 'bilal.plumber@example.com'), 'plumbing', 'Kitchen & Bathroom Plumbing', 'Specialized in kitchen sinks and bathroom fixtures', 3000, true),
      ((SELECT id FROM user_profiles WHERE email = 'imran.plumber@example.com'), 'plumbing', 'Emergency Plumbing Services', '24/7 available for urgent plumbing issues', 4000, true),
      
      -- Electricians
      ((SELECT id FROM user_profiles WHERE email = 'zahid.electrician@example.com'), 'electrical', 'House Wiring Services', 'Complete electrical wiring for new and old homes', 5000, true),
      ((SELECT id FROM user_profiles WHERE email = 'farhan.electrician@example.com'), 'electrical', 'Electrical Repairs', 'Switch, socket, and appliance repairs', 2500, true),
      ((SELECT id FROM user_profiles WHERE email = 'naveed.electrician@example.com'), 'electrical', 'Commercial Electrical Work', 'Office and shop electrical installations', 6000, true),
      
      -- Carpenters
      ((SELECT id FROM user_profiles WHERE email = 'rashid.carpenter@example.com'), 'carpentry', 'Custom Furniture Making', 'Beds, wardrobes, tables, and chairs', 8000, true),
      ((SELECT id FROM user_profiles WHERE email = 'kamran.carpenter@example.com'), 'carpentry', 'Door & Window Installation', 'Wooden doors, windows, and frames', 4500, true),
      ((SELECT id FROM user_profiles WHERE email = 'shahid.carpenter@example.com'), 'carpentry', 'Kitchen Cabinets', 'Custom kitchen cabinets and storage solutions', 7000, true),
      
      -- Painters
      ((SELECT id FROM user_profiles WHERE email = 'asif.painter@example.com'), 'painting', 'Interior House Painting', 'Professional interior painting service', 5500, true),
      ((SELECT id FROM user_profiles WHERE email = 'tariq.painter@example.com'), 'painting', 'Exterior Wall Painting', 'Weather-resistant exterior painting', 6500, true),
      ((SELECT id FROM user_profiles WHERE email = 'wasim.painter@example.com'), 'painting', 'Complete Home Painting', 'Interior and exterior painting packages', 12000, true);
  END IF;
END $$;