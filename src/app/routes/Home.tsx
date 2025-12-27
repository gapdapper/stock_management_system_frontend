import "./Home.css";
import Navbar from "@/features/landing/components/Navbar";
import Hero from "@/features/landing/components/Hero";
import Features from "@/features/landing/components/Features";
import Footer from "@/features/landing/components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </>
  );
}

export default Home;
