import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Upload, X, Send } from "lucide-react";
import { toast } from "sonner";

const TOTAL_STEPS = 8;

// Detect in-app browsers (TikTok, Instagram, Facebook, etc.)
const isInAppBrowser = () => {
  const ua = navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|TikTok|Musical_ly|BytedanceWebview|Snapchat|Twitter|Line\//i.test(ua);
};

interface FormData {
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
  photos: { file: File; caption: string; preview: string }[];
  consent: boolean;
}

const initialFormData: FormData = {
  fullName: "", phone: "", email: "", address: "", contactMethod: "phone",
  projectType: [], propertyType: "", sqft: "", stories: "", occupied: "", hoa: "",
  scope: [], conditions: [], timeline: "", dateFlexibility: "", budget: "", otherBids: "",
  notes: "", photos: [], consent: false,
};

const projectTypes = ["Interior Painting", "Exterior Painting", "Cabinet Painting", "Repair & Prep", "Other"];
const scopeItems = ["Walls", "Ceilings", "Trim", "Doors", "Baseboards", "Cabinets", "Stucco", "Fascia", "Eaves", "Garage", "Fence", "Patio Cover", "Other"];
const conditionItems = ["Peeling Paint", "Cracks", "Water Damage", "Wood Damage", "Stucco Damage", "Nail Holes", "Wallpaper Removal", "Texture Repair", "Caulking Needed", "Unsure"];

