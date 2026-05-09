// GovChain - Government Contractor Free Trial API
// Revenue-critical: converts contractors and small businesses to paid plans
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const TRIAL_PLANS = [
    {
      id: 'contractor_trial',
      name: 'Contractor Trial',
      trial_days: 14,
      converts_to: 'contractor_pro',
      price_after_trial: 149,
      billing: 'monthly',
      contracts_limit: 25,
      opportunities_limit: 100,
      proposal_templates: 10,
      sam_monitoring: true,
      sbir_tracking: true,
      past_performance_tracking: true,
      credit_card_required: false,
      features: [
        '25 active contracts',
        '100 opportunity searches/month',
        '10 proposal templates',
        'SAM.gov status monitoring',
        'SBIR/STTR tracking',
        'Past performance library',
        'Milestone & deliverable tracking',
        'Team collaboration (5 users)',
        'Compliance alerts',
      ],
    },
    {
      id: 'agency_trial',
      name: 'Agency / Program Manager Trial',
      trial_days: 14,
      converts_to: 'agency_pro',
      price_after_trial: 399,
      billing: 'monthly',
      contracts_limit: 250,
      opportunities_limit: -1,
      vendor_management: true,
      teaming_facilitation: true,
      reporting: 'advanced',
      credit_card_required: false,
      features: [
        '250 contracts under management',
        'Unlimited opportunity pipeline',
        'Vendor & teaming management',
        'Advanced reporting & dashboards',
        'Protest & dispute tracking',
        'Closeout management',
        'Option period alerts',
        'Unlimited team members',
        'Priority support',
      ],
    },
    {
      id: 'small_business_trial',
      name: 'Small Business Trial',
      trial_days: 30,
      converts_to: 'small_business_pro',
      price_after_trial: 79,
      billing: 'monthly',
      contracts_limit: 10,
      opportunities_limit: 50,
      certifications: ['8a', 'HUBZone', 'SDVOSB', 'WOSB'],
      set_aside_alerts: true,
      sbir_tracking: true,
      credit_card_required: false,
      features: [
        '10 active contracts',
        '50 opportunity searches/month',
        'Set-aside opportunity alerts',
        'SBIR/STTR grant tracking',
        'Small business certification tracker',
        'SAM.gov monitoring',
        'Proposal starter templates',
        '2 team members',
        'Email support',
      ],
    },
  ];

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'Start your free GovChain trial. Win more government contracts.',
      trials: TRIAL_PLANS,
      trust_signals: [
        'No credit card required',
        '14-30 day full access trial',
        'Cancel anytime',
        'SAM.gov compliant from day 1',
        'Dedicated onboarding for contractors',
        'Your data is retained if you upgrade',
      ],
      cta_url: 'https://govchain.us/trial',
      contact: 'sales@govchain.us',
    });
  }

  if (req.method === 'POST') {
    const {
      email,
      name,
      company_name,
      cage_code,
      uei_number,
      plan_id = 'contractor_trial',
      naics_codes,
      state,
      small_business_certifications,
      phone,
    } = req.body || {};

    if (!email || !company_name) {
      return res.status(400).json({
        error: 'email and company_name are required to start a trial',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(422).json({ error: 'Invalid email address' });
    }

    const plan = TRIAL_PLANS.find((p) => p.id === plan_id);
    if (!plan) {
      return res.status(422).json({
        error: `Invalid plan_id. Must be one of: ${TRIAL_PLANS.map((p) => p.id).join(', ')}`,
      });
    }

    const trial_id = `GC-TRIAL-${Date.now()}`;
    const trial_start = new Date();
    const trial_end = new Date(trial_start.getTime() + plan.trial_days * 24 * 60 * 60 * 1000);

    // Production: create Supabase user, send SendGrid welcome + onboarding sequence,
    // pre-populate SAM.gov profile from UEI if provided, notify sales Slack channel

    return res.status(201).json({
      success: true,
      trial_id,
      email,
      name: name || null,
      company_name,
      cage_code: cage_code || null,
      uei_number: uei_number || null,
      state: state || null,
      phone: phone || null,
      plan,
      trial_start: trial_start.toISOString(),
      trial_end: trial_end.toISOString(),
      days_remaining: plan.trial_days,
      status: 'active',
      sam_prefill_attempted: !!uei_number,
      next_steps: [
        'Check your email for login credentials',
        'Log in to your GovChain dashboard at govchain.us/dashboard',
        'Import your active contracts or search SAM.gov opportunities',
        'Set up compliance alerts for your NAICS codes',
        'Book your free onboarding call: govchain.us/onboarding-call',
      ],
      upgrade_url: `https://govchain.us/upgrade?trial=${trial_id}&plan=${plan.converts_to}`,
      dashboard_url: 'https://govchain.us/dashboard',
      support: 'support@govchain.us',
      message: `Your ${plan.trial_days}-day GovChain trial is active for ${company_name}. No credit card required.`,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
