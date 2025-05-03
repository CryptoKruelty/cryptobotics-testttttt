"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground mt-1">Configure global platform settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="chains">Blockchain Chains</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>Configure general platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" defaultValue="CryptoBotics" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@cryptobotics.io" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord-invite">Discord Support Server Invite</Label>
                <Input id="discord-invite" defaultValue="https://discord.gg/cryptobotics" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <Switch id="maintenance-mode" />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the platform will be in maintenance mode and users will not be able to access it.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="registration-enabled">User Registration</Label>
                  <Switch id="registration-enabled" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">Allow new users to register on the platform.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bot Settings</CardTitle>
              <CardDescription>Configure global bot settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-update-interval">Default Update Interval (seconds)</Label>
                <Input id="default-update-interval" type="number" defaultValue="60" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default-decimal-places">Default Decimal Places</Label>
                <Input id="default-decimal-places" type="number" defaultValue="4" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allow-custom-bots">Allow Custom RPC Bots</Label>
                  <Switch id="allow-custom-bots" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  Allow users to create custom RPC bots with their own queries.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-bots-per-user">Maximum Bots Per User (Free Tier)</Label>
                <Input id="max-bots-per-user" type="number" defaultValue="1" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plans</CardTitle>
              <CardDescription>Configure subscription plans and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Plan Name</TableHead>
                      <TableHead>Price (USD)</TableHead>
                      <TableHead>Bot Quota</TableHead>
                      <TableHead>Stripe Price ID</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Basic</TableCell>
                      <TableCell>$5.00</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>price_basic123456</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Standard</TableCell>
                      <TableCell>$15.00</TableCell>
                      <TableCell>3</TableCell>
                      <TableCell>price_standard123456</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Premium</TableCell>
                      <TableCell>$45.00</TableCell>
                      <TableCell>10</TableCell>
                      <TableCell>price_premium123456</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button variant="outline">Add New Plan</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stripe Integration</CardTitle>
              <CardDescription>Configure Stripe payment settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="stripe-publishable-key">Stripe Publishable Key</Label>
                <Input id="stripe-publishable-key" type="password" defaultValue="pk_test_..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
                <Input id="stripe-secret-key" type="password" defaultValue="sk_test_..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stripe-webhook-secret">Stripe Webhook Secret</Label>
                <Input id="stripe-webhook-secret" type="password" defaultValue="whsec_..." />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="test-mode">Test Mode</Label>
                  <Switch id="test-mode" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the platform will use Stripe test keys instead of live keys.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Discord Integration</CardTitle>
              <CardDescription>Configure Discord OAuth settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discord-client-id">Discord Client ID</Label>
                <Input id="discord-client-id" defaultValue="123456789012345678" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord-client-secret">Discord Client Secret</Label>
                <Input id="discord-client-secret" type="password" defaultValue="abcdefghijklmnopqrstuvwxyz" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discord-redirect-uri">Discord Redirect URI</Label>
                <Input id="discord-redirect-uri" defaultValue="http://localhost:3000/api/auth/callback/discord" />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blockchain API Integration</CardTitle>
              <CardDescription>Configure blockchain API settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alchemy-api-key">Alchemy API Key</Label>
                <Input id="alchemy-api-key" type="password" defaultValue="abcdefghijklmnopqrstuvwxyz" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="infura-api-key">Infura API Key (Optional)</Label>
                <Input id="infura-api-key" placeholder="Enter Infura API key" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="etherscan-api-key">Etherscan API Key (Optional)</Label>
                <Input id="etherscan-api-key" placeholder="Enter Etherscan API key" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="use-fallback-providers">Use Fallback Providers</Label>
                  <Switch id="use-fallback-providers" defaultChecked />
                </div>
                <p className="text-sm text-muted-foreground">
                  When enabled, the platform will use fallback providers if the primary provider fails.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="chains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Supported Blockchain Networks</CardTitle>
              <CardDescription>Configure supported blockchain networks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chain Name</TableHead>
                      <TableHead>Chain ID</TableHead>
                      <TableHead>RPC URL</TableHead>
                      <TableHead>Currency Symbol</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Ethereum</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell className="font-mono text-xs">https://eth-mainnet.g.alchemy.com/v2/...</TableCell>
                      <TableCell>ETH</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Polygon</TableCell>
                      <TableCell>137</TableCell>
                      <TableCell className="font-mono text-xs">https://polygon-mainnet.g.alchemy.com/v2/...</TableCell>
                      <TableCell>MATIC</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Arbitrum</TableCell>
                      <TableCell>42161</TableCell>
                      <TableCell className="font-mono text-xs">https://arb-mainnet.g.alchemy.com/v2/...</TableCell>
                      <TableCell>ARB</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Inactive</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end">
                <Button variant="outline">Add New Chain</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="gradient-bg border-0 hover:opacity-90" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>

          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Chain Configuration</AlertTitle>
            <AlertDescription>
              Adding new chains requires proper RPC endpoints and configuration. Make sure to test the RPC endpoints
              before adding them to the platform.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
