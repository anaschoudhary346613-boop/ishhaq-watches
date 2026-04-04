-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Products Table
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  brand text,
  description text,
  regular_price numeric(10, 2) not null,
  sale_price numeric(10, 2),
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Orders Table
create table orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  email text not null,
  phone text,
  shipping_address text not null,
  total_amount numeric(10, 2) not null,
  status text not null default 'Processing', -- Processing, Shipped, Completed
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Order Items Table
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) on delete restrict not null,
  quantity integer not null default 1,
  price_at_purchase numeric(10, 2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Storage Bucket for Product Images
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict do nothing;

create policy "Public Access to Images" on storage.objects for select using ( bucket_id = 'product-images' );
create policy "Admin Insert" on storage.objects for insert with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
create policy "Admin Update" on storage.objects for update using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
create policy "Admin Delete" on storage.objects for delete using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

-- 5. Set up Row Level Security (RLS)
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Product Policies
create policy "Public can view active products" on products for select using ( true );
create policy "Admins can manage products" on products for all using ( auth.role() = 'authenticated' );

-- Order Policies
create policy "Admins can view orders" on orders for select using ( auth.role() = 'authenticated' );
create policy "Admins can update orders" on orders for update using ( auth.role() = 'authenticated' );
create policy "Anyone can insert orders" on orders for insert with check ( true ); -- Allow public checkout submissions

-- Order Item Policies
create policy "Admins can view order items" on order_items for select using ( auth.role() = 'authenticated' );
create policy "Anyone can insert order items" on order_items for insert with check ( true ); -- Allow public checkout submissions

