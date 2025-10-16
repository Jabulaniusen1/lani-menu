import { SignUpForm } from "@/components/auth/sign-up-form"
import Link from "next/link"
import { QrCode } from "lucide-react"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row animate-in slide-in-from-right duration-700 ease-out">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 p-8 xl:p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <QrCode className="w-6 h-6 xl:w-8 xl:h-8 text-white" />
          </div>
          <span className="text-xl xl:text-2xl font-bold text-white">Lanimenu</span>
        </div>

        <div className="space-y-4 xl:space-y-6">
          <h1 className="text-3xl xl:text-5xl font-bold text-white leading-tight text-balance">
            Transform your restaurant menu into a digital experience
          </h1>
          <p className="text-lg xl:text-xl text-orange-50 leading-relaxed">
            Create beautiful digital menus accessible via QR codes. Update in real-time, delight your customers.
          </p>
        </div>

        <div className="flex gap-6 xl:gap-8 text-white/80 text-xs xl:text-sm">
          <div>
            <div className="text-2xl xl:text-3xl font-bold text-white">500+</div>
            <div>Restaurants</div>
          </div>
          <div>
            <div className="text-2xl xl:text-3xl font-bold text-white">50K+</div>
            <div>Menu Scans</div>
          </div>
          <div>
            <div className="text-2xl xl:text-3xl font-bold text-white">4.9/5</div>
            <div>Rating</div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3 justify-center mb-6 sm:mb-8 animate-in fade-in slide-in-from-top duration-500 delay-100">
            <div className="bg-orange-500 p-2 rounded-lg">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">Lanimenu</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Create your account</h2>
            <p className="text-sm sm:text-base text-muted-foreground">Start creating your digital menu in minutes</p>
          </div>

          <SignUpForm />

          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary font-medium hover:underline transition-colors duration-200">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
