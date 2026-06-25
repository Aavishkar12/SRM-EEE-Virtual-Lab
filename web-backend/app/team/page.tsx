"use client"

import { motion, AnimatePresence } from "framer-motion"
import { DigitalClock } from "@/components/digital-clock"
import { DynamicSidebar } from "@/components/dynamic-sidebar"
import Image from "next/image"
import { GithubIcon, LinkedinIcon, MailIcon, Users, BookOpen, Settings, LogIn, FileQuestion, Info, Home, Award, GraduationCap, BookMarked, Library, User } from "lucide-react"
import Link from "next/link"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { MovingBorder } from "@/components/ui/moving-border"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useState } from "react"
import { FloatingDock } from "@/components/ui/floating-dock"
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect"

// Team member data with actual photos
const teamMembers = [
  {
    id: 1,
    name: "Dr. K. Saravanan",
    role: "Associate Professor",
    department: "Department of Electrical Engineering",
    bio: "Dr. K. Saravanan has over 15 years of experience in electrical engineering education and research. He specializes in power systems and renewable energy integration.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop",
    social: {
      email: "saravanan@srm.edu.in",
      linkedin: "https://linkedin.com/in/example",
      github: "https://github.com/example",
    },
  },
  {
    id: 2,
    name: "Dr. S. Vidyasagar",
    role: "Assistant Professor",
    department: "Department of Electronics Engineering",
    bio: "Dr. S. Vidyasagar specializes in power electronics and control systems. He has contributed to several research projects in renewable energy applications.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop",
    social: {
      email: "vidyasagar@srm.edu.in",
      linkedin: "https://linkedin.com/in/example",
      github: "https://github.com/example",
    },
  },
  {
    id: 3,
    name: "Dr. D. Sattianandan",
    role: "Associate Professor",
    department: "Department of Electrical Engineering",
    bio: "Dr. D. Sattianandan is an expert in power systems and smart grid technologies. He has led multiple projects on grid integration and power quality improvement.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop",
    social: {
      email: "sattianandan@srm.edu.in",
      linkedin: "https://linkedin.com/in/example",
      github: "https://github.com/example",
    },
  },
  {
    id: 4,
    name: "Dr. V. Kalyanasundaram",
    role: "Assistant Professor",
    department: "Department of Electrical Engineering",
    bio: "Dr. V. Kalyanasundaram specializes in electrical machines and drives. His research focuses on efficiency improvement and fault diagnosis in electrical systems.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop",
    social: {
      email: "kalyanasundaram@srm.edu.in",
      linkedin: "https://linkedin.com/in/example",
      github: "https://github.com/example",
    },
  },
]

// Format team members for hover effect cards
const teamCards = teamMembers.map((member) => ({
  title: member.name,
  description: `${member.role}, ${member.department}`,
  link: `mailto:${member.social.email}`,
}))

