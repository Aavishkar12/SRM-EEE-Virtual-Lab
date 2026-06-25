"use client"
import { NavDock } from "@/components/nav-dock"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { DigitalClock } from "@/components/digital-clock"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Home, BookOpen, Settings, LogIn, FileQuestion, Users, Info, Library, User } from "lucide-react"
import { SrmAccessGate } from "@/components/srm-access-gate"
import { apiUrl } from "@/lib/api"
import { getStudentDisplayName } from "@/lib/auth"
import {
  Bell,
  Lock,
  Palette,
  Shield,
  UserCircle,
  Mail,
  Building2,
  Hash,
} from "lucide-react"

export default function SettingsPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("account")
  const isAdmin = session?.user?.role === "admin"
  
  // Dynamic admin accounts list state
  const [adminEmails, setAdminEmails] = useState<string[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [loadingAdmins, setLoadingAdmins] = useState(false)

  const fetchAdmins = async () => {
    if (!isAdmin) return
    setLoadingAdmins(true)
    try {
      const res = await fetch(apiUrl("/api/admins"))
      if (res.ok) {
        const data = await res.json()
        setAdminEmails(data)
      } else {
        toast.error("Failed to load admin emails.")
      }
    } catch (error) {
      toast.error("An error occurred loading admin list.")
    } finally {
      setLoadingAdmins(false)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAdmins()
    }
  }, [isAdmin])

  const handleAddAdmin = async () => {
    if (!newAdminEmail) return
    try {
      const res = await fetch(apiUrl("/api/admins"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newAdminEmail }),
      })
      if (res.ok) {
        toast.success("Admin account added successfully!")
        setNewAdminEmail("")
        fetchAdmins()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to add admin account.")
      }
    } catch (error) {
      toast.error("An error occurred.")
    }
  }

  const handleDeleteAdmin = async (email: string) => {
    if (!confirm(`Are you sure you want to revoke admin access for ${email}?`)) return
    try {
      const res = await fetch(apiUrl(`/api/admins?email=${encodeURIComponent(email)}`), {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Admin access revoked successfully.")
        fetchAdmins()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to revoke admin access.")
      }
    } catch (error) {
      toast.error("An error occurred.")
    }
  }
  

  // Account settings
  const displayName = getStudentDisplayName(session?.user)
  const [accountSettings, setAccountSettings] = useState({
    name: displayName,
    email: session?.user?.email || "",
    bio: session?.user?.branch || session?.user?.department
      ? `${session.user.branch ?? session.user.department}${session.user.section ? `, Section ${session.user.section}` : ""}`
      : "Electrical Engineering student at SRM University",
  })

  useEffect(() => {
    if (session?.user) {
      setAccountSettings({
        name: getStudentDisplayName(session.user),
        email: session.user.email || "",
        bio: session.user.branch || session.user.department
          ? `${session.user.branch ?? session.user.department}${session.user.section ? `, Section ${session.user.section}` : ""}`
          : "Electrical Engineering student at SRM University",
      })
    }
  }, [session])

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: true,
    highContrast: false,
    fontSize: 16,
    animationsEnabled: true,
  })

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    experimentUpdates: true,
    newExperiments: true,
    quizReminders: false,
  })

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    shareProgress: true,
    publicProfile: false,
    dataCollection: true,
  })

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAccountSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleAppearanceChange = (key: string, value: boolean | number) => {
    setAppearanceSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Save settings to localStorage for demo purposes
      localStorage.setItem("accountSettings", JSON.stringify(accountSettings))
      localStorage.setItem("appearanceSettings", JSON.stringify(appearanceSettings))
      localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
      localStorage.setItem("privacySettings", JSON.stringify(privacySettings))

      toast.success("Settings saved successfully!")
    } catch (error) {
      toast.error("Failed to save settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SrmAccessGate
      title="SRM settings access"
      description="Settings are available only to signed-in SRM users."
    >
    <div className="min-h-screen overflow-x-hidden bg-[#050508] text-white">
      {/* Dynamic Sidebar */}
      
      {/* Centered navigation at the top */}


      <DigitalClock />

      
      <NavDock />
<div className="w-full max-w-6xl mx-auto px-4 py-8 pt-28 sm:pt-32">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-300/70">
                Preferences
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-white">Settings</h1>
              <p className="mt-2 max-w-2xl text-neutral-400">
                Manage your account, appearance, notifications, and administrative access.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 px-5 py-4 backdrop-blur-xl">
              <p className="text-sm font-semibold text-white">{displayName}</p>
              <p className="text-xs text-neutral-500">{session?.user?.email}</p>
            </div>
          </div>

          <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
            <TabsList className={`grid w-full ${isAdmin ? "grid-cols-5" : "grid-cols-4"} rounded-2xl border border-neutral-800 bg-neutral-950/80 p-1`}>
              <TabsTrigger value="account" className="gap-1.5 rounded-xl data-[state=active]:bg-blue-900/40 text-white">
                <UserCircle className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-1.5 rounded-xl data-[state=active]:bg-blue-900/40 text-white">
                <Palette className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-1.5 rounded-xl data-[state=active]:bg-blue-900/40 text-white">
                <Bell className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Alerts</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="gap-1.5 rounded-xl data-[state=active]:bg-blue-900/40 text-white">
                <Lock className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="admins" className="gap-1.5 rounded-xl data-[state=active]:bg-emerald-950/40 text-white">
                  <Shield className="h-4 w-4 shrink-0" />
                  <span className="hidden sm:inline">Admins</span>
                </TabsTrigger>
              )}
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="mt-6">
              <div className="space-y-6">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl">
                  <h2 className="mb-2 text-xl font-semibold">Academia Profile</h2>
                  <p className="mb-6 text-sm text-neutral-400">
                    These details are synced from your SRM Academia account.
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <UserCircle className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.16em]">Student Name</span>
                      </div>
                      <p className="font-medium text-white">{displayName}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <Mail className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.16em]">Email</span>
                      </div>
                      <p className="font-medium text-white">{session?.user?.email}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <Hash className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.16em]">Registration No.</span>
                      </div>
                      <p className="font-medium text-white">{session?.user?.registrationNumber || "—"}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <Building2 className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.16em]">Branch</span>
                      </div>
                      <p className="font-medium text-white">{session?.user?.branch ?? session?.user?.department ?? "—"}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <Hash className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.16em]">Year</span>
                      </div>
                      <p className="font-medium text-white">{session?.user?.year || "—"}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <Hash className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.16em]">Semester</span>
                      </div>
                      <p className="font-medium text-white">{session?.user?.semester || "—"}</p>
                    </div>
                    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
                      <div className="mb-2 flex items-center gap-2 text-neutral-500">
                        <Hash className="h-4 w-4" />
                        <span className="text-xs uppercase tracking-[0.16em]">Batch</span>
                      </div>
                      <p className="font-medium text-white">{session?.user?.batch || "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl">
                  <h2 className="mb-6 text-xl font-semibold">Display Preferences</h2>

                  <div className="space-y-6">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Display Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={accountSettings.name}
                        onChange={handleAccountChange}
                        className="border-neutral-700 bg-neutral-800"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={accountSettings.bio}
                        onChange={handleAccountChange}
                        rows={4}
                        className="resize-none rounded-md border border-neutral-700 bg-neutral-800 p-2 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="mt-6">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold mb-6">Appearance Settings</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="darkMode" className="text-base">
                        Dark Mode
                      </Label>
                      <p className="text-sm text-neutral-400">Enable dark theme for the application</p>
                    </div>
                    <Switch
                      id="darkMode"
                      checked={appearanceSettings.darkMode}
                      onCheckedChange={(checked) => handleAppearanceChange("darkMode", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="highContrast" className="text-base">
                        High Contrast
                      </Label>
                      <p className="text-sm text-neutral-400">Increase contrast for better visibility</p>
                    </div>
                    <Switch
                      id="highContrast"
                      checked={appearanceSettings.highContrast}
                      onCheckedChange={(checked) => handleAppearanceChange("highContrast", checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="fontSize" className="text-base">
                        Font Size
                      </Label>
                      <span className="text-sm text-neutral-400">{appearanceSettings.fontSize}px</span>
                    </div>
                    <Slider
                      id="fontSize"
                      min={12}
                      max={24}
                      step={1}
                      value={[appearanceSettings.fontSize]}
                      onValueChange={(value) => handleAppearanceChange("fontSize", value[0])}
                      className="w-full"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="animationsEnabled" className="text-base">
                        Animations
                      </Label>
                      <p className="text-sm text-neutral-400">Enable animations throughout the application</p>
                    </div>
                    <Switch
                      id="animationsEnabled"
                      checked={appearanceSettings.animationsEnabled}
                      onCheckedChange={(checked) => handleAppearanceChange("animationsEnabled", checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="mt-6">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications" className="text-base">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-neutral-400">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="experimentUpdates" className="text-base">
                        Experiment Updates
                      </Label>
                      <p className="text-sm text-neutral-400">Get notified about updates to experiments</p>
                    </div>
                    <Switch
                      id="experimentUpdates"
                      checked={notificationSettings.experimentUpdates}
                      onCheckedChange={(checked) => handleNotificationChange("experimentUpdates", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="newExperiments" className="text-base">
                        New Experiments
                      </Label>
                      <p className="text-sm text-neutral-400">Get notified when new experiments are added</p>
                    </div>
                    <Switch
                      id="newExperiments"
                      checked={notificationSettings.newExperiments}
                      onCheckedChange={(checked) => handleNotificationChange("newExperiments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="quizReminders" className="text-base">
                        Quiz Reminders
                      </Label>
                      <p className="text-sm text-neutral-400">Receive reminders about upcoming quizzes</p>
                    </div>
                    <Switch
                      id="quizReminders"
                      checked={notificationSettings.quizReminders}
                      onCheckedChange={(checked) => handleNotificationChange("quizReminders", checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="mt-6">
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold mb-6">Privacy Settings</h2>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="shareProgress" className="text-base">
                        Share Progress
                      </Label>
                      <p className="text-sm text-neutral-400">Allow instructors to view your experiment progress</p>
                    </div>
                    <Switch
                      id="shareProgress"
                      checked={privacySettings.shareProgress}
                      onCheckedChange={(checked) => handlePrivacyChange("shareProgress", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="publicProfile" className="text-base">
                        Public Profile
                      </Label>
                      <p className="text-sm text-neutral-400">Make your profile visible to other students</p>
                    </div>
                    <Switch
                      id="publicProfile"
                      checked={privacySettings.publicProfile}
                      onCheckedChange={(checked) => handlePrivacyChange("publicProfile", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dataCollection" className="text-base">
                        Data Collection
                      </Label>
                      <p className="text-sm text-neutral-400">
                        Allow anonymous usage data collection to improve the platform
                      </p>
                    </div>
                    <Switch
                      id="dataCollection"
                      checked={privacySettings.dataCollection}
                      onCheckedChange={(checked) => handlePrivacyChange("dataCollection", checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Manage Admins Settings (Only for Admins) */}
            {isAdmin && (
              <TabsContent value="admins" className="mt-6">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl">
                  <h2 className="text-xl font-semibold mb-2">Manage Administrative Accounts</h2>
                  <p className="text-neutral-400 text-sm mb-6">
                    Add or remove accounts that have administrative permissions (creating, editing, and deleting academic resources).
                  </p>

                  <div className="space-y-6">
                    {/* Add Admin Email */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-grow">
                        <Input
                          placeholder="Admin Email (e.g. professor@srmist.edu.in)"
                          value={newAdminEmail}
                          onChange={(e) => setNewAdminEmail(e.target.value)}
                          className="bg-neutral-800 border-neutral-700 text-white focus:ring-emerald-500 focus:border-emerald-500"
                        />
                      </div>
                      <Button
                        onClick={handleAddAdmin}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        Add Admin
                      </Button>
                    </div>

                    {/* Admin List */}
                    <div className="mt-6 border border-neutral-800 rounded-lg overflow-hidden">
                      <div className="bg-neutral-950 px-4 py-3 border-b border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                        Authorized Admin Emails
                      </div>
                      {loadingAdmins ? (
                        <div className="p-4 text-center text-sm text-neutral-500">Loading admin accounts...</div>
                      ) : adminEmails.length === 0 ? (
                        <div className="p-4 text-center text-sm text-neutral-500">No dynamically authorized admins found.</div>
                      ) : (
                        <div className="divide-y divide-neutral-800">
                          {adminEmails.map((email) => {
                            const isCurrentUser = email.toLowerCase().trim() === session?.user?.email?.toLowerCase().trim()
                            return (
                              <div key={email} className="flex items-center justify-between px-4 py-3 bg-neutral-900 hover:bg-neutral-800/50">
                                <span className="text-sm font-medium text-white">{email}</span>
                                {isCurrentUser ? (
                                  <span className="text-xs text-neutral-500 italic px-3 py-1 bg-neutral-800 rounded-full">Current User</span>
                                ) : (
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteAdmin(email)}
                                    className="h-8 px-3 text-xs bg-red-950/60 border border-red-800/40 text-red-300 hover:bg-red-900"
                                  >
                                    Revoke Access
                                  </Button>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>

          <div className="mt-8 flex justify-end">
            <Button onClick={saveSettings} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
    </SrmAccessGate>
  )
}
