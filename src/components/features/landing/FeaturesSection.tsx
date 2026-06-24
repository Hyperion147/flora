"use client";

import { featureCards, type FeaturePreviewKind } from "./data";
import { CircleDot } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { SectionHeader, WorldMapPattern } from "./shared";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="flora-full-bleed w-screen bg-[var(--flora-section)] px-[clamp(1rem,5vw,5.5rem)] py-20"
    >
      <SectionHeader
        eyebrow="Features"
        title="Everything You Need to Explore & Track Plants"
        text="A full toolkit to discover, document, search, map, and celebrate plant life."
      />

      <div className="mt-12 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-5">
        {featureCards.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.05 }}
              className="flora-glass flex min-h-[430px] flex-col rounded-3xl p-5 transition-transform hover:-translate-y-1"
            >
              <div className="flora-glass-soft mb-5 flex h-12 w-12 items-center justify-center rounded-2xl text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-black text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 min-h-24 text-sm leading-6 text-muted-foreground">
                {feature.text}
              </p>
              <FeaturePreview kind={feature.preview} />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}

function FeaturePreview({ kind }: { kind: FeaturePreviewKind }) {
  if (kind === "dashboard") {
    return (
      <div className="flora-glass-soft mt-auto rounded-2xl p-3">
        <div className="grid grid-cols-3 gap-2">
          {["24", "8", "156"].map((value) => (
            <div key={value} className="flora-glass-soft rounded-xl p-2 text-center text-xs font-black text-primary">
              {value}
            </div>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((item) => (
            <div key={item} className="relative h-16 overflow-hidden rounded-xl">
              <Image src="/hero-plants.png" alt="" fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "form") {
    return (
      <div className="flora-glass-soft mt-auto rounded-2xl p-3">
        <div className="flora-glass-soft mb-2 h-8 rounded-lg" />
        <div className="flora-glass-soft mb-2 h-8 rounded-lg" />
        <div className="relative h-24 overflow-hidden rounded-xl">
          <Image src="/hero-plants.png" alt="" fill className="object-cover" />
        </div>
      </div>
    );
  }

  if (kind === "map") {
    return (
      <div className="flora-glass-soft mt-auto overflow-hidden rounded-2xl p-3">
        <WorldMapPattern compact />
      </div>
    );
  }

  if (kind === "search") {
    return (
      <div className="flora-glass-soft mt-auto rounded-2xl p-3">
        <div className="flora-glass-soft mb-3 h-8 rounded-lg" />
        {["Monstera", "John Doe", "PID: FLR2345", "Snake Plant"].map((item) => (
          <div
            key={item}
            className="mb-2 flex items-center gap-2 text-xs text-muted-foreground"
          >
            <CircleDot className="h-3 w-3 text-primary" />
            {item}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flora-glass-soft mt-auto rounded-2xl p-3">
      {["PlantMaster", "GreenThumb", "NatureLover", "LeafExplorer"].map(
        (item, rank) => (
          <div key={item} className="mb-3 flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {rank + 1}. {item}
            </span>
            <span className="text-primary">{2847 - rank * 401}</span>
          </div>
        )
      )}
    </div>
  );
}
