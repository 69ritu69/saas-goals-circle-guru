import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Palette, 
  Target, 
  Save, 
  Sparkles,
  MonitorSpeaker,
  Bell,
  Moon,
  Sun
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsData {
  // SaaS Configuration
  companyName: string;
  industry: string;
  website: string;
  timezone: string;
  currency: string;
  
  // Display Preferences
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  soundEffects: boolean;
  compactMode: boolean;
  language: string;
  
  // Goal Tracking
  userGoal: number;
  revenueGoal: number;
  growthTarget: number;
  trackingPeriod: 'monthly' | 'quarterly' | 'yearly';
  autoReminders: boolean;
}

const SettingsModal = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("saas");
  const [settings, setSettings] = useState<SettingsData>({
    companyName: "",
    industry: "",
    website: "",
    timezone: "UTC",
    currency: "USD",
    theme: "system",
    notifications: true,
    soundEffects: true,
    compactMode: false,
    language: "en",
    userGoal: 1000,
    revenueGoal: 10000,
    growthTarget: 20,
    trackingPeriod: "monthly",
    autoReminders: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 24
      }
    }
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved!",
      description: "Your preferences have been updated successfully.",
    });
    setIsOpen(false);
  };

  const TabIcon = ({ tab }: { tab: string }) => {
    const icons = {
      saas: Settings,
      display: Palette,
      goals: Target
    };
    const Icon = icons[tab as keyof typeof icons];
    return <Icon className="w-4 h-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </motion.div>
      </DialogTrigger>
      
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  User Settings
                </DialogTitle>
              </DialogHeader>

              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full mt-6"
              >
                <TabsList className="grid w-full grid-cols-3">
                  {["saas", "display", "goals"].map((tab) => (
                    <motion.div
                      key={tab}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <TabsTrigger value={tab} className="flex items-center gap-2 capitalize">
                        <TabIcon tab={tab} />
                        {tab === "saas" ? "SaaS Config" : tab === "display" ? "Display" : "Goals"}
                      </TabsTrigger>
                    </motion.div>
                  ))}
                </TabsList>

                <div className="mt-6 overflow-y-auto max-h-[60vh]">
                  <motion.div
                    key={activeTab}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <TabsContent value="saas" className="space-y-6 mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-card border-border/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Settings className="w-5 h-5 text-primary" />
                              SaaS Configuration
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <motion.div 
                                variants={itemVariants}
                                className="space-y-2"
                              >
                                <Label htmlFor="company">Company Name</Label>
                                <Input
                                  id="company"
                                  placeholder="Your Company Name"
                                  value={settings.companyName}
                                  onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                                />
                              </motion.div>
                              
                              <motion.div 
                                variants={itemVariants}
                                className="space-y-2"
                              >
                                <Label htmlFor="industry">Industry</Label>
                                <Select 
                                  value={settings.industry} 
                                  onValueChange={(value) => setSettings({...settings, industry: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select industry" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="saas">SaaS</SelectItem>
                                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                                    <SelectItem value="fintech">Fintech</SelectItem>
                                    <SelectItem value="healthcare">Healthcare</SelectItem>
                                    <SelectItem value="education">Education</SelectItem>
                                  </SelectContent>
                                </Select>
                              </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="space-y-2">
                              <Label htmlFor="website">Website URL</Label>
                              <Input
                                id="website"
                                placeholder="https://yourcompany.com"
                                value={settings.website}
                                onChange={(e) => setSettings({...settings, website: e.target.value})}
                              />
                            </motion.div>

                            <div className="grid grid-cols-2 gap-4">
                              <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select 
                                  value={settings.timezone} 
                                  onValueChange={(value) => setSettings({...settings, timezone: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="UTC">UTC</SelectItem>
                                    <SelectItem value="EST">EST</SelectItem>
                                    <SelectItem value="PST">PST</SelectItem>
                                    <SelectItem value="CET">CET</SelectItem>
                                  </SelectContent>
                                </Select>
                              </motion.div>

                              <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="currency">Currency</Label>
                                <Select 
                                  value={settings.currency} 
                                  onValueChange={(value) => setSettings({...settings, currency: value})}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="USD">USD</SelectItem>
                                    <SelectItem value="EUR">EUR</SelectItem>
                                    <SelectItem value="GBP">GBP</SelectItem>
                                    <SelectItem value="JPY">JPY</SelectItem>
                                  </SelectContent>
                                </Select>
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="display" className="space-y-6 mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-card border-border/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Palette className="w-5 h-5 text-primary" />
                              Display Preferences
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="flex items-center gap-2">
                                  {settings.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                                  Theme
                                </Label>
                                <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                              </div>
                              <Select 
                                value={settings.theme} 
                                onValueChange={(value: any) => setSettings({...settings, theme: value})}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                  <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                              </Select>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="flex items-center gap-2">
                                  <Bell className="w-4 h-4" />
                                  Notifications
                                </Label>
                                <p className="text-sm text-muted-foreground">Receive desktop notifications</p>
                              </div>
                              <motion.div
                                whileTap={{ scale: 0.95 }}
                              >
                                <Switch
                                  checked={settings.notifications}
                                  onCheckedChange={(checked) => setSettings({...settings, notifications: checked})}
                                />
                              </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="flex items-center gap-2">
                                  <MonitorSpeaker className="w-4 h-4" />
                                  Sound Effects
                                </Label>
                                <p className="text-sm text-muted-foreground">Enable audio feedback</p>
                              </div>
                              <motion.div
                                whileTap={{ scale: 0.95 }}
                              >
                                <Switch
                                  checked={settings.soundEffects}
                                  onCheckedChange={(checked) => setSettings({...settings, soundEffects: checked})}
                                />
                              </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label>Compact Mode</Label>
                                <p className="text-sm text-muted-foreground">Reduce spacing for dense layouts</p>
                              </div>
                              <motion.div
                                whileTap={{ scale: 0.95 }}
                              >
                                <Switch
                                  checked={settings.compactMode}
                                  onCheckedChange={(checked) => setSettings({...settings, compactMode: checked})}
                                />
                              </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <Select 
                                value={settings.language} 
                                onValueChange={(value) => setSettings({...settings, language: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="es">Español</SelectItem>
                                  <SelectItem value="fr">Français</SelectItem>
                                  <SelectItem value="de">Deutsch</SelectItem>
                                </SelectContent>
                              </Select>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>

                    <TabsContent value="goals" className="space-y-6 mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-card border-border/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Target className="w-5 h-5 text-primary" />
                              Goal Tracking
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="user-goal">User Goal</Label>
                                <Input
                                  id="user-goal"
                                  type="number"
                                  placeholder="1000"
                                  value={settings.userGoal}
                                  onChange={(e) => setSettings({...settings, userGoal: parseInt(e.target.value) || 0})}
                                />
                              </motion.div>

                              <motion.div variants={itemVariants} className="space-y-2">
                                <Label htmlFor="revenue-goal">Revenue Goal ($)</Label>
                                <Input
                                  id="revenue-goal"
                                  type="number"
                                  placeholder="10000"
                                  value={settings.revenueGoal}
                                  onChange={(e) => setSettings({...settings, revenueGoal: parseInt(e.target.value) || 0})}
                                />
                              </motion.div>
                            </div>

                            <motion.div variants={itemVariants} className="space-y-2">
                              <Label htmlFor="growth-target">Growth Target (%)</Label>
                              <Input
                                id="growth-target"
                                type="number"
                                placeholder="20"
                                value={settings.growthTarget}
                                onChange={(e) => setSettings({...settings, growthTarget: parseInt(e.target.value) || 0})}
                              />
                            </motion.div>

                            <motion.div variants={itemVariants} className="space-y-2">
                              <Label htmlFor="tracking-period">Tracking Period</Label>
                              <Select 
                                value={settings.trackingPeriod} 
                                onValueChange={(value: any) => setSettings({...settings, trackingPeriod: value})}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                  <SelectItem value="quarterly">Quarterly</SelectItem>
                                  <SelectItem value="yearly">Yearly</SelectItem>
                                </SelectContent>
                              </Select>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label>Auto Reminders</Label>
                                <p className="text-sm text-muted-foreground">Get reminded when goals need attention</p>
                              </div>
                              <motion.div
                                whileTap={{ scale: 0.95 }}
                              >
                                <Switch
                                  checked={settings.autoReminders}
                                  onCheckedChange={(checked) => setSettings({...settings, autoReminders: checked})}
                                />
                              </motion.div>
                            </motion.div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>
                  </motion.div>
                </div>

                <motion.div 
                  className="flex justify-end gap-3 mt-6 pt-4 border-t"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Settings
                    </Button>
                  </motion.div>
                </motion.div>
              </Tabs>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default SettingsModal;