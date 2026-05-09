export default async function handler(req, res) {
  const { query } = req;
  const { vendor_id, status, category, required_only } = query;

  const trainings = [
    {
      id: 'train_001',
      vendor_id: 'vendor_001',
      title: 'FAR/DFARS Compliance Fundamentals',
      category: 'compliance',
      provider: 'GovChain Academy',
      format: 'online',
      duration_hours: 4,
      cost_usd: 0,
      is_required: true,
      required_for_naics: ['541330', '541511', '541512'],
      expiry_months: 12,
      status: 'completed',
      completed_at: new Date(Date.now() - 60 * 86400000).toISOString(),
      expires_at: new Date(Date.now() + 305 * 86400000).toISOString(),
      certificate_id: 'CERT-2024-001',
      score_pct: 92
    },
    {
      id: 'train_002',
      vendor_id: 'vendor_001',
      title: 'Cybersecurity Maturity Model Certification (CMMC) Level 1',
      category: 'cybersecurity',
      provider: 'DoD Cyber Exchange',
      format: 'online',
      duration_hours: 8,
      cost_usd: 0,
      is_required: true,
      required_for_naics: ['541511', '541512', '518210'],
      expiry_months: 36,
      status: 'in_progress',
      completed_at: null,
      expires_at: null,
      certificate_id: null,
      score_pct: null,
      progress_pct: 45
    },
    {
      id: 'train_003',
      vendor_id: 'vendor_002',
      title: 'Small Business Innovation Research (SBIR) Proposal Writing',
      category: 'grants',
      provider: 'SBA Training Portal',
      format: 'webinar',
      duration_hours: 2,
      cost_usd: 0,
      is_required: false,
      required_for_naics: [],
      expiry_months: null,
      status: 'available',
      completed_at: null,
      expires_at: null,
      certificate_id: null,
      score_pct: null,
      progress_pct: 0
    }
  ];

  let filtered = trainings;
  if (vendor_id) filtered = filtered.filter(t => t.vendor_id === vendor_id);
  if (status) filtered = filtered.filter(t => t.status === status);
  if (category) filtered = filtered.filter(t => t.category === category);
  if (required_only === 'true') filtered = filtered.filter(t => t.is_required);

  return res.status(200).json({
    success: true,
    trainings: filtered,
    total: filtered.length,
    statuses: ['available', 'enrolled', 'in_progress', 'completed', 'expired'],
    categories: ['compliance', 'cybersecurity', 'grants', 'contracting', 'finance', 'ethics']
  });
}
