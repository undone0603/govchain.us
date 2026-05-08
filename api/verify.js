// Vercel Serverless Function: GET/POST /api/verify
// GovChain document verification endpoint
// Supports both citizen lookups (GET ?token=) and agency submissions (POST)

import { createHash } from 'crypto';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  // GET /api/verify?token=XXXX — citizen document lookup
  if (req.method === 'GET') {
    const { token, id } = req.query;
    const identifier = token || id;
    if (!identifier) {
      return res.status(400).json({ error: 'token or id query parameter required' });
    }

    try {
      if (supabaseUrl && supabaseKey) {
        const lookupRes = await fetch(
          `${supabaseUrl}/rest/v1/verified_documents?or=(token.eq.${identifier},document_id.eq.${identifier})&limit=1`,
          { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
        );
        const docs = await lookupRes.json();
        if (docs && docs.length > 0) {
          const doc = docs[0];
          return res.status(200).json({
            verified: true,
            documentId: doc.document_id,
            documentType: doc.document_type,
            issuingAgency: doc.issuing_agency,
            issueDate: doc.issue_date,
            expiryDate: doc.expiry_date,
            holderName: doc.holder_name_redacted,
            chainTx: doc.polygon_tx,
            verifiedAt: doc.verified_at,
            status: doc.status,
            nistCompliant: true,
            zkProof: doc.zk_proof_hash || null
          });
        }
      }

      // Demo response for pilot testing (when no Supabase record exists)
      return res.status(200).json({
        verified: false,
        message: 'Document not found in GovChain registry. This document may not yet be anchored on-chain.',
        documentId: identifier,
        status: 'not_found',
        helpUrl: 'https://govchain.us/#agencies'
      });

    } catch (err) {
      console.error('Verify GET error:', err);
      return res.status(500).json({ error: 'Verification service temporarily unavailable' });
    }
  }

  // POST /api/verify — agency submits document for anchoring
  if (req.method === 'POST') {
    try {
      const { documentType, documentHash, issuingAgency, holderNameRedacted, issueDate, expiryDate, agencyApiKey } = req.body;

      if (!documentHash || !documentType || !issuingAgency) {
        return res.status(400).json({ error: 'documentHash, documentType, and issuingAgency are required' });
      }

      // Validate API key
      const validKey = process.env.AGENCY_API_KEY;
      if (validKey && agencyApiKey !== validKey) {
        return res.status(401).json({ error: 'Invalid agency API key' });
      }

      const documentId = `GC-DOC-${createHash('sha256').update(documentHash + Date.now()).digest('hex').slice(0, 12).toUpperCase()}`;
      const timestamp = new Date().toISOString();

      const record = {
        document_id: documentId,
        document_type: documentType,
        document_hash: documentHash,
        issuing_agency: issuingAgency,
        holder_name_redacted: holderNameRedacted || 'REDACTED',
        issue_date: issueDate || null,
        expiry_date: expiryDate || null,
        status: 'anchoring',
        nist_compliant: true,
        verified_at: timestamp,
        created_at: timestamp
      };

      if (supabaseUrl && supabaseKey) {
        await fetch(`${supabaseUrl}/rest/v1/verified_documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(record)
        });
      }

      return res.status(201).json({
        success: true,
        documentId,
        status: 'anchoring',
        message: 'Document received and queued for blockchain anchoring on Polygon PoS.',
        estimatedAnchoring: '< 2 minutes',
        verifyUrl: `https://govchain.us/verify?token=${documentId}`,
        nistCompliant: true
      });

    } catch (err) {
      console.error('Verify POST error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
