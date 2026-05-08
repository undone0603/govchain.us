// GovChain /api/contact - General contact form handler
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, organization, subject, message, inquiry_type } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['name', 'email', 'message']
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || 'partnerships@govchain.us';

  const contactId = `GC-CONTACT-${Date.now()}`;
  const timestamp = new Date().toISOString();

  try {
    // Store in Supabase if configured
    if (SUPABASE_URL && SUPABASE_KEY) {
      await fetch(`${SUPABASE_URL}/rest/v1/contact_submissions`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          contact_id: contactId,
          name,
          email,
          organization: organization || null,
          subject: subject || inquiry_type || 'General Inquiry',
          message,
          inquiry_type: inquiry_type || 'general',
          source: 'govchain.us',
          status: 'new',
          submitted_at: timestamp
        })
      });
    }

    // Send notification via Resend if configured
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'GovChain <noreply@govchain.us>',
          to: [NOTIFY_EMAIL],
          reply_to: email,
          subject: `[GovChain Contact] ${subject || inquiry_type || 'New Inquiry'} - ${name}`,
          html: `<h2>New Contact Submission</h2>
            <p><strong>ID:</strong> ${contactId}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Organization:</strong> ${organization || 'Not provided'}</p>
            <p><strong>Inquiry Type:</strong> ${inquiry_type || 'General'}</p>
            <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
            <hr/>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, '<br/>')}</p>
            <hr/>
            <p><small>Submitted at ${timestamp} via govchain.us</small></p>`
        })
      });
    }

    return res.status(200).json({
      success: true,
      contact_id: contactId,
      message: 'Thank you for contacting GovChain. Our team will respond within 1 business day.',
      submitted_at: timestamp
    });
  } catch (err) {
    console.error('[contact] Error:', err);
    return res.status(500).json({
      error: 'Contact form submission failed. Please email partnerships@govchain.us directly.',
      contact_id: contactId
    });
  }
}
