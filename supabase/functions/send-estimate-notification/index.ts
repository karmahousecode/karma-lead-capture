import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const ADMIN_EMAIL = "Mark@karmahouse.com";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data = await req.json();
    const {
      requestId, fullName, phone, email, address, contactMethod,
      projectType, propertyType, sqft, stories, occupied, hoa,
      scope, conditions, timeline, dateFlexibility, budget,
      otherBids, notes, photoUrls,
    } = data;

    const photoSection = photoUrls && photoUrls.length > 0
      ? `<h3 style="margin-top:20px;">📷 Photos (${photoUrls.length})</h3>
         ${photoUrls.map((url: string, i: number) => `<p><a href="${url}" target="_blank">Photo ${i + 1}</a></p>`).join('')}`
      : '<p><em>No photos uploaded</em></p>';

    const htmlBody = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <h1 style="color:#1a1a2e;border-bottom:3px solid #c9a96e;padding-bottom:10px;">
          New Estimate Request
        </h1>
        <h2 style="color:#333;">Customer Information</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Name</td><td style="padding:8px;">${fullName}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Phone</td><td style="padding:8px;"><a href="tel:${phone}">${phone}</a></td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Email</td><td style="padding:8px;">${email || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Address</td><td style="padding:8px;">${address}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Preferred Contact</td><td style="padding:8px;">${contactMethod}</td></tr>
        </table>

        <h2 style="color:#333;margin-top:20px;">Project Details</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Project Type</td><td style="padding:8px;">${(projectType || []).join(', ') || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Property Type</td><td style="padding:8px;">${propertyType || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Sq Ft</td><td style="padding:8px;">${sqft || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Stories</td><td style="padding:8px;">${stories || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Occupied</td><td style="padding:8px;">${occupied || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">HOA</td><td style="padding:8px;">${hoa || '—'}</td></tr>
        </table>

        <h2 style="color:#333;margin-top:20px;">Scope & Conditions</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Scope</td><td style="padding:8px;">${(scope || []).join(', ') || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Conditions</td><td style="padding:8px;">${(conditions || []).join(', ') || '—'}</td></tr>
        </table>

        <h2 style="color:#333;margin-top:20px;">Timing & Budget</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Timeline</td><td style="padding:8px;">${timeline || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Flexibility</td><td style="padding:8px;">${dateFlexibility || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Budget</td><td style="padding:8px;">${budget || '—'}</td></tr>
          <tr><td style="padding:8px;font-weight:bold;color:#555;">Other Bids</td><td style="padding:8px;">${otherBids || '—'}</td></tr>
        </table>

        ${notes ? `<h2 style="color:#333;margin-top:20px;">Additional Notes</h2><p style="padding:8px;background:#f5f5f5;border-radius:8px;">${notes}</p>` : ''}

        ${photoSection}

        <p style="margin-top:30px;padding:15px;background:#1a1a2e;color:#c9a96e;border-radius:8px;text-align:center;">
          Request ID: ${requestId}
        </p>
      </div>
    `;

    // Use Resend API via RESEND_API_KEY if available, otherwise use Lovable AI
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Karma House Painting <notifications@karmahouse.com>',
          to: [ADMIN_EMAIL],
          subject: `New Estimate Request – Karma House Painting`,
          html: htmlBody,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error('Resend API error:', errBody);
        throw new Error(`Resend API failed [${res.status}]: ${errBody}`);
      }
    } else {
      // Fallback: Log the notification (email will work once configured)
      console.log(`📧 Notification would be sent to ${ADMIN_EMAIL}`);
      console.log('Subject: New Estimate Request – Karma House Painting');
      console.log('Request ID:', requestId);
      console.log('Customer:', fullName, phone);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error sending notification:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
