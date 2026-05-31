"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Image, Loader2, UploadCloud, X } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { productSchema, ProductFormSchemaType } from "@/lib/zodSchemas";
import { createProduct, updateProduct, uploadProductImage } from "@/app/actions/product.action";

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string | null;
    inStock: boolean;
  } | null;
  onSuccess: (product: any, isEdit: boolean) => void;
}

const CATEGORIES = ["Bridal", "Practice", "Nail/Care", "Stain Oil"];

export function ProductForm({ open, onOpenChange, product, onSuccess }: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const isEdit = !!product;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormSchemaType>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      category: "",
      imageUrl: "",
      inStock: true,
    },
  });

  // Pre-fill form when product changes (editing mode)
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        imageUrl: product.imageUrl || "",
        inStock: product.inStock,
      });
      setPreviewUrl(product.imageUrl || "");
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        imageUrl: "",
        inStock: true,
      });
      setPreviewUrl("");
    }
  }, [product, reset, open]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Direct size / type validations
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (png, jpg, jpeg)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB");
      return;
    }

    // Set temporary local blob preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadProductImage(formData);
      if (result.success && result.url) {
        setValue("imageUrl", result.url, { shouldValidate: true });
        toast.success("Image uploaded successfully");
      } else {
        toast.error(result.error || "Failed to upload image");
        setPreviewUrl(product?.imageUrl || "");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during file upload.");
      setPreviewUrl(product?.imageUrl || "");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: ProductFormSchemaType) => {
    setSubmitting(true);
    try {
      let res;
      if (isEdit && product) {
        res = await updateProduct(product.id, values);
      } else {
        res = await createProduct(values);
      }

      if (res.success && res.product) {
        toast.success(
          isEdit
            ? "Product updated successfully"
            : "Product created successfully"
        );
        onSuccess(res.product, isEdit);
        onOpenChange(false);
        reset();
        setPreviewUrl("");
      } else {
        toast.error(res.error || "Something went wrong saving the product");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to save product details");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-[#FDFBF7] border-l border-[#EBE4DC] overflow-y-auto p-6 font-sans flex flex-col gap-6">
        <SheetHeader className="p-0">
          <SheetTitle className="font-serif text-2xl font-bold text-[#4E3E2F]">
            {isEdit ? "Edit Product Details" : "Add New Product"}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Fill in product attributes below. Click save to publish changes to the inventory.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-1 pb-6">
          {/* Product Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold text-[#5C4D3E]">
              Product Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Premium Bridal Henna Cone"
              className="bg-[#FDFBF7] border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-lg h-9"
              {...register("name")}
            />
            {errors.name && (
              <span className="text-[11px] font-semibold text-rose-600 block">
                {errors.name.message}
              </span>
            )}
          </div>

          {/* Price & Stock Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-xs font-semibold text-[#5C4D3E]">
                Price (₹)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8C7A6B]">
                  ₹
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="250"
                  className="pl-7 bg-[#FDFBF7] border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-lg h-9"
                  {...register("price", { valueAsNumber: true })}
                />
              </div>
              {errors.price && (
                <span className="text-[11px] font-semibold text-rose-600 block">
                  {errors.price.message}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-xs font-semibold text-[#5C4D3E]">
                Stock Units
              </Label>
              <Input
                id="stock"
                type="number"
                placeholder="45"
                className="bg-[#FDFBF7] border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-lg h-9"
                {...register("stock", { valueAsNumber: true })}
              />
              {errors.stock && (
                <span className="text-[11px] font-semibold text-rose-600 block">
                  {errors.stock.message}
                </span>
              )}
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-xs font-semibold text-[#5C4D3E]">
              Category
            </Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <span className="text-[11px] font-semibold text-rose-600 block">
                {errors.category.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs font-semibold text-[#5C4D3E]">
              Description
            </Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="List product ingredients, application tips, storage guidelines, and staining profile..."
              className="bg-[#FDFBF7] border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-lg resize-none min-h-[90px]"
              {...register("description")}
            />
            {errors.description && (
              <span className="text-[11px] font-semibold text-rose-600 block">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* Image Upload Component */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#5C4D3E] block">
              Product Thumbnail
            </Label>
            
            {previewUrl ? (
              <div className="relative group rounded-xl border border-[#EBE4DC] overflow-hidden aspect-video bg-[#FAF6F0] flex items-center justify-center shadow-xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Product preview"
                  className="h-full w-full object-cover"
                />
                
                {uploading ? (
                  <div className="absolute inset-0 bg-[#4E3E2F]/40 backdrop-blur-xs flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-[#FAF6F0]" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <Label
                      htmlFor="image-file"
                      className="cursor-pointer bg-[#FDFBF7] hover:bg-[#FAF6F0] text-xs font-semibold text-[#4E3E2F] px-3 py-1.5 rounded-lg shadow-xs transition-colors"
                    >
                      Change Image
                    </Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="xs"
                      onClick={() => {
                        setPreviewUrl("");
                        setValue("imageUrl", "");
                      }}
                      className="rounded-lg shadow-xs"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative rounded-xl border border-dashed border-[#EBE4DC] bg-[#FAF6F0]/40 hover:bg-[#FAF6F0]/60 transition-colors flex flex-col items-center justify-center p-6 text-center shadow-2xs">
                {uploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                ) : (
                  <UploadCloud className="h-8 w-8 text-[#8C7A6B]/50 mb-2" />
                )}
                <span className="text-xs font-semibold text-[#5C4D3E] mb-0.5">
                  {uploading ? "Saving asset..." : "Upload product image"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  PNG, JPG, JPEG up to 5MB
                </span>
                <input
                  type="file"
                  id="image-file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            )}
            
            {errors.imageUrl && (
              <span className="text-[11px] font-semibold text-rose-600 block">
                {errors.imageUrl.message}
              </span>
            )}
            {/* hidden form field for the imageUrl string */}
            <input type="hidden" {...register("imageUrl")} />
          </div>

          {/* Active Availability Toggle (inStock) */}
          <div className="flex items-center justify-between bg-[#FAF6F0]/45 border border-[#EBE4DC] p-3 rounded-lg">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-[#4E3E2F]">Live Visibility</span>
              <span className="text-[10px] text-muted-foreground">
                Instantly toggle storefront availability.
              </span>
            </div>
            <Controller
              name="inStock"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {/* Submit Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0]"
              disabled={submitting || uploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={submitting || uploading}
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Saving...
                </div>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
