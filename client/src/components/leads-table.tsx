import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLeads, useDeleteLead } from "@/hooks/use-leads";
import { Link } from "wouter";
import { Search, MoreHorizontal, Trash2, Eye, Calendar, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CreateLeadDialog } from "./create-lead-dialog";

export function LeadsTable() {
  const { data: leads, isLoading } = useLeads();
  const { mutate: deleteLead } = useDeleteLead();
  const [search, setSearch] = useState("");

  const filteredLeads = leads?.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "contacted":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "qualified":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "converted":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "lost":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="glass-card rounded-xl p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 input-glass rounded-xl"
          />
        </div>
        <CreateLeadDialog />
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border/50">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/30 border-b border-border/50">
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Follow Up</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No leads found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads?.map((lead) => (
                <TableRow key={lead.id} className="group hover:bg-muted/30 border-b border-border/50 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <Link href={`/leads/${lead.id}`}>
                        <span className="hover:text-primary hover:underline cursor-pointer transition-colors">
                          {lead.name}
                        </span>
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Mail className="w-3 h-3" />
                      {lead.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${getStatusColor(lead.status)} border rounded-full px-3`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{lead.source}</TableCell>
                  <TableCell>
                    {lead.followUpDate ? (
                      <div className={`flex items-center gap-2 text-sm ${
                        new Date(lead.followUpDate) < new Date() ? "text-red-500 font-medium" : "text-muted-foreground"
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {format(new Date(lead.followUpDate), "MMM d, yyyy")}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground/50">None</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/leads/${lead.id}`} className="cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this lead?")) {
                              deleteLead(lead.id);
                            }
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
