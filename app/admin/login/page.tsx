"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Lock, Mail, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import TulipSeprator from "@/components/common/TulipSeprator";
import { LoginFormSchemaType, loginSchema } from "@/lib/zodSchemas";
import { SignIn } from "@/app/actions/auth.action";

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { control, handleSubmit } = useForm<LoginFormSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  async function onSubmit(data: LoginFormSchemaType) {
    setIsSubmitting(true);
    try {
      const result = await SignIn({
        email: data.email,
        password: data.password,
      });

      if (result.success) {
        toast.success(result.message);
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#FAF6F0] relative overflow-hidden font-sans">
      {/* Decorative background elements matching the vintage henna brand */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group select-none"
      >
        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to website
      </Link>

      <div className="w-full max-w-md bg-[#FDFBF7] rounded-3xl border border-[#EBE4DC] p-6 md:p-8 relative overflow-hidden shadow-md">
        {/* Vintage Corner Flourishes */}
        <div className="absolute top-3 left-3 text-[#D4C3B3] pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute top-3 right-3 text-[#D4C3B3] pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute bottom-3 left-3 text-[#D4C3B3] pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute bottom-3 right-3 text-[#D4C3B3] pointer-events-none">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4C3B3]" />
        </div>
        <div className="absolute inset-1.5 border-[0.5px] border-[#EBE4DC]/60 rounded-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-gray-800">
              Admin Portal
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to manage bookings, orders, and products
            </p>
          </div>

          <TulipSeprator variant="wavy" className="py-2" />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="admin-email"
                      className="text-sm font-medium text-foreground flex items-center gap-1.5"
                    >
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      Email Address
                    </FieldLabel>
                    <Input
                      {...field}
                      id="admin-email"
                      type="email"
                      placeholder="admin@hennabliss.com"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="admin-password"
                      className="text-sm font-medium text-foreground flex items-center gap-1.5"
                    >
                      <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                      Password
                    </FieldLabel>
                    <Input
                      {...field}
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      aria-invalid={fieldState.invalid}
                      className="h-10 rounded-lg focus-visible:ring-ring/50 border-input bg-transparent"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-6 rounded-xl text-md flex items-center justify-center gap-2 shadow-md shadow-primary/10 transition-all duration-300 hover:scale-[1.005] active:scale-[0.995]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4.5 w-4.5" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
