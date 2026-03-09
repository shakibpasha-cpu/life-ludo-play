import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";
import {
  Dices, LogOut, Search, Filter, Users, CalendarDays,
  TrendingUp, Clock, MessageSquare, ChevronDown, Trash2
} from "lucide-react";

type Lead = Tables<"leads">;
type LeadNote = Tables<"lead_notes">;
type LeadStatus = Lead["status"];

const STATUS_LABELS: Record<LeadStatus, string> = {
  new_lead: "New Lead",
  contacted: "Contacted",
  negotiation: "Negotiation",
  confirmed_booking: "Confirmed",
  closed: "Closed",
};

const STATUS_COLORS: Record<LeadStatus, string> = {
  new_lead: "bg-ludo-blue/20 text-ludo-blue",
  contacted: "bg-ludo-yellow/20 text-ludo-yellow",
  negotiation: "bg-primary/20 text-primary",
  confirmed_booking: "bg-ludo-green/20 text-ludo-green",
  closed: "bg-muted text-muted-foreground",
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notes, setNotes] = useState<Record<string, LeadNote[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState("");

  useEffect(() => {
    checkAuth();
    fetchLeads();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/admin"); return; }
    const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!data) { navigate("/admin"); }
  };

  const fetchLeads = async () => {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) { toast.error("Failed to load leads"); return; }
    setLeads(data || []);
    setLoading(false);
  };

  const fetchNotes = async (leadId: string) => {
    const { data } = await supabase
      .from("lead_notes")
      .select("*")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false });
    
    setNotes(prev => ({ ...prev, [leadId]: data || [] }));
  };

  const updateStatus = async (leadId: string, status: LeadStatus) => {
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId);
    
    if (error) { toast.error("Failed to update"); return; }
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));
    toast.success("Status updated");
  };

  const addNote = async () => {
    if (!selectedLead || !newNote.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("lead_notes")
      .insert({ lead_id: selectedLead.id, note: newNote, created_by: user?.id || null });
    
    if (error) { toast.error("Failed to add note"); return; }
    setNewNote("");
    fetchNotes(selectedLead.id);
    toast.success("Note added");
  };

  const deleteLead = async (id: string) => {
    const { error } = await supabase.from("leads").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    setLeads(prev => prev.filter(l => l.id !== id));
    if (selectedLead?.id === id) setSelectedLead(null);
    toast.success("Lead deleted");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const filtered = leads.filter(l => {
    const matchSearch = !searchTerm || 
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm);
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Analytics
  const totalLeads = leads.length;
  const thisMonth = leads.filter(l => {
    const d = new Date(l.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const confirmed = leads.filter(l => l.status === "confirmed_booking").length;
  const conversionRate = totalLeads > 0 ? ((confirmed / totalLeads) * 100).toFixed(1) : "0";
  const upcoming = leads.filter(l => l.event_date && new Date(l.event_date) > new Date()).length;

  const selectLead = (lead: Lead) => {
    setSelectedLead(lead);
    fetchNotes(lead.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Dices className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="mt-4 text-muted-foreground">Loading CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Dices className="w-7 h-7 text-primary" />
            <h1 className="font-display font-bold text-xl">CRM Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>View Site</Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Users, label: "Total Leads", value: totalLeads, color: "text-ludo-blue" },
            { icon: CalendarDays, label: "This Month", value: thisMonth, color: "text-ludo-green" },
            { icon: TrendingUp, label: "Conversion", value: `${conversionRate}%`, color: "text-primary" },
            { icon: Clock, label: "Upcoming Events", value: upcoming, color: "text-ludo-red" },
          ].map(stat => (
            <div key={stat.label} className="glass-card rounded-xl p-5">
              <stat.icon className={`w-6 h-6 mb-2 ${stat.color}`} />
              <p className="text-2xl font-display font-bold">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card h-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
              className="h-10 rounded-lg border border-border bg-card pl-10 pr-8 text-sm text-foreground appearance-none"
            >
              <option value="all">All Status</option>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lead list */}
          <div className="lg:col-span-2 space-y-3">
            {filtered.length === 0 ? (
              <div className="glass-card rounded-xl p-10 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No leads found</p>
              </div>
            ) : (
              filtered.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => selectLead(lead)}
                  className={`glass-card rounded-xl p-4 cursor-pointer transition-all hover:border-primary/50 ${
                    selectedLead?.id === lead.id ? "border-primary" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display font-bold truncate">{lead.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_COLORS[lead.status]}`}>
                          {STATUS_LABELS[lead.status]}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{lead.email}</span>
                        <span>{lead.phone}</span>
                        {lead.city && <span>📍 {lead.city}</span>}
                        {lead.event_type && <span>🎯 {lead.event_type}</span>}
                        {lead.event_date && <span>📅 {format(new Date(lead.event_date), "MMM d, yyyy")}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(lead.created_at), "MMM d")}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                        className="p-1 hover:bg-destructive/20 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Lead detail panel */}
          <div className="space-y-4">
            {selectedLead ? (
              <>
                <div className="glass-card rounded-xl p-6">
                  <h3 className="font-display font-bold text-xl mb-4">{selectedLead.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div><span className="text-muted-foreground">Email:</span> <span>{selectedLead.email}</span></div>
                    <div><span className="text-muted-foreground">Phone:</span> <span>{selectedLead.phone}</span></div>
                    {selectedLead.city && <div><span className="text-muted-foreground">City:</span> <span>{selectedLead.city}</span></div>}
                    {selectedLead.event_type && <div><span className="text-muted-foreground">Event:</span> <span>{selectedLead.event_type}</span></div>}
                    {selectedLead.event_date && <div><span className="text-muted-foreground">Date:</span> <span>{format(new Date(selectedLead.event_date), "MMM d, yyyy")}</span></div>}
                    {selectedLead.participants && <div><span className="text-muted-foreground">Participants:</span> <span>{selectedLead.participants}</span></div>}
                    {selectedLead.message && <div><span className="text-muted-foreground">Message:</span> <p className="mt-1">{selectedLead.message}</p></div>}
                  </div>

                  {/* Status changer */}
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(STATUS_LABELS) as LeadStatus[]).map(status => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedLead.id, status)}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            selectedLead.status === status
                              ? STATUS_COLORS[status]
                              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                          }`}
                        >
                          {STATUS_LABELS[status]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="glass-card rounded-xl p-6">
                  <h4 className="font-display font-bold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Notes
                  </h4>
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                    {(notes[selectedLead.id] || []).map(note => (
                      <div key={note.id} className="bg-secondary/50 rounded-lg p-3">
                        <p className="text-sm">{note.note}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(note.created_at), "MMM d, h:mm a")}
                        </p>
                      </div>
                    ))}
                    {(notes[selectedLead.id] || []).length === 0 && (
                      <p className="text-sm text-muted-foreground">No notes yet</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="bg-background/50 min-h-[60px] text-sm"
                    />
                  </div>
                  <Button variant="hero" size="sm" className="mt-2 w-full" onClick={addNote}>
                    Add Note
                  </Button>
                </div>
              </>
            ) : (
              <div className="glass-card rounded-xl p-10 text-center">
                <MessageSquare className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Select a lead to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
