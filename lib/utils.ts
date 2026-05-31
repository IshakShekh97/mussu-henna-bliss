import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Booking } from "./zodSchemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusStyle = (status: string) => {
  if (status === "PENDING_QUOTE")
    return "bg-amber-50 text-amber-700 border-amber-200";
  if (status === "QUOTED") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "ACCEPTED")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (status === "COMPLETED")
    return "bg-zinc-100 text-zinc-700 border-zinc-200";
  return "bg-rose-50 text-rose-700 border-rose-200"; // Cancelled / Fallback
};

export const getStatusLabel = (status: string) => {
  if (status === "PENDING_QUOTE") return "Requested";
  if (status === "QUOTED") return "Quoted";
  if (status === "ACCEPTED") return "Accepted";
  if (status === "COMPLETED") return "Completed";
  if (status === "CANCELLED") return "Cancelled";
  return status;
};

export const getWhatsAppLink = (b: Booking) => {
  const formattedDate = new Date(b.eventDate).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(b.eventDate).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const priceText = b.quotedPrice ? `₹${b.quotedPrice}` : "To be calculated";
  const notesText = b.artistNotes ? `\n\n📝 *Notes:* ${b.artistNotes}` : "";
  const trackingLink = `${process.env.NEXT_PUBLIC_API_URL || "https://mussu-henna-bliss.vercel.app"}/status/booking-${b.id}`;

  const text = `Hi *${b.customerName}*, Muskan here from *Mussu's Henna Bliss!* ✨

Thank you for booking with us! I have reviewed your request for *${b.eventType}* and updated your booking details:

📅 *Event Date:* ${formattedDate}
⏰ *Event Time:* ${formattedTime}
📍 *Location:* ${b.location}
👥 *Guest Count:* ${b.guestCount || "N/A"} people
💰 *Custom Quote:* ${priceText}${notesText}

🔗 *Live Status Link:* Review your booking, track the status, and lock your slot here:
${trackingLink}

Feel free to reach out if you have any questions or details to update. Looking forward to creating beautiful henna designs for you! 💕`;

  return `https://wa.me/${b.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
};