const EstimatePage = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  const updateField = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const toggleArrayItem = (field: "projectType" | "scope" | "conditions", item: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(item) ? prev[field].filter(i => i !== item) : [...prev[field], item],
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (form.photos.length + files.length > 10) {
      toast.error("Maximum 10 photos allowed");
      return;
    }
    const maxSize = 20 * 1024 * 1024; // 20MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name} is too large (max 20MB)`);
        return false;
      }
      return true;
    });
    const newPhotos = validFiles.map(file => ({
      file,
      caption: "",
      preview: URL.createObjectURL(file),
    }));
    updateField("photos", [...form.photos, ...newPhotos]);
    // Reset the input so the same file can be re-selected
    e.target.value = '';
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(form.photos[index].preview);
    updateField("photos", form.photos.filter((_, i) => i !== index));
  };

  const updateCaption = (index: number, caption: string) => {
    const updated = [...form.photos];
    updated[index] = { ...updated[index], caption };
    updateField("photos", updated);
  };

  const validateStep = useCallback(() => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!form.fullName.trim()) errs.fullName = "Name is required";
      if (!form.phone.trim()) errs.phone = "Phone is required";
      if (!form.address.trim()) errs.address = "Address is required";
    }
    if (step === 2 && form.projectType.length === 0) errs.projectType = "Select at least one";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [step, form]);

  const nextStep = () => { if (validateStep() && step < TOTAL_STEPS) setStep(s => s + 1); };
  const prevStep = () => { if (step > 1) setStep(s => s - 1); };

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.consent) {
      toast.error("Please agree to be contacted");
      return;
    }
    setSubmitting(true);
    try {
      // Upload photos to storage
      const photoUrls: string[] = [];
      for (const photo of form.photos) {
        const fileExt = photo.file.name.split('.').pop();
        const filePath = `estimates/${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('estimate-photos')
          .upload(filePath, photo.file, {
            cacheControl: '3600',
            upsert: false,
          });
        if (uploadError) {
          console.error('Photo upload error:', uploadError.message);
          toast.error(`Failed to upload ${photo.file.name}`);
          continue;
        }
        const { data: urlData } = supabase.storage
          .from('estimate-photos')
          .getPublicUrl(filePath);
        photoUrls.push(urlData.publicUrl);
      }

      // Save to database
      const requestId = crypto.randomUUID();
      const { error: dbError } = await supabase.from('estimate_requests').insert({
        id: requestId,
        full_name: form.fullName,
        phone: form.phone,
        email: form.email || null,
        address: form.address,
        contact_method: form.contactMethod,
        project_type: form.projectType,
        property_type: form.propertyType || null,
        sqft: form.sqft || null,
        stories: form.stories || null,
        occupied: form.occupied || null,
        hoa: form.hoa || null,
        scope: form.scope,
        conditions: form.conditions,
        timeline: form.timeline || null,
        date_flexibility: form.dateFlexibility || null,
        budget: form.budget || null,
        other_bids: form.otherBids || null,
        notes: form.notes || null,
        photo_urls: photoUrls,
        consent: form.consent,
      });

      if (dbError) throw dbError;

      // Send notification email via transactional email system
      await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'estimate-notification',
          recipientEmail: 'mark@karmahouse.com',
          idempotencyKey: `estimate-notify-${requestId}`,
          templateData: {
            requestId,
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            address: form.address,
            contactMethod: form.contactMethod,
            projectType: form.projectType,
            propertyType: form.propertyType,
            sqft: form.sqft,
            stories: form.stories,
            occupied: form.occupied,
            hoa: form.hoa,
            scope: form.scope,
            conditions: form.conditions,
            timeline: form.timeline,
            dateFlexibility: form.dateFlexibility,
            budget: form.budget,
            otherBids: form.otherBids,
            notes: form.notes,
            photoUrls,
          },
        },
      });

      toast.success("Estimate request submitted!");
      navigate("/thank-you");
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <>
      <Header />
      <main className="pt-20 pb-16 min-h-screen bg-background">
        <div className="container-narrow px-5 md:px-8">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">Request an Estimate</h1>
            <p className="font-body text-sm text-muted-foreground">Step {step} of {TOTAL_STEPS}</p>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-secondary rounded-full mb-8 overflow-hidden">
            <motion.div className="h-full gold-gradient rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
          </div>

          <div className="bg-card rounded-lg border border-border p-6 md:p-8 shadow-soft">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>

                {step === 1 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-xl font-semibold text-foreground">Your Information</h2>
                    <div>
                      <Label className="font-body text-sm">Full Name *</Label>
                      <Input value={form.fullName} onChange={e => updateField("fullName", e.target.value)} placeholder="John Smith" className="mt-1.5 h-12 text-base" />
                      {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <Label className="font-body text-sm">Phone *</Label>
                      <Input value={form.phone} onChange={e => updateField("phone", e.target.value)} placeholder="(949) 836-4864" type="tel" className="mt-1.5 h-12 text-base" />
                      {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <Label className="font-body text-sm">Email</Label>
                      <Input value={form.email} onChange={e => updateField("email", e.target.value)} placeholder="you@email.com" type="email" className="mt-1.5 h-12 text-base" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Property Address *</Label>
                      <Input value={form.address} onChange={e => updateField("address", e.target.value)} placeholder="123 Main St, Irvine, CA" className="mt-1.5 h-12 text-base" />
                      {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <Label className="font-body text-sm">Preferred Contact Method</Label>
                      <RadioGroup value={form.contactMethod} onValueChange={v => updateField("contactMethod", v)} className="flex gap-4 mt-2">
                        {["phone", "email", "text"].map(m => (
                          <div key={m} className="flex items-center gap-2">
                            <RadioGroupItem value={m} id={`cm-${m}`} />
                            <Label htmlFor={`cm-${m}`} className="font-body text-sm capitalize cursor-pointer">{m}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-xl font-semibold text-foreground">Project Type</h2>
                    <p className="font-body text-sm text-muted-foreground">Select all that apply *</p>
                    {errors.projectType && <p className="text-destructive text-xs">{errors.projectType}</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {projectTypes.map(pt => (
                        <button key={pt} onClick={() => toggleArrayItem("projectType", pt)}
                          className={`p-4 rounded-lg border-2 text-left font-body text-sm font-medium transition-all ${
                            form.projectType.includes(pt)
                              ? "border-accent bg-accent/10 text-foreground"
                              : "border-border text-muted-foreground hover:border-accent/50"
                          }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-xl font-semibold text-foreground">Property Details</h2>
                    <div>
                      <Label className="font-body text-sm">Property Type</Label>
                      <Select value={form.propertyType} onValueChange={v => updateField("propertyType", v)}>
                        <SelectTrigger className="mt-1.5 h-12 text-base"><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          {["House", "Condo", "Townhouse", "Apartment"].map(t => (
                            <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-body text-sm">Approximate Square Footage</Label>
                      <Input value={form.sqft} onChange={e => updateField("sqft", e.target.value)} placeholder="e.g. 2,000" className="mt-1.5 h-12 text-base" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Number of Stories</Label>
                      <Select value={form.stories} onValueChange={v => updateField("stories", v)}>
                        <SelectTrigger className="mt-1.5 h-12 text-base"><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3+"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="font-body text-sm">Occupied or Vacant?</Label>
                      <RadioGroup value={form.occupied} onValueChange={v => updateField("occupied", v)} className="flex gap-4 mt-2">
                        {["Occupied", "Vacant"].map(o => (
                          <div key={o} className="flex items-center gap-2">
                            <RadioGroupItem value={o.toLowerCase()} id={`occ-${o}`} />
                            <Label htmlFor={`occ-${o}`} className="font-body text-sm cursor-pointer">{o}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="font-body text-sm">HOA Involved?</Label>
                      <RadioGroup value={form.hoa} onValueChange={v => updateField("hoa", v)} className="flex gap-4 mt-2">
                        {["Yes", "No"].map(h => (
                          <div key={h} className="flex items-center gap-2">
                            <RadioGroupItem value={h.toLowerCase()} id={`hoa-${h}`} />
                            <Label htmlFor={`hoa-${h}`} className="font-body text-sm cursor-pointer">{h}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-xl font-semibold text-foreground">Scope of Work</h2>
                    <p className="font-body text-sm text-muted-foreground">Select all areas that apply</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {scopeItems.map(item => (
                        <button key={item} onClick={() => toggleArrayItem("scope", item)}
                          className={`p-3 rounded-lg border-2 text-center font-body text-sm font-medium transition-all ${
                            form.scope.includes(item)
                              ? "border-accent bg-accent/10 text-foreground"
                              : "border-border text-muted-foreground hover:border-accent/50"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-xl font-semibold text-foreground">Condition & Prep</h2>
                    <p className="font-body text-sm text-muted-foreground">Select any that apply</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {conditionItems.map(item => (
                        <label key={item} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 transition-colors cursor-pointer">
                          <Checkbox checked={form.conditions.includes(item)} onCheckedChange={() => toggleArrayItem("conditions", item)} />
                          <span className="font-body text-sm text-foreground">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-xl font-semibold text-foreground">Timing</h2>
                    <div>
                      <Label className="font-body text-sm">When do you want the project done?</Label>
                      <Input value={form.timeline} onChange={e => updateField("timeline", e.target.value)} placeholder="e.g. Next month, Summer 2026" className="mt-1.5 h-12 text-base" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Date Flexibility</Label>
                      <RadioGroup value={form.dateFlexibility} onValueChange={v => updateField("dateFlexibility", v)} className="flex gap-4 mt-2">
                        {["Flexible", "Specific Date"].map(d => (
                          <div key={d} className="flex items-center gap-2">
                            <RadioGroupItem value={d.toLowerCase()} id={`df-${d}`} />
                            <Label htmlFor={`df-${d}`} className="font-body text-sm cursor-pointer">{d}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <div>
                      <Label className="font-body text-sm">Are you getting other bids?</Label>
                      <RadioGroup value={form.otherBids} onValueChange={v => updateField("otherBids", v)} className="flex gap-4 mt-2">
                        {["Yes", "No"].map(b => (
                          <div key={b} className="flex items-center gap-2">
                            <RadioGroupItem value={b.toLowerCase()} id={`ob-${b}`} />
                            <Label htmlFor={`ob-${b}`} className="font-body text-sm cursor-pointer">{b}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-xl font-semibold text-foreground">Notes & Photos</h2>
                    <div>
                      <Label className="font-body text-sm">Additional Notes</Label>
                      <Textarea value={form.notes} onChange={e => updateField("notes", e.target.value)} placeholder="Anything else we should know about your project..." className="mt-1.5 min-h-[120px] text-base" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Upload Photos (up to 10)</Label>
                      {isInAppBrowser() && (
                        <div className="mt-2 p-3 bg-accent/10 border border-accent/30 rounded-lg text-sm text-foreground">
                          <p className="font-semibold">📱 Having trouble uploading?</p>
                          <p className="mt-1 text-muted-foreground">
                            In-app browsers (TikTok, Instagram, etc.) may block photo uploads. 
                            Tap the <strong>⋯</strong> menu and select <strong>"Open in browser"</strong> to use Safari/Chrome instead.
                          </p>
                        </div>
                      )}
                      <label className="relative mt-2 flex flex-col items-center justify-center gap-2 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-accent/50 transition-colors active:bg-accent/5 overflow-hidden">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="font-body text-sm text-muted-foreground">Tap to upload photos</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          style={{ fontSize: '16px' }}
                        />
                      </label>
                    </div>
                    {form.photos.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {form.photos.map((photo, i) => (
                          <div key={i} className="relative">
                            <img src={photo.preview} alt={`Upload ${i + 1}`} className="w-full aspect-square object-cover rounded-lg" />
                            <button onClick={() => removePhoto(i)} className="absolute top-1 right-1 p-1 bg-primary/80 rounded-full">
                              <X className="w-4 h-4 text-primary-foreground" />
                            </button>
                            <Input
                              value={photo.caption}
                              onChange={e => updateCaption(i, e.target.value)}
                              placeholder="Caption"
                              className="mt-1 h-9 text-xs"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 8 && (
                  <div className="space-y-5">
                    <h2 className="font-display text-xl font-semibold text-foreground">Review & Submit</h2>
                    <div className="space-y-4 text-sm font-body">
                      <ReviewRow label="Name" value={form.fullName} />
                      <ReviewRow label="Phone" value={form.phone} />
                      <ReviewRow label="Email" value={form.email || "—"} />
                      <ReviewRow label="Address" value={form.address} />
                      <ReviewRow label="Contact Method" value={form.contactMethod} />
                      <ReviewRow label="Project Type" value={form.projectType.join(", ") || "—"} />
                      <ReviewRow label="Property" value={`${form.propertyType || "—"}, ${form.sqft || "—"} sqft, ${form.stories || "—"} story`} />
                      <ReviewRow label="Occupied" value={form.occupied || "—"} />
                      <ReviewRow label="HOA" value={form.hoa || "—"} />
                      <ReviewRow label="Scope" value={form.scope.join(", ") || "—"} />
                      <ReviewRow label="Conditions" value={form.conditions.join(", ") || "—"} />
                      <ReviewRow label="Timeline" value={form.timeline || "—"} />
                      <ReviewRow label="Budget" value={form.budget || "—"} />
                      <ReviewRow label="Other Bids" value={form.otherBids || "—"} />
                      <ReviewRow label="Notes" value={form.notes || "—"} />
                      <ReviewRow label="Photos" value={`${form.photos.length} uploaded`} />
                    </div>
                    <label className="flex items-start gap-3 p-4 rounded-lg border border-border cursor-pointer">
                      <Checkbox checked={form.consent} onCheckedChange={v => updateField("consent", !!v)} className="mt-0.5" />
                      <span className="font-body text-sm text-foreground">I agree to be contacted by Karma House Painting regarding this estimate request.</span>
                    </label>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              {step > 1 ? (
                <Button variant="outline" size="lg" onClick={prevStep}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
              ) : <div />}
              {step < TOTAL_STEPS ? (
                <Button variant="gold" size="lg" onClick={nextStep}>
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button variant="gold" size="lg" onClick={handleSubmit} disabled={submitting}>
                  <Send className="w-4 h-4" /> {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-border last:border-0">
    <span className="text-muted-foreground font-medium">{label}</span>
    <span className="text-foreground capitalize">{value}</span>
  </div>
);

export default EstimatePage;
