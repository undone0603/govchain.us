import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const featured = req.query.featured === 'true';
      const agency_type = req.query.agency_type;

      let query = supabase
        .from('testimonials')
        .select('id, author_name, agency_name, agency_type, contract_value, content, rating, win_rate_improvement, is_featured, created_at')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (featured) query = query.eq('is_featured', true);
      if (agency_type) query = query.eq('agency_type', agency_type);

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json({ success: true, testimonials: data || [] });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
      if (authErr || !user) return res.status(401).json({ error: 'Invalid token' });

      const { author_name, agency_name, agency_type, contract_value, content, rating, win_rate_improvement } = req.body;
      if (!author_name || !content || !rating) {
        return res.status(400).json({ error: 'Missing required fields: author_name, content, rating' });
      }

      const { data, error } = await supabase
        .from('testimonials')
        .insert({
          user_id: user.id,
          author_name,
          agency_name: agency_name || null,
          agency_type: agency_type || null,
          contract_value: contract_value || null,
          content,
          rating: Math.min(5, Math.max(1, parseInt(rating))),
          win_rate_improvement: win_rate_improvement || null,
          status: 'pending',
          is_featured: false,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        testimonial: data,
        message: 'Thank you! Your success story will help other contractors win government contracts.',
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
