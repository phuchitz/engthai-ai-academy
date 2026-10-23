"use server";
import { authConfigured, signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
export async function googleSignIn() {
  if (!authConfigured()) redirect("/login?error=Configuration");
  try {
    await signIn("google", { redirectTo: "/learn" });
  } catch (error) {
    if (error instanceof AuthError) redirect("/login?error=OAuthSignInError");
    throw error;
  }
}
export async function googleSignOut() {
  await signOut({ redirectTo: "/" });
}
