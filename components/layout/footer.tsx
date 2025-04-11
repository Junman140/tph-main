"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Youtube, ArrowUp, Mail, Phone, MapPin, Send } from "lucide-react"
import { SubscriptionForm } from "@/components/subscription-form"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="bg-gray-950 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
              <p className="text-white/70 max-w-md">
                Subscribe to our newsletter to receive updates on sermons, events, and familynews.
              </p>
            </div>
            <div>
              <SubscriptionForm />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About Column */}
          <div className="space-y-4">
            <img src="\TPH LOGO 2.png" alt="TPH Global" className="h-10 w-auto mb-4" />
            <p className="text-white/70 text-sm">
              TPH Global is dedicated to raising Kingdom generals through principles of loyalty, holiness, and Anakazo
              empowerment.
            </p>
            <div className="flex space-x-4 pt-4">
              <a
                href="https://www.facebook.com/profile.php?id=100069383405925"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-primary/80 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/tphglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-primary/80 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/tphglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-primary/80 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com/tphglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-primary/80 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Quick Links</h3>
            <div className="space-y-3">
              <Link href="/about" className="block text-white/70 hover:text-white transition-colors">
                About Us
              </Link>
              <Link href="/sermons" className="block text-white/70 hover:text-white transition-colors">
                Sermons
              </Link>
              <Link href="/events" className="block text-white/70 hover:text-white transition-colors">
                Events
              </Link>
              <Link href="/prayer" className="block text-white/70 hover:text-white transition-colors">
                Prayer
              </Link>
              <a href="/donate.jpg" className="block text-white/70 hover:text-white transition-colors">
                Donate
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Contact Us</h3>
            <div className="space-y-4">
              <a
                href="mailto:thepeculiahouseglobal@gmail.com"
                className="flex items-start text-white/70 hover:text-white transition-colors"
              >
                <Mail className="h-5 w-5 mr-3 mt-0.5" />
                <span>Thepeculiahouseglobal@gmail.com</span>
              </a>
              <a href="tel:+23490164920471" className="flex items-start text-white/70 hover:text-white transition-colors">
                <Phone className="h-5 w-5 mr-3 mt-0.5" />
                <span>+234 (901) 649-20471</span>
              </a>
              <div className="flex items-start text-white/70">
                <MapPin className="h-5 w-5 mr-3 mt-0.5" />
                <span>
                  College of Education, Afaha Nsit
                  <br />
                  Akwa Ibom State
                </span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-6">Legal</h3>
            <div className="space-y-3">
              <Link href="/privacy" className="block text-white/70 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-white/70 hover:text-white transition-colors">
                Terms of Use
              </Link>
              <Link href="/disclaimer" className="block text-white/70 hover:text-white transition-colors">
                Disclaimer
              </Link>
              <Link href="/cookies" className="block text-white/70 hover:text-white transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white/50">© {new Date().getFullYear()} TPH Global. All rights reserved.</p>
            <Button
              variant="ghost"
              size="icon"
              className="mt-4 md:mt-0 text-white/50 hover:text-white hover:bg-white/10"
              onClick={scrollToTop}
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

