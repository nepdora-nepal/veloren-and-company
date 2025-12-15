"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  LogOut, 
  User as UserIcon, 
  Package, 
  ShieldCheck, 
  Camera, 
  Check, 
  MapPin
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { OrdersTab } from "./profile/OrdersTab";

export default function ProfilePage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleUpdateProfile = async () => {
    setIsEditing(false);
    toast.success("Profile updated successfully");
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
        toast.error("New passwords do not match"); 
        return; 
    }
    if (!passwordData.old_password || !passwordData.new_password) {
        toast.error("Please fill in all fields");
        return;
    }
    toast.success("Security settings updated");
    setPasswordData({ old_password: "", new_password: "", confirm_password: "" });
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </div>
    );
  }

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase();

  const menuItems = [
    { id: "account", label: "General", icon: UserIcon, description: "Profile details & shipping" },
    { id: "orders", label: "Orders", icon: Package, description: "Track & manage orders" },
    { id: "security", label: "Security", icon: ShieldCheck, description: "Password & protection" },
  ];

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/10">
      
      {/* Abstract Background Ambient */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vh] bg-primary/5 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 left-[-10%] w-[40vw] h-[40vh] bg-primary/5 rounded-full blur-[100px] opacity-30" />
      </div>

      <main className="container mx-auto px-4 pt-24 pb-20 max-w-6xl">
        {/* Header Section */}
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 md:mb-16"
        >
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-2 text-sm md:text-base font-light">
              Manage your personal information and account preferences.
            </p>
        </motion.div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-8 lg:gap-16 items-start">
          
          {/* Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:sticky lg:top-32 space-y-8"
          >
            {/* Minimal Profile Card */}
            <div className="flex items-center gap-4 pb-6 border-b border-border/40">
                <Avatar className="h-12 w-12 border border-border/50">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-0.5">
                    <p className="font-medium text-sm leading-none">{user.first_name} {user.last_name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={cn(
                            "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group relative",
                            activeTab === item.id 
                                ? "text-primary font-medium bg-primary/5" 
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                        )}
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <item.icon className={cn("w-4 h-4 transition-colors", activeTab === item.id ? "text-primary" : "text-muted-foreground/70")} />
                            <span>{item.label}</span>
                        </div>
                        {activeTab === item.id && (
                          <motion.div 
                            layoutId="activeTabIndicator"
                            className="absolute left-0 w-0.5 h-1/2 top-1/4 bg-primary rounded-r-full"
                          />
                        )}
                    </button>
                ))}
            </nav>

            <div className="pt-6 border-t border-border/40">
                 <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/5 px-3 h-10 text-sm font-normal"
                    onClick={logout}
                >
                    <LogOut className="w-4 h-4 mr-3" />
                    Log out
                 </Button>
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="min-h-[500px]">
            <AnimatePresence mode="wait">
                
                {/* --- ACCOUNT TAB --- */}
                {activeTab === "account" && (
                    <motion.div
                        key={user?.id ? `account-${user.id}` : "account"}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-10"
                    >
                        {/* Section Header with Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
                            <div>
                                <h2 className="text-lg font-medium text-foreground">Profile Information</h2>
                                <p className="text-sm text-muted-foreground font-light">Update your photo and personal details here.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="h-9 px-4 text-xs">
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <>
                                        <Button onClick={handleCancelEdit} variant="ghost" size="sm" className="h-9 px-3 text-xs text-muted-foreground">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleUpdateProfile} size="sm" className="h-9 px-4 text-xs gap-2">
                                            <Check className="w-3.5 h-3.5" /> Save Changes
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Avatar Section */}
                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-background shadow-sm">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="bg-secondary text-secondary-foreground text-2xl font-light">{initials}</AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full shadow-md hover:bg-primary/90 transition-colors">
                                        <Camera className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            {isEditing && (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="text-xs h-8">Upload New</Button>
                                        <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:text-destructive hover:bg-destructive/10">Remove</Button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">JPG, GIF or PNG. Max 1MB.</p>
                                </div>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
                            <ProfileField 
                                label="First Name" 
                                value={formData.first_name} 
                                isEditing={isEditing}
                                onChange={(val) => setFormData({...formData, first_name: val})}
                            />
                            <ProfileField 
                                label="Last Name" 
                                value={formData.last_name} 
                                isEditing={isEditing}
                                onChange={(val) => setFormData({...formData, last_name: val})}
                            />
                            <ProfileField 
                                label="Email Address" 
                                value={formData.email} 
                                isEditing={isEditing}
                                onChange={(val) => setFormData({...formData, email: val})}
                            />
                            <ProfileField 
                                label="Phone Number" 
                                value={formData.phone} 
                                isEditing={isEditing}
                                placeholder="+1 (555) 000-0000"
                                onChange={(val) => setFormData({...formData, phone: val})}
                            />
                            <div className="md:col-span-2">
                                <ProfileField 
                                    label="Shipping Address" 
                                    value={formData.address} 
                                    isEditing={isEditing}
                                    icon={<MapPin className="w-4 h-4" />}
                                    placeholder="Street address, City, State, Zip"
                                    onChange={(val) => setFormData({...formData, address: val})}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- ORDERS TAB --- */}
                {activeTab === "orders" && (
                    <motion.div
                        key="orders"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                    >
                         <div className="mb-8 border-b border-border/40 pb-2">
                            <h2 className="text-lg font-medium text-foreground">Order History</h2>
                            <p className="text-sm text-muted-foreground font-light">View and track your recent purchases.</p>
                        </div>
                        <OrdersTab />
                    </motion.div>
                )}

                {/* --- SECURITY TAB --- */}
                {activeTab === "security" && (
                     <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="max-w-lg"
                    >
                         <div className="mb-8 border-b border-border/40 pb-2">
                            <h2 className="text-lg font-medium text-foreground">Login & Security</h2>
                            <p className="text-sm text-muted-foreground font-light">Manage your password and account security.</p>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Current Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="max-w-md bg-background focus:bg-background transition-all"
                                        value={passwordData.old_password}
                                        onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">New Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="max-w-md bg-background focus:bg-background transition-all"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="max-w-md bg-background focus:bg-background transition-all"
                                        value={passwordData.confirm_password}
                                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                                    />
                                </div>
                            </div>
                            
                            <div className="pt-4 flex items-center gap-4">
                                <Button onClick={handleChangePassword} disabled={isLoading} className="px-6">
                                    {isLoading ? "Updating..." : "Update Password"}
                                </Button>
                                <p className="text-xs text-muted-foreground max-w-[200px] leading-tight">
                                    Secure your account with a strong password.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper Component for Fields
const ProfileField = ({ 
    label, 
    value, 
    isEditing, 
    onChange, 
    icon,
    placeholder = "Not set"
}: { 
    label: string, 
    value: string, 
    isEditing: boolean, 
    onChange: (val: string) => void,
    icon?: React.ReactNode,
    placeholder?: string
}) => {
    return (
        <div className="space-y-2 group">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold pl-1">{label}</Label>
            <div className="relative">
                {isEditing ? (
                    <div className="relative">
                        {icon && <div className="absolute left-3 top-2.5 text-muted-foreground">{icon}</div>}
                        <Input 
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className={cn(
                                "transition-all bg-secondary/20 border-transparent focus:border-input focus:bg-background", 
                                icon && "pl-9"
                            )}
                        />
                    </div>
                ) : (
                    <div className={cn(
                        "flex items-center w-full px-1 py-2 text-base text-foreground font-light border-b border-border/10 group-hover:border-border/40 transition-colors",
                        !value && "text-muted-foreground italic text-sm"
                    )}>
                        {icon && <span className="mr-3 opacity-50">{icon}</span>}
                        {value || placeholder}
                    </div>
                )}
            </div>
        </div>
    );
};
