"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Booking } from "@/lib/zodSchemas";
import { getStatusStyle } from "@/lib/utils";

interface CalendarViewProps {
  bookings: Booking[];
  onView: (b: Booking) => void;
}

export function CalendarView({ bookings, onView }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const buildCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startWeekDay = firstDay.getDay(); // 0: Sun, 1: Mon
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Fill prev month days padding
    for (let i = startWeekDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Fill current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Pad next month days to fit exactly 42 slots (6 weeks)
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = buildCalendarDays();

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  return (
    <div className="bg-[#FDFBF7] border border-[#EBE4DC] rounded-2xl p-5 shadow-xs">
      {/* Calendar Month Navigation Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-xl font-bold text-[#4E3E2F]">
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            className="h-9 w-9 border-[#EBE4DC] hover:bg-[#FAF6F0]/50 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 text-[#8C7A6B]" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-9 w-9 border-[#EBE4DC] hover:bg-[#FAF6F0]/50 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4 text-[#8C7A6B]" />
          </Button>
        </div>
      </div>

      {/* Grid Layout of Days */}
      <div className="grid grid-cols-7 gap-2 text-center font-semibold text-xs text-[#8C7A6B] border-b border-[#EBE4DC]/60 pb-3 mb-2 select-none">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map(({ date, isCurrentMonth }, index) => {
          const dayBookings = bookings.filter((b) => {
            const bDate = new Date(b.eventDate);
            return (
              bDate.getDate() === date.getDate() &&
              bDate.getMonth() === date.getMonth() &&
              bDate.getFullYear() === date.getFullYear()
            );
          });

          return (
            <div
              key={index}
              className={`min-h-[90px] border border-[#EBE4DC]/50 rounded-xl p-2 flex flex-col gap-1.5 transition-all text-left ${
                isCurrentMonth
                  ? "bg-white"
                  : "bg-[#FAF6F0]/30 text-muted-foreground/60"
              }`}
            >
              <span
                className={`text-[10px] font-bold ${
                  isCurrentMonth ? "text-[#4E3E2F]" : "text-muted-foreground/50"
                }`}
              >
                {date.getDate()}
              </span>

              {/* Badge elements of bookings for this day */}
              <div className="flex flex-col gap-1 overflow-y-auto max-h-[70px] no-scrollbar">
                {dayBookings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onView(b)}
                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md border text-left truncate cursor-pointer block select-none ${getStatusStyle(
                      b.status,
                    )}`}
                  >
                    {b.customerName.split(" ")[0]} ({b.eventType.split(" ")[0]})
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
