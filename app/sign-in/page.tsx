import { SignInForm } from "@/components/auth/sign-in-form"
import Link from "next/link"
import { QrCode, Sparkles, Zap, Shield } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="bg-orange-500 p-2 rounded-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">QR Menu</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to manage your restaurant menu</p>
          </div>

          <SignInForm />

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Sign up for free
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">QR Menu</span>
        </div>

        <div className="space-y-8">
          <h2 className="text-4xl font-bold text-white leading-tight text-balance">
            Everything you need to manage your digital menu
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="bg-orange-500/10 p-3 rounded-lg h-fit">
                <Zap className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Real-time Updates</h3>
                <p className="text-slate-300 leading-relaxed">
                  Update your menu instantly. Changes reflect immediately for all customers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-orange-500/10 p-3 rounded-lg h-fit">
                <Sparkles className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Beautiful Design</h3>
                <p className="text-slate-300 leading-relaxed">
                  Professional templates that make your menu look amazing on any device.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-orange-500/10 p-3 rounded-lg h-fit">
                <Shield className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Secure & Reliable</h3>
                <p className="text-slate-300 leading-relaxed">
                  Your data is protected with enterprise-grade security and 99.9% uptime.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-slate-400 text-sm">
          Trusted by restaurants worldwide to deliver exceptional digital menu experiences.
        </div>
      </div>
    </div>
  )
}
