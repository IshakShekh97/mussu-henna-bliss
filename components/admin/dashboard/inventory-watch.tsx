import React from "react";
import { Package, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInventoryWatch } from "@/app/actions/admin.action";

export async function InventoryWatch() {
  const result = await getInventoryWatch();
  const lowStockProducts = result.success && result.data ? result.data : [];

  return (
    <Card className="bg-[#FDFBF7] border-[#EBE4DC] shadow-xs flex flex-col">
      <CardHeader className="border-b border-[#EBE4DC]/60 pb-4">
        <CardTitle className="font-serif text-xl font-bold text-[#4E3E2F]">
          Urgent Inventory Watch
        </CardTitle>
        <CardDescription className="text-xs">
          Cones and tools with low stock. Replenish immediately.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 flex-1">
        {lowStockProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-[#8C7A6B]">
            <Package className="h-8 w-8 text-[#8C7A6B]/50 mb-2" />
            <span className="font-semibold text-xs">Stock is healthy</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">No products under 15 remaining items.</span>
          </div>
        ) : (
          <div className="divide-y divide-[#EBE4DC]/50">
            {lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 flex items-center justify-between gap-3 transition-colors hover:bg-[#FAF6F0]/40"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-serif font-bold text-xs shadow-xs border border-primary/20">
                    {product.name[0]}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold text-[#4E3E2F] truncate">
                      {product.name}
                    </span>
                    <span className="text-4xs text-muted-foreground uppercase tracking-wider font-bold">
                      {product.category}
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {product.stock === 0 ? (
                    <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-3xs font-extrabold px-2 py-1 rounded-md uppercase tracking-wider">
                      Out of Stock
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-50 text-rose-700 border border-rose-200 text-3xs font-extrabold px-2 py-1 rounded-md uppercase tracking-wider flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 shrink-0" />
                      Only {product.stock} left
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
