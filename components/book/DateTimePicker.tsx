"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon, ClockIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateTimePickerProps {
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  time: string;
  onTimeChange: (time: string) => void;
  dateError?: { message?: string };
  timeError?: { message?: string };
}

export function DateTimePicker({
  date,
  onDateChange,
  time,
  onTimeChange,
  dateError,
  timeError,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full">
      {/* Date Field */}
      <Field className="flex-1" data-invalid={!!dateError}>
        <FieldLabel htmlFor="booking-date" className="text-sm font-medium text-foreground mb-1">
          Date
        </FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="booking-date"
              className={cn(
                "w-full h-10 justify-between font-normal text-left border-input bg-transparent px-3 hover:bg-muted/50 rounded-lg",
                !date && "text-muted-foreground",
                dateError && "border-destructive ring-destructive/20 focus-visible:ring-destructive/20"
              )}
            >
              <span className="truncate">{date ? format(date, "PPP") : "Select date"}</span>
              <CalendarIcon className="h-4 w-4 ml-2 opacity-50 shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              defaultMonth={date || new Date()}
              disabled={(d) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return d < today;
              }}
              onSelect={(selectedDate) => {
                onDateChange(selectedDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
        {dateError && <FieldError errors={[dateError]} />}
      </Field>

      {/* Time Field */}
      <Field className="w-full sm:w-48" data-invalid={!!timeError}>
        <FieldLabel htmlFor="booking-time" className="text-sm font-medium text-foreground mb-1">
          Start Time
        </FieldLabel>
        <div className="relative">
          <Input
            type="time"
            id="booking-time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className={cn(
              "h-10 pr-10 bg-transparent rounded-lg border-input focus-visible:ring-ring/50",
              timeError && "border-destructive ring-destructive/20 focus-visible:ring-destructive/20"
            )}
          />
          <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none opacity-50" />
        </div>
        {timeError && <FieldError errors={[timeError]} />}
      </Field>
    </div>
  );
}
