import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Download, ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";

interface Lead {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  contactMethod: string;
  projectType: string[];
  propertyType: string;
  sqft: string;
  stories: string;
  occupied: string;
  hoa: string;
  scope: string[];
  conditions: string[];
  timeline: string;
  dateFlexibility: string;
  budget: string;
  otherBids: string;
  notes: string;
  photos: { caption: string; name: string }[];
  submittedAt: string;
  status: string;
  adminNotes?: string;
}

const statusColors: Record<string, string> = {
  New: "bg-accent/20 text-accent-foreground border-accent",
  Contacted: "bg-blue-100 text-blue-800 border-blue-300",
  "Estimate Scheduled": "bg-emerald-100 text-emerald-800 border-emerald-300",
  Sold: "bg-green-100 text-green-800 border-green-300",
  "Not a Fit": "bg-muted text-muted-foreground border-border",
};

const statuses = ["All", "New", "Contacted", "Estimate Scheduled", "Sold", "Not a Fit"];

const AdminDashboard = () => {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try { return JSON.parse(localStorage.getItem("karma_leads") || "[]"); } catch { return []; }
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    return leads
      .filter(l => {
        const q = search.toLowerCase();
        const matchesSearch = !q || l.fullName.toLowerCase().includes(q) || l.address.toLowerCase().includes(q) || l.projectType.join(" ").toLowerCase().includes(q);
        const matchesStatus = statusFilter === "All" || l.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [leads, search, statusFilter]);

  const updateLeadStatus = (index: number, status: string) => {
    const allLeads = [...leads];
    const origIndex = allLeads.findIndex(l => l.submittedAt === filteredLeads[index].submittedAt);
    if (origIndex !== -1) {
      allLeads[origIndex] = { ...allLeads[origIndex], status };
      setLeads(allLeads);
      localStorage.setItem("karma_leads", JSON.stringify(allLeads));
      if (selectedLead?.submittedAt === filteredLeads[index].submittedAt) {
        setSelectedLead({ ...allLeads[origIndex] });
      }
    }
  };

  const updateAdminNotes = (submittedAt: string, adminNotes: string) => {
    const allLeads = leads.map(l => l.submittedAt === submittedAt ? { ...l, adminNotes } : l);
    setLeads(allLeads);
    localStorage.setItem("karma_leads", JSON.stringify(allLeads));
  };

  const exportCSV = () => {
    const headers = ["Date", "Name", "Phone", "Email", "Address", "Project Type", "Status"];
    const rows = filteredLeads.map(l => [
      new Date(l.submittedAt).toLocaleDateString(), l.fullName, l.phone, l.email, l.address, l.projectType.join("; "), l.status,
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `karma-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCity = (address: string) => {
    const parts = address.split(",");
    return parts.length >= 2 ? parts[parts.length - 2].trim() : "—";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          <h1 className="font-display text-lg font-bold">Admin Dashboard</h1>
        </div>
        <Button variant="gold" size="sm" onClick={exportCSV}>
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      <div className="p-5">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, city, project..." className="pl-10 h-11" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48 h-11"><SelectValue /></SelectTrigger>
            <SelectContent>
              {statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <p className="font-body text-sm text-muted-foreground mb-3">{filteredLeads.length} lead{filteredLeads.length !== 1 ? "s" : ""}</p>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-body text-muted-foreground">No leads yet. Submissions will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filteredLeads.map((lead, i) => (
                <button key={lead.submittedAt} onClick={() => setSelectedLead(lead)} className="w-full text-left bg-card rounded-lg border border-border p-4 shadow-soft">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-body text-sm font-semibold text-foreground">{lead.fullName}</span>
                    <Badge className={`text-xs ${statusColors[lead.status] || ""}`}>{lead.status}</Badge>
                  </div>
                  <p className="font-body text-xs text-muted-foreground">{lead.phone} · {getCity(lead.address)}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{lead.projectType.join(", ")}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">{new Date(lead.submittedAt).toLocaleDateString()}</p>
                </button>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    {["Date", "Name", "Phone", "Email", "City", "Project Type", "Status"].map(h => (
                      <th key={h} className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-3 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, i) => (
                    <tr key={lead.submittedAt} onClick={() => setSelectedLead(lead)} className="border-b border-border hover:bg-secondary/50 cursor-pointer transition-colors">
                      <td className="py-3 pr-4 font-body text-sm text-muted-foreground">{new Date(lead.submittedAt).toLocaleDateString()}</td>
                      <td className="py-3 pr-4 font-body text-sm font-medium text-foreground">{lead.fullName}</td>
                      <td className="py-3 pr-4 font-body text-sm text-muted-foreground">{lead.phone}</td>
                      <td className="py-3 pr-4 font-body text-sm text-muted-foreground">{lead.email || "—"}</td>
                      <td className="py-3 pr-4 font-body text-sm text-muted-foreground">{getCity(lead.address)}</td>
                      <td className="py-3 pr-4 font-body text-sm text-muted-foreground">{lead.projectType.join(", ")}</td>
                      <td className="py-3 pr-4">
                        <Select value={lead.status} onValueChange={v => updateLeadStatus(i, v)}>
                          <SelectTrigger className="h-8 w-40 text-xs border-0 p-0">
                            <Badge className={`text-xs ${statusColors[lead.status] || ""}`}>{lead.status}</Badge>
                          </SelectTrigger>
                          <SelectContent>
                            {statuses.filter(s => s !== "All").map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{selectedLead.fullName}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm font-body">
                <DetailRow label="Phone" value={selectedLead.phone} />
                <DetailRow label="Email" value={selectedLead.email || "—"} />
                <DetailRow label="Address" value={selectedLead.address} />
                <DetailRow label="Contact Method" value={selectedLead.contactMethod} />
                <DetailRow label="Project Type" value={selectedLead.projectType.join(", ")} />
                <DetailRow label="Property" value={`${selectedLead.propertyType || "—"} · ${selectedLead.sqft || "—"} sqft · ${selectedLead.stories || "—"} story`} />
                <DetailRow label="Occupied" value={selectedLead.occupied || "—"} />
                <DetailRow label="HOA" value={selectedLead.hoa || "—"} />
                <DetailRow label="Scope" value={selectedLead.scope.join(", ") || "—"} />
                <DetailRow label="Conditions" value={selectedLead.conditions.join(", ") || "—"} />
                <DetailRow label="Timeline" value={selectedLead.timeline || "—"} />
                <DetailRow label="Flexibility" value={selectedLead.dateFlexibility || "—"} />
                <DetailRow label="Budget" value={selectedLead.budget || "—"} />
                <DetailRow label="Other Bids" value={selectedLead.otherBids || "—"} />
                <DetailRow label="Notes" value={selectedLead.notes || "—"} />
                <DetailRow label="Photos" value={`${selectedLead.photos.length} uploaded`} />
                <DetailRow label="Submitted" value={new Date(selectedLead.submittedAt).toLocaleString()} />

                <div className="pt-3 border-t border-border">
                  <label className="font-body text-sm font-semibold text-foreground block mb-2">Status</label>
                  <Select
                    value={selectedLead.status}
                    onValueChange={v => {
                      const idx = filteredLeads.findIndex(l => l.submittedAt === selectedLead.submittedAt);
                      if (idx !== -1) updateLeadStatus(idx, v);
                    }}
                  >
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statuses.filter(s => s !== "All").map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-body text-sm font-semibold text-foreground block mb-2">Admin Notes</label>
                  <Textarea
                    value={selectedLead.adminNotes || ""}
                    onChange={e => {
                      updateAdminNotes(selectedLead.submittedAt, e.target.value);
                      setSelectedLead({ ...selectedLead, adminNotes: e.target.value });
                    }}
                    placeholder="Add internal notes..."
                    className="min-h-[80px]"
                  />
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-1.5 border-b border-border last:border-0">
    <span className="text-muted-foreground font-medium">{label}</span>
    <span className="text-foreground capitalize sm:text-right max-w-[60%]">{value}</span>
  </div>
);

export default AdminDashboard;
