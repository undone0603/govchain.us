import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const ONBOARDING_STEPS = [
  { step: 1, key: 'sam_registration', label: 'SAM.gov Registration', description: 'Verify your SAM.gov UEI number to unlock government contracting features.' },
  { step: 2, key: 'capability_statement', label: 'Capability Statement', description: 'Upload or create your capability statement to showcase to contracting officers.' },
  { step: 3, key: 'naics_codes', label: 'NAICS Code Selection', description: 'Select your primary and secondary NAICS codes for contract matching.' },
  { step: 4, key: 'certifications', label: 'Business Certifications', description: 'Add SBA, SDVOSB, 8(a), or other certifications to boost visibility.' },
  { step: 5, key: 'first_search', label: 'First Contract Search', description: 'Run your first SAM.gov contract opportunity search.' },
  { step: 6, key: 'plan_selection', label: 'Select a Plan', description: 'Choose a GovChain plan to unlock full tracking, alerts, and AI matching.' }
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return res.status(401).json({ error: 'Invalid token' });

  if (req.method === 'GET') {
    const { data: progress } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const completed = progress?.completed_steps || [];
    const steps = ONBOARDING_STEPS.map(s => ({
      ...s,
      completed: completed.includes(s.key),
      is_current: !completed.includes(s.key) && completed.length === s.step - 1
    }));

    const percent = Math.round((completed.length / ONBOARDING_STEPS.length) * 100);
    const next_step = steps.find(s => !s.completed);
    const is_complete = completed.length === ONBOARDING_STEPS.length;

    return res.status(200).json({
      success: true,
      percent_complete: percent,
      is_complete,
      steps,
      next_step: next_step || null,
      show_upgrade_prompt: completed.length >= 4 && !is_complete
    });
  }

  if (req.method === 'POST') {
    const { step_key } = req.body;
    if (!step_key) return res.status(400).json({ error: 'step_key is required' });

    const valid = ONBOARDING_STEPS.find(s => s.key === step_key);
    if (!valid) return res.status(400).json({ error: 'Invalid step_key' });

    const { data: existing } = await supabase
      .from('onboarding_progress')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const completed = existing?.completed_steps || [];
    if (!completed.includes(step_key)) completed.push(step_key);

    const { error: upsertErr } = await supabase
      .from('onboarding_progress')
      .upsert({ user_id: user.id, completed_steps: completed, updated_at: new Date().toISOString() });

    if (upsertErr) return res.status(500).json({ error: upsertErr.message });

    const percent = Math.round((completed.length / ONBOARDING_STEPS.length) * 100);
    return res.status(200).json({
      success: true,
      step_completed: step_key,
      percent_complete: percent,
      show_upgrade_prompt: completed.length >= 4
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
