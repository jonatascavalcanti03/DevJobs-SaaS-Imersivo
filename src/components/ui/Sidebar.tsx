"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, ChevronLeft, LogOut, type LucideIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface SidebarProps {
  links: SidebarLink[];
  activePath: string;
  userName: string;
  userRole: string;
  userImage?: string;
}

export default function Sidebar({ links, activePath, userName, userRole, userImage }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 z-40 glass-strong border-r border-white/5"
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/5">
          <Link href={userRole === "Empresa" ? "/empresa" : "/candidato"} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center flex-shrink-0">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="text-lg font-bold whitespace-nowrap overflow-hidden">
                  <span className="text-gradient">Dev</span><span className="text-white">Jobs</span><span className="text-[#06B6D4]">.br</span>
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-white/5 text-[#64748B] hover:text-white transition-colors">
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* User Info */}
        <div className={`px-4 py-4 border-b border-white/5 ${collapsed ? "flex justify-center" : ""}`}>
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1]/30 to-[#06B6D4]/30 border border-white/10 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {userImage ? <img src={userImage} alt="" className="w-full h-full rounded-xl object-cover" /> : userName.charAt(0).toUpperCase()}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{userName}</p>
                  <p className="text-xs text-[#64748B] truncate">{userRole}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = activePath === link.href;
            return (
              <Link href={link.href} key={link.href} passHref legacyBehavior>
                <motion.a
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                    isActive
                      ? "bg-[#6366F1]/15 text-white border border-[#6366F1]/20"
                      : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  {isActive && (
                    <motion.div layoutId="activeIndicator" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-[#6366F1]" />
                  )}
                  <link.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-[#818CF8]" : "group-hover:text-[#818CF8]"} transition-colors`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="truncate">
                        {link.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!collapsed && link.badge && (
                    <span className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold bg-[#6366F1]/20 text-[#818CF8]">{link.badge}</span>
                  )}
                </motion.a>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button onClick={() => signOut({ callbackUrl: '/' })} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748B] hover:text-red-400 hover:bg-red-500/5 transition-all ${collapsed ? "justify-center" : ""}`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-strong border-t border-white/5 px-2 py-2 flex items-center justify-around">
        {links.slice(0, 5).map((link) => {
          const isActive = activePath === link.href;
          return (
            <Link key={link.href} href={link.href} className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all ${isActive ? "text-[#818CF8]" : "text-[#64748B]"}`}>
              <link.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
