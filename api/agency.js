// Vercel Serverless Function: POST /api/agency - v3
// v2: GET + POST support
// GovChain agency onboarding - stores lead in Supabase + sends notification

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://govchain.us');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
if (req.method === 'GET') {
    const { id, name } = req.query;
    return res.status(200).json({ agency: { id: id || null, name: name || null, type: 'government', status: 'active', govchain_verified: true, document_count: 0, joined: new Date().toISOString() }, protocol: 'GovChain' });
  }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { agencyName, agencyType, state, contactName, contactEmail, contactPhone, useCase } = req.body;
    if (!agencyName || !contactEmail) {
      return res.status(400).json({ error: 'agencyName and contactEmail are required' });
    }

    const leadId = `GC-${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Store in Supabase
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/agency_leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          lead_id: leadId,
          agency_name: agencyName,
          agency_type: agencyType || 'Unknown',
          state: state || 'Michigan',
          contact_name: contactName || '',
          contact_email: contactEmail,
          contact_phone: contactPhone || '',
          use_case: useCase || '',
          status: 'pending',
          pilot_tier: state === 'Michigan' ? 'michigan-pilot' : 'waitlist',
          created_at: timestamp
        })
      });
    }

    // Send notification via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'GovChain <notifications@govchain.us>',
          to: ['authichain@gmail.com'],
          subject: `New Agency Lead: ${agencyName} (${agencyType || 'Unknown'} - ${state || 'Michigan'})`,
          html: `
            <h2>New Agency Onboarding Request - GovChain</h2>
            <table>
              <tr><td><b>Lead ID:</b></td><td>${leadId}</td></tr>
              <tr><td><b>Agency:</b></td><td>${agencyName}</td></tr>
              <tr><td><b>Type:</b></td><td>${agencyType || 'N/A'}</td></tr>
              <tr><td><b>State:</b></td><td>${state || 'Michigan'}</td></tr>
              <tr><td><b>Contact:</b></td><td>${contactName || 'N/A'}</td></tr>
              <tr><td><b>Email:</b></td><td>${contactEmail}</td></tr>
              <tr><td><b>Phone:</b></td><td>${contactPhone || 'N/A'}</td></tr>
              <tr><td><b>Use Case:</b></td><td>${useCase || 'N/A'}</td></tr>
              <tr><td><b>Pilot Tier:</b></td><td>${state === 'Michigan' ? 'Michigan Pilot' : 'Waitlist'}</td></tr>
              <tr><td><b>Submitted:</b></td><td>${timestamp}</td></tr>
            </table>
            <p><b>Action required:</b> Follow up within 24 hours for Michigan agencies.</p>
          `
        })
      });
    }

    return res.status(200).json({
      success: true,
      leadId,
      message: 'Onboarding request received. Our team will contact you within 24-48 hours.',
      pilotStatus: state === 'Michigan' ? 'michigan-pilot' : 'waitlist'
    });

  } catch (err) {
    console.error('Agency API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
