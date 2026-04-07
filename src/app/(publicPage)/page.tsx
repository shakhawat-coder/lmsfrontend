import Banner from "@/components/modules/homePage/Banner";
import Categories from "@/components/modules/homePage/Categories";
import MostReadedBooks from "@/components/modules/homePage/MostReadedBooks";
import MembershipPlan from "@/components/modules/homePage/MembershipPlan";
import Statistics from "@/components/modules/homePage/Statistics";
import Testimonial from "@/components/modules/homePage/Testimonial";
import Cta from "@/components/modules/homePage/Cta";
import FAQ from "@/components/modules/homePage/FAQ";
import BlogSection from "@/components/modules/homePage/BlogSection";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full flex-col items-center justify-between bg-white dark:bg-black sm:items-start">
        <Banner />
        <Categories />
        <MostReadedBooks />
        <Statistics />
        <MembershipPlan />
        <FAQ />
        <Testimonial />
        <Cta />
        <BlogSection />
      </main>
    </div>
  );
}
