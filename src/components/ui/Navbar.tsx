"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, Sparkles } from "lucide-react";

const navLinks = [
  { label: "Vagas", href: "#vagas" },
  { label: "Para Empresas", href: "#empresas" },
  { label: "Plano Pro", href: "#pro" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "glass-strong shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-[#6366F1]/25">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#06B6D4] opacity-0 group-hover:opacity-30 blur-lg transition-opacity duration-500" />
            </div>
            <span className="text-xl font-bold">
              <span className="text-gradient">Match</span>
              <span className="text-[#06B6D4]">.js</span>
            </span>
          </motion.a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="relative px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors duration-300 rounded-lg group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{link.label}</span>
                <motion.div
                  className="absolute inset-0 rounded-lg bg-white/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.a
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Entrar
            </motion.a>
            <motion.a
              href="/cadastro"
              className="relative px-5 py-2.5 text-sm font-semibold text-white rounded-xl overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1] to-[#06B6D4] transition-all duration-300" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#06B6D4] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Começar Grátis
              </span>
            </motion.a>
          </div>

          {/* Mobile Toggle */}
          <motion.button
            className="md:hidden p-2 text-[#94A3B8] hover:text-white"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden glass-strong border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="block px-4 py-3 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <a
                  href="/login"
                  className="block px-4 py-3 text-center text-[#94A3B8] hover:text-white rounded-xl transition-colors"
                >
                  Entrar
                </a>
                <a
                  href="/cadastro"
                  className="block px-4 py-3 text-center text-white font-semibold bg-gradient-to-r from-[#6366F1] to-[#06B6D4] rounded-xl"
                >
                  Começar Grátis
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
