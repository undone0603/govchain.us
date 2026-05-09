export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, naics_code, category, keyword } = req.query;

  const capabilities = [
    {
      id: 'cap_001',
      company_name: 'TechForward Solutions LLC',
      cage_code: 'TF001',
      uei: 'ABC123DEF456',
      sam_registered: true,
      naics_codes: ['541512', '541511', '541519'],
      primary_naics: '541512',
      categories: ['software_development', 'cloud', 'cybersecurity'],
      certifications: ['ISO 27001', 'FedRAMP Ready', 'CMMC Level 2'],
      socioeconomic_status: ['8a', 'sdvosb'],
      past_performance: [
        { agency: 'DoD', contract_value: 2500000, description: 'Cloud migration for Army ERP system', rating: 'Excellent' },
        { agency: 'DHS', contract_value: 890000, description: 'Cybersecurity assessment services', rating: 'Very Good' }
      ],
      key_personnel: [
        { name: 'Marcus Williams', title: 'President/CEO', clearance: 'Secret' },
        { name: 'Dr. Emily Chen', title: 'CTO', clearance: 'Top Secret' }
      ],
      capabilities_narrative: 'TechForward specializes in cloud-native software development and cybersecurity solutions for federal agencies, with 12 years of proven performance.',
      active_contracts: 4,
      annual_revenue: 8500000,
      employees: 45,
      founded: 2014
    },
    {
      id: 'cap_002',
      company_name: 'DataBridge Analytics Inc',
      cage_code: 'DB002',
      uei: 'GHI789JKL012',
      sam_registered: true,
      naics_codes: ['541611', '541715', '518210'],
      primary_naics: '541611',
      categories: ['data_analytics', 'ai_ml', 'consulting'],
      certifications: ['ISO 9001', 'CMMC Level 1'],
      socioeconomic_status: ['wosb', 'hubzone'],
      past_performance: [
        { agency: 'HHS', contract_value: 1200000, description: 'Healthcare data analytics platform', rating: 'Excellent' }
      ],
      key_personnel: [
        { name: 'Sandra Park', title: 'CEO', clearance: 'Public Trust' }
      ],
      capabilities_narrative: 'DataBridge delivers advanced analytics and AI/ML solutions to help federal agencies derive actionable insights from complex datasets.',
      active_contracts: 2,
      annual_revenue: 3200000,
      employees: 22,
      founded: 2018
    }
  ];

  let filtered = capabilities;
  if (id) filtered = filtered.filter(c => c.id === id);
  if (naics_code) filtered = filtered.filter(c => c.naics_codes.includes(naics_code));
  if (category) filtered = filtered.filter(c => c.categories.includes(category));
  if (keyword) filtered = filtered.filter(c =>
    c.company_name.toLowerCase().includes(keyword.toLowerCase()) ||
    c.capabilities_narrative.toLowerCase().includes(keyword.toLowerCase())
  );

  return res.status(200).json({
    success: true,
    capabilities: filtered,
    total: filtered.length,
    available_categories: ['software_development', 'cloud', 'cybersecurity', 'data_analytics', 'ai_ml', 'consulting', 'logistics', 'construction', 'research'],
    generated_at: new Date().toISOString()
  });
}
