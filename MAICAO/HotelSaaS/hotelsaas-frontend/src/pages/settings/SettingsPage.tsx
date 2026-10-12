import { ChevronRight, Moon, Sun, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { applyTheme, useUiStore } from '@/store/ui.store'

export function SettingsPage() {
  const { theme, setTheme } = useUiStore()

  const handleThemeChange = (value: string) => {
    const newTheme = value as 'light' | 'dark' | 'system'
    setTheme(newTheme)
    applyTheme(newTheme)
  }

  return (
    <div>
      <PageHeader title="Settings" description="Manage your preferences" />

      <div className="grid gap-6 max-w-2xl">
        <Card className="glass rounded-2xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how HotelSaaS looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Moon className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="theme">Theme</Label>
              </div>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger id="theme" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass rounded-2xl border-0">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your profile and security</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Link
              to="/settings/profile"
              className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Profile</p>
                  <p className="text-sm text-muted-foreground">
                    Update your name, phone, and avatar
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
