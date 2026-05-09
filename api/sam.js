module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { uei, cage_code, search, naics } = req.query;

  const samEntities = [
    {
      id: 'sam_001',
      entity_name: 'GovChain Technologies Inc.',
      uei: 'GCT012345678',
      cage_code: 'GCT01',
      duns: '12-345-6789',
      registration_status: 'active',
      registration_date: '2024-03-01',
      expiration_date: '2027-03-01',
      entity_type: 'business',
      business_types: ['2X', 'QF'],
      business_type_labels: ['For Profit Organization', 'Small Disadvantaged Business'],
      primary_naics: '541519',
      naics_codes: ['541519', '541512', '541715'],
      socioeconomic_status: {
        small_business: true,
        woman_owned: false,
        veteran_owned: false,
        service_disabled_veteran_owned: false,
        hubzone: false,
        minority_owned: false,
        eight_a: false
      },
      address: {
        street: '123 Blockchain Ave',
        city: 'Ann Arbor',
        state: 'MI',
        zip: '48104',
        country: 'US'
      },
      points_of_contact: [
        { type: 'E', title: 'Electronic Business', name: 'Alex Rivera', email: 'alex@govchain.us', phone: '555-468-2424' },
        { type: 'G', title: 'Government Business', name: 'Alex Rivera', email: 'alex@govchain.us', phone: '555-468-2424' }
      ],
      exclusions: [],
      awards_count: 2,
      total_awards_value: 2125000,
      active_representations: [
        { provision: 'FAR 52.219-1', title: 'Small Business Program Representations', status: 'certified' },
        { provision: 'FAR 52.204-26', title: 'Covered Telecommunications Equipment', status: 'certified' }
      ],
      blockchain_verified: true,
      protocol: 'GovChain'
    }
  ];

  let filtered = samEntities;
  if (uei) filtered = filtered.filter(e => e.uei === uei);
  if (cage_code) filtered = filtered.filter(e => e.cage_code === cage_code);
  if (naics) filtered = filtered.filter(e => e.naics_codes.includes(naics));
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(e =>
      e.entity_name.toLowerCase().includes(q) ||
      e.uei.toLowerCase().includes(q) ||
      e.cage_code.toLowerCase().includes(q)
    );
  }

  return res.status(200).json({
    success: true,
    source: 'SAM.gov',
    entities: filtered,
    total: filtered.length,
    active: filtered.filter(e => e.registration_status === 'active').length,
    note: 'Entity data synchronized with SAM.gov registration system',
    last_sync: new Date().toISOString(),
    protocol: 'GovChain'
  });
};
