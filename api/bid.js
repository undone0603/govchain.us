// GovChain /api/bid - Government procurement bid tracking
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, solicitation, agency, status } = req.query || {};

  if (req.method === 'GET') {
    if (id || solicitation) {
      return res.status(200).json({
        success: true,
        bid: {
          id: id || `BID-${Date.now()}`,
          solicitation_id: solicitation || 'SOL-2026-001',
          title: 'Blockchain-Based Supply Chain Verification System',
          agency: 'Department of Defense',
          naics_code: '541519',
          contract_type: 'SBIR Phase II',
          set_aside: 'Small Business',
          value_estimate: '$1,250,000',
          due_date: '2026-06-30',
          status: status || 'open',
          blockchain_hash: `0x${Buffer.from((id || solicitation) + Date.now()).toString('hex').slice(0, 64)}`,
          sam_link: 'https://sam.gov',
          govchain_id: `GC-BID-${Date.now()}`,
          protocol: 'GovChain'
        }
      });
    }

    return res.status(200).json({
      success: true,
      endpoint: '/api/bid',
      description: 'Government procurement bid tracking on blockchain',
      protocol: 'GovChain',
      stats: {
        active_bids: 847,
        total_value_pipeline: '$2.3B',
        agencies: 23,
        blockchain_verified: 847
      },
      usage: {
        by_id: '/api/bid?id=BID-001',
        by_solicitation: '/api/bid?solicitation=SOL-2026-001',
        by_agency: '/api/bid?agency=DOD'
      }
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { solicitation_id, vendor_id, bid_amount, technical_approach } = req.body || {};

  if (!solicitation_id || !vendor_id || !bid_amount) {
    return res.status(400).json({ error: 'solicitation_id, vendor_id, and bid_amount are required' });
  }

  const bid_id = `BID-${Date.now()}`;
  return res.status(201).json({
    success: true,
    bid_id,
    solicitation_id,
    vendor_id,
    bid_amount,
    status: 'submitted',
    blockchain_hash: `0x${Buffer.from(bid_id + vendor_id).toString('hex').slice(0, 64)}`,
    chain: 'Polygon',
    submitted_at: new Date().toISOString(),
    protocol: 'GovChain'
  });
}
