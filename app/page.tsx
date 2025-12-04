"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Zap, Smartphone, BarChart3, Globe, Mail, Phone, MapPin, Menu, X, Utensils, Coffee, Cake, Hotel, Store, Wine } from "lucide-react"
import Image from "next/image"
import { Analytics } from "@vercel/analytics/next"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Typing animation component
function TypingText() {
  const [currentText, setCurrentText] = useState("Restaurant")
  const [isDeleting, setIsDeleting] = useState(false)
  const [textIndex, setTextIndex] = useState(0)
  
  const words = ["Restaurant", "Bistro", "Cafe", "Bakery", "Hotel", "Bar", "Food Truck", "Catering"]
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (currentText === words[textIndex]) {
          setTimeout(() => setIsDeleting(true), 2000)
        } else {
          setCurrentText(words[textIndex].slice(0, currentText.length + 1))
        }
      } else {
        if (currentText === "") {
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % words.length)
        } else {
          setCurrentText(currentText.slice(0, -1))
        }
      }
    }, isDeleting ? 100 : 150)
    
    return () => clearTimeout(timeout)
  }, [currentText, isDeleting, textIndex, words])
  
  return (
    <span className="text-primary animate-pulse">
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const howItWorksRef = useRef<HTMLDivElement>(null)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      gsap.from(heroRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      })
    }

    // Features cards animation
    if (featuresRef.current) {
      const cards = featuresRef.current.querySelectorAll('[data-animate="card"]')
      cards.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none none"
          },
          ease: "power2.out"
        })
      })
    }

    // How It Works section
    if (howItWorksRef.current) {
      const steps = howItWorksRef.current.querySelectorAll('[data-animate="step"]')
      steps.forEach((step, index) => {
        gsap.from(step, {
          opacity: 0,
          scale: 0.9,
          y: 40,
          duration: 0.9,
          delay: index * 0.15,
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            toggleActions: "play none none none"
          },
          ease: "back.out(1.2)"
        })
      })
    }

    // Floating animation for hero image
    const heroImage = document.querySelector('[data-animate="hero-image"]')
    if (heroImage) {
      gsap.to(heroImage, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      })
    }

    // Fade in animations for sections
    const sections = document.querySelectorAll('[data-animate="section"]')
    sections.forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        ease: "power2.out"
      })
    })

    // Stagger animation for benefit cards
    const benefitCards = document.querySelectorAll('[data-animate="benefit"]')
    benefitCards.forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        x: -30,
        duration: 0.7,
        delay: index * 0.1,
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
          toggleActions: "play none none none"
        },
        ease: "power2.out"
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg hover:scale-110 transition-transform duration-300">
                <QrCode className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold hover:text-primary transition-colors duration-300">Lanimenu</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </Link>
              <div className="flex gap-3">
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-4 pb-2 space-y-2 border-t mt-4">
              <Link 
                href="/pricing" 
                className="block px-3 py-2 text-sm font-medium hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <div className="flex flex-col gap-2 px-3">
                <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-12 sm:py-20 overflow-hidden">
        {/* Light Dotted Background for Hero Section */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(156_163_175)_1px,transparent_0)] bg-[length:20px_20px] opacity-30"></div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div ref={heroRef} className="text-center lg:text-left space-y-4 sm:space-y-6">
              <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-balance">
                  Digital QR Code Menus for Your <TypingText />
              </h1>
              </div>
              <div>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Create beautiful digital menus accessible via QR codes. Update in real-time, delight your customers, and
                modernize your business.
              </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-4">
                <Link href="/sign-up">
                  <Button size="lg" className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto hover:scale-105 transition-transform">
                    Start For Free
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button size="lg" variant="outline" className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base bg-transparent w-full sm:w-auto hover:scale-105 transition-transform">
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative">
              <div className="relative mx-auto max-w-md lg:max-w-lg" data-animate="hero-image">
                {/* Uploaded Hero Image */}
                <div className="relative">
                  <Image
                    src="/heroimg.png"
                    alt="QR Code Menu Demo"
                    width={400}
                    height={300}
                    className="w-full h-auto rounded-full"
                    priority
                  />
                  
                  {/* Overlay scanning effect */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-green-400 rounded-full animate-ping opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-green-400 rounded-full animate-ping opacity-40 transform -translate-x-1/2 -translate-y-1/2 animation-delay-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="container mx-auto px-4 py-12 sm:py-20 max-w-7xl" data-animate="section">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">How It Works</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Three simple steps to transform your restaurant menu into a modern digital experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Step 1 */}
          <div className="text-center space-y-4" data-animate="step">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="bg-primary/10 rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden">
                <Image
                  src="/create-menu.png"
                  alt="Create Your Digital Menu Dashboard"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
                1
              </div>
                </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold">Create Your Menu</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Sign up and build your digital menu in minutes. Add items, prices, descriptions, and photos. Organize by categories and customize the design to match your brand.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="text-center space-y-4" data-animate="step">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="bg-primary/10 rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden">
                <Image
                  src="/place.jpg"
                  alt="QR Code Menu Stand on Restaurant Table"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
                2
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold">Print & Place QR Codes</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Download and print your unique QR code. Place it on tables, walls, or countertops. Customers scan with any smartphone camera—no app needed.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="text-center space-y-4" data-animate="step">
            <div className="relative mx-auto w-full max-w-sm">
              <div className="bg-primary/10 rounded-2xl p-6 sm:p-8 shadow-lg overflow-hidden">
                <Image
                  src="/users-scan.jpg"
                  alt="Customer Scanning QR Code with Smartphone"
                  width={400}
                  height={300}
                  className="w-full h-auto rounded-xl object-cover"
                />
              </div>
              <div className="absolute -top-4 -left-4 bg-primary text-primary-foreground w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-lg sm:text-xl shadow-lg">
                3
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-semibold">Customers View Instantly</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                When customers scan, they instantly see your beautiful menu on their phone. Update prices or add items anytime—changes appear immediately for all customers.
              </p>
            </div>
          </div> 
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
          <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-all duration-300" data-animate="benefit">
            <CardContent className="space-y-3">
              <div className="bg-green-100 dark:bg-green-900/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-sm sm:text-base">Instant Updates</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Change your menu in seconds, no reprinting needed</p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-all duration-300" data-animate="benefit">
            <CardContent className="space-y-3">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto">
                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-sm sm:text-base">No App Required</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Works with any smartphone camera</p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-all duration-300" data-animate="benefit">
            <CardContent className="space-y-3">
              <div className="bg-purple-100 dark:bg-purple-900/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-sm sm:text-base">Contactless</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Safe, hygienic dining experience</p>
            </CardContent>
          </Card>

          <Card className="text-center p-4 sm:p-6 hover:shadow-lg transition-all duration-300" data-animate="benefit">
            <CardContent className="space-y-3">
              <div className="bg-orange-100 dark:bg-orange-900/20 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold text-sm sm:text-base">Cost Effective</h4>
              <p className="text-xs sm:text-sm text-muted-foreground">Save on printing and menu redesign costs</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="container mx-auto px-4 py-12 sm:py-20 max-w-7xl" data-animate="section">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Everything You Need to Succeed</h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Lanimenu provides all the tools you need to create, manage, and share your digital menu. From QR code generation to real-time updates, we've got you covered.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300" data-animate="card">
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors duration-300">QR Code Generation</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Instantly generate high-quality QR codes for your menu. Download in multiple formats (PNG, SVG, PDF) and print on any material. Each QR code is unique to your restaurant and links directly to your live menu.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300" data-animate="card">
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors duration-300">Real-time Updates</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Update prices, add new items, mark items as sold out, or change descriptions instantly from your dashboard. All changes appear immediately for customers—no waiting, no delays. Perfect for daily specials or seasonal menus.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300" data-animate="card">
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors duration-300">Mobile Optimized</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Your menu looks stunning on every device—smartphones, tablets, and desktops. Fast loading, easy navigation, and beautiful layouts (Grid or List view) ensure customers have a great experience browsing your menu.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300" data-animate="card">
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors duration-300">Easy Management</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Intuitive dashboard makes menu management effortless. Add items with photos, organize by categories, set prices, write descriptions, and drag to reorder. Upload a PDF menu or build individual items—you choose.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300" data-animate="card">
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors duration-300">No App Required</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Customers simply scan the QR code with their phone's built-in camera. The menu opens instantly in their browser—no app download, no registration, no hassle. Works on iPhone, Android, and any smartphone.
              </p>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300" data-animate="card">
            <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="bg-primary/10 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-primary group-hover:animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold group-hover:text-primary transition-colors duration-300">Contactless Dining</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Offer a hygienic, contactless dining experience. Customers view menus on their own devices, reducing physical contact with shared menus. Perfect for health-conscious diners and modern restaurants.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* What is Lanimenu */}
      <section className="bg-secondary/30 py-12 sm:py-20" data-animate="section">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">What is Lanimenu?</h2>
            <div className="space-y-4 text-left sm:text-center">
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Lanimenu is a digital menu platform designed specifically for restaurants, cafes, bars, and food businesses across Africa. We transform traditional paper menus into modern, interactive digital experiences accessible via QR codes.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Instead of printing expensive paper menus that become outdated quickly, create a beautiful digital menu that you can update instantly from anywhere. Your customers scan a QR code on their table, and your menu appears instantly on their phone—no app download required.
              </p>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Whether you run a fine dining restaurant, a cozy cafe, a food truck, or a hotel restaurant, Lanimenu helps you provide a modern, contactless dining experience while saving time and money on menu printing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Food Outlets */}
      <section className="container mx-auto px-4 py-12 sm:py-20 max-w-7xl relative z-10" data-animate="section">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Perfect for Every Food Business</h2>
          <p className="text-muted-foreground text-base sm:text-lg">Lanimenu works for all types of food establishments across Africa</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Restaurants */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center space-y-3">
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Restaurants</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Fine dining, casual dining, and family restaurants</p>
            </CardContent>
          </Card>

          {/* Cafes */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center space-y-3">
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Cafes</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Coffee shops, tea houses, and casual cafes</p>
            </CardContent>
          </Card>

          {/* Bakeries */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center space-y-3">
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Cake className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Bakeries</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Artisan bakeries, pastry shops, and dessert bars</p>
            </CardContent>
          </Card>

          {/* Hotels */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center space-y-3">
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Hotel className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Hotels</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Hotel restaurants, room service, and banquet halls</p>
            </CardContent>
          </Card>

          {/* Bars */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center space-y-3">
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Wine className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Bars & Pubs</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Cocktail bars, sports bars, and pub grub</p>
            </CardContent>
          </Card>

          {/* Food Trucks */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center space-y-3">
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Food Trucks</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Mobile food vendors and street food stalls</p>
            </CardContent>
          </Card>

          {/* Catering */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center space-y-3">
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Utensils className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Catering</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Event catering and corporate dining</p>
            </CardContent>
          </Card>

          {/* Food Courts */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 hover:scale-105">
            <CardContent className="p-4 sm:p-6 text-center space-y-3">
              <div className="bg-primary/10 w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <Store className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base">Food Courts</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Mall food courts and food halls</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* African Countries */}
      <section className="container mx-auto px-4 py-12 sm:py-20 max-w-7xl" data-animate="section">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Available Across Africa</h2>
          <p className="text-muted-foreground text-base sm:text-lg">Serving restaurants in major African markets</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {/* Kenya */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-4xl">🇰🇪</div>
              <h3 className="font-semibold text-xs sm:text-sm">Kenya</h3>
              <p className="text-xs text-muted-foreground">Nairobi, Mombasa</p>
            </CardContent>
          </Card>

          {/* Nigeria */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-4xl">🇳🇬</div>
              <h3 className="font-semibold text-xs sm:text-sm">Nigeria</h3>
              <p className="text-xs text-muted-foreground">Lagos, Abuja</p>
            </CardContent>
          </Card>

          {/* South Africa */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-4xl">🇿🇦</div>
              <h3 className="font-semibold text-xs sm:text-sm">South Africa</h3>
              <p className="text-xs text-muted-foreground">Cape Town, Johannesburg</p>
            </CardContent>
          </Card>

          {/* Ghana */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-4xl">🇬🇭</div>
              <h3 className="font-semibold text-xs sm:text-sm">Ghana</h3>
              <p className="text-xs text-muted-foreground">Accra, Kumasi</p>
            </CardContent>
          </Card>

          {/* Egypt */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-4xl">🇪🇬</div>
              <h3 className="font-semibold text-xs sm:text-sm">Egypt</h3>
              <p className="text-xs text-muted-foreground">Cairo, Alexandria</p>
            </CardContent>
          </Card>

          {/* Uganda */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-3 sm:p-6 text-center space-y-2 sm:space-y-3">
              <div className="text-2xl sm:text-4xl">🇺🇬</div>
              <h3 className="font-semibold text-xs sm:text-sm">Uganda</h3>
              <p className="text-xs text-muted-foreground">Kampala, Entebbe</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <p className="text-muted-foreground">
            <Globe className="w-4 h-4 inline mr-2" />
            Expanding to more African countries soon
          </p>
        </div>
      </section>

      {/* Q&A Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl relative z-10" data-animate="section">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Got Questions?</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Quick answers to common questions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          {/* FAQ 1 */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <QrCode className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                    How does it work?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Create your menu, generate a QR code, place it on tables. Customers scan and view instantly!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ 2 */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                    Real-time updates?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Yes! Update anytime from your dashboard. Changes reflect immediately for all customers.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ 3 */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                    App required?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    No! Customers just scan with their camera. Works on any smartphone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ 4 */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                    Pricing?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Flexible plans starting with a free trial. Check our pricing page for details.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ 5 */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Utensils className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                    Customizable?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Yes! Choose templates, colors, add your logo, and organize by categories.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ 6 */}
          <Card className="group hover:shadow-lg hover:scale-105 transition-all duration-300 border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm sm:text-base mb-1 group-hover:text-primary transition-colors">
                    Support?
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Yes! Email, live chat, and phone support available to help you succeed.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Contact CTA */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-sm text-muted-foreground mb-3">Still have questions?</p>
          <Link href="/contact">
            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
              Contact Support
            </Button>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-12 sm:py-20 max-w-7xl">
        <Card className="relative bg-primary text-primary-foreground animate-in fade-in zoom-in-95 duration-700 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden">
          {/* Pattern Background */}
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/pattern.png"
              alt="Pattern background"
              fill
              className="object-cover"
            />
          </div>
          
          <CardContent className="relative z-10 p-6 sm:p-12 text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold hover:scale-105 transition-transform duration-300">Ready to Get Started?</h2>
            <p className="text-base sm:text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of restaurants already using Lanimenu to provide better dining experiences.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base hover:scale-110 hover:shadow-lg transition-all duration-300">
                Create Your Menu Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8 sm:py-16 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Company Info */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg">
                  <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <span className="text-lg sm:text-xl font-bold">Lanimenu</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Transform your restaurant menu into a digital experience. 
                Create beautiful QR code menus that delight your customers.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base">Product</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base">Support</h3>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
                <li><Link href="/tutorials" className="hover:text-foreground transition-colors">Tutorials</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="font-semibold text-sm sm:text-base">Contact</h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>hello@lanimenu.africa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>+234 906 352 5949</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Lagos, Nigeria</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Nairobi, Kenya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
              <div className="text-xs sm:text-sm text-muted-foreground">
                © 2025 Lanimenu. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <Analytics />
    </div>
  )
}
