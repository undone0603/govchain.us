export default {
  async fetch(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const token = authHeader.replace('Bearer ', '');

    const userRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: env.SUPABASE_ANON_KEY }
    });
    if (!userRes.ok) return Response.json({ error: 'Invalid token' }, { status: 401 });
    const { id: userId, email } = await userRes.json();

    const since = new Date(Date.now() - 7 * 86400000).toISOString();

    const [contractsRes, grantsRes, rfpsRes, statsRes] = await Promise.all([
      fetch(`${env.SUPABASE_URL}/rest/v1/contracts?user_id=eq.${userId}&created_at=gte.${since}&select=id,title,status`, {
        headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
      }),
      fetch(`${env.SUPABASE_URL}/rest/v1/grants?user_id=eq.${userId}&created_at=gte.${since}&select=id,title,amount`, {
        headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
      }),
      fetch(`${env.SUPABASE_URL}/rest/v1/rfps?status=eq.open&posted_at=gte.${since}&select=id,title,agency,due_date&limit=5`, {
        headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
      }),
      fetch(`${env.SUPABASE_URL}/rest/v1/user_stats?user_id=eq.${userId}&select=streak_days,total_contracts,milestone_count`, {
        headers: { apikey: env.SUPABASE_ANON_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` }
      }),
    ]);

    const [contracts, grants, rfps, statsArr] = await Promise.all([
      contractsRes.json(), grantsRes.json(), rfpsRes.json(), statsRes.json()
    ]);

    const stats = statsArr[0] || {};

    const digest = {
      period: 'weekly',
      generated_at: new Date().toISOString(),
      user_id: userId,
      summary: {
        new_contracts_this_week: (contracts || []).length,
        new_grants_this_week: (grants || []).length,
        open_rfps_available: (rfps || []).length,
        current_streak: stats.streak_days || 0,
        total_contracts: stats.total_contracts || 0,
        milestones_earned: stats.milestone_count || 0,
      },
      recent_contracts: (contracts || []).slice(0, 5),
      recent_grants: (grants || []).slice(0, 5),
      open_rfps: rfps || [],
      action_items: [
        ...(stats.streak_days === 0 ? [{ type: 'streak', message: 'Start your daily monitoring streak to earn rewards' }] : []),
        ...((contracts || []).filter(c => c.status === 'pending').length > 0
          ? [{ type: 'contract', message: `You have ${(contracts || []).filter(c => c.status === 'pending').length} pending contracts needing attention` }]
          : []),
        ...(rfps && rfps.length > 0 ? [{ type: 'rfp', message: `${rfps.length} new RFPs posted this week matching your profile` }] : []),
      ],
    };

    return Response.json(digest);
  }
};
