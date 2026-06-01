"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { productSchema, ProductFormSchemaType } from "@/lib/zodSchemas";
import { createProduct, updateProduct } from "@/app/actions/product.action";
import { CldUploadWidget } from "next-cloudinary";

interface ProductFormStandaloneProps {
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
}

const CATEGORIES = ["Bridal", "Practice", "Nail/Care", "Stain Oil"];

export function ProductFormStandalone({ product }: ProductFormStandaloneProps) {
  const router = useRouter();
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
    }
  }, [product, reset]);

  const onSubmit = async (values: ProductFormSchemaType) => {
    setSubmitting(true);
    try {
      let res;
      if (isEdit && product) {
        res = await updateProduct(product.id, values);
      } else {
        res = await createProduct(values);
      }

      if (res.success) {
        toast.success(
          isEdit
            ? "Product updated successfully"
            : "Product created successfully",
        );
        router.push("/admin/products");
        router.refresh();
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
    <div className="w-full font-sans space-y-6">
      {/* Top Navigation & Title Header */}
      <div className="space-y-1.5 pb-6 border-b border-[#EBE4DC]">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/admin/products"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7A6B] hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Catalog
          </Link>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#4E3E2F]">
          {isEdit ? "Edit Product Details" : "Create New Product"}
        </h1>
        <p className="text-xs text-muted-foreground">
          Fill in product details below to {isEdit ? "update" : "publish"} item
          to storefront inventory.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Section */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Basic Information
            </h2>
            <FieldGroup className="space-y-5">
              {/* Product Name */}
              <Field data-invalid={!!errors.name}>
                <FieldLabel
                  htmlFor="name"
                  className="text-xs font-semibold text-[#5C4D3E]"
                >
                  Product Name *
                </FieldLabel>
                <Input
                  id="name"
                  placeholder="e.g., Premium Bridal Henna Cone"
                  disabled={submitting}
                  className="bg-white border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus-visible:ring-primary/40 focus-visible:border-primary rounded-lg h-10"
                  {...register("name")}
                />
                {errors.name && <FieldError errors={[errors.name]} />}
              </Field>

              {/* Category Dropdown */}
              <Field data-invalid={!!errors.category}>
                <FieldLabel
                  htmlFor="category"
                  className="text-xs font-semibold text-[#5C4D3E]"
                >
                  Category *
                </FieldLabel>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={submitting}
                    >
                      <SelectTrigger
                        id="category"
                        className="bg-white border-[#EBE4DC] h-10"
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#EBE4DC]">
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && <FieldError errors={[errors.category]} />}
              </Field>

              {/* Description */}
              <Field data-invalid={!!errors.description}>
                <FieldLabel
                  htmlFor="description"
                  className="text-xs font-semibold text-[#5C4D3E]"
                >
                  Description *
                </FieldLabel>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="List product ingredients, application tips, storage guidelines, and staining profile..."
                  disabled={submitting}
                  className="bg-white border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus-visible:ring-primary/40 focus-visible:border-primary rounded-lg resize-none min-h-[120px] leading-relaxed"
                  {...register("description")}
                />
                {errors.description && (
                  <FieldError errors={[errors.description]} />
                )}
              </Field>
            </FieldGroup>
          </div>

          {/* Pricing & Inventory Section */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Pricing & Inventory
            </h2>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Price */}
              <Field data-invalid={!!errors.price}>
                <FieldLabel
                  htmlFor="price"
                  className="text-xs font-semibold text-[#5C4D3E]"
                >
                  Price (₹) *
                </FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#8C7A6B]">
                    ₹
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="250"
                    disabled={submitting}
                    className="pl-7 bg-white border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus-visible:ring-primary/40 focus-visible:border-primary rounded-lg h-10"
                    {...register("price", { valueAsNumber: true })}
                  />
                </div>
                {errors.price && <FieldError errors={[errors.price]} />}
              </Field>

              {/* Stock */}
              <Field data-invalid={!!errors.stock}>
                <FieldLabel
                  htmlFor="stock"
                  className="text-xs font-semibold text-[#5C4D3E]"
                >
                  Stock Units *
                </FieldLabel>
                <Input
                  id="stock"
                  type="number"
                  placeholder="45"
                  disabled={submitting}
                  className="bg-white border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus-visible:ring-primary/40 focus-visible:border-primary rounded-lg h-10"
                  {...register("stock", { valueAsNumber: true })}
                />
                {errors.stock && <FieldError errors={[errors.stock]} />}
              </Field>
            </FieldGroup>
          </div>
        </div>

        {/* Right Column: Media, Visibility & Actions */}
        <div className="space-y-6">
          {/* Image Upload Component */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Product Image
            </h2>
            <Field data-invalid={!!errors.imageUrl} className="space-y-2">
              <FieldLabel className="text-xs font-semibold text-[#5C4D3E] block">
                Upload image *
              </FieldLabel>

              {previewUrl ? (
                <div className="relative group rounded-xl border border-[#EBE4DC] overflow-hidden aspect-video bg-[#FAF6F0] flex items-center justify-center shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <CldUploadWidget
                      uploadPreset={
                        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                        "ml_default"
                      }
                      onSuccess={(results) => {
                        if (
                          results.info &&
                          typeof results.info === "object" &&
                          "secure_url" in results.info
                        ) {
                          const url = results.info.secure_url as string;
                          setValue("imageUrl", url, { shouldValidate: true });
                          setPreviewUrl(url);
                          toast.success("Image uploaded successfully!");
                        }
                        // Fix freeze by restoring scrollability
                        document.body.style.overflow = "unset";
                      }}
                      onClose={() => {
                        // Fix freeze by restoring scrollability on close
                        document.body.style.overflow = "unset";
                      }}
                      onError={(err) => {
                        console.error(err);
                        toast.error("Upload failed");
                      }}
                    >
                      {({ open }) => (
                        <Button
                          type="button"
                          variant="secondary"
                          size="xs"
                          onClick={() => open()}
                          className="bg-[#FDFBF7] hover:bg-[#FAF6F0] text-xs font-semibold text-[#4E3E2F] rounded-lg shadow-xs"
                        >
                          Change Image
                        </Button>
                      )}
                    </CldUploadWidget>
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
                </div>
              ) : (
                <CldUploadWidget
                  uploadPreset={
                    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
                    "ml_default"
                  }
                  onSuccess={(results) => {
                    if (
                      results.info &&
                      typeof results.info === "object" &&
                      "secure_url" in results.info
                    ) {
                      const url = results.info.secure_url as string;
                      setValue("imageUrl", url, { shouldValidate: true });
                      setPreviewUrl(url);
                      toast.success("Image uploaded successfully!");
                    }
                    // Fix freeze by restoring scrollability
                    document.body.style.overflow = "unset";
                  }}
                  onClose={() => {
                    // Fix freeze by restoring scrollability on close
                    document.body.style.overflow = "unset";
                  }}
                  onError={(err) => {
                    console.error(err);
                    toast.error("Upload failed");
                  }}
                >
                  {({ open }) => (
                    <div
                      onClick={() => open()}
                      className="relative rounded-xl border border-dashed border-[#EBE4DC] bg-[#FAF6F0]/40 hover:bg-[#FAF6F0]/60 transition-colors flex flex-col items-center justify-center p-6 text-center shadow-2xs cursor-pointer"
                    >
                      <UploadCloud className="h-8 w-8 text-[#8C7A6B]/50 mb-2" />
                      <span className="text-xs font-semibold text-[#5C4D3E] mb-0.5">
                        Upload product image
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        PNG, JPG, JPEG up to 5MB (Direct to Cloudinary)
                      </span>
                    </div>
                  )}
                </CldUploadWidget>
              )}

              {errors.imageUrl && <FieldError errors={[errors.imageUrl]} />}
              <input type="hidden" {...register("imageUrl")} />
            </Field>
          </div>

          {/* Status & Visibility */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Status & Visibility
            </h2>
            <div className="flex items-center justify-between bg-[#FAF6F0]/45 border border-[#EBE4DC] p-4 rounded-xl">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-[#4E3E2F]">
                  Live Visibility
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Instantly toggle storefront listing availability.
                </span>
              </div>
              <Controller
                name="inStock"
                control={control}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={submitting}
                  />
                )}
              />
            </div>
          </div>

          {/* Publishing Options */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Publishing Options
            </h2>
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold shadow-md shadow-primary/10 select-none active:scale-[0.99] transition-all"
                disabled={submitting}
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                ) : isEdit ? (
                  "Save Changes"
                ) : (
                  "Create Product"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
                className="w-full border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] h-11 rounded-xl"
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
