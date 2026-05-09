module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const profile = {
    id: 'org_001',
    name: 'GovChain Technologies Inc.',
    dba: null,
    cage_code: 'GCT01',
    uei: 'GCT012345678',
    entity_type: 'small_business',
    naics_codes: ['541519', '541512', '541715'],
    primary_naics: '541519',
    certifications: [
      { type: 'CMMC', level: 2, status: 'certified', expiry: '2027-01-15' },
      { type: 'ISO_27001', status: 'in_progress', expected: '2026-09-01' }
    ],
    contact: {
      primary_name: 'Alex Rivera',
      title: 'CEO',
      email: 'alex@govchain.us',
      phone: '+1-555-468-2424',
      address: {
        street: '123 Blockchain Ave',
        city: 'Ann Arbor',
        state: 'MI',
        zip: '48104',
        country: 'US'
      }
    },
    sam_registration: {
      status: 'active',
      expiry: '2027-03-01',
      registered_date: '2024-03-01'
    },
    subscription: {
      plan: 'enterprise',
      status: 'active',
      renewal_date: '2027-01-01',
      features: ['unlimited_contracts', 'compliance_monitoring', 'api_access', 'team_management']
    },
    stats: {
      active_contracts: 2,
      total_contract_value: 2125000,
      active_grants: 1,
      proposals_submitted: 5,
      win_rate: 0.60
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: new Date().toISOString(),
    protocol: 'GovChain'
  };

  if (req.method === 'PUT') {
    const updates = req.body || {};
    const allowed = ['name', 'dba', 'naics_codes', 'contact'];
    const updated = Object.fromEntries(
      Object.entries(updates).filter(([k]) => allowed.includes(k))
    );
    return res.status(200).json({
      success: true,
      profile: { ...profile, ...updated, updated_at: new Date().toISOString() },
      message: 'Profile updated successfully'
    });
  }

  return res.status(200).json({ success: true, profile, protocol: 'GovChain' });
};
