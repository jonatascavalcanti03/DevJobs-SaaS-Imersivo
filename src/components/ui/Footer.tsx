"use client";

import { motion } from "framer-motion";
import { Code2, Heart, Globe, Link, MessageCircle } from "lucide-react";

const footerLinks = {
  Plataforma: [
    { label: "Buscar Vagas", href: "#vagas" },
    { label: "Para Empresas", href: "#empresas" },
    { label: "Plano Pro", href: "#pro" },
    { label: "Preços", href: "#precos" },
  ],
  Recursos: [
    { label: "Blog", href: "/blog" },
    { label: "Guia de Carreira", href: "/guia" },
    { label: "Salários Tech", href: "/salarios" },
    { label: "FAQ", href: "/faq" },
  ],
  Legal: [
    { label: "Termos de Uso", href: "/termos" },
    { label: "Privacidade", href: "/privacidade" },
    { label: "LGPD", href: "/lgpd" },
    { label: "Cookies", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border/50">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#6366F1]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#06B6D4] flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">
                <span className="text-gradient">Match</span>
                <span className="text-text-primary">.js</span>
              </span>
            </div>
            <p className="text-sm text-[#64748B] leading-relaxed mb-4">
              Conectando os melhores desenvolvedores às melhores empresas de
              tecnologia do Brasil.
            </p>
            <div className="flex items-center gap-3">
              {[Globe, Link, MessageCircle].map((Icon, i) => (
                <motion.a
                  key={i}
                  href="#"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-lg bg-surface border border-border/50 flex items-center justify-center text-[#64748B] hover:text-text-primary hover:border-[#6366F1]/30 hover:bg-[#6366F1]/10 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-text-primary mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#64748B] hover:text-[#818CF8] transition-colors duration-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#64748B]">
            © {new Date().getFullYear()} — Todos os direitos
            reservados.
          </p>
          <p className="text-xs text-[#64748B] flex items-center gap-1">
            Feito com{" "}
            <Heart className="w-3 h-3 text-red-500 fill-red-500 animate-pulse" />{" "}
            no Brasil 🇧🇷
          </p>
        </div>
      </div>
    </footer>
  );
}
