"use server";
import { auth } from "@/lib/auth";
import { LoginFormSchemaType } from "@/lib/zodSchemas";

export const SignIn = async (data: LoginFormSchemaType) => {
  try {
    await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
    });

    return {
      success: true,
      message: "Welcome back, Mussu 💕",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An unknown error occurred.",
    };
  }
};
