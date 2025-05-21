// Home page component with redirection
import { redirect } from "next/navigation";

// Home page component that redirects to login
export default function HomePage() {
  // Redirect to login page
  redirect("/auth/login");
}
