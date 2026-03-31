import { redirect } from "next/navigation";

export default function CatalogRootPage() {
  // Redirect to the main books catalog by default
  redirect("/catalog/book");
}
