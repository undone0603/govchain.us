export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { id, agency, rating, naics_code } = req.query;

  const records = [
    {
      id: 'pp_001',
      contract_number: 'W9128F-23-C-0015',
      contract_title: 'IT Infrastructure Modernization',
      agency: 'U.S. Army Corps of Engineers',
      co_name: 'Michael Chen',
      co_phone: '601-634-2000',
      co_email: 'm.chen@usace.army.mil',
      naics_code: '541512',
      contract_value: 4200000,
      period_of_performance: { start: '2023-01-15', end: '2024-06-30' },
      description: 'Full IT infrastructure modernization including network upgrades, server migrations, and helpdesk support.',
      ratings: {
        overall: 'Exceptional',
        quality: 'Exceptional',
        schedule: 'Very Good',
        cost_control: 'Very Good',
        management: 'Exceptional',
        small_business: 'Exceptional'
      },
      narrative: 'Contractor exceeded all performance metrics. Delivered ahead of schedule and under budget.',
      cpars_submitted: true,
      cpars_date: '2024-07-15',
      referenceable: true
    },
    {
      id: 'pp_002',
      contract_number: 'FA8721-22-C-0089',
      contract_title: 'AI Analytics Platform Development',
      agency: 'Air Force Research Laboratory',
      co_name: 'Sarah Williams',
      co_phone: '937-255-1234',
      co_email: 's.williams@afrl.af.mil',
      naics_code: '541715',
      contract_value: 1800000,
      period_of_performance: { start: '2022-08-01', end: '2024-01-31' },
      description: 'Developed and deployed AI-powered analytics platform for logistics optimization.',
      ratings: {
        overall: 'Very Good',
        quality: 'Very Good',
        schedule: 'Satisfactory',
        cost_control: 'Very Good',
        management: 'Very Good',
        small_business: 'Very Good'
      },
      narrative: 'Strong technical performance. Minor schedule delays resolved promptly.',
      cpars_submitted: true,
      cpars_date: '2024-02-20',
      referenceable: true
    }
  ];

  let filtered = records;
  if (id) filtered = filtered.filter(r => r.id === id);
  if (agency) filtered = filtered.filter(r => r.agency.toLowerCase().includes(agency.toLowerCase()));
  if (rating) filtered = filtered.filter(r => r.ratings.overall.toLowerCase() === rating.toLowerCase());
  if (naics_code) filtered = filtered.filter(r => r.naics_code === naics_code);

  return res.status(200).json({
    success: true,
    past_performance: filtered,
    total: filtered.length,
    rating_scale: ['Exceptional', 'Very Good', 'Satisfactory', 'Marginal', 'Unsatisfactory'],
    cpars_url: 'https://www.cpars.gov',
    generated_at: new Date().toISOString()
  });
}
