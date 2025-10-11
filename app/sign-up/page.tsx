import { SignUpForm } from "@/components/auth/sign-up-form"
import Link from "next/link"
import { QrCode } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">QR Menu</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-white leading-tight text-balance">
            Transform your restaurant menu into a digital experience
          </h1>
          <p className="text-xl text-orange-50 leading-relaxed">
            Create beautiful digital menus accessible via QR codes. Update in real-time, delight your customers.
          </p>
        </div>

        <div className="flex gap-8 text-white/80 text-sm">
          <div>
            <div className="text-3xl font-bold text-white">500+</div>
            <div>Restaurants</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">50K+</div>
            <div>Menu Scans</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">4.9/5</div>
            <div>Rating</div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="bg-orange-500 p-2 rounded-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">QR Menu</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Create your account</h2>
            <p className="text-muted-foreground">Start creating your digital menu in minutes</p>
          </div>

          <SignUpForm />

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
