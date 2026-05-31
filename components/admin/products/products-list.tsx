"use client";

import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Package, AlertCircle, ImageIcon } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductForm } from "./product-form";
import { toggleProductStock, deleteProduct } from "@/app/actions/product.action";

// Predefined list of products matched from server actions
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ProductsListProps {
  initialProducts: Product[];
}

const CATEGORIES = ["All", "Bridal", "Practice", "Nail/Care", "Stain Oil"];

export function ProductsList({ initialProducts }: ProductsListProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("stock-asc"); // Default sorting low stock first

  // Drawer / Form state
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Optimistic UI toggle for product inStock status
  const handleToggleStock = async (productId: string, currentInStock: boolean) => {
    const nextInStock = !currentInStock;

    // Optimistically update status
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: nextInStock } : p))
    );

    try {
      const res = await toggleProductStock(productId, nextInStock);
      if (res.success) {
        toast.success(`Product is now ${nextInStock ? "visible on storefront" : "hidden from storefront"}`);
      } else {
        toast.error(res.error || "Failed to update availability");
        // Rollback on failure
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, inStock: currentInStock } : p))
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Restoring previous status.");
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, inStock: currentInStock } : p))
      );
    }
  };

  // Delete product action
  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await deleteProduct(productId);
      if (res.success) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        toast.error(res.error || "Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  // Callback when product is added or edited successfully
  const handleFormSuccess = (savedProduct: any, isEdit: boolean) => {
    // Format saved product dates
    const formatted: Product = {
      ...savedProduct,
      createdAt: new Date(savedProduct.createdAt),
      updatedAt: new Date(savedProduct.updatedAt),
    };

    if (isEdit) {
      setProducts((prev) =>
        prev.map((p) => (p.id === formatted.id ? formatted : p))
      );
    } else {
      setProducts((prev) => [formatted, ...prev]);
    }
  };

  // Client side filtering & sorting
  const filteredProducts = products
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || p.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "stock-asc":
          return a.stock - b.stock;
        case "stock-desc":
          return b.stock - a.stock;
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#4E3E2F]">
            Products Directory
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your henna cones inventory, update stock levels, toggle shop visibility, and upload visuals.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setFormOpen(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-1.5 self-start sm:self-auto rounded-lg shadow-xs"
        >
          <Plus className="h-4 w-4 shrink-0" />
          Add New Product
        </Button>
      </div>

      {/* 2. Control Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#FDFBF7] border border-[#EBE4DC] p-4 rounded-xl shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C7A6B]/50 shrink-0" />
          <Input
            placeholder="Search products by name, category, or ingredients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-[#FDFBF7] border-[#EBE4DC] text-sm text-[#4E3E2F] placeholder:text-[#8C7A6B]/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 rounded-lg h-9"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap gap-3 shrink-0">
          <div className="w-[140px] sm:w-[160px]">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === "All" ? "All Categories" : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-[160px] sm:w-[180px]">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stock-asc">Stock: Low to High</SelectItem>
                <SelectItem value="stock-desc">Stock: High to Low</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest Added</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 3. Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center border border-dashed border-[#EBE4DC] bg-[#FDFBF7]/50 rounded-2xl p-16 text-center shadow-3xs">
          <Package className="h-12 w-12 text-[#8C7A6B]/40 mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#4E3E2F]">No products found</h3>
          <p className="text-xs text-muted-foreground max-w-xs mt-1">
            Try adjusting your search terms or filters, or add a brand new product to start listing.
          </p>
          <Button
            variant="outline"
            className="mt-4 border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] rounded-lg"
            onClick={() => {
              setSearch("");
              setCategoryFilter("All");
              setSortOption("stock-asc");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            // Stock Badge calculation
            let stockBadge = (
              <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-3xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
                In Stock ({product.stock})
              </Badge>
            );
            if (product.stock === 0) {
              stockBadge = (
                <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-3xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
                  Out of Stock
                </Badge>
              );
            } else if (product.stock < 10) {
              stockBadge = (
                <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-3xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-0.5">
                  <AlertCircle className="h-2.5 w-2.5 shrink-0" />
                  Low Stock ({product.stock})
                </Badge>
              );
            }

            return (
              <Card
                key={product.id}
                className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group rounded-xl"
              >
                {/* Product Image Area */}
                <div className="relative aspect-square w-full bg-[#FAF6F0] overflow-hidden border-b border-[#EBE4DC]/60">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full flex flex-col items-center justify-center text-[#8C7A6B]/40">
                      <ImageIcon className="h-10 w-10 stroke-1" />
                      <span className="text-[10px] mt-1 font-semibold">No Preview Image</span>
                    </div>
                  )}

                  {/* Stock Status Overlay Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    {stockBadge}
                  </div>

                  {/* Live Status Overlay Badge */}
                  <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1 bg-[#4E3E2F]/80 backdrop-blur-xs text-[#FDFBF7] text-4xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-2xs">
                    {product.inStock ? (
                      <>
                        <Eye className="h-3 w-3 shrink-0" />
                        Live Check
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 shrink-0" />
                        Hidden
                      </>
                    )}
                  </div>
                </div>

                {/* Details Group */}
                <CardHeader className="p-4 pb-2 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif text-base font-bold text-[#4E3E2F] leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-4xs text-muted-foreground uppercase tracking-widest font-extrabold block">
                    {product.category}
                  </span>
                </CardHeader>

                <CardContent className="p-4 pt-0 pb-3 flex-1 flex flex-col justify-between gap-3">
                  <p className="text-[11.5px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {product.description || "No description provided for this product."}
                  </p>
                  
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-[11px] font-semibold text-muted-foreground">Price</span>
                    <span className="text-base font-bold text-primary">
                      ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </CardContent>

                {/* Actions Footer */}
                <CardFooter className="border-t border-[#EBE4DC]/50 p-4 pt-3 flex items-center justify-between bg-[#FAF6F0]/20 gap-2 shrink-0">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => {
                        setEditingProduct(product);
                        setFormOpen(true);
                      }}
                      className="border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] rounded-md flex items-center gap-1 px-2.5 h-7 text-[11px]"
                    >
                      <Edit2 className="h-3 w-3 shrink-0" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteProduct(product.id, product.name)}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md size-7 flex items-center justify-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Availability Toggle Switch */}
                  <div className="flex items-center gap-2">
                    <span className="text-4xs text-[#8C7A6B] font-bold uppercase tracking-wider">
                      Live
                    </span>
                    <Switch
                      checked={product.inStock}
                      onCheckedChange={() => handleToggleStock(product.id, product.inStock)}
                      className="scale-90"
                    />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Slide-out Product Config Form */}
      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
