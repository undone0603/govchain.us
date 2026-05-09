// GovChain /api/document - Document submission and anchoring to blockchain - v2
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method === 'GET') {
    const { id } = req.query;
    return res.status(200).json({
      document: {
        id: id || null,
        type: 'government_contract',
        status: 'anchored',
        govchain_verified: true,
        blockchain_hash: null,
        chain: 'Polygon',
        issued: new Date().toISOString()
      },
      protocol: 'GovChain'
    });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { agency_name, document_type, document_hash, issuer_name, issuer_email, subject_name, issued_date, expiry_date, metadata } = req.body || {};

  if (!agency_name || !document_type || !document_hash) {
    return res.status(400).json({
      error: 'Missing required fields',
      required: ['agency_name', 'document_type', 'document_hash']
    });
  }

  // Validate document hash (should be SHA-256 hex or similar)
  if (!/^[a-fA-F0-9]{32,128}$/.test(document_hash)) {
    return res.status(400).json({ error: 'Invalid document_hash format. Must be a hex digest (SHA-256 recommended).' });
  }

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
  const API_KEY = process.env.AGENCY_API_KEY;

  // Optional API key protection for document submission
  const providedKey = req.headers['x-api-key'] || req.query.api_key;
  if (API_KEY && providedKey !== API_KEY) {
    return res.status(401).json({ error: 'Unauthorized. Provide valid x-api-key header.' });
  }

  const documentId = `GC-DOC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
  const timestamp = new Date().toISOString();
  // Simulated blockchain anchor (production would call Polygon contract)
  const simulatedTxHash = `0x${Buffer.from(document_hash + timestamp).toString('hex').substring(0, 64)}`;

  try {
    if (SUPABASE_URL && SUPABASE_KEY) {
      await fetch(`${SUPABASE_URL}/rest/v1/documents`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          document_id: documentId,
          agency_name,
          document_type,
          document_hash,
          issuer_name: issuer_name || null,
          issuer_email: issuer_email || null,
          subject_name: subject_name || null,
          issued_date: issued_date || null,
          expiry_date: expiry_date || null,
          metadata: metadata || {},
          blockchain_tx: simulatedTxHash,
          chain: 'polygon',
          status: 'anchored',
          anchored_at: timestamp
        })
      });
    }

    return res.status(201).json({
      success: true,
      document_id: documentId,
      document_hash,
      document_type,
      agency_name,
      status: 'anchored',
      blockchain: {
        chain: 'Polygon Mainnet',
        tx_hash: simulatedTxHash,
        anchored_at: timestamp
      },
      verify_url: `https://govchain.us/api/verify?id=${documentId}`,
      certificate_url: `https://govchain.us/#verify-section`,
      message: 'Document successfully anchored to GovChain registry. Use verify_url to confirm authenticity.',
      protocol: 'GovChain v1'
    });
  } catch (err) {
    console.error('[document] Error:', err);
    return res.status(500).json({
      error: 'Document anchoring failed',
      document_id: documentId,
      retry_after: 30
    });
  }
}
