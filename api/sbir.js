module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      endpoint: '/api/sbir',
      opportunities: [
        {
          id: 'sbir_001',
          program: 'SBIR Phase II',
          agency: 'DoD',
          solicitation: 'N68335-26-SBIR',
          title: 'Blockchain-Based Supply Chain Authentication for Defense Logistics',
          award_amount_usd: 1500000,
          deadline: '2026-07-15',
          topic_code: 'N26A-T001',
          status: 'application_in_progress',
          tech_area: 'Information Systems and Technology',
          match_score: 0.94,
          submitted: false
        },
        {
          id: 'sbir_002',
          program: 'SBIR Phase I',
          agency: 'DHS',
          solicitation: 'DHS-26-SVIP',
          title: 'AI-Powered Product Authentication and Counterfeit Detection',
          award_amount_usd: 150000,
          deadline: '2026-06-30',
          topic_code: 'DHS-SVIP-2026',
          status: 'submitted',
          tech_area: 'Cybersecurity and Privacy',
          match_score: 0.91,
          submitted: true,
          submitted_date: '2026-04-20'
        },
        {
          id: 'sbir_003',
          program: 'STTR Phase I',
          agency: 'NSF',
          solicitation: 'NSF-26-STTR',
          title: 'Distributed Ledger Technology for Government Contract Transparency',
          award_amount_usd: 256000,
          deadline: '2026-08-01',
          topic_code: 'NSF-STTR-ITE-2026',
          status: 'researching',
          tech_area: 'Information and Intelligent Systems',
          match_score: 0.87,
          submitted: false
        }
      ],
      total: 3,
      total_potential_usd: 1906000,
      submitted: 1,
      in_progress: 1,
      researching: 1,
      recommended_next: 'sbir_001',
      protocol: 'GovChain'
    });
  }
  return res.status(405).json({ error: 'Method not allowed' });
};
