import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";

export const metadata: Metadata = {
  title: "Decode | The Next Move Method — Yez The Realtor",
  description:
    "The first phase of The Next Move Method: understanding your full situation — financial position, timing, lifestyle, and where this move fits your future.",
};

export default function Page() {
  return <MethodPhasePage phaseId="decode" />;
}
