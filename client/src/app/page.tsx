import HeaderComp from "@/components/Header";
import HomeComp from "@/components/Home/HomeComp";

export default function Home() {
  return (
    <main className="min-h-[100vh] flex flex-col items-center justify-center">
      <HeaderComp />
      <HomeComp />
    </main>
  );
}
