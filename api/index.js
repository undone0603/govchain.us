/**
 * GovChain API - Single catch-all serverless function
 * Routes all /api/* requests to the correct handler.
 * Keeps Vercel Hobby plan under the 12-function limit.
 */
const url = require('url');

const handlers = {
  achievement:    () => require('./achievement'),
  affiliate:      () => require('./affiliate'),
  agency:         () => require('./agency'),
  amendment:      () => require('./amendment'),
  analytics:      () => require('./analytics'),
  audit:          () => require('./audit'),
  award:          () => require('./award'),
  badges:         () => require('./badges'),
  bid:            () => require('./bid'),
  budget:         () => require('./budget'),
  calendar:       () => require('./calendar'),
  capability:     () => require('./capability'),
  certification:  () => require('./certification'),
  checkout:       () => require('./checkout'),
  'churn-risk':   () => require('./churn-risk'),
  clauses:        () => require('./clauses'),
  clearance:      () => require('./clearance'),
  closeout:       () => require('./closeout'),
  compliance:     () => require('./compliance'),
  contact:        () => require('./contact'),
  contract:       () => require('./contract'),
  dashboard:      () => require('./dashboard'),
  debrief:        () => require('./debrief'),
  deliverable:    () => require('./deliverable'),
  demo:           () => require('./demo'),
  digest:         () => require('./digest'),
  dispute:        () => require('./dispute'),
  document:       () => require('./document'),
  'email-broadcast': () => require('./email-broadcast'),
  enterprise:     () => require('./enterprise'),
  export:         () => require('./export'),
  funding:        () => require('./funding'),
  grants:         () => require('./grants'),
  invoice:        () => require('./invoice'),
  leaderboard:    () => require('./leaderboard'),
  meeting:        () => require('./meeting'),
  milestone:      () => require('./milestone'),
  modification:   () => require('./modification'),
  notification:   () => require('./notification'),
  onboarding:     () => require('./onboarding'),
  option:         () => require('./option'),
  outreach:       () => require('./outreach'),
  past_performance: () => require('./past_performance'),
  'payment-recovery': () => require('./payment-recovery'),
  payment:        () => require('./payment'),
  performance:    () => require('./performance'),
  pipeline:       () => require('./pipeline'),
  plans:          () => require('./plans'),
  pricing:        () => require('./pricing'),
  profile:        () => require('./profile'),
  proposal:       () => require('./proposal'),
  protest:        () => require('./protest'),
  referral:       () => require('./referral'),
  report:         () => require('./report'),
  retention:      () => require('./retention'),
  rewards:        () => require('./rewards'),
  rfp:            () => require('./rfp'),
  sam:            () => require('./sam'),
  sbir:           () => require('./sbir'),
  search:         () => require('./search'),
  small_business: () => require('./small_business'),
  'social-proof': () => require('./social-proof'),
  solicitation:   () => require('./solicitation'),
  sow:            () => require('./sow'),
  stakeholder:    () => require('./stakeholder'),
  status:         () => require('./status'),
  streaks:        () => require('./streaks'),
  subcontract:    () => require('./subcontract'),
  subscription:   () => require('./subscription'),
  support:        () => require('./support'),
  task:           () => require('./task'),
  team:           () => require('./team'),
  teaming:        () => require('./teaming'),
  testimonials:   () => require('./testimonials'),
  training:       () => require('./training'),
  trial:          () => require('./trial'),
  upgrade:        () => require('./upgrade'),
  upsell:         () => require('./upsell'),
  user:           () => require('./user'),
  vendor:         () => require('./vendor'),
  verify:         () => require('./verify'),
  waitlist:       () => require('./waitlist'),
  webhook:        () => require('./webhook'),
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const parsed = url.parse(req.url);
  const parts = parsed.pathname.replace(/^\/api\//, '').split('/');
  const segment = parts[0];

  const loader = handlers[segment];
  if (!loader) {
    return res.status(404).json({ error: `API route not found: ${segment}` });
  }

  try {
    const handler = loader();
    const fn = handler.default || handler;
    return await fn(req, res);
  } catch (err) {
    console.error(`[GovChain API] Error in /${segment}:`, err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};
