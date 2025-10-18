import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
  return null; // This prevents any additional rendering
}
