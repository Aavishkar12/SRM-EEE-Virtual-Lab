"use client"
import { NavDock } from "@/components/nav-dock";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Lightbulb,
  Cpu,
  ChevronRight,
  ArrowRight,
  FlaskConical,
  Award,
  Clock,
  BookMarked,
  FileQuestion,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { DigitalClock } from "@/components/digital-clock";
import { GlowingCard } from "@/components/glowing-card";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";
import { getStudentDisplayName } from "@/lib/auth";

// All experiments aligned with 26EEE1001T syllabus
const experiments = [
  {
    id: 1,
    title: "Kirchhoff's Voltage Law",
    description: "Verify KVL by measuring voltages in a closed-loop DC circuit and confirming their algebraic sum is zero.",
    category: "Circuit Analysis",
    difficulty: "Beginner",
    duration: "45 min",
  },
  {
    id: 2,
    title: "Thevenin's Theorem",
    description: "Simplify complex linear circuits into a single voltage source and series resistance.",
    category: "Circuit Analysis",
    difficulty: "Intermediate",
    duration: "60 min",
  },
  {
    id: 3,
    title: "House Wiring",
    description: "Implement residential wiring using switches, energy meter, lamps, and fan in parallel circuits.",
    category: "Electrical Installation",
    difficulty: "Intermediate",
    duration: "90 min",
  },
  {
    id: 4,
    title: "Fluorescent Lamp Wiring",
    description: "Study the choke-starter mechanism and wire a 40W fluorescent tube lamp correctly.",
    category: "Electrical Installation",
    difficulty: "Intermediate",
    duration: "60 min",
  },
  {
    id: 5,
    title: "Staircase Wiring",
    description: "Control a single lamp from two locations using two-way switches for staircase circuits.",
    category: "Electrical Installation",
    difficulty: "Intermediate",
    duration: "75 min",
  },
  {
    id: 6,
    title: "Full Wave Rectifier",
    description: "Build a bridge rectifier using 4 diodes and observe waveforms with and without filter capacitor.",
    category: "Power Electronics",
    difficulty: "Intermediate",
    duration: "60 min",
  },
];

const features = [
  {
    icon: <FlaskConical className="h-6 w-6 text-blue-400" />,
    title: "12 Lab Experiments",
    description: "Covering all units of 26EEE1001T — from DC circuits to power generation",
  },
  {
    icon: <Zap className="h-6 w-6 text-yellow-400" />,
    title: "Interactive Simulations",
    description: "Tinkercad-powered circuit simulations with real-time component interaction",
  },
  {
    icon: <Award className="h-6 w-6 text-purple-400" />,
    title: "Knowledge Quizzes",
    description: "Post-experiment MCQ quizzes to reinforce learning and test understanding",
  },
  {
    icon: <Clock className="h-6 w-6 text-green-400" />,
    title: "24/7 Access",
    description: "Practice anytime — the virtual lab is always open from any device",
  },
];

export default function HomePage() {
  const experimentsRef = useRef(null);
  const { data: session } = useSession();

  const scrollToExperiments = () => {
    experimentsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-blue-500/30 selection:text-blue-200">

      {/* Digital Clock */}
      <DigitalClock />

      {/* Floating Navigation */}
      <NavDock />

      {/* ── HERO SECTION ── */}
      <div className="relative w-full overflow-hidden">
        <HeroGeometric badge="26EEE1001T · Virtual Lab" title1="Learn EEE" title2="Interactively">
          <div className="flex w-full max-w-3xl flex-col items-center gap-8 sm:gap-10 px-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                as={Link}
                href="/experiments"
                className="bg-black border-blue-500 text-white px-8 py-3"
                containerClassName="w-auto"
              >
                <span className="flex items-center gap-2">
                  Explore Experiments
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Button>
              <Link
                href="/quizzes"
                className="flex items-center gap-2 text-neutral-300 hover:text-white transition-colors text-sm font-medium"
              >
                <FileQuestion className="h-4 w-4" />
                Take a Quiz
              </Link>
            </div>

            {session?.user?.email && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.0, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex flex-col items-center gap-2 sm:gap-3 text-center w-full pt-2"
              >
                <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-blue-400/60">
                  Welcome back
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300">
                    {getStudentDisplayName(session.user)}
                  </span>
                </h2>
                {(session.user.branch || session.user.department || session.user.program) && (
                  <p className="text-sm sm:text-base text-neutral-500 tracking-wide">
                    {session.user.branch ?? session.user.department ?? session.user.program}
                  </p>
                )}
                <div className="mt-1 h-px w-24 sm:w-32 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
              </motion.div>
            )}
          </div>
        </HeroGeometric>

      </div>

      {/* ── FEATURES SECTION ── */}
      <div className="w-full py-20 bg-[#050508]">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-block rounded-lg bg-blue-900/30 px-3 py-1 text-sm text-blue-300 mb-4">
              Why SRM EEE Virtual Lab?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Built for Engineering Students
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Everything you need to complete your EEE lab course — experiments, simulations, theory, and assessments.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-xl bg-neutral-900/60 border border-neutral-800/60 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="h-11 w-11 rounded-lg bg-neutral-800 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── EXPERIMENTS SECTION ── */}
      <div
        ref={experimentsRef}
        id="experiments"
        className="w-full py-20 bg-gradient-to-b from-[#050508] to-[#070a15]"
      >
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <div className="inline-block rounded-lg bg-blue-900/30 px-3 py-1 text-sm text-blue-300 mb-4">
                Interactive Learning
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Hands-on Experiments
              </h2>
              <p className="text-neutral-400 max-w-lg">
                Six core experiments from your lab manual — with theory, interactive simulations, and quizzes.
              </p>
            </div>
            <Link
              href="/experiments"
              className="mt-6 md:mt-0 flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
            >
              View all 12 experiments
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {experiments.map((experiment, i) => (
              <motion.div
                key={experiment.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <GlowingCard
                  href={`/experiments/${experiment.id}`}
                  experimentId={experiment.id}
                  title={experiment.title}
                  description={experiment.description}
                  category={experiment.category}
                  difficulty={experiment.difficulty}
                  duration={experiment.duration}
                />
              </motion.div>
            ))}
          </ul>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="w-full py-12 bg-black border-t border-neutral-900">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-neutral-500 text-sm">Interactive Electrical Engineering Experiments · 26EEE1001T</p>
            </div>
            <div className="flex gap-6 flex-wrap justify-center">
              {[
                { label: "Experiments", href: "/experiments" },
                { label: "Quizzes", href: "/quizzes" },
                { label: "Team", href: "/team" },
                { label: "About", href: "/about" },
                { label: "Developers", href: "/developers" },
              ].map((link) => (
                <Link key={link.label} href={link.href} className="text-neutral-500 hover:text-neutral-200 transition-colors text-sm">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-neutral-900 text-center text-neutral-600 text-sm">
            © {new Date().getFullYear()} SRM Institute of Science and Technology — Department of EEE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
