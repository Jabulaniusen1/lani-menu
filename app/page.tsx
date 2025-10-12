import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { QrCode, Zap, Smartphone, BarChart3, Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg">
                <QrCode className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">QR Menu</span>
            </div>
            <div className="flex items-center gap-6">
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
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center space-y-6 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl font-bold leading-tight text-balance">
            Transform Your Restaurant Menu Into a Digital Experience
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Create beautiful digital menus accessible via QR codes. Update in real-time, delight your customers, and
            modernize your restaurant.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/sign-up">
              <Button size="lg" className="h-12 px-8 text-base">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
          <p className="text-muted-foreground text-lg">Watch how easy it is to create and manage your digital menu</p>
        </div>

        <div className="max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="relative aspect-video bg-secondary/50 rounded-xl border-2 border-border overflow-hidden shadow-2xl">
            {/* Video embed placeholder - replace with your actual video embed code */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
                  <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-primary border-b-[12px] border-b-transparent ml-1" />
                </div>
                <p className="text-muted-foreground">Embed your demo video here</p>
                <p className="text-sm text-muted-foreground/70">
                  Replace this placeholder with your video embed code (YouTube, Vimeo, etc.)
                </p>
              </div>
            </div>
            {/* Example: Uncomment and add your video URL
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
              title="Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            */}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
          <p className="text-muted-foreground text-lg">Powerful features to manage your digital menu</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">QR Code Generation</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate beautiful QR codes for your menu. Print and place them anywhere in your restaurant.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Real-time Updates</h3>
              <p className="text-muted-foreground leading-relaxed">
                Update your menu instantly. Changes reflect immediately for all customers viewing your menu.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Mobile Optimized</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful design that works perfectly on any device. Your customers will love the experience.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[400ms]">
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Easy Management</h3>
              <p className="text-muted-foreground leading-relaxed">
                Simple dashboard to add, edit, and organize your menu items by category.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">No App Required</h3>
              <p className="text-muted-foreground leading-relaxed">
                Customers access your menu directly in their browser. No downloads or installations needed.
              </p>
            </CardContent>
          </Card>

          <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-[600ms]">
            <CardContent className="p-6 space-y-4">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Contactless Dining</h3>
              <p className="text-muted-foreground leading-relaxed">
                Provide a safe, contactless way for customers to view your menu and make decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* African Countries */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-3xl font-bold mb-4">Available Across Africa</h2>
          <p className="text-muted-foreground text-lg">Serving restaurants in major African markets</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {/* Kenya */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">🇰🇪</div>
              <h3 className="font-semibold text-sm">Kenya</h3>
              <p className="text-xs text-muted-foreground">Nairobi, Mombasa</p>
            </CardContent>
          </Card>

          {/* Nigeria */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">🇳🇬</div>
              <h3 className="font-semibold text-sm">Nigeria</h3>
              <p className="text-xs text-muted-foreground">Lagos, Abuja</p>
            </CardContent>
          </Card>

          {/* South Africa */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">🇿🇦</div>
              <h3 className="font-semibold text-sm">South Africa</h3>
              <p className="text-xs text-muted-foreground">Cape Town, Johannesburg</p>
            </CardContent>
          </Card>

          {/* Ghana */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">🇬🇭</div>
              <h3 className="font-semibold text-sm">Ghana</h3>
              <p className="text-xs text-muted-foreground">Accra, Kumasi</p>
            </CardContent>
          </Card>

          {/* Egypt */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">🇪🇬</div>
              <h3 className="font-semibold text-sm">Egypt</h3>
              <p className="text-xs text-muted-foreground">Cairo, Alexandria</p>
            </CardContent>
          </Card>

          {/* Uganda */}
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">🇺🇬</div>
              <h3 className="font-semibold text-sm">Uganda</h3>
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

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 max-w-7xl">
        <Card className="bg-primary text-primary-foreground animate-in fade-in zoom-in-95 duration-700">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of restaurants already using QR Menu to provide better dining experiences.
            </p>
            <Link href="/sign-up">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-base">
                Create Your Menu Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-16 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg">
                  <QrCode className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">QR Menu</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transform your restaurant menu into a digital experience. 
                Create beautiful QR code menus that delight your customers.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="sm" className="p-2">
                  <Facebook className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Twitter className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Linkedin className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/demo" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link href="/integrations" className="hover:text-foreground transition-colors">Integrations</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/status" className="hover:text-foreground transition-colors">Status</Link></li>
                <li><Link href="/tutorials" className="hover:text-foreground transition-colors">Tutorials</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>hello@qrmenu.africa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+254 700 000 000</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Nairobi, Kenya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 QR Menu. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
