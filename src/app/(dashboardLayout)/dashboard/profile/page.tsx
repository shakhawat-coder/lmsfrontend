"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/providers/auth-provider";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  UserIcon, 
  LockIcon, 
  CameraIcon,
  ShieldCheckIcon,
  Loader2Icon,
  MailIcon,
  CheckIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { userApi } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsUpdating(true);
    try {
      await userApi.update(user.id, { name: profileData.name });
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (error) {
        toast.error(error.message || "Failed to change password");
      } else {
        toast.success("Password changed successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file size (e.g. 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    
    try {
      await userApi.update(user.id, formData);
      toast.success("Profile picture updated!");
      // The auth-provider should ideally refresh the user session or the user can refresh
      window.location.reload(); 
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return (
    <div className="p-12 flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2Icon className="w-10 h-10 text-blue-600 animate-spin" />
      <p className="text-muted-foreground font-medium animate-pulse">Establishing secure session...</p>
    </div>
  );

  return (
    <div className="max-w-[1100px] mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 pt-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <span className="h-1 w-8 bg-blue-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Account Center</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
            Manage <span className="text-blue-600 italic">Profile</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md">Update your professional identity and security parameters.</p>
        </motion.div>
        
        <Badge className="px-6 py-2 rounded-full font-bold bg-slate-900 text-white shadow-xl shadow-slate-900/10">
          Rank: {user?.role}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <div className="px-4">
          <TabsList className="inline-flex h-14 items-center justify-center rounded-2xl bg-slate-100 p-1.5 text-slate-500 shadow-inner">
            <TabsTrigger 
              value="details" 
              className="rounded-xl px-8 py-2.5 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg"
            >
              <UserIcon className="w-4 h-4 mr-2" /> Personal Details
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-xl px-8 py-2.5 text-sm font-bold transition-all data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-lg"
            >
              <LockIcon className="w-4 h-4 mr-2" /> Security Shield
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="mt-10 px-4">
          <TabsContent value="details" className="mt-0 outline-none">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid lg:grid-cols-12 gap-10 items-start"
            >
              {/* Identity Card */}
              <div className="lg:col-span-4 space-y-6">
                <Card className="rounded-[3rem] border-none shadow-2xl bg-white dark:bg-slate-900 overflow-hidden relative">
                  <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-blue-600 to-indigo-700" />
                  <CardContent className="pt-16 pb-12 flex flex-col items-center text-center relative z-10">
                    <div className="relative group cursor-pointer" onClick={handleImageClick}>
                      <div className="p-1.5 bg-white dark:bg-slate-900 rounded-full shadow-2xl transition-transform duration-500 group-hover:scale-105">
                        <Avatar className="w-36 h-36 border-4 border-slate-50 dark:border-slate-800">
                          <AvatarImage src={user?.image} className="object-cover" />
                          <AvatarFallback className="text-5xl bg-slate-100 text-slate-400 font-black">
                            {user?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                         {isUploading ? (
                           <Loader2Icon className="w-8 h-8 text-white animate-spin" />
                         ) : (
                           <CameraIcon className="w-8 h-8 text-white" />
                         )}
                      </div>
                      
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept="image/*" 
                      />
                    </div>

                    <div className="mt-8 space-y-1">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white capitalize">{user?.name}</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">{user?.email}</p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 w-full grid grid-cols-2 gap-4">
                       <div className="text-left space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Status</span>
                          <p className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Verified
                          </p>
                       </div>
                       <div className="text-left space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Member Since</span>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">2024</p>
                       </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="p-8 bg-blue-50 dark:bg-blue-950/20 rounded-[2.5rem] border border-blue-100 dark:border-blue-900/30">
                   <p className="text-xs font-medium text-blue-700 dark:text-blue-400 leading-relaxed text-center italic">
                     "Your profile image is visible to all administrators and will be used on your digital library card."
                   </p>
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-8">
                <Card className="rounded-[3rem] border-none shadow-3xl bg-white dark:bg-slate-900 overflow-hidden">
                  <CardHeader className="p-12 pb-8 border-b border-slate-50 dark:border-slate-800">
                    <CardTitle className="text-3xl font-black text-slate-900 dark:text-white">Identity Matrix</CardTitle>
                    <CardDescription className="text-lg font-medium">Update your core system identifiers and communication channels.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-12 space-y-10">
                    <form onSubmit={handleUpdateProfile} className="space-y-10">
                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Full Identity</Label>
                          <div className="relative group">
                            <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                            <Input 
                              id="name" 
                              value={profileData.name} 
                              onChange={(e) => setProfileData(p => ({...p, name: e.target.value}))}
                              className="rounded-3xl py-8 px-14 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-blue-100 transition-all font-bold text-lg"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">System Mail</Label>
                          <div className="relative">
                            <MailIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <Input 
                              id="email" 
                              value={profileData.email} 
                              disabled 
                              className="rounded-3xl py-8 px-14 border-slate-100 bg-slate-100/30 opacity-100 cursor-not-allowed text-lg font-bold text-slate-400"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        disabled={isUpdating} 
                        className="rounded-[2rem] py-8 px-14 bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-2xl shadow-blue-500/20 active:scale-95 transition-all w-full md:w-auto"
                      >
                        {isUpdating ? (
                          <>
                            <Loader2Icon className="mr-3 h-6 w-6 animate-spin text-white" />
                            Synchronizing...
                          </>
                        ) : (
                          <>Save Identity</>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="outline-none">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
            >
              <Card className="rounded-[3rem] border-none shadow-3xl bg-white dark:bg-slate-900 overflow-hidden">
                <CardHeader className="p-12 bg-slate-900 text-white border-none flex flex-row items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-black">Security Shield</CardTitle>
                    <CardDescription className="text-slate-400 text-lg font-medium">Protect your portal access and sensitive data.</CardDescription>
                  </div>
                  <div className="hidden md:flex p-4 bg-white/10 rounded-[2rem] backdrop-blur-md border border-white/10">
                     <ShieldCheckIcon className="w-10 h-10 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="p-12 space-y-16">
                   <div className="max-w-2xl mx-auto py-8">
                      <div className="space-y-10">
                         <div className="space-y-2">
                            <h4 className="font-black text-2xl text-slate-900 dark:text-white">Credentials Renewal</h4>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">Update your access key to maintain high-level security profile.</p>
                         </div>
                         <form onSubmit={handleChangePassword} className="space-y-6">
                            <Input 
                              type="password" 
                              placeholder="Current Secure Password" 
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData(p => ({ ...p, currentPassword: e.target.value }))}
                              className="rounded-2xl py-8 px-8 bg-slate-50 dark:bg-slate-800 border-none font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all shadow-inner" 
                            />
                            <Input 
                              type="password" 
                              placeholder="New Encryption Key" 
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(p => ({ ...p, newPassword: e.target.value }))}
                              className="rounded-2xl py-8 px-8 bg-slate-50 dark:bg-slate-800 border-none font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all shadow-inner" 
                            />
                            <Input 
                              type="password" 
                              placeholder="Confirm Encryption Key" 
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(p => ({ ...p, confirmPassword: e.target.value }))}
                              className="rounded-2xl py-8 px-8 bg-slate-50 dark:bg-slate-800 border-none font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-slate-900 transition-all shadow-inner" 
                            />
                            <Button 
                              type="submit"
                              disabled={isChangingPassword}
                              className="w-full rounded-[2rem] py-8 text-xl font-black bg-slate-900 text-white shadow-2xl shadow-slate-900/20 active:translate-y-1 transition-all"
                            >
                              {isChangingPassword ? (
                                <>
                                  <Loader2Icon className="mr-3 h-6 w-6 animate-spin" />
                                  Authorizing...
                                </>
                              ) : (
                                <>Authorize Change</>
                              )}
                            </Button>
                         </form>
                      </div>
                   </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
