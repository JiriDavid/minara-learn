import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image"; // Don't forget to import this

const Footer = () => {
  const [theme, setTheme] = useState("light"); // ✅ Proper initialization

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const currentYear = new Date().getFullYear();
  const logoSrc =
    theme === "dark"
      ? "/minara-learn-logo-white.svg"
      : "/minara-learn-logo-white.svg";

  return (
    <footer className="bg-slate-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/">
              <Image
                src={logoSrc}
                width={200}
                height={100}
                alt="Minara Logo"
                className="h-12 w-auto mb-4"
              />
            </Link>
            <p className="mt-3 text-sm text-slate-400">
              Empowering education through technology. Our learning management
              system helps students, educators, and institutions achieve their
              learning goals.
            </p>
            <div className="mt-4 flex space-x-4">
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/courses"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-slate-400 hover:text-blue-400 transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <address className="not-italic">
              <p className="text-slate-400">123 Learn Street</p>
              <p className="text-slate-400">Education City, EC 12345</p>
              <p className="text-slate-400 mt-3">
                <a
                  href="tel:+11234567890"
                  className="hover:text-blue-400 transition-colors"
                >
                  +1 (123) 456-7890
                </a>
              </p>
              <p className="text-slate-400">
                <a
                  href="mailto:info@extratlms.com"
                  className="flex items-center mt-2 hover:text-blue-400 transition-colors"
                >
                  <Mail size={16} className="mr-2" />
                  info@extratlms.com
                </a>
              </p>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            &copy; {currentYear} E-Xtra LMS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
