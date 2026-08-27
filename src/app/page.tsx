import Hero from "@/components/hero/Hero";
import Manifesto from "@/components/sections/Manifesto";
import About from "@/components/sections/About";
import Method from "@/components/sections/Method";
import Services from "@/components/sections/Services";
import Differentiator from "@/components/sections/Differentiator";
import Credibility from "@/components/sections/Credibility";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <Manifesto />
      <About />
      <Method />
      <Services />
      <Differentiator />
      <Credibility />
      <Contact />
      <Footer />
    </main>
  );
}
