"use client";

import React, { useState } from "react";
import { Search, Plus, Edit2, Trash2, Eye, EyeOff, Package, AlertCircle, ImageIcon, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
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
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("stock-asc"); // Default sorting low stock first

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Open delete dialog handler
  const handleDeleteProduct = (productId: string, name: string) => {
    setProductToDelete({ id: productId, name });
  };

  // Perform actual product deletion from the dialog
  const confirmDeleteProduct = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteProduct(productToDelete.id);
      if (res.success) {
        toast.success("Product deleted successfully");
        setProducts((prev) => prev.filter((p) => p.id !== productToDelete.id));
        setProductToDelete(null);
      } else {
        toast.error(res.error || "Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
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
          onClick={() => router.push("/admin/products/create")}
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
        <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl shadow-sm overflow-hidden w-full">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#FAF6F0]/60 border-b border-[#EBE4DC]/60">
                <TableRow className="hover:bg-transparent border-[#EBE4DC]/60">
                  <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4 pl-6">Product</TableHead>
                  <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Category</TableHead>
                  <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Price</TableHead>
                  <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Stock Status</TableHead>
                  <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4">Live Storefront</TableHead>
                  <TableHead className="text-xs font-bold text-[#8C7A6B] uppercase tracking-wider py-4 pr-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
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
                    <TableRow
                      key={product.id}
                      className="group border-[#EBE4DC]/40 hover:bg-[#FAF6F0]/30 transition-colors animate-fade-in"
                    >
                      {/* Product Thumbnail & Name */}
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-10 w-10 rounded-lg object-cover border border-[#EBE4DC]"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center rounded-lg border border-dashed border-[#EBE4DC] bg-[#FAF6F0] text-[#8C7A6B]/40">
                              <ImageIcon className="h-4 w-4" />
                            </div>
                          )}
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-xs text-[#4E3E2F]">
                              {product.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground line-clamp-1 max-w-[240px]" title={product.description}>
                              {product.description || "No description"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell className="py-4 text-xs text-[#5C4D3E]">
                        <span className="bg-[#FAF6F0] px-2 py-0.5 rounded border border-[#EBE4DC]/80 font-semibold uppercase text-[10px] tracking-wider">
                          {product.category}
                        </span>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="py-4 text-xs font-bold text-[#4E3E2F]">
                        ₹{product.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </TableCell>

                      {/* Stock Badge */}
                      <TableCell className="py-4 text-xs">
                        {stockBadge}
                      </TableCell>

                      {/* Live Storefront Toggle Switch */}
                      <TableCell className="py-4 text-xs">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.inStock}
                            onCheckedChange={() => handleToggleStock(product.id, product.inStock)}
                            className="scale-90"
                          />
                          <span className="text-4xs text-[#8C7A6B] font-bold uppercase tracking-wider">
                            {product.inStock ? "Live" : "Hidden"}
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="py-4 pr-6 text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => router.push(`/admin/products/${product.id}/edit`)}
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
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={productToDelete !== null} onOpenChange={(open) => { if (!open) setProductToDelete(null); }}>
        <DialogContent className="max-w-md border border-[#EBE4DC] rounded-2xl p-6 shadow-lg text-center gap-5 bg-[#FDFBF7]">
          <DialogHeader className="items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 border border-rose-200 mb-2">
              <AlertTriangle className="h-6 w-6 text-rose-600" />
            </div>
            <DialogTitle className="font-serif text-xl font-bold text-[#4E3E2F]">
              Delete Product?
            </DialogTitle>
            <DialogDescription className="text-xs mt-1 leading-relaxed text-[#8C7A6B]">
              Are you sure you want to permanently delete <span className="font-semibold text-[#4E3E2F]">"{productToDelete?.name}"</span>?
              This action is permanent and cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-3 mt-4 w-full">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setProductToDelete(null)}
              className="border-[#EBE4DC] text-[#8C7A6B] hover:bg-[#FAF6F0] flex-1 py-5 rounded-xl cursor-pointer disabled:opacity-50"
            >
              Cancel
            </Button>
            <Button
              disabled={isDeleting}
              onClick={confirmDeleteProduct}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold flex-1 py-5 rounded-xl cursor-pointer flex items-center justify-center gap-1.5"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Product
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
