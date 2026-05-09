export default async function handler(req, res) {
  const { query } = req;
  const { vendor_id, type, status } = query;

  const certifications = [
    {
      id: 'cert_001',
      vendor_id: 'vendor_001',
      type: 'small_business',
      certifying_body: 'SBA',
      certification_name: 'Small Business Concern (SBC)',
      naics_codes: ['541511', '541512', '541330'],
      status: 'active',
      issued_date: new Date(Date.now() - 365 * 86400000).toISOString(),
      expiry_date: new Date(Date.now() + 730 * 86400000).toISOString(),
      certificate_number: 'SBA-2023-001234',
      set_aside_eligible: ['small_business', '8a', 'hubzone'],
      annual_revenue_limit_usd: 25000000,
      employee_limit: 500,
      verified: true
    },
    {
      id: 'cert_002',
      vendor_id: 'vendor_001',
      type: 'sdvosb',
      certifying_body: 'VA CVE',
      certification_name: 'Service-Disabled Veteran-Owned Small Business',
      naics_codes: ['541511', '541512'],
      status: 'active',
      issued_date: new Date(Date.now() - 200 * 86400000).toISOString(),
      expiry_date: new Date(Date.now() + 165 * 86400000).toISOString(),
      certificate_number: 'CVE-SDVOSB-2023-0092',
      set_aside_eligible: ['sdvosb', 'vosb'],
      annual_revenue_limit_usd: 25000000,
      employee_limit: 500,
      verified: true
    },
    {
      id: 'cert_003',
      vendor_id: 'vendor_002',
      type: '8a',
      certifying_body: 'SBA',
      certification_name: 'SBA 8(a) Business Development Program',
      naics_codes: ['541511'],
      status: 'pending',
      issued_date: null,
      expiry_date: null,
      certificate_number: null,
      set_aside_eligible: [],
      annual_revenue_limit_usd: null,
      employee_limit: null,
      verified: false,
      application_date: new Date(Date.now() - 30 * 86400000).toISOString(),
      estimated_approval: new Date(Date.now() + 60 * 86400000).toISOString()
    }
  ];

  let filtered = certifications;
  if (vendor_id) filtered = filtered.filter(c => c.vendor_id === vendor_id);
  if (type) filtered = filtered.filter(c => c.type === type);
  if (status) filtered = filtered.filter(c => c.status === status);

  return res.status(200).json({
    success: true,
    certifications: filtered,
    total: filtered.length,
    statuses: ['active', 'pending', 'expired', 'suspended', 'revoked'],
    types: ['small_business', '8a', 'hubzone', 'wosb', 'edwosb', 'sdvosb', 'vosb', 'veteran_owned', 'minority_owned', 'iso_9001', 'cmmc']
  });
}
