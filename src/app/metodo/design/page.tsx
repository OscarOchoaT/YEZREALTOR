import type { Metadata } from "next";
import MethodPhasePage from "@/components/MethodPhasePage";

export const metadata: Metadata = {
  title: "Design | The Next Move Method — Yez The Realtor",
  description:
    "The second phase of The Next Move Method: building your Personalized Ownership Strategy — what we're looking for, why it makes sense, and how we evaluate opportunities.",
};

export default function Page() {
  return <MethodPhasePage phaseId="design" />;
}
