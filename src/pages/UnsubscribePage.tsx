import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

type Status = "loading" | "valid" | "already_unsubscribed" | "invalid" | "success" | "error";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<Status>("loading");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: SUPABASE_ANON_KEY } }
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus("invalid");
        } else if (data.valid === false && data.reason === "already_unsubscribed") {
          setStatus("already_unsubscribed");
        } else if (data.valid) {
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      } catch {
        setStatus("error");
      }
    })();
  }, [token]);

  const handleUnsubscribe = async () => {
    setProcessing(true);
    try {
      const { data } = await supabase.functions.invoke("handle-email-unsubscribe", {
        body: { token },
      });
      if (data?.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-16 min-h-screen bg-background flex items-center justify-center">
        <div className="container-narrow px-5 md:px-8 text-center max-w-md">
          {status === "loading" && (
            <p className="font-body text-muted-foreground">Verifying…</p>
          )}
          {status === "valid" && (
            <div className="space-y-4">
              <h1 className="font-display text-2xl font-bold text-foreground">Unsubscribe</h1>
              <p className="font-body text-muted-foreground">
                Click below to unsubscribe from future emails.
              </p>
              <Button variant="destructive" onClick={handleUnsubscribe} disabled={processing}>
                {processing ? "Processing…" : "Confirm Unsubscribe"}
              </Button>
            </div>
          )}
          {status === "already_unsubscribed" && (
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-foreground">Already Unsubscribed</h1>
              <p className="font-body text-muted-foreground">You've already been unsubscribed.</p>
            </div>
          )}
          {status === "success" && (
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-foreground">Unsubscribed</h1>
              <p className="font-body text-muted-foreground">You won't receive any more emails from us.</p>
            </div>
          )}
          {status === "invalid" && (
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-foreground">Invalid Link</h1>
              <p className="font-body text-muted-foreground">This unsubscribe link is invalid or has expired.</p>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-2">
              <h1 className="font-display text-2xl font-bold text-foreground">Something went wrong</h1>
              <p className="font-body text-muted-foreground">Please try again later.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default UnsubscribePage;
