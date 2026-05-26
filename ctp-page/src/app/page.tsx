'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ArrowRight, ShieldCheck, Code2, Server } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-24 py-20 font-mono">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 mt-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 flex h-20 w-20 items-center justify-center bg-hacker-green shadow-[0_0_50px_rgba(0,255,65,0.4)]"
        >
          <Cpu size={40} className="text-black" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-9xl font-black tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent uppercase leading-[0.8]"
        >
          ENGINEER THE <br /> FUTURE<span className="text-hacker-green">.OPS</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-white/40 font-bold tracking-[0.2em] max-w-2xl mb-14 uppercase leading-relaxed"
        >
          Distribute. Automate. Defend. <br /> Deployment & Intelligence for Elite Security Teams.
        </motion.p>

        <div className="flex flex-wrap justify-center gap-8">
          <button
            onClick={() => router.push('/marketplace')}
            className="group relative overflow-hidden bg-hacker-white px-12 py-6 font-black text-xs uppercase tracking-[0.4em] text-black transition-all hover:bg-hacker-green hover:shadow-[0_0_30px_#00FF41] flex items-center gap-3"
          >
            ENTER_OPS_ARENA
            <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </button>
          <button
            onClick={() => router.push('/login')}
            className="border border-white/20 bg-white/5 px-12 py-6 font-black text-xs uppercase tracking-[0.4em] text-white transition-all hover:bg-white hover:text-black"
          >
            INITIALIZE_ID
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid md:grid-cols-3 gap-1 px-4 lg:px-0 mx-auto max-w-7xl bg-hacker-border border border-hacker-border">
        <FeatureCard
          icon={<Server size={32} />}
          title="EDGE_DEPLOY"
          desc="Deploy offensive security modules to 12+ global nodes with hardware acceleration."
        />
        <FeatureCard
          icon={<Code2 size={32} />}
          title="TOOL_MARKET"
          desc="Access 32+ audited security blueprints, AI-driven automation & exploitation tools."
        />
        <FeatureCard
          icon={<ShieldCheck size={32} />}
          title="ZERO_TRUST"
          desc="Military-grade identity management & session encryption for covert ops."
        />
      </section>

      {/* Terminal View */}
      <section className="mx-auto max-w-5xl w-full px-4 mb-20">
        <div className="bg-hacker-gray border border-hacker-green shadow-[0_0_100px_rgba(0,255,65,0.05)] p-10 relative group">
          <div className="flex items-center justify-between border-b border-hacker-border pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 bg-hacker-green animate-pulse"></div>
              <span className="text-[10px] font-black text-hacker-green uppercase tracking-[0.4em]">LIVE_MISSION_CONSOLE_V4.2</span>
            </div>
            <div className="flex gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
              <div className="h-1.5 w-1.5 rounded-full bg-white/10"></div>
            </div>
          </div>
          <div className="font-mono text-xs text-white/40 leading-relaxed font-bold">
            <div className="flex gap-3 mb-2">
              <span className="text-hacker-green">➜</span>
              <span>cyberjai-ops --sync-intel --target=GLOBAL</span>
            </div>
            <div className="text-hacker-green/60 ml-8 mb-1 uppercase">ESTABLISHING SECURE_LINK VIA SINGAPORE_EDGE... OK</div>
            <div className="text-hacker-green/60 ml-8 mb-1 uppercase">DOWNLOADING 32 MISSION_MODULES... OK [100%]</div>
            <div className="text-hacker-green/60 ml-8 mb-1 uppercase">MOUNTING TOOLCHAIN V4.2.0-STABLE... OK</div>
            <div className="text-white ml-8 mt-4 border-l-2 border-hacker-green pl-6 py-1">
              STATUS: READY_FOR_DEPLOYMENT <br />
              OPERATIVE: UNIDENTIFIED_GHOST
            </div>
            <div className="flex gap-3 mt-8">
              <span className="text-hacker-green">➜</span>
              <span className="animate-pulse bg-hacker-green ml-1 w-2 h-4"></span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-black p-12 hover:bg-hacker-gray transition-all group border border-transparent hover:border-hacker-green cursor-default">
      <div className="text-hacker-green mb-8 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 origin-left">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 text-white tracking-[0.1em] uppercase">{title}</h3>
      <p className="text-[10px] text-white/30 leading-relaxed font-black uppercase tracking-widest">{desc}</p>
      <div className="mt-8 h-1 w-0 bg-hacker-green group-hover:w-full transition-all duration-700"></div>
    </div>
  );
}
