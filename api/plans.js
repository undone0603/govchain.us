// GovChain - Pricing Plans API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { billing = 'monthly' } = req.query;
  const isAnnual = billing === 'annual';

  const PLANS = [
    {
      id: 'small_business',
      name: 'Small Business',
      tagline: 'For small businesses and new government contractors',
      price_monthly: 79,
      price_annual: 63,
      annual_savings: 192,
      stripe_price_id_monthly: 'price_govchain_smb_monthly',
      stripe_price_id_annual: 'price_govchain_smb_annual',
      popular: false,
      contracts_limit: 10,
      opportunities_limit: 50,
      team_members: 2,
      features: [
        '10 active contracts',
        '50 opportunity searches/month',
        'SAM.gov status monitoring',
        'SBIR/STTR grant tracking',
        'Set-aside opportunity alerts',
        'Small business cert tracker (8(a), HUBZone, SDVOSB, WOSB)',
        'Proposal starter templates',
        '2 team members',
        'Email support',
      ],
      cta: 'Start Free Trial',
      trial_days: 30,
      trial_url: 'https://govchain.us/trial?plan=small_business_trial',
      checkout_url: 'https://govchain.us/checkout?plan=small_business',
    },
    {
      id: 'contractor_pro',
      name: 'Contractor Pro',
      tagline: 'For growing contractors managing multiple contracts',
      price_monthly: 149,
      price_annual: 119,
      annual_savings: 360,
      stripe_price_id_monthly: 'price_govchain_contractor_monthly',
      stripe_price_id_annual: 'price_govchain_contractor_annual',
      popular: true,
      contracts_limit: 25,
      opportunities_limit: 100,
      team_members: 5,
      features: [
        '25 active contracts',
        '100 opportunity searches/month',
        'Everything in Small Business',
        'Milestone & deliverable tracking',
        'SOW / PWS document builder',
        'Past performance library',
        'Teaming agreement management',
        '5 team members',
        'Priority email support',
      ],
      cta: 'Start Free Trial',
      trial_days: 14,
      trial_url: 'https://govchain.us/trial?plan=contractor_trial',
      checkout_url: 'https://govchain.us/checkout?plan=contractor_pro',
    },
    {
      id: 'agency_pro',
      name: 'Agency Pro',
      tagline: 'For program managers and contracting officers',
      price_monthly: 399,
      price_annual: 319,
      annual_savings: 960,
      stripe_price_id_monthly: 'price_govchain_agency_monthly',
      stripe_price_id_annual: 'price_govchain_agency_annual',
      popular: false,
      contracts_limit: 250,
      opportunities_limit: -1,
      team_members: -1,
      features: [
        '250 contracts under management',
        'Unlimited opportunity pipeline',
        'Everything in Contractor Pro',
        'Vendor & teaming management',
        'Advanced reporting & dashboards',
        'Protest & dispute tracking',
        'Closeout & option period management',
        'Unlimited team members',
        'Dedicated Slack support channel',
      ],
      cta: 'Start Free Trial',
      trial_days: 14,
      trial_url: 'https://govchain.us/trial?plan=agency_trial',
      checkout_url: 'https://govchain.us/checkout?plan=agency_pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tagline: 'Custom contracts for large primes and agencies',
      price_monthly: null,
      price_annual: null,
      annual_savings: null,
      stripe_price_id_monthly: null,
      stripe_price_id_annual: null,
      popular: false,
      contracts_limit: -1,
      opportunities_limit: -1,
      team_members: -1,
      features: [
        'Unlimited contracts & pipeline',
        'Everything in Agency Pro',
        'Custom integrations (SAM API, PIEE, etc.)',
        'White-label deployment',
        'SOC 2 compliance reports',
        'Dedicated account manager',
        'Net-30 invoicing',
        'Custom SLA',
      ],
      cta: 'Contact Sales',
      trial_days: 30,
      trial_url: null,
      checkout_url: null,
      contact_url: 'https://govchain.us/enterprise',
    },
  ];

  const plans_with_billing = PLANS.map((plan) => ({
    ...plan,
    displayed_price: plan.price_monthly !== null
      ? isAnnual ? plan.price_annual : plan.price_monthly
      : null,
    billing_cycle: billing,
    active_stripe_price_id: isAnnual
      ? plan.stripe_price_id_annual
      : plan.stripe_price_id_monthly,
  }));

  return res.status(200).json({
    success: true,
    billing,
    annual_discount_percent: 20,
    plans: plans_with_billing,
    faq: [
      { q: 'Do I need a credit card for the trial?', a: 'No. All trials are completely free with no credit card required.' },
      { q: 'Does GovChain integrate with SAM.gov?', a: 'Yes. We monitor your SAM.gov registration status and alert you on expiry or issues.' },
      { q: 'Can I track SBIR/STTR grants?', a: 'Yes, SBIR/STTR tracking is included on all plans including Small Business.' },
      { q: 'Is there a government/non-profit discount?', a: 'Yes — contact sales@govchain.us for special pricing.' },
    ],
    contact: { sales: 'sales@govchain.us', support: 'support@govchain.us' },
  });
}
