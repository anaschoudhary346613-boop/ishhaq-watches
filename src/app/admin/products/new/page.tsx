"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Upload } from "lucide-react";
import { ConnectionDiagnostic } from "@/components/admin/ConnectionDiagnostic";

export default function AddProductPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "Rolex",
    price: "",
    salePrice: "",
    stock: "",
    description: "",
  });
  const [customBrand, setCustomBrand] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (imageFiles.length + files.length > 4) {
        showToast("error", "You can only upload up to 4 images per watch.");
        return;
      }
      
      const newFiles = [...imageFiles, ...files];
      const newPreviews = [...imagePreviews, ...files.map(file => URL.createObjectURL(file))];
      
      setImageFiles(newFiles);
      setImagePreviews(newPreviews);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    
    // Revoke the URL to avoid memory leaks
    URL.revokeObjectURL(newPreviews[index]);
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    if (type === "success") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (imageFiles.length === 0) {
      showToast("error", "Please select at least one product image.");
      return;
    }

    const finalBrand = formData.brand === "Other" ? customBrand : formData.brand;
    if (formData.brand === "Other" && !customBrand.trim()) {
      showToast("error", "Please enter a custom brand name.");
      return;
    }

    setIsSubmitting(true);
    setToast(null);

    try {
      // Step 1: Upload all images
      const imageUrls: string[] = [];
      
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) throw new Error(`Image Upload Failed: ${uploadError.message}`);

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
          
        imageUrls.push(publicUrl);
      }

      // Step 2: Database Insert
      const payload: any = {
        name: formData.name,
        brand: finalBrand,
        regular_price: Number(formData.price),
        description: formData.description,
        image_url: imageUrls[0], // Set the first image as the primary one
        images: imageUrls,       // Store the full array for the gallery
        stock: formData.stock !== "" ? Number(formData.stock) : null,
      };

      if (formData.salePrice) {
        payload.sale_price = Number(formData.salePrice);
      }

      const { error: insertError } = await supabase.from("products").insert([payload]);

      if (insertError) throw new Error(`Database Insert Failed: ${insertError.message}`);

      // Success
      showToast("success", "Watch added successfully!");
      setFormData({ name: "", brand: "Rolex", price: "", salePrice: "", stock: "", description: "" });
      setCustomBrand("");
      setImageFiles([]);
      setImagePreviews([]);
      
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);

    } catch (err: any) {
      console.error("Product creation error:", err);
      
      let message = err.message || "An unexpected error occurred.";
      
      // Provide more helpful message for common Supabase failures
      if (message.includes("Failed to fetch")) {
        message = "Image Upload Failed: Could not connect to Supabase Storage. Please ensure the 'product-images' bucket is created and set to 'Public' in your Supabase dashboard.";
      }
      
      showToast("error", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-20">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-6 py-3 rounded shadow-lg text-sm font-medium animate-in slide-in-from-top-5 ${toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5 text-red-500" />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 border rounded hover:bg-gray-50 text-gray-500 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-serif text-[#121c2d]">Add New Watch</h1>
      </div>

      <ConnectionDiagnostic />

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Vintage Casio Illuminator"
              className="w-full min-h-[44px] border-gray-300 border px-4 py-2 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Brand</label>
                <select
                  className="w-full min-h-[44px] border-gray-300 border px-4 py-2 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm bg-white"
                  value={formData.brand}
                  onChange={(e) => setFormData({...formData, brand: e.target.value})}
                >
                  <option value="Rolex">Rolex</option>
                  <option value="Casio">Casio</option>
                  <option value="Patek Philippe">Patek Philippe</option>
                  <option value="Tissot">Tissot</option>
                  <option value="Hublot">Hublot</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {formData.brand === "Other" && (
                <div className="animate-in slide-in-from-top-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Custom Brand Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom brand..."
                    className="w-full min-h-[44px] border-gray-300 border px-4 py-2 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Regular Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-sans">₹</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full min-h-[44px] border-gray-300 border pl-8 pr-4 py-2 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Sale Price (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-sans">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full min-h-[44px] border-gray-300 border pl-8 pr-4 py-2 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g. 5"
                  className="w-full min-h-[44px] border-gray-300 border px-4 py-2 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                  value={formData.stock}
                  onChange={(e) => setFormData({...formData, stock: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Description</label>
            <textarea
              required
              rows={4}
              placeholder="Enter watch details, materials, condition, etc."
              className="w-full min-h-[88px] border-gray-300 border px-4 py-3 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm resize-y"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Product Images (Up to 4)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group aspect-square bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90%] bg-[#121c2d] text-white text-[8px] uppercase tracking-widest py-1 rounded-full text-center font-bold">
                      Primary
                    </div>
                  )}
                </div>
              ))}
              
              {imageFiles.length < 4 && (
                <div className="relative border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center text-center hover:border-[#c5a059] transition-colors bg-gray-50/50 aspect-square group">
                  <input
                    type="file"
                    multiple
                    accept="image/jpeg, image/png, image/webp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleImageChange}
                  />
                  <div className="flex flex-col items-center p-2">
                    <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Upload className="w-4 h-4 text-[#c5a059]" />
                    </div>
                    <p className="text-[10px] font-medium text-[#121c2d]">Add More</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[44px] bg-[#121c2d] text-white py-3 rounded uppercase tracking-widest text-sm font-medium hover:bg-[#c5a059] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Uploading...
                </>
              ) : (
                "Add Watch"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

