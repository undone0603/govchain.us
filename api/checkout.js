// Vercel Serverless Function: /api/checkout
// Creates a Stripe Checkout Session for GovChain subscriptions
// POST { tier: 'municipal' | 'state' | 'federal', email?: string }

const TIERS = {
  municipal: {
    name: 'GovChain Municipal',
    amount: 14900, // $149/mo
    currency: 'usd',
    interval: 'month',
  },
  state: {
    name: 'GovChain State',
    amount: 49900, // $499/mo
    currency: 'usd',
    interval: 'month',
  },
  federal: {
    name: 'GovChain Federal',
    amount: 149900, // $1,499/mo
    currency: 'usd',
    interval: 'month',
  },
  gov_municipal: {
    name: 'GovChain Government Municipal',
    amount: 29900, // $299/mo
    currency: 'usd',
    interval: 'month',
  },
  gov_state: {
    name: 'GovChain Government State',
    amount: 99900, // $999/mo
    currency: 'usd',
    interval: 'month',
  },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://govchain.us');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (!stripeSecret) {
    return res.status(500).json({ error: 'Stripe not configured' });
  }

  const { tier = 'municipal', email } = req.body || {};
  const tierConfig = TIERS[tier];

  if (!tierConfig) {
    return res.status(400).json({ error: `Invalid tier: ${tier}` });
  }

  try {
    const sessionPayload = {
      payment_method_types: ['card'],
      mode: 'subscription',
      metadata: { tier, source: 'govchain' },
      success_url: `https://govchain.us/?checkout=success&tier=${tier}`,
      cancel_url: `https://govchain.us/?checkout=cancelled`,
      line_items: [
        {
          price_data: {
            currency: tierConfig.currency,
            product_data: { name: tierConfig.name },
            unit_amount: tierConfig.amount,
            recurring: { interval: tierConfig.interval },
          },
          quantity: 1,
        },
      ],
    };

    if (email) {
      sessionPayload.customer_email = email;
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(flattenStripeParams(sessionPayload)).toString(),
    });

    const session = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: session.error?.message || 'Stripe error' });
    }

    return res.status(200).json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Checkout error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function flattenStripeParams(obj, prefix = '') {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}[${key}]` : key;
    if (value === null || value === undefined) continue;
    if (typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenStripeParams(value, fullKey));
    } else if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === 'object') {
          Object.assign(result, flattenStripeParams(item, `${fullKey}[${i}]`));
        } else {
          result[`${fullKey}[${i}]`] = item;
        }
      });
    } else {
      result[fullKey] = String(value);
    }
  }
  return result;
}
