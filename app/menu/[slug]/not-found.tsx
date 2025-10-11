import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QrCode } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30">
      <div className="text-center space-y-6 max-w-md">
        <div className="mx-auto bg-muted w-20 h-20 rounded-full flex items-center justify-center">
          <QrCode className="w-10 h-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Menu Not Found</h1>
          <p className="text-muted-foreground leading-relaxed">
            The restaurant menu you're looking for doesn't exist or has been removed.
          </p>
        </div>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
