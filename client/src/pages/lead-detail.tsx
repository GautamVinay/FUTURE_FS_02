import { Layout } from "@/components/layout";
import { useLead, useUpdateLead } from "@/hooks/use-leads";
import { useNotes, useCreateNote } from "@/hooks/use-notes";
import { useActivities } from "@/hooks/use-activities";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { ArrowLeft, Mail, Globe, Calendar, Send, History, MessageSquare, Tag } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LeadDetailPage() {
  const [, params] = useRoute("/leads/:id");
  const id = parseInt(params?.id || "0");
  const { data: lead, isLoading } = useLead(id);
  const { data: notes } = useNotes(id);
  const { data: activities } = useActivities(id);
  
  const { mutate: updateLead } = useUpdateLead();
  const { mutate: createNote, isPending: isCreatingNote } = useCreateNote();
  
  const [noteContent, setNoteContent] = useState("");

  if (isLoading || !lead) {
    return (
      <Layout>
        <div className="space-y-6">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </Layout>
    );
  }

  const handleStatusChange = (status: string) => {
    updateLead({ id, status });
  };

  const handleAddNote = () => {
    if (!noteContent.trim()) return;
    createNote(
      { leadId: id, content: noteContent },
      { onSuccess: () => setNoteContent("") }
    );
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href="/leads">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                {lead.name}
                <Badge variant="outline" className="text-base font-normal py-1">
                  {lead.status}
                </Badge>
              </h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" /> {lead.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select defaultValue={lead.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px] glass-card">
                <SelectValue placeholder="Update Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="glass-card">Edit Details</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Timeline & Notes */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass-card p-1 mb-4">
                <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="activity" className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-xl p-6 relative"
                >
                  <div className="absolute left-8 top-6 bottom-6 w-px bg-border" />
                  <div className="space-y-8">
                    {activities?.map((activity, index) => (
                      <motion.div 
                        key={activity.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pl-10 group"
                      >
                        <div className="absolute left-0 w-4 h-4 rounded-full bg-background border-2 border-primary translate-x-[-7px] group-hover:scale-125 transition-transform duration-200" />
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium">{activity.description}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(activity.createdAt!), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                    {activities?.length === 0 && (
                      <p className="text-center text-muted-foreground pl-4">No activity yet.</p>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="notes" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Add Note</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea 
                      placeholder="Type your note here..." 
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="resize-none min-h-[100px] input-glass"
                    />
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddNote} 
                        disabled={!noteContent.trim() || isCreatingNote}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {isCreatingNote ? "Saving..." : "Save Note"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {notes?.map((note) => (
                    <Card key={note.id} className="glass-card border-l-4 border-l-primary/50">
                      <CardContent className="pt-6">
                        <p className="whitespace-pre-wrap">{note.content}</p>
                        <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(note.createdAt!), "MMM d, yyyy")}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Info */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="w-5 h-5 text-primary" />
                    Lead Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Globe className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Source</p>
                      <p className="font-medium">{lead.source}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Created On</p>
                      <p className="font-medium">{format(new Date(lead.createdAt!), "MMM d, yyyy")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <History className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Last Updated</p>
                      <p className="font-medium">{format(new Date(lead.updatedAt!), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {lead.notes && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="glass-card bg-yellow-500/5 border-yellow-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-400">
                      <MessageSquare className="w-4 h-4" />
                      Quick Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm italic text-muted-foreground">"{lead.notes}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
