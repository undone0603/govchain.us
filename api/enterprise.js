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
    const { name, email, company, annual_contract_value, employee_count, certifications, message } = req.body;
    if (!name || !email || !company) return res.status(400).json({ error: 'name, email, and company required' });

    const { error } = await supabase.from('enterprise_inquiries').insert({
      name, email, company, annual_contract_value, employee_count,
      certifications: Array.isArray(certifications) ? certifications.join(', ') : certifications,
      message,
      status: 'new',
      created_at: new Date().toISOString(),
    });
    if (error) return res.status(500).json({ error: error.message });

    await Promise.all([
      resend.emails.send({
        from: 'GovChain <noreply@govchain.us>',
        to: email,
        subject: 'Your GovChain Enterprise inquiry has been received',
        html: `<h2>Hi ${name},</h2><p>Thank you for your interest in GovChain Enterprise. Our government contracting specialists will prepare a custom proposal and reach out within 1 business day.</p><p><strong>Company:</strong> ${company}<br/><strong>Annual contract value:</strong> ${annual_contract_value || 'N/A'}<br/><strong>Certifications:</strong> ${certifications || 'N/A'}</p><p>In the meantime, ensure your <strong>SAM.gov</strong> registration is active and your CAGE code is current — we'll validate this during onboarding.</p>`,
      }).catch(() => {}),
      resend.emails.send({
        from: 'GovChain <noreply@govchain.us>',
        to: process.env.SALES_EMAIL || 'sales@govchain.us',
        subject: `Enterprise inquiry: ${company} - $${annual_contract_value || '?'} ACV`,
        html: `<p><strong>Name:</strong> ${name}<br/><strong>Email:</strong> ${email}<br/><strong>Company:</strong> ${company}<br/><strong>Employees:</strong> ${employee_count || 'N/A'}<br/><strong>Annual contract value:</strong> ${annual_contract_value || 'N/A'}<br/><strong>Certifications:</strong> ${certifications || 'N/A'}<br/><strong>Message:</strong> ${message || 'None'}</p>`,
      }).catch(() => {}),
    ]);

    return res.status(200).json({ success: true, message: 'Enterprise inquiry received. We will contact you within 1 business day.' });
  }

  if (req.method === 'GET') {
    const { admin_key } = req.query;
    if (admin_key !== process.env.ADMIN_SECRET) return res.status(401).json({ error: 'Unauthorized' });
    const { data, count } = await supabase.from('enterprise_inquiries').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    return res.status(200).json({ total: count, inquiries: data || [] });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
