import { NavPill } from "@/components/ui/NavPill";
import { WhatsAppFAB } from "@/components/ui/WhatsAppFAB";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { IntroCurtain } from "@/components/ui/IntroCurtain";
import { Hero } from "@/components/sections/Hero";
import { Differentiation } from "@/components/sections/Differentiation";
import { Manifesto } from "@/components/sections/Manifesto";
import { About } from "@/components/sections/About";
import { Method } from "@/components/sections/Method";
import { HumanTech } from "@/components/sections/HumanTech";
import { Services } from "@/components/sections/Services";
import { WhyYez } from "@/components/sections/WhyYez";
import { Credibility } from "@/components/sections/Credibility";
import { ProfileSelector } from "@/components/sections/ProfileSelector";
import { Contact } from "@/components/sections/Contact";
import { IntentProvider } from "@/lib/intent-context";

// Section order follows brief/04-information-architecture.md §2 — do not reorder
// without checking the narrative arc (noise → direction → strategy → action → ownership).
export default function Home() {
  return (
    <IntentProvider>
      <IntroCurtain />
      <GrainOverlay />
      <ScrollProgress />
      <ScrollRail />
      <CustomCursor />
      <NavPill />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Differentiation />
        <Manifesto />
        <About />
        <Method />
        <HumanTech />
        <Services />
        <WhyYez />
        <Credibility />
        <ProfileSelector />
      </main>
      <Contact />
      <WhatsAppFAB />
    </IntentProvider>
  );
}
