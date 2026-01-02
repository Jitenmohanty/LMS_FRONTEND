import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Blog", href: "/blog" },
    ],
    categories: [
      { name: "Development", href: "/courses?category=development" },
      { name: "Design", href: "/courses?category=design" },
      { name: "IT & Software", href: "/courses?category=it-software" },
      { name: "Business", href: "/courses?category=business" },
      { name: "Marketing", href: "/courses?category=marketing" },
    ],
    support: [
      { name: "Support", href: "/contact" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand */}
          <div className="lg:col-span-3">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-xl font-bold text-white">DEVSKILL</span>
              <span className="text-orange-500 text-xl">.</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm">
              Empowering learners worldwide with high-quality, accessible & engaging education. Our mission is offering
              a diverse range of courses.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Info */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-4">Company Info</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Categories */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-4">Top Categories</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-orange-500 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span className="break-all">info.nextgensolution90@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span>+91-8338829961</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <span>Nilachal Bhaban, B-14 , Dalak, Odagaon , Nayagarh, 752081</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-400 text-sm text-center md:text-left">
              Secure Payment with
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Using styled text badges as placeholders for logos, with hover effects */}
              <div className="px-4 py-2 bg-white text-gray-900 rounded-md text-xs font-extrabold tracking-wider shadow-sm hover:scale-105 transition-transform cursor-default select-none">VISA</div>
              <div className="px-4 py-2 bg-white text-gray-900 rounded-md text-xs font-extrabold tracking-wider shadow-sm hover:scale-105 transition-transform cursor-default select-none flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                MasterCard
              </div>
              <div className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-bold shadow-sm hover:scale-105 transition-transform cursor-default select-none">PayPal</div>
              <div className="px-4 py-2 bg-[#0C2D48] text-white rounded-md text-xs font-bold shadow-sm hover:scale-105 transition-transform cursor-default select-none">Razorpay</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} DevSkill. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
