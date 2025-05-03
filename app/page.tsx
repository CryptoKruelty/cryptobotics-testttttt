import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bot, DollarSign, Shield, Zap, Check, ChevronRight, BarChart3 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Bot className="h-6 w-6 text-primary" />
            <span>CryptoBotics</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/login">
              <Button className="gradient-bg border-0 hover:opacity-90">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-30"></div>
          <div className="container flex flex-col items-center text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Automated <span className="gradient-text">Crypto Bots</span> for Discord
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mb-10">
              Keep your community informed with real-time cryptocurrency data, price alerts, and custom blockchain
              metrics - all through Discord.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login">
                <Button size="lg" className="gradient-bg border-0 hover:opacity-90 gap-2 h-12 px-6">
                  Start for Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="h-12 px-6">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats Section */}
            <div className="mt-16 w-full max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-30"></div>
                <div className="relative bg-card rounded-xl border p-8 md:p-10">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold">Powering Crypto Communities</h2>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      { value: "60s", label: "Update Frequency" },
                      { value: "99.9%", label: "Uptime Guarantee" },
                      { value: "10+", label: "Bot Types" },
                      { value: "24/7", label: "Monitoring" },
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rest of the homepage content remains the same */}
        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50 relative">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need for <span className="gradient-text">Crypto Discord Bots</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powerful features to keep your Discord community engaged and informed with real-time crypto data
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card p-6 rounded-xl border shadow-sm card-hover">
                <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Price & Market Data</h3>
                <p className="text-muted-foreground">
                  Display real-time token prices, market caps, and trading volumes directly in Discord nicknames and
                  statuses.
                </p>
                <ul className="mt-4 space-y-2">
                  {["Real-time price updates", "24h change indicators", "Volume tracking"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-card p-6 rounded-xl border shadow-sm card-hover">
                <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Whale Alerts</h3>
                <p className="text-muted-foreground">
                  Notify your community when large transactions occur on the blockchain with customizable threshold
                  alerts.
                </p>
                <ul className="mt-4 space-y-2">
                  {["Customizable thresholds", "Transaction details", "Wallet tracking"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="bg-card p-6 rounded-xl border shadow-sm card-hover">
                <div className="h-12 w-12 rounded-full gradient-bg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Custom RPC Bots</h3>
                <p className="text-muted-foreground">
                  Create bots that fetch any on-chain data using custom RPC calls to display exactly what your community
                  needs.
                </p>
                <ul className="mt-4 space-y-2">
                  {["Custom blockchain queries", "Flexible formatting", "Multiple chains supported"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How <span className="gradient-text">CryptoBotics</span> Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Get your crypto Discord bots up and running in minutes with our simple setup process
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Create Your Bot",
                  description: "Choose from our pre-built bot types or create a custom bot with your own RPC calls.",
                  icon: Bot,
                },
                {
                  step: "2",
                  title: "Connect to Discord",
                  description: "Link your bot to your Discord server with our simple integration process.",
                  icon: ChevronRight,
                },
                {
                  step: "3",
                  title: "Monitor & Customize",
                  description: "Track performance and adjust settings from your dashboard as needed.",
                  icon: BarChart3,
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-20"></div>
                  <Card className="relative bg-card p-6 rounded-xl border shadow-sm h-full flex flex-col">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <span className="text-xl font-bold text-primary">{item.step}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground flex-grow">{item.description}</p>
                    <div className="mt-4 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, <span className="gradient-text">Transparent</span> Pricing
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pay only for what you use with our bot-based pricing model
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-30"></div>
                <Card className="relative bg-card p-8 rounded-xl border shadow-lg">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">Pay Per Bot</h3>
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold">$5</span>
                      <span className="text-muted-foreground ml-2">/bot/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {[
                      "One bot included in free tier",
                      "60-second update intervals",
                      "All bot types included",
                      "Discord priority support",
                      "99.9% uptime guarantee",
                    ].map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/login" className="block">
                    <Button className="w-full gradient-bg border-0 hover:opacity-90">Get Started</Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground mt-4">
                    No credit card required for free tier
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-30"></div>
              <Card className="relative overflow-hidden">
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to enhance your Discord server?</h2>
                    <p className="text-muted-foreground max-w-2xl">
                      Get started with CryptoBotics today and keep your community engaged with real-time crypto data.
                    </p>
                  </div>
                  <Link href="/login">
                    <Button size="lg" className="gradient-bg border-0 hover:opacity-90 h-12 px-6">
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">CryptoBotics</span>
            </div>
            <div className="flex gap-8">
              <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </Link>
            </div>
          </div>
          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CryptoBotics. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
