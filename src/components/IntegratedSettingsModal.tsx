import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Target, 
  Save, 
  Sparkles,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SaaSData {
  name: string;
  currentUsers: number;
  goalUsers: number;
  monthlyRevenue: number;
  revenueGoal: number;
  churnRate: number;
  growthRate: number;
  historicalData: Array<{
    month: string;
    users: number;
    revenue: number;
  }>;
}

interface IntegratedSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SaaSData;
  onSave: (data: SaaSData) => void;
  isRequired?: boolean;
}

const IntegratedSettingsModal = ({ 
  isOpen, 
  onClose, 
  data, 
  onSave, 
  isRequired = false 
}: IntegratedSettingsModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("basics");
  const [formData, setFormData] = useState<SaaSData>(data);

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.currentUsers > 0 &&
      formData.goalUsers > 0 &&
      formData.monthlyRevenue > 0 &&
      formData.revenueGoal > 0
    );
  };

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
    if (!isFormValid()) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill in all required fields to continue.",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Settings Saved!",
      description: "Your SaaS configuration has been updated successfully.",
    });
    onClose();
  };

  const handleClose = () => {
    if (isRequired && !isFormValid()) {
      toast({
        title: "Configuration Required",
        description: "Please complete your SaaS setup to continue.",
        variant: "destructive",
      });
      return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                  {isRequired ? "Complete Your SaaS Setup" : "SaaS Settings"}
                  {isRequired && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Required
                    </div>
                  )}
                </DialogTitle>
              </DialogHeader>

              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="w-full mt-6"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TabsTrigger value="basics" className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      Basic Info
                    </TabsTrigger>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <TabsTrigger value="goals" className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Goals & Metrics
                    </TabsTrigger>
                  </motion.div>
                </TabsList>

                <div className="mt-6 overflow-y-auto max-h-[60vh]">
                  <motion.div
                    key={activeTab}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <TabsContent value="basics" className="space-y-6 mt-0">
                      <motion.div variants={itemVariants}>
                        <Card className="bg-gradient-card border-border/50">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Settings className="w-5 h-5 text-primary" />
                              Basic Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <motion.div 
                              variants={itemVariants}
                              className="space-y-2"
                            >
                              <Label htmlFor="saas-name">
                                SaaS Name <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                id="saas-name"
                                placeholder="Enter your SaaS name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className={!formData.name.trim() ? "border-destructive" : ""}
                              />
                            </motion.div>

                            <div className="grid grid-cols-2 gap-4">
                              <motion.div 
                                variants={itemVariants}
                                className="space-y-2"
                              >
                                <Label htmlFor="current-users">
                                  Current Users <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="current-users"
                                  type="number"
                                  placeholder="0"
                                  value={formData.currentUsers}
                                  onChange={(e) => setFormData({ 
                                    ...formData, 
                                    currentUsers: parseInt(e.target.value) || 0 
                                  })}
                                  className={formData.currentUsers === 0 ? "border-destructive" : ""}
                                />
                              </motion.div>

                              <motion.div 
                                variants={itemVariants}
                                className="space-y-2"
                              >
                                <Label htmlFor="monthly-revenue">
                                  Monthly Revenue ($) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="monthly-revenue"
                                  type="number"
                                  placeholder="0"
                                  value={formData.monthlyRevenue}
                                  onChange={(e) => setFormData({ 
                                    ...formData, 
                                    monthlyRevenue: parseInt(e.target.value) || 0 
                                  })}
                                  className={formData.monthlyRevenue === 0 ? "border-destructive" : ""}
                                />
                              </motion.div>
                            </div>
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
                              Goals & Targets
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <motion.div 
                                variants={itemVariants}
                                className="space-y-2"
                              >
                                <Label htmlFor="goal-users">
                                  User Goal <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="goal-users"
                                  type="number"
                                  placeholder="0"
                                  value={formData.goalUsers}
                                  onChange={(e) => setFormData({ 
                                    ...formData, 
                                    goalUsers: parseInt(e.target.value) || 0 
                                  })}
                                  className={formData.goalUsers === 0 ? "border-destructive" : ""}
                                />
                              </motion.div>

                              <motion.div 
                                variants={itemVariants}
                                className="space-y-2"
                              >
                                <Label htmlFor="revenue-goal">
                                  Revenue Goal ($) <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                  id="revenue-goal"
                                  type="number"
                                  placeholder="0"
                                  value={formData.revenueGoal}
                                  onChange={(e) => setFormData({ 
                                    ...formData, 
                                    revenueGoal: parseInt(e.target.value) || 0 
                                  })}
                                  className={formData.revenueGoal === 0 ? "border-destructive" : ""}
                                />
                              </motion.div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <motion.div 
                                variants={itemVariants}
                                className="space-y-2"
                              >
                                <Label htmlFor="churn-rate">Churn Rate (%)</Label>
                                <Input
                                  id="churn-rate"
                                  type="number"
                                  placeholder="0"
                                  value={formData.churnRate}
                                  onChange={(e) => setFormData({ 
                                    ...formData, 
                                    churnRate: parseInt(e.target.value) || 0 
                                  })}
                                />
                              </motion.div>

                              <motion.div 
                                variants={itemVariants}
                                className="space-y-2"
                              >
                                <Label htmlFor="growth-rate">Growth Rate (%/month)</Label>
                                <Input
                                  id="growth-rate"
                                  type="number"
                                  placeholder="0"
                                  value={formData.growthRate}
                                  onChange={(e) => setFormData({ 
                                    ...formData, 
                                    growthRate: parseInt(e.target.value) || 0 
                                  })}
                                />
                              </motion.div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </TabsContent>
                  </motion.div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {isRequired && "* Required fields must be completed"}
                  </div>
                  <div className="flex gap-3">
                    {!isRequired && (
                      <Button variant="outline" onClick={handleClose}>
                        Cancel
                      </Button>
                    )}
                    <Button 
                      onClick={handleSave}
                      className="gap-2"
                      disabled={!isFormValid()}
                    >
                      <Save className="w-4 h-4" />
                      {isRequired ? "Complete Setup" : "Save Settings"}
                    </Button>
                  </div>
                </div>
              </Tabs>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

export default IntegratedSettingsModal;