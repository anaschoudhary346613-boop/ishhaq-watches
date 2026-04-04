"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { ArrowLeft, Upload, CheckCircle2, XCircle } from "lucide-react";
import { use } from "react";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const supabase = createClient();
  const resolvedParams = use(params);
  
  const [formData, setFormData] = useState({
    name: "",
    brand: "Rolex",
    price: "",
    salePrice: "",
    description: "",
  });
  const [customBrand, setCustomBrand] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase.from('products').select('*').eq('id', resolvedParams.id).single();
      
      if (data) {
        // Check if brand is a default option, else set to Other and populate custom brand
        const defaultBrands = ["Rolex", "Casio", "Patek Philippe", "Tissot", "Hublot"];
        if (!defaultBrands.includes(data.brand) && data.brand) {
          setFormData(prev => ({ ...prev, brand: "Other" }));
          setCustomBrand(data.brand);
        } else {
          setFormData(prev => ({ ...prev, brand: data.brand || "Rolex" }));
        }

        setFormData(prev => ({
          ...prev,
          name: data.name || "",
          price: data.regular_price ? String(data.regular_price) : "",
          salePrice: data.sale_price ? String(data.sale_price) : "",
          description: data.description || "",
        }));

        const imgs = data.images || (data.image_url ? [data.image_url] : []);
        setExistingImages(imgs);
      } else if (error) {
        showToast("error", "Could not fetch product details.");
      }
      setIsLoading(false);
    }
    fetchProduct();
  }, [supabase, resolvedParams.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      if (existingImages.length + imageFiles.length + files.length > 4) {
        showToast("error", "You can only have up to 4 images per watch.");
        return;
      }
      
      const newFiles = [...imageFiles, ...files];
      const newPreviews = [...imagePreviews, ...files.map(file => URL.createObjectURL(file))];
      
      setImageFiles(newFiles);
      setImagePreviews(newPreviews);
    }
  };

  const removeLocalImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = (index: number) => {
    const newExisting = [...existingImages];
    newExisting.splice(index, 1);
    setExistingImages(newExisting);
  };

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    if (type === "success") {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (existingImages.length + imageFiles.length === 0) {
      showToast("error", "Please have at least one product image.");
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
      const imageUrls = [...existingImages];

      // Upload new images
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

        const { data: { publicUrl: url } } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);
          
        imageUrls.push(url);
      }

      // Database Update
      const payload: any = {
        name: formData.name,
        brand: finalBrand,
        regular_price: Number(formData.price),
        description: formData.description,
        image_url: imageUrls[0], // Set first as primary
        images: imageUrls,
        sale_price: formData.salePrice ? Number(formData.salePrice) : null
      };

      const { error: updateError } = await supabase.from("products").update(payload).eq('id', resolvedParams.id);

      if (updateError) throw new Error(`Database Update Failed: ${updateError.message}`);

      // Success
      showToast("success", "Watch updated successfully!");
      
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);

    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-20 text-center text-gray-500">Loading product data...</div>;
  }

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
        <h1 className="text-2xl font-serif text-[#121c2d]">Edit Watch</h1>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Product Name</label>
            <input
              type="text"
              required
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
                      className="w-full min-h-[44px] border-gray-300 border pl-8 pr-4 py-2 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm"
                      value={formData.salePrice}
                      onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                    />
                  </div>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Description</label>
            <textarea
              required
              rows={4}
              className="w-full min-h-[88px] border-gray-300 border px-4 py-3 rounded focus:outline-none focus:border-[#c5a059] transition-colors text-sm resize-y"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-gray-700 mb-2 font-medium">Product Images (Up to 4)</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              {/* Existing Images */}
              {existingImages.map((url, index) => (
                <div key={`existing-${index}`} className="relative group aspect-square bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
                  <img src={url} alt={`Existing ${index}`} className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
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

              {/* Local Image Previews */}
              {imagePreviews.map((preview, index) => (
                <div key={`local-${index}`} className="relative group aspect-square bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
                  <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-contain" />
                  <button
                    type="button"
                    onClick={() => removeLocalImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  {existingImages.length === 0 && index === 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[90%] bg-[#121c2d] text-white text-[8px] uppercase tracking-widest py-1 rounded-full text-center font-bold">
                      Primary
                    </div>
                  )}
                </div>
              ))}
              
              {existingImages.length + imageFiles.length < 4 && (
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
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
