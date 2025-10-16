import Link from "next/link"
import { QrCode, Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3 justify-center mb-6 sm:mb-8">
            <div className="bg-orange-500 p-2 rounded-lg">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">Lanimenu</span>
          </div>

          <div className="text-center space-y-3 sm:space-y-4">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Check your email</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                We've sent you a confirmation link to verify your account
              </p>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-start gap-2 sm:gap-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-medium text-blue-900">
                    Confirmation email sent
                  </p>
                  <p className="text-xs sm:text-sm text-blue-700">
                    Click the link in your email to activate your account and start creating your digital menu.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-muted-foreground">
              <p className="font-medium">Didn't receive the email?</p>
              <ul className="space-y-1 ml-3 sm:ml-4">
                <li>• Check your spam or junk folder</li>
                <li>• Make sure you entered the correct email address</li>
                <li>• Wait a few minutes for the email to arrive</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full h-10 sm:h-11 text-sm sm:text-base">
                <Link href="/sign-in">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to sign in
                </Link>
              </Button>
              
              <div className="text-center text-xs sm:text-sm text-muted-foreground">
                Need help?{" "}
                <Link href="/contact" className="text-primary font-medium hover:underline transition-colors duration-200">
                  Contact support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 p-8 xl:p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-xl">
            <QrCode className="w-6 h-6 xl:w-8 xl:h-8 text-white" />
          </div>
          <span className="text-xl xl:text-2xl font-bold text-white">Lanimenu</span>
        </div>

        <div className="space-y-6 xl:space-y-8">
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight text-balance">
            You're almost ready to create your digital menu
          </h2>

          <div className="space-y-4 xl:space-y-6">
            <div className="flex gap-3 xl:gap-4">
              <div className="bg-green-500/10 p-2 xl:p-3 rounded-lg h-fit">
                <CheckCircle className="w-5 h-5 xl:w-6 xl:h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-base xl:text-lg font-semibold text-white mb-1">Account Created</h3>
                <p className="text-sm xl:text-base text-slate-300 leading-relaxed">
                  Your restaurant account has been created successfully.
                </p>
              </div>
            </div>

            <div className="flex gap-3 xl:gap-4">
              <div className="bg-orange-500/10 p-2 xl:p-3 rounded-lg h-fit">
                <Mail className="w-5 h-5 xl:w-6 xl:h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-base xl:text-lg font-semibold text-white mb-1">Email Verification</h3>
                <p className="text-sm xl:text-base text-slate-300 leading-relaxed">
                  Check your email and click the confirmation link to activate your account.
                </p>
              </div>
            </div>

            <div className="flex gap-3 xl:gap-4">
              <div className="bg-blue-500/10 p-2 xl:p-3 rounded-lg h-fit">
                <QrCode className="w-5 h-5 xl:w-6 xl:h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-base xl:text-lg font-semibold text-white mb-1">Start Building</h3>
                <p className="text-sm xl:text-base text-slate-300 leading-relaxed">
                  Once verified, you can start creating your beautiful digital menu.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-slate-400 text-xs xl:text-sm">
          Join thousands of restaurants already using Lanimenu for their digital menus.
        </div>
      </div>
    </div>
  )
}
