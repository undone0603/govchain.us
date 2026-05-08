// api/grants.js - GovChain federal grant and contract opportunities
// Returns curated government grant opportunities relevant to blockchain/authentication/supply chain

const GRANT_OPPORTUNITIES = [
  {
    id: 'dhs-svip-2024',
    title: 'DHS Silicon Valley Innovation Program (SVIP)',
    agency: 'Department of Homeland Security',
    amount: '$800,000',
    phase: 'Phase 1-3',
    topic: 'Blockchain-based supply chain authentication and provenance verification',
    deadline: 'Rolling Admissions',
    status: 'open',
    url: 'https://www.dhs.gov/science-and-technology/svip',
    fit: 98,
    tags: ['blockchain', 'supply-chain', 'authentication', 'dhs']
  },
  {
    id: 'nsf-sbir-phase2',
    title: 'NSF SBIR/STTR Phase II',
    agency: 'National Science Foundation',
    amount: '$1,000,000',
    phase: 'Phase II',
    topic: 'Distributed ledger for government procurement verification',
    deadline: 'Rolling',
    status: 'open',
    url: 'https://seedfund.nsf.gov',
    fit: 95,
    tags: ['sbir', 'distributed-ledger', 'procurement', 'nsf']
  },
  {
    id: 'dod-sttr-2024',
    title: 'DoD STTR – Blockchain for Acquisition',
    agency: 'Department of Defense',
    amount: '$1,750,000',
    phase: 'Phase I-II',
    topic: 'Immutable audit trails for defense procurement and contractor authentication',
    deadline: 'Q3 2025',
    status: 'open',
    url: 'https://www.dodsbirsttr.mil',
    fit: 92,
    tags: ['dod', 'blockchain', 'acquisition', 'sttr']
  },
  {
    id: 'gsa-fas-contract',
    title: 'GSA Federal Acquisition Service Schedule',
    agency: 'General Services Administration',
    amount: 'Contract Vehicle',
    phase: 'Contract',
    topic: 'IT Schedule 70 / MAS - Blockchain and Identity Verification Services',
    deadline: 'Ongoing',
    status: 'open',
    url: 'https://www.gsa.gov/technology/technology-products-services',
    fit: 88,
    tags: ['gsa', 'it-schedule', 'identity', 'contract']
  },
  {
    id: 'nist-sbir-2024',
    title: 'NIST SBIR – Standards-Based Authentication',
    agency: 'National Institute of Standards and Technology',
    amount: '$300,000',
    phase: 'Phase I',
    topic: 'Cryptographic standards for product authentication and tamper detection',
    deadline: 'Q2 2025',
    status: 'open',
    url: 'https://www.nist.gov/tpo/nist-sbir-program',
    fit: 85,
    tags: ['nist', 'cryptography', 'standards', 'sbir']
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

  const { agency, tag, status = 'open', limit = '10' } = req.query;

  let results = GRANT_OPPORTUNITIES;

  if (status) {
    results = results.filter(g => g.status === status);
  }
  if (agency) {
    results = results.filter(g => g.agency.toLowerCase().includes(agency.toLowerCase()));
  }
  if (tag) {
    results = results.filter(g => g.tags.includes(tag.toLowerCase()));
  }

  results = results.slice(0, parseInt(limit));

  return res.status(200).json({
    success: true,
    total: results.length,
    opportunities: results,
    last_updated: new Date().toISOString()
  });
}
