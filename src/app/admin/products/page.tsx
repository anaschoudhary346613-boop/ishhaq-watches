"use client";

import { useAdminStore } from "@/store/useAdminStore";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function AdminProducts() {
  const { isAuthenticated } = useAdminStore();
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [liveProducts, setLiveProducts] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/admin/login");
    } else {
      const fetchProducts = async () => {
        const { data, error } = await supabase.from('products').select('*');
        if (data) {
          setLiveProducts(data);
        }
      };
      
      fetchProducts();

      // Subscribe to realtime changes locally
      const channel = supabase
        .channel('admin:products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          fetchProducts();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated, router, supabase]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this watch?")) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        setLiveProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert("Failed to delete product.");
      }
    }
  };

  if (!mounted || !isAuthenticated) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-serif text-[#121c2d]">Inventory</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#c5a059] text-sm w-full sm:w-64"
            />
          </div>
          <Link 
            href="/admin/products/new"
            className="flex items-center justify-center gap-2 bg-[#121c2d] text-white px-4 py-2 rounded shadow text-sm hover:bg-[#1a2942] transition-colors min-h-[44px] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {liveProducts.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {product.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-300 text-xs text-center">No Image</div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500">
                  {product.brand}
                </td>
                <td className="px-6 py-4 font-medium">
                  <div className="flex flex-col">
                    <span>₹{product.regular_price?.toLocaleString()}</span>
                    {product.sale_price && (
                      <span className="text-[10px] text-[#c5a059] font-semibold uppercase tracking-wider">
                        Sale: ₹{product.sale_price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {product.stock !== null && product.stock !== undefined ? (
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-gray-900">{product.stock}</span>
                      {product.stock > 5 ? (
                        <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">In Stock</span>
                      ) : product.stock > 0 ? (
                        <span className="text-[10px] text-amber-600 font-bold uppercase tracking-widest">Low Stock</span>
                      ) : (
                        <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest">Out of Stock</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400 font-light italic">Unlimited</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-gray-400 hover:text-[#c5a059] transition-colors p-2"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {liveProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  No watches found in inventory. Add one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

