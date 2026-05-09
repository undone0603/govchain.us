const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'POST') {
    const { name, email, agency, role, use_case, message } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });

    const { error } = await supabase.from('demo_requests').insert({
      name, email, agency, role, use_case, message,
      status: 'pending',
      created_at: new Date().toISOString(),
    });
    if (error) return res.status(500).json({ error: error.message });

    await Promise.all([
      resend.emails.send({
        from: 'GovChain <noreply@govchain.us>',
        to: email,
        subject: 'Your GovChain demo request is confirmed',
        html: `<h2>Hi ${name},</h2><p>Thank you for your interest in GovChain! Our government contracting specialists will reach out within 24 hours to schedule a personalized walkthrough of our SBIR/STTR tracking and federal pipeline management tools.</p><p><strong>Agency:</strong> ${agency || 'N/A'}<br/><strong>Role:</strong> ${role || 'N/A'}<br/><strong>Use case:</strong> ${use_case || 'General'}</p>`,
      }).catch(() => {}),
      resend.emails.send({
        from: 'GovChain <noreply@govchain.us>',
        to: process.env.SALES_EMAIL || 'sales@govchain.us',
        subject: `Demo request: ${name} at ${agency || 'unknown agency'}`,
        html: `<p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Agency:</strong> ${agency || 'N/A'}<br/><strong>Role:</strong> ${role || 'N/A'}<br/><strong>Use case:</strong> ${use_case || 'N/A'}<br/><strong>Message:</strong> ${message || 'None'}</p>`,
      }).catch(() => {}),
    ]);

    return res.status(200).json({ success: true, message: 'Demo request received. We will contact you within 24 hours.' });
  }

  if (req.method === 'GET') {
    const { admin_key } = req.query;
    if (admin_key !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
    const { data, count } = await supabase.from('demo_requests').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    return res.status(200).json({ total: count, requests: data || [] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