export default function TeamPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const dockItems = [
    { title: "Home", icon: <Home className="h-full w-full text-neutral-300" />, href: "/" },
    { title: "Experiments", icon: <BookOpen className="h-full w-full text-neutral-300" />, href: "/experiments" },
    { title: "Study Room", icon: <Library className="h-full w-full text-neutral-300" />, href: "/study-room" },
    { title: "Quizzes", icon: <FileQuestion className="h-full w-full text-neutral-300" />, href: "/quizzes" },
    { title: "Team", icon: <Users className="h-full w-full text-neutral-300" />, href: "/team" },
    { title: "About", icon: <Info className="h-full w-full text-neutral-300" />, href: "/about" },
    { title: "Profile", icon: <User className="h-full w-full text-neutral-300" />, href: "/profile" }, { title: "Settings", icon: <Settings className="h-full w-full text-neutral-300" />, href: "/settings" },
    { title: "Sign In", icon: <LogIn className="h-full w-full text-neutral-300" />, href: "/signin" },
  ]

  const words = [
    {
      text: "Meet",
    },
    {
      text: "Our",
    },
    {
      text: "Expert",
    },
    {
      text: "Faculty",
    },
    {
      text: "Team",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Dynamic Sidebar */}
      <DynamicSidebar />
      
      {/* Centered navigation at the top */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <FloatingDock items={dockItems} className="w-auto" mobileClassName="w-auto" />
      </div>

      <div className="absolute top-4 left-20 md:left-48 z-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center"
        >
          <div className="h-10 bg-white text-blue-800 font-bold px-3 py-1 rounded">SRM EEE</div>
        </motion.div>
      </div>

      <DigitalClock />

      <div className="w-full max-w-6xl mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div className="flex flex-col items-center justify-center mb-10">
            <TypewriterEffectSmooth words={words} className="mb-8" />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-4 text-lg text-neutral-400 max-w-2xl"
            >
              Meet the dedicated faculty and staff behind the EEE Learning Platform. Our team brings decades of experience in electrical engineering education and research.
            </motion.p>
          </div>
        </motion.div>

        {/* Team Members Grid with Enhanced Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 mb-16">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-70 blur-xl transition-all duration-500 -z-10"></div>
              
              <div className="relative rounded-2xl overflow-hidden bg-neutral-900/90 border border-neutral-800 group-hover:border-blue-500/50 transition-all duration-300">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <GlowingEffect disabled={false} blur={20} />
                </div>
                
                {/* Profile Image Container - Fixed Height with Object Position */}
                <div className="relative w-full h-[300px] overflow-hidden">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                <div className="p-6 relative z-20">
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors"
                  >
                    {member.name}
                  </motion.h3>
                  
                  <div className="flex flex-col space-y-2 mt-2">
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="text-blue-400 font-medium"
                    >
                      {member.role}
                    </motion.p>
                    
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="text-neutral-500 text-sm"
                    >
                      {member.department}
                    </motion.p>
                  </div>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="text-neutral-300 mt-4 text-sm leading-relaxed"
                  >
                    {member.bio}
                  </motion.p>

                  <div className="mt-6 flex space-x-4">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Link
                          href={`mailto:${member.social.email}`}
                          className="text-neutral-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-500/10"
                        >
                          <MailIcon className="h-5 w-5" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-neutral-900 border border-neutral-800 text-white">
                        <p>Send email to {member.social.email}</p>
                      </HoverCardContent>
                    </HoverCard>
                    
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Link
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-500/10"
                        >
                          <LinkedinIcon className="h-5 w-5" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-neutral-900 border border-neutral-800 text-white">
                        <p>View LinkedIn profile</p>
                      </HoverCardContent>
                    </HoverCard>
                    
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Link
                          href={member.social.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-400 hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-blue-500/10"
                        >
                          <GithubIcon className="h-5 w-5" />
                        </Link>
                      </HoverCardTrigger>
                      <HoverCardContent className="bg-neutral-900 border border-neutral-800 text-white">
                        <p>View GitHub projects</p>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Faculty Expertise Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="relative my-20 py-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl -z-10"></div>
          
          <div className="relative z-10 text-center mb-10">
            <div className="inline-block relative">
              <MovingBorder duration={3000} rx="30%" ry="30%">
                <div className="h-20 w-20 bg-[radial-gradient(#0ea5e9_40%,transparent_60%)] opacity-[0.8]" />
              </MovingBorder>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
                Faculty Expertise
              </h2>
            </div>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Our faculty members specialize in various domains of electrical engineering, bringing their expertise to the classroom and research.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "Power Systems",
                description: "Research in smart grids, renewable energy integration, and power quality improvement",
                icon: <BookMarked className="h-8 w-8 text-blue-400" />
              },
              {
                title: "Power Electronics",
                description: "Expertise in converter design, motor drives, and energy-efficient systems",
                icon: <GraduationCap className="h-8 w-8 text-purple-400" />
              },
              {
                title: "Control Systems",
                description: "Advanced research in automation, industrial controls, and system optimization",
                icon: <Award className="h-8 w-8 text-green-400" />
              },
              {
                title: "Electrical Machines",
                description: "Design and analysis of motors, generators, and transformers",
                icon: <BookOpen className="h-8 w-8 text-yellow-400" />
              },
              {
                title: "Renewable Energy",
                description: "Solar, wind, and hybrid energy systems research and development",
                icon: <Info className="h-8 w-8 text-pink-400" />
              },
              {
                title: "Digital Signal Processing",
                description: "Signal analysis, filtering techniques, and embedded systems applications",
                icon: <Settings className="h-8 w-8 text-cyan-400" />
              },
            ].map((expertise, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex justify-center mb-4">
                  {expertise.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{expertise.title}</h3>
                <p className="text-neutral-400 text-sm">{expertise.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Team Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="relative my-16 py-10"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl -z-10"></div>
          
          <div className="relative z-10 text-center mb-10">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 mb-4">
              Faculty Achievements
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto mb-10">
              Our team's collective accomplishments in research, teaching, and industry collaboration
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Faculty Members", value: "4+", icon: <Users className="h-8 w-8 text-blue-400" /> },
              { label: "Years Experience", value: "50+", icon: <GraduationCap className="h-8 w-8 text-purple-400" /> },
              { label: "Research Projects", value: "25+", icon: <BookMarked className="h-8 w-8 text-green-400" /> },
              { label: "Publications", value: "100+", icon: <Award className="h-8 w-8 text-yellow-400" /> },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 text-center hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="flex justify-center mb-3">{stat.icon}</div>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                <p className="text-neutral-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

