import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";

export const metadata: Metadata = {
  title: "Advance | The Next Move Method | Yez The Realtor",
  description:
    "The fourth phase of The Next Move Method: the relationship keeps moving after closing, with ongoing guidance on equity, market position, and future moves.",
};

export default function Page() {
  return <MethodPhasePage phaseId="advance" />;
}
