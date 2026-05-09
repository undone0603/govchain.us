import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const [testimonialsRes, statsRes, agenciesRes] = await Promise.all([
      supabase
        .from('testimonials')
        .select('id, author_name, agency_name, content, rating, contract_value, win_rate_improvement')
        .eq('status', 'approved')
        .eq('is_featured', true)
        .limit(6),
      supabase
        .from('social_proof_stats')
        .select('metric, value, label')
        .eq('is_active', true)
        .order('sort_order'),
      supabase
        .from('featured_agencies')
        .select('id, name, logo_url, agency_type')
        .eq('is_active', true)
        .order('sort_order')
        .limit(12),
    ]);

    const ratings = (testimonialsRes.data || []).map(t => t.rating).filter(Boolean);
    const avgRating = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : '5.0';

    const totalContractValue = (testimonialsRes.data || [])
      .filter(t => t.contract_value)
      .reduce((sum, t) => sum + (parseFloat(t.contract_value) || 0), 0);

    return res.status(200).json({
      success: true,
      featured_testimonials: testimonialsRes.data || [],
      stats: statsRes.data || [
        { metric: 'contracts_won', value: '$2B+', label: 'Total Contract Value Won' },
        { metric: 'contractors', value: '1,200+', label: 'Active Contractors' },
        { metric: 'agencies', value: '150+', label: 'Federal Agencies Covered' },
        { metric: 'win_rate', value: '3.2x', label: 'Average Win Rate Improvement' },
      ],
      featured_agencies: agenciesRes.data || [],
      average_rating: avgRating,
      total_contract_value_tracked: totalContractValue,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
