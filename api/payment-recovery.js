// /api/payment-recovery - Cron dunning handler for GovChain subscription recovery
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data: failedSubs, error } = await supabase
      .from('subscriptions')
      .select('id, user_id, plan, payment_failed_at, retry_count')
      .eq('status', 'past_due')
      .lte('retry_count', 3)
      .gte('payment_failed_at', new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;

    const results = [];

    for (const sub of failedSubs || []) {
      await supabase.from('payment_recovery_log').insert({
        subscription_id: sub.id,
        user_id: sub.user_id,
        attempt_number: (sub.retry_count || 0) + 1,
        attempted_at: new Date().toISOString(),
        status: 'queued',
      });

      await supabase
        .from('subscriptions')
        .update({ retry_count: (sub.retry_count || 0) + 1 })
        .eq('id', sub.id);

      results.push({
        subscriptionId: sub.id,
        userId: sub.user_id,
        plan: sub.plan,
        retryAttempt: (sub.retry_count || 0) + 1,
      });
    }

    return res.status(200).json({ success: true, processed: results.length, results });
  } catch (err) {
    console.error('GovChain payment recovery error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
