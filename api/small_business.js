export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { category, certified, state } = req.query;

  const programs = [
    {
      id: 'prog_8a',
      name: '8(a) Business Development Program',
      category: 'disadvantaged',
      acronym: '8(a)',
      administering_agency: 'SBA',
      description: 'Assists small businesses owned by socially and economically disadvantaged individuals.',
      eligibility: ['Socially disadvantaged individual ownership >51%', 'Net worth <$750K (excluding business/home)', 'Adjusted gross income <$350K average'],
      benefits: ['Sole-source contracts up to $4M (goods/services), $7M (manufacturing)', 'Set-aside contract eligibility', 'Business development assistance', 'Mentor-protege program access'],
      annual_goal_percentage: 5,
      application_url: 'https://certify.sba.gov',
      max_contract_value_sole_source: 4000000,
      certified: true,
      certification_date: '2022-03-15',
      expiration_date: '2031-03-15',
      naics_codes: ['541512', '541715', '541611']
    },
    {
      id: 'prog_sdvosb',
      name: 'Service-Disabled Veteran-Owned Small Business',
      category: 'veteran',
      acronym: 'SDVOSB',
      administering_agency: 'VA/SBA',
      description: 'Set-aside and sole-source contracts for service-disabled veteran-owned businesses.',
      eligibility: ['51%+ owned by service-disabled veteran(s)', 'Service-connected disability rating required', 'Daily management by veteran owner'],
      benefits: ['VA set-asides', 'DoD set-asides', 'Sole-source up to $4M (services)', 'Preferred contractor status'],
      annual_goal_percentage: 3,
      application_url: 'https://veterans.certify.sba.gov',
      max_contract_value_sole_source: 4000000,
      certified: true,
      certification_date: '2023-07-01',
      expiration_date: '2026-07-01',
      naics_codes: ['541512', '541519', '541715']
    },
    {
      id: 'prog_wosb',
      name: 'Women-Owned Small Business',
      category: 'women_owned',
      acronym: 'WOSB',
      administering_agency: 'SBA',
      description: 'Set-aside contracts for women-owned small businesses in underrepresented industries.',
      eligibility: ['51%+ owned and controlled by women', 'Must qualify as small business per NAICS', 'For EDWOSB: economically disadvantaged'],
      benefits: ['Set-aside contracts', 'EDWOSB sole-source up to $4M (services)', 'Access to restricted competitions'],
      annual_goal_percentage: 5,
      application_url: 'https://certify.sba.gov',
      max_contract_value_sole_source: 4000000,
      certified: false,
      certification_date: null,
      expiration_date: null,
      naics_codes: []
    },
    {
      id: 'prog_hubzone',
      name: 'Historically Underutilized Business Zone',
      category: 'geographic',
      acronym: 'HUBZone',
      administering_agency: 'SBA',
      description: 'Stimulates economic development in historically underutilized business zones.',
      eligibility: ['Principal office in HUBZone', '35%+ employees residing in HUBZone', '51%+ US citizen ownership'],
      benefits: ['10% price evaluation preference', 'Set-aside contracts', 'Sole-source up to $4.5M (services)'],
      annual_goal_percentage: 3,
      application_url: 'https://maps.certify.sba.gov/hubzone/map',
      max_contract_value_sole_source: 4500000,
      certified: false,
      certification_date: null,
      expiration_date: null,
      naics_codes: []
    }
  ];

  let filtered = programs;
  if (category) filtered = filtered.filter(p => p.category === category);
  if (certified !== undefined) filtered = filtered.filter(p => p.certified === (certified === 'true'));

  const certified_count = programs.filter(p => p.certified).length;
  const annual_set_aside_goals = { total: 23, small_business: 23, sdb: 5, wosb: 5, sdvosb: 3, hubzone: 3, sbc_research: 3.2 };

  return res.status(200).json({
    success: true,
    programs: filtered,
    total: filtered.length,
    certified_count,
    annual_set_aside_goals,
    far_reference: 'FAR Subpart 19',
    sba_size_standards_url: 'https://www.sba.gov/document/support-table-size-standards',
    generated_at: new Date().toISOString()
  });
}
