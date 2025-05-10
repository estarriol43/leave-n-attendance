import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"

export const metadata = {
  title: "Login - Leave and Attendance System",
  description: "Log in to the Cloud Native Leave and Attendance System",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <main className="min-h-screen">
        {children}
      </main>
      <Toaster />
    </ThemeProvider>
  )
} 