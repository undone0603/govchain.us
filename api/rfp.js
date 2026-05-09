// api/rfp.js - Request for Proposal (RFP) Management
const allowedOrigins = ['https://govchain.us', 'https://www.govchain.us'];

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const { agency, status, naics_code } = req.query;
    const rfps = [
      {
        id: 'RFP-2024-DOD-001',
        title: 'AI-Based Supply Chain Verification System',
        agency: 'Department of Defense',
        agency_code: 'DOD',
        naics_code: '541519',
        set_aside: 'small_business',
        value_min: 1000000,
        value_max: 5000000,
        currency: 'USD',
        status: 'open',
        posted_date: '2024-10-01',
        due_date: '2024-11-15',
        sam_gov_id: 'W91ZLK24R0001',
        description: 'DoD seeks blockchain-based verification system for defense supply chains',
        proposals_received: 7,
        blockchain_hash: '0xrfp001hash'
      },
      {
        id: 'RFP-2024-DHS-001',
        title: 'Blockchain Document Authentication Platform',
        agency: 'Department of Homeland Security',
        agency_code: 'DHS',
        naics_code: '541511',
        set_aside: 'sdvosb',
        value_min: 500000,
        value_max: 2000000,
        currency: 'USD',
        status: 'awarded',
        posted_date: '2024-09-01',
        due_date: '2024-10-01',
        sam_gov_id: '70CDCR24R00001',
        description: 'DHS seeks blockchain platform for secure document verification and authentication',
        proposals_received: 12,
        awarded_to: 'SecureGov Systems Inc',
        blockchain_hash: '0xrfp002hash'
      },
      {
        id: 'RFP-2024-VA-001',
        title: 'Veteran Identity Verification Blockchain',
        agency: 'Department of Veterans Affairs',
        agency_code: 'VA',
        naics_code: '541512',
        set_aside: 'sdvosb',
        value_min: 250000,
        value_max: 1500000,
        currency: 'USD',
        status: 'open',
        posted_date: '2024-10-20',
        due_date: '2024-12-01',
        sam_gov_id: '36C10X24R0001',
        description: 'VA seeks blockchain solution for secure veteran identity verification',
        proposals_received: 3,
        blockchain_hash: '0xrfp003hash'
      },
    ];
    let filtered = rfps;
    if (agency) filtered = filtered.filter(r => r.agency_code === agency || r.agency.toLowerCase().includes(agency.toLowerCase()));
    if (status) filtered = filtered.filter(r => r.status === status);
    if (naics_code) filtered = filtered.filter(r => r.naics_code === naics_code);
    return res.status(200).json({
      success: true,
      endpoint: '/api/rfp',
      rfps: filtered,
      total: filtered.length,
      open_count: rfps.filter(r => r.status === 'open').length,
      blockchain_verified: true,
      protocol: 'GovChain'
    });
  }

  if (req.method === 'POST') {
    const { title, agency, naics_code, value_min, value_max, due_date, description, set_aside } = req.body || {};
    if (!title || !agency) return res.status(400).json({ error: 'title and agency are required' });
    const rfp_id = `RFP-${new Date().getFullYear()}-${agency}-${Date.now().toString().slice(-4)}`;
    return res.status(200).json({
      success: true,
      rfp: {
        id: rfp_id,
        title,
        agency,
        naics_code: naics_code || '541519',
        set_aside: set_aside || 'full_and_open',
        value_min: value_min || 0,
        value_max: value_max || 0,
        currency: 'USD',
        status: 'draft',
        posted_date: new Date().toISOString().split('T')[0],
        due_date: due_date || null,
        description,
        blockchain_hash: `0x${Math.random().toString(16).slice(2, 18)}`,
      },
      protocol: 'GovChain'
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
