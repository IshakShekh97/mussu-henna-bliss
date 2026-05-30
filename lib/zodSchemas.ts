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

export type bookingFormSchemaType = z.infer<typeof bookingSchema>;
export type checkoutFormSchemaType = z.infer<typeof checkoutSchema>;
