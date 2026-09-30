"use client";

import { motion } from "framer-motion";
import { TECH_VS_YEZ } from "@/content/method";

const draw = (delay = 0) => ({
  initial: { pathLength: 0, opacity: 0 },
  whileInView: { pathLength: 1, opacity: 1 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 1.6, delay, ease: "easeInOut" as const },
});

// Left hemisphere silhouette; the right one is the same path mirrored.
const HEMISPHERE =
  "M196 44 C160 30 112 38 84 70 C56 100 54 140 66 166 C58 196 82 226 116 228 C132 252 176 258 196 246 Z";

const GYRI = [
  "M120 80 C140 70 160 80 170 96",
  "M96 110 C118 100 136 116 150 112 C164 108 172 120 178 132",
  "M80 150 C102 140 120 158 140 150 C156 144 168 156 174 172",
  "M108 190 C124 180 142 194 158 190 C170 187 178 198 182 212",
  "M140 226 C152 220 166 226 176 236",
];

const TRACES = [
  "M262 126 V96 H232",
  "M274 126 V84 H292",
  "M298 138 H328",
  "M298 162 H320 V188 H302",
  "M262 174 V208 H232",
  "M286 174 V220 H298",
  "M250 138 H228",
  "M250 162 H236",
];

const NODES: [number, number][] = [
  [232, 96],
  [292, 84],
  [328, 138],
  [302, 188],
  [232, 208],
  [298, 220],
  [228, 138],
  [236, 162],
];

function Brain() {
  return (
    <svg viewBox="0 0 400 300" className="h-auto w-full" role="img" aria-label="A brain whose right half is a circuit: human plus technology">
      {/* Human hemisphere */}
      <motion.path d={HEMISPHERE} fill="none" strokeWidth={1.5} className="stroke-stone" {...draw(0)} />
      {GYRI.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="round"
          className="stroke-stone/80"
          {...draw(0.3 + i * 0.15)}
        />
      ))}

      {/* Technology hemisphere (mirrored silhouette) */}
      <g transform="translate(400 0) scale(-1 1)">
        <motion.path d={HEMISPHERE} fill="none" strokeWidth={1.5} className="stroke-bone" {...draw(0.2)} />
      </g>
      {TRACES.map((d, i) => (
        <motion.path
          key={d}
          d={d}
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-bone/80"
          {...draw(0.5 + i * 0.1)}
        />
      ))}
      {NODES.map(([cx, cy]) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={3.5}
          className="fill-bone"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 1.6 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      ))}

      {/* Chip */}
      <motion.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <rect x={250} y={126} width={48} height={48} rx={5} className="fill-cocoaBark stroke-bone" strokeWidth={1.5} />
        <rect x={262} y={138} width={24} height={24} rx={2} className="fill-none stroke-bone/60" strokeWidth={1} />
      </motion.g>

      {/* Where they meet */}
      <motion.circle
        cx={200}
        cy={150}
        r={5}
        className="fill-cognac"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
      />
    </svg>
  );
}

function Column({
  label,
  items,
  align,
  delay,
}: {
  label: string;
  items: string[];
  align: "left" | "right";
  delay: number;
}) {
  const right = align === "right";
  return (
    <motion.div
      initial={{ opacity: 0, x: right ? -16 : 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={`flex flex-col gap-4 ${right ? "lg:items-end lg:text-right" : "lg:items-start lg:text-left"} items-center text-center`}
    >
      <h3 className="font-display text-3xl tracking-headline text-bone">{label}</h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className={`flex items-center gap-3 font-body text-base font-normal text-bone/90 ${
              right ? "lg:flex-row-reverse" : ""
            }`}
          >
            <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${right ? "bg-stone" : "bg-bone"}`} />
            {item}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function HumanTech() {
  const { human, technology } = { human: TECH_VS_YEZ.columns.yez, technology: TECH_VS_YEZ.columns.technology };
  return (
    <div className="relative mx-auto mt-24 max-w-6xl">
      <h2 className="text-center font-display text-3xl tracking-headline text-bone sm:text-4xl">
        <span className="text-stone">Human</span> <span className="text-cognac">+</span> Technology
      </h2>

      <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_minmax(0,26rem)_1fr] lg:gap-8">
        <div className="order-2 lg:order-none">
          <Column label={human.label} items={human.items} align="right" delay={0.1} />
        </div>
        <div className="order-1 mx-auto w-full max-w-sm lg:order-none lg:max-w-none">
          <Brain />
        </div>
        <div className="order-3 lg:order-none">
          <Column label={technology.label} items={technology.items} align="left" delay={0.2} />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mt-16 text-center font-display !font-medium text-xl tracking-subhead text-bone sm:text-2xl"
      >
        {TECH_VS_YEZ.closingLine}
      </motion.p>
    </div>
  );
}
