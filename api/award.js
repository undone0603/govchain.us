module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { agency, year, min_value, max_value, naics, page = 1, limit = 20 } = req.query;

  const awards = [
    {
      id: 'award_001',
      award_id: 'W911NF-26-C-0042',
      title: 'Blockchain-Based Supply Chain Integrity Platform',
      agency: 'Army Research Laboratory',
      agency_code: 'ARL',
      contractor: 'GovChain Technologies Inc.',
      award_amount_usd: 1250000,
      start_date: '2026-03-01',
      end_date: '2027-02-28',
      naics_code: '541519',
      naics_description: 'Other Computer Related Services',
      performance_period_months: 12,
      award_type: 'Contract',
      competition_type: 'Full and Open',
      set_aside: 'Small Business',
      status: 'active',
      place_of_performance: 'Washington, DC',
      description: 'Development of blockchain-based supply chain integrity and transparency platform for government procurement.',
      protocol: 'GovChain'
    },
    {
      id: 'award_002',
      award_id: 'HSHQDC-26-C-00089',
      title: 'DHS Document Verification Blockchain Infrastructure',
      agency: 'Department of Homeland Security',
      agency_code: 'DHS',
      contractor: 'GovChain Technologies Inc.',
      award_amount_usd: 875000,
      start_date: '2026-01-15',
      end_date: '2026-12-31',
      naics_code: '541512',
      naics_description: 'Computer Systems Design Services',
      performance_period_months: 11,
      award_type: 'Contract',
      competition_type: 'Full and Open after Exclusion of Sources',
      set_aside: 'None',
      status: 'active',
      place_of_performance: 'Arlington, VA',
      description: 'Immutable blockchain infrastructure for government document verification and credentialing system.',
      protocol: 'GovChain'
    },
    {
      id: 'award_003',
      award_id: 'NSF-ITE-2026-0178',
      title: 'Distributed Ledger for Federal Transparency Initiative',
      agency: 'National Science Foundation',
      agency_code: 'NSF',
      contractor: 'GovChain Technologies Inc.',
      award_amount_usd: 256000,
      start_date: '2026-09-01',
      end_date: '2027-08-31',
      naics_code: '541715',
      naics_description: 'Research and Development in the Physical, Engineering, and Life Sciences',
      performance_period_months: 12,
      award_type: 'Grant',
      competition_type: 'STTR Phase I',
      set_aside: 'Small Business',
      status: 'pending',
      place_of_performance: 'Ann Arbor, MI',
      description: 'Research into distributed ledger technology for enhancing federal contract transparency.',
      protocol: 'GovChain'
    }
  ];

  let filtered = awards;
  if (agency) filtered = filtered.filter(a => a.agency_code === agency || a.agency.toLowerCase().includes(agency.toLowerCase()));
  if (year) filtered = filtered.filter(a => a.start_date.startsWith(year));
  if (naics) filtered = filtered.filter(a => a.naics_code === naics);
  if (min_value) filtered = filtered.filter(a => a.award_amount_usd >= Number(min_value));
  if (max_value) filtered = filtered.filter(a => a.award_amount_usd <= Number(max_value));

  const total_value = filtered.reduce((sum, a) => sum + a.award_amount_usd, 0);
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  return res.status(200).json({
    success: true,
    awards: paginated,
    total: filtered.length,
    total_value_usd: total_value,
    active: filtered.filter(a => a.status === 'active').length,
    pending: filtered.filter(a => a.status === 'pending').length,
    page: pageNum,
    limit: limitNum,
    protocol: 'GovChain'
  });
};
