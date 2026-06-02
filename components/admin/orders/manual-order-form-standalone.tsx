"use client";

import React, { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Plus, Trash2, Info } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { manualOrderCreateSchema, type manualOrderCreateSchemaType } from "@/lib/zodSchemas";
import { createManualOrder } from "@/app/actions/order.action";

interface ProductType {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface ManualOrderFormStandaloneProps {
  products: ProductType[];
}

export function ManualOrderFormStandalone({ products }: ManualOrderFormStandaloneProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<manualOrderCreateSchemaType>({
    resolver: zodResolver(manualOrderCreateSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      status: "PENDING",
      paymentMethod: "COD",
      items: [{ productId: "", quantity: 1 }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch items array to calculate total dynamically
  const watchedItems = watch("items");

  // Calculate live total price
  const calculateTotal = () => {
    let sum = 0;
    watchedItems.forEach((item) => {
      if (item.productId) {
        const prod = products.find((p) => p.id === item.productId);
        if (prod) {
          sum += prod.price * (item.quantity || 0);
        }
      }
    });
    return sum;
  };

  const onSubmit = (data: manualOrderCreateSchemaType) => {
    // Basic pre-submit check: make sure no product has insufficient stock
    for (const item of data.items) {
      const prod = products.find((p) => p.id === item.productId);
      if (prod && prod.stock < item.quantity) {
        toast.error(`Insufficient stock for ${prod.name}. Available: ${prod.stock}`);
        return;
      }
    }

    startTransition(async () => {
      const response = await createManualOrder(data);

      if (response.success) {
        toast.success("Manual order logged successfully!");
        router.push("/admin/orders");
        router.refresh();
      } else {
        toast.error(response.error || "Failed to log order.");
      }
    });
  };

  return (
    <div className="w-full font-sans space-y-6">
      {/* Header and navigation */}
      <div className="space-y-1.5 pb-6 border-b border-[#EBE4DC]">
        <div className="flex items-center gap-2 mb-2">
          <Link
            href="/admin/orders"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7A6B] hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Orders
          </Link>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#4E3E2F]">
          Log Manual Order
        </h1>
        <p className="text-xs text-muted-foreground">
          Log phone-in orders or special client requests manually.
        </p>
      </div>

      {/* Main Form container grid */}
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Static Helper Text Banner */}
          <div className="bg-[#FAF6EE] border border-[#E9DFD0] rounded-2xl p-4 flex gap-3 text-xs text-[#5C4D3E] leading-relaxed shadow-2xs">
            <Info className="h-5 w-5 text-[#8C7A6B] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Fulfillment Info</span>
              <p>
                Logging a manual order automatically decrements the stock counts of selected products. 
                Flipping the status to <strong>FULFILLED</strong> dispatches an automated HTML invoice to the client's email.
              </p>
            </div>
          </div>

          {/* Customer Details section */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Customer Details
            </h2>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field data-invalid={!!errors.customerName}>
                <FieldLabel htmlFor="manual-name" className="text-xs font-semibold text-[#5C4D3E]">
                  Customer Name *
                </FieldLabel>
                <Input
                  id="manual-name"
                  disabled={isPending}
                  placeholder="Enter name"
                  className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                  {...register("customerName")}
                />
                {errors.customerName && <FieldError errors={[errors.customerName]} />}
              </Field>

              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="manual-phone" className="text-xs font-semibold text-[#5C4D3E]">
                  Phone Number *
                </FieldLabel>
                <Input
                  id="manual-phone"
                  disabled={isPending}
                  placeholder="E.g. 9876543210"
                  className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                  {...register("phone")}
                />
                {errors.phone && <FieldError errors={[errors.phone]} />}
              </Field>

              <Field data-invalid={!!errors.email} className="md:col-span-2">
                <FieldLabel htmlFor="manual-email" className="text-xs font-semibold text-[#5C4D3E]">
                  Email Address *
                </FieldLabel>
                <Input
                  type="email"
                  id="manual-email"
                  disabled={isPending}
                  placeholder="customer@email.com"
                  className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                  {...register("email")}
                />
                {errors.email && <FieldError errors={[errors.email]} />}
              </Field>

              <Field data-invalid={!!errors.address} className="md:col-span-2">
                <FieldLabel htmlFor="manual-address" className="text-xs font-semibold text-[#5C4D3E]">
                  Fulfillment Address *
                </FieldLabel>
                <Textarea
                  id="manual-address"
                  disabled={isPending}
                  placeholder="12 Whitefield Road, Bengaluru - 560066"
                  rows={3}
                  className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs leading-relaxed"
                  {...register("address")}
                />
                {errors.address && <FieldError errors={[errors.address]} />}
              </Field>
            </FieldGroup>
          </div>

          {/* Product Items Selection Section */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-[#EBE4DC]/60 pb-3">
              <h2 className="font-serif text-lg font-bold text-[#4E3E2F]">
                Order Items
              </h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ productId: "", quantity: 1 })}
                className="border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] text-xs h-8 gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Item
              </Button>
            </div>

            {fields.length === 0 && (
              <div className="text-center py-6 text-xs text-muted-foreground font-semibold">
                No items added. Add at least one item below.
              </div>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => {
                const currentProductId = watchedItems[index]?.productId;
                const selectedProduct = products.find((p) => p.id === currentProductId);

                return (
                  <div key={field.id} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end border-b border-[#EBE4DC]/30 pb-4 last:border-b-0 last:pb-0">
                    {/* Select Product */}
                    <div className="w-full sm:flex-1">
                      <Controller
                        name={`items.${index}.productId`}
                        control={control}
                        render={({ field: selectField }) => (
                          <Field className="space-y-1">
                            <FieldLabel className="text-[10px] font-bold text-[#8C7A6B] uppercase">Product *</FieldLabel>
                            <Select
                              value={selectField.value}
                              onValueChange={selectField.onChange}
                              disabled={isPending}
                            >
                              <SelectTrigger className="bg-white border-[#EBE4DC] h-10 text-xs">
                                <SelectValue placeholder="Select product" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-[#EBE4DC]">
                                {products.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.name} (₹{p.price})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </Field>
                        )}
                      />
                    </div>

                    {/* Stock indicator info */}
                    {selectedProduct && (
                      <div className="text-[10px] text-[#8C7A6B] font-medium sm:pb-3.5">
                        Stock: <span className="font-bold text-[#4E3E2F]">{selectedProduct.stock}</span>
                      </div>
                    )}

                    {/* Input Quantity */}
                    <div className="w-full sm:w-24">
                      <Field className="space-y-1">
                        <FieldLabel className="text-[10px] font-bold text-[#8C7A6B] uppercase">Qty *</FieldLabel>
                        <Input
                          type="number"
                          min="1"
                          disabled={isPending}
                          className="border-[#EBE4DC] bg-white rounded-lg focus-visible:ring-primary/40 text-xs h-10"
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                        />
                      </Field>
                    </div>

                    {/* Delete Item */}
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 h-10 w-10 shrink-0 self-end"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Ledger Settings & Actions */}
        <div className="space-y-6">
          {/* Log Ledger settings */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-5">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Fulfillment Settings
            </h2>
            <FieldGroup className="space-y-4">
              {/* Status */}
              <Controller
                name="status"
                control={control}
                render={({ field: statusField }) => (
                  <Field className="space-y-1">
                    <FieldLabel className="text-xs font-semibold text-[#5C4D3E]">Initial Status</FieldLabel>
                    <Select
                      value={statusField.value}
                      onValueChange={statusField.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger className="bg-white border-[#EBE4DC] h-10 text-xs">
                        <SelectValue placeholder="Select initial status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#EBE4DC]">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                        <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />

              {/* Payment Method */}
              <Controller
                name="paymentMethod"
                control={control}
                render={({ field: methodField }) => (
                  <Field className="space-y-1">
                    <FieldLabel className="text-xs font-semibold text-[#5C4D3E]">Payment Mode</FieldLabel>
                    <Select
                      value={methodField.value}
                      onValueChange={methodField.onChange}
                      disabled={isPending}
                    >
                      <SelectTrigger className="bg-white border-[#EBE4DC] h-10 text-xs">
                        <SelectValue placeholder="Select payment mode" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-[#EBE4DC]">
                        <SelectItem value="COD">Cash on Delivery (COD)</SelectItem>
                        <SelectItem value="PREPAID">Online Prepaid</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                )}
              />
            </FieldGroup>
          </div>

          {/* Pricing Total Summary card */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Order Summary
            </h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping Fee</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#4E3E2F] pt-2 border-t border-[#EBE4DC]/40">
                <span>Total Amount</span>
                <span>₹{calculateTotal().toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="bg-[#FDFBF7] border border-[#EBE4DC] shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#4E3E2F] border-b border-[#EBE4DC]/60 pb-3">
              Publishing Options
            </h2>
            <div className="flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-xl font-semibold shadow-md shadow-primary/10 select-none active:scale-[0.99] transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Create Order"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/orders")}
                className="w-full border-[#EBE4DC] text-[#4E3E2F] hover:bg-[#FAF6F0] h-11 rounded-xl"
                disabled={isPending}
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
