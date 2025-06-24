
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id),
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_out_of_stock BOOLEAN DEFAULT false,
  specifications TEXT[] DEFAULT '{}',
  materials TEXT,
  occasion TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT NOT NULL,
  order_items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_charges DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site settings table
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name, description) VALUES
('Traditional', 'Classic traditional rakhis with authentic designs'),
('Designer', 'Modern designer rakhis with contemporary styles'),
('Kids', 'Colorful and fun rakhis specially designed for children'),
('Premium', 'Luxury rakhis with premium materials and craftsmanship'),
('Eco-Friendly', 'Environment-friendly rakhis made from sustainable materials');

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('delivery_charges', '50'),
('free_delivery_minimum', '200'),
('contact_phone', '+91 7696400902'),
('contact_email', 'prathamm4402@gmail.com'),
('site_title', 'RakhiMart - Premium Rakhi Collection'),
('site_description', 'Celebrate Raksha Bandhan with our beautiful collection of traditional and designer rakhis');

-- Insert sample product (you can modify the admin panel later)
INSERT INTO public.products (name, price, description, category_id, images, stock, specifications, materials, occasion) 
SELECT 
  'Traditional Gold Rakhi',
  299.00,
  'Beautiful traditional gold-plated rakhi with intricate designs. Perfect for your beloved brother. Handcrafted with premium materials and adorned with sacred threads.',
  c.id,
  ARRAY[
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=400&fit=crop'
  ],
  25,
  ARRAY['Gold-plated', 'Handcrafted', 'Sacred thread', 'Traditional design'],
  'Gold-plated metal, silk thread, beads',
  'Raksha Bandhan, Traditional ceremonies'
FROM public.categories c WHERE c.name = 'Traditional';

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no authentication required for viewing)
CREATE POLICY "Allow public read access to categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public read access to site_settings" ON public.site_settings FOR SELECT USING (true);

-- Create policies for orders (public can insert orders, but not read others)
CREATE POLICY "Allow public to create orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Create policies for reviews (public can create and read reviews)
CREATE POLICY "Allow public to create reviews" ON public.reviews FOR INSERT WITH CHECK (true);

-- For admin access, we'll handle this in the application logic with password protection
-- since we're not implementing user authentication in this version
