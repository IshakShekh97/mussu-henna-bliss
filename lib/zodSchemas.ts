import z from "zod";

export const bookingSchema = z.object({
  occasion: z.enum(["bridal", "guest", "festive"]),
  date: z.date({
    message: "Please select a date for your event.",
  }),
  time: z.string().min(1, "Please select a start time."),
  location: z.string().min(5, "Event location must be at least 5 characters."),
  peopleCount: z.number().min(1, "At least 1 person is required."),
  vision: z
    .string()
    .min(10, "Please describe your vision in at least 10 characters.")
    .max(1000, "Vision description cannot exceed 1000 characters."),
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
  whatsapp: z
    .string()
    .min(10, "WhatsApp number must be at least 10 digits.")
    .regex(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email address."),
});

export const checkoutSchema = z.object({
  customerName: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(50, "Name cannot exceed 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Please enter a valid 10-digit Indian mobile number",
    ),
  address: z
    .string()
    .min(
      10,
      "Please provide a more detailed shipping address (min 10 characters)",
    )
    .max(300, "Address is too long"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    }),
  ),
  totalAmount: z.number().min(0, "Total amount must be a positive number"),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const manualBookingSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits.")
    .regex(/^\+?[0-9\s-]{10,15}$/, "Please enter a valid phone number."),
  eventType: z.string().min(1, "Please select an event occasion."),
  date: z.date({
    error: "Please select an event date",
  }),
  time: z.string().min(1, "Please select an event start time."),
  location: z.string().min(5, "Venue location must be at least 5 characters."),
  guestCount: z.number().min(1, "Guest count must be at least 1.").optional(),
  designNotes: z
    .string()
    .max(1000, "Design notes cannot exceed 1000 characters.")
    .optional(),
  status: z.enum(["PENDING_QUOTE", "ACCEPTED"]),
  quotedPrice: z
    .number()
    .min(0, "Quoted price must be a non-negative number.")
    .optional(),
  artistNotes: z
    .string()
    .max(1000, "Artist notes cannot exceed 1000 characters.")
    .optional(),
});

export interface Booking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: Date | string;
  location: string;
  guestCount?: number | null;
  designNotes?: string | null;
  quotedPrice?: number | null;
  artistNotes?: string | null;
  status: string; // PENDING_QUOTE, QUOTED, ACCEPTED, COMPLETED, CANCELLED
  createdAt: Date | string;
}

export const editBookingSchema = z.object({
  customerName: z
    .string()
    .min(2, "Customer name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 digits."),
  eventType: z.string().min(1, "Please select an event occasion."),
  date: z.date({ error: "Please select an event date" }),
  time: z.string().min(1, "Please select an event start time."),
  location: z.string().min(5, "Venue location must be at least 5 characters."),
  guestCount: z
    .number()
    .min(1, "Guest count must be at least 1.")
    .optional()
    .nullable(),
  designNotes: z.string().max(1000).optional().nullable(),
  status: z.enum([
    "PENDING_QUOTE",
    "QUOTED",
    "ACCEPTED",
    "COMPLETED",
    "CANCELLED",
  ]),
  quotedPrice: z
    .number()
    .min(0, "Quoted price must be a non-negative number.")
    .optional()
    .nullable(),
  artistNotes: z.string().max(1000).optional().nullable(),
});

export type editBookingSchemaType = z.infer<typeof editBookingSchema>;
export type LoginFormSchemaType = z.infer<typeof loginSchema>;
export type bookingFormSchemaType = z.infer<typeof bookingSchema>;
export type checkoutFormSchemaType = z.infer<typeof checkoutSchema>;
export type manualBookingSchemaType = z.infer<typeof manualBookingSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  price: z.number().min(0, "Price must be a positive number."),
  stock: z.number().int().min(0, "Stock must be a non-negative integer."),
  category: z.string().min(1, "Please select a category."),
  imageUrl: z.string().min(1, "Image is required."),
  inStock: z.boolean(),
});

export type ProductFormSchemaType = z.infer<typeof productSchema>;

