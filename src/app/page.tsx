import Image from "next/image";
import { Button } from "../components/ui/button";
import Banner from "@/components/modules/homePage/Banner";
import Categories from "@/components/modules/homePage/Categories";
import MostReadedBooks from "@/components/modules/homePage/MostReadedBooks";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <Banner />
        <Categories />
        <MostReadedBooks />
      </main>
    </div>
  );
}
