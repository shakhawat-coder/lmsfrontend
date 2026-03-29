"use client";

import { useEffect, useState, useMemo } from "react";
import { contactApi } from "@/lib/api";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MailIcon, 
  MessageSquareIcon, 
  CalendarIcon, 
  UserIcon, 
  Trash2Icon, 
  EyeIcon,
  InboxIcon,
  SendIcon,
  ClockIcon
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import { toast } from "sonner";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const data = await contactApi.getAllMessages();
      setMessages(Array.isArray(data) ? data : (data as any).data || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      toast.error("Failed to load contact messages.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const stats = useMemo(() => {
    const total = messages.length;
    const today = messages.filter(m => {
      const date = new Date(m.createdAt);
      const todayDate = new Date();
      return date.toDateString() === todayDate.toDateString();
    }).length;
    
    return [
      { 
        title: "Total Messages", 
        value: total, 
        icon: InboxIcon, 
        color: "text-blue-500", 
        bg: "bg-blue-500/10" 
      },
      { 
        title: "Received Today", 
        value: today, 
        icon: ClockIcon, 
        color: "text-emerald-500", 
        bg: "bg-emerald-500/10" 
      },
      { 
        title: "Pending Sync", 
        value: 0, 
        icon: SendIcon, 
        color: "text-amber-500", 
        bg: "bg-amber-500/10" 
      },
    ];
  }, [messages]);

  const handleDelete = async (id: string) => {
    try {
      toast.promise(
        contactApi.deleteMessage(id),
        {
          loading: 'Deleting message...',
          success: () => {
            setMessages(prev => prev.filter(m => m.id !== id));
            return 'Message deleted successfully';
          },
          error: 'Failed to delete message'
        }
      );
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (isLoading) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground animate-pulse font-medium">Fetching messages...</p>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Customer Inquiries
          </h1>
          <p className="text-muted-foreground mt-1">Review and manage messages sent from the public contact form.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchMessages}
          className="rounded-full px-4 hover:bg-slate-50 transition-colors"
        >
          Refresh Feed
        </Button>
      </div>

      {/* <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bg} p-2.5 rounded-xl`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div> */}

      <div className="bg-card rounded-2xl border border-border/50 shadow-xl overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <InboxIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No messages found.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[200px] pl-6 py-4">Sender</TableHead>
                <TableHead className="py-4">Subject</TableHead>
                <TableHead className="w-[180px] py-4">Date</TableHead>
                <TableHead className="text-right pr-6 py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 border-border/50 transition-all"
                >
                  <TableCell className="pl-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground">{item.name}</span>
                      <span className="text-xs text-muted-foreground">{item.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant="outline" className="font-medium bg-background/50 border-border/50 truncate max-w-[300px]">
                      {item.subject}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <CalendarIcon className="h-3 w-3" />
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6 py-4">
                    <div className="flex justify-end gap-2 pr-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setSelectedMessage(item)}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl">
                          <div className="bg-blue-600 h-2 w-full" />
                          <DialogHeader className="p-8 pb-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="bg-blue-50 p-2 rounded-xl">
                                <MailIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Message Details</span>
                            </div>
                            <DialogTitle className="text-2xl font-bold">{item.subject}</DialogTitle>
                            <DialogDescription className="flex items-center gap-4 mt-2">
                              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                                <UserIcon className="h-3.5 w-3.5" /> {item.name}
                              </span>
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="px-8 pb-6">
                            <div className="bg-slate-50 dark:bg-slate-930 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 min-h-[150px] whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                              {item.message}
                            </div>
                            
                            <div className="flex items-center justify-between mt-6">
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold mb-1">Reply to</span>
                                <a href={`mailto:${item.email}`} className="text-blue-600 text-sm font-bold hover:underline">
                                  {item.email}
                                </a>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <span className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold mb-1">Received</span>
                                <time className="text-xs font-medium text-slate-500">
                                  {new Date(item.createdAt).toLocaleString()}
                                </time>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-3xl border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold">Remove Message?</AlertDialogTitle>
                            <AlertDialogDescription className="text-base py-2">
                              This will permanently delete the message from <span className="font-bold text-foreground">"{item.name}"</span>. 
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4 gap-2">
                            <AlertDialogCancel className="rounded-full border-slate-200">Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(item.id)}
                              className="bg-rose-500 text-white hover:bg-rose-600 rounded-full px-6 font-bold"
                            >
                              Confirm Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
