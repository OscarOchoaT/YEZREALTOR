import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";

export const metadata: Metadata = {
  title: "Advance | The Next Move Method — Yez The Realtor",
  description:
    "The fourth phase of The Next Move Method: the relationship keeps moving after closing — ongoing guidance, and a first look at The Arrival Experience.",
};

export default function Page() {
  return <MethodPhasePage phaseId="advance" />;
}
