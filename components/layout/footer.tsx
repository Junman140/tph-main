"use client"

import * as React from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"
import Image from "next/image"

export function Footer() {

  return (
    <div className="bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* About Column */}
          <div className="space-y-4">
            <Image 
              src="/TPH LOGO 2.png" 
              alt="TPH Global" 
              width={120} 
              height={30} 
              className="h-12 w-auto mb-4"
            />
            <p className="text-white/70 text-xs sm:text-sm">
              TPH Global is dedicated to raising Kingdom generals through principles of loyalty, holiness, and Anakazo
              empowerment.
            </p>
            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href="https://www.facebook.com/profile.php?id=100069383405925"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 sm:p-2.5 rounded-full hover:bg-primary/80 transition-colors"
                aria-label="Facebook"
                title="Facebook"
              >
                <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="https://x.com/tph_global"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 sm:p-2.5 rounded-full hover:bg-primary/80 transition-colors"
                aria-label="Twitter"
                title="Twitter"
              >
                <Twitter className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="https://instagram.com/tphglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 sm:p-2.5 rounded-full hover:bg-primary/80 transition-colors"
                aria-label="Instagram"
                title="Instagram"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a
                href="https://www.youtube.com/@THEPECULIARHOUSEGLOBAL"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 sm:p-2.5 rounded-full hover:bg-primary/80 transition-colors"
                aria-label="YouTube"
                title="YouTube"
              >
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">Contact Us</h3>
            <div className="space-y-4">
              <a
                href="mailto:thepeculiahouseglobal@gmail.com"
                className="flex items-start text-white/70 hover:text-white transition-colors"
              >
                <Mail className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm break-all">Thepeculiahouseglobal@gmail.com</span>
              </a>
              <a href="tel:+23490164920471" className="flex items-start text-white/70 hover:text-white transition-colors">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">+234 (91) 649-20471</span>
              </a>
              <div className="flex items-start text-white/70">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  College of Education, Afaha Nsit
                  <br />
                  Akwa Ibom State
                </span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">Legal</h3>
            <div className="space-y-3">
              <Link href="/privacy" className="block text-white/70 hover:text-white transition-colors text-xs sm:text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-white/70 hover:text-white transition-colors text-xs sm:text-sm">
                Terms of Use
              </Link>
              <Link href="/disclaimer" className="block text-white/70 hover:text-white transition-colors text-xs sm:text-sm">
                Disclaimer
              </Link>
              <Link href="/cookies" className="block text-white/70 hover:text-white transition-colors text-xs sm:text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

