// GovChain Analytics API
// Provides grant discovery, SAM.gov opportunity, and agency metrics

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { period = '7d', agencyId } = req.query;
    const validPeriods = ['24h', '7d', '30d', '90d'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ error: 'Invalid period. Use: 24h, 7d, 30d, 90d' });
    }

    const periodHours = { '24h': 24, '7d': 168, '30d': 720, '90d': 2160 };
    const since = new Date(Date.now() - periodHours[period] * 3600 * 1000).toISOString();

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    let totalOpportunities = 0;
    let activeProposals = 0;
    let wonContracts = 0;
    let totalGrantValue = 0;
    let opportunitiesByDay = [];

    if (supabaseUrl && supabaseKey) {
      // Fetch SAM.gov opportunities ingested in period
      const oppsRes = await fetch(
        `${supabaseUrl}/rest/v1/sam_opportunities?select=id,status,value,created_at&created_at=gte.${since}` +
          (agencyId ? `&agency_id=eq.${agencyId}` : ''),
        {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        }
      );

      if (oppsRes.ok) {
        const opps = await oppsRes.json();
        totalOpportunities = opps.length;
        activeProposals = opps.filter(o => o.status === 'active').length;
        wonContracts = opps.filter(o => o.status === 'awarded').length;
        totalGrantValue = opps.reduce((sum, o) => sum + (parseFloat(o.value) || 0), 0);

        // Build by-day aggregation
        const dayMap = {};
        opps.forEach(o => {
          const day = o.created_at.slice(0, 10);
          dayMap[day] = (dayMap[day] || 0) + 1;
        });
        opportunitiesByDay = Object.entries(dayMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([date, count]) => ({ date, count }));
      }
    }

    return res.status(200).json({
      success: true,
      period,
      since,
      metrics: {
        totalOpportunities,
        activeProposals,
        wonContracts,
        totalGrantValue: Math.round(totalGrantValue),
        winRate: totalOpportunities > 0 ? Math.round((wonContracts / totalOpportunities) * 100) : 0,
      },
      opportunitiesByDay,
      filters: { agencyId: agencyId || null },
    });
  } catch (err) {
    console.error('[GovChain /api/analytics]', err);
    return res.status(500).json({
      success: false,
      error: 'Analytics unavailable',
      metrics: { totalOpportunities: 0, activeProposals: 0, wonContracts: 0, totalGrantValue: 0 },
    });
  }
};
