// GovChain - Statement of Work (SOW) API
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const SOW_SECTIONS = [
    'background',
    'scope_of_work',
    'objectives',
    'tasks_deliverables',
    'period_of_performance',
    'place_of_performance',
    'personnel_qualifications',
    'government_furnished_equipment',
    'security_requirements',
    'reporting_requirements',
    'evaluation_criteria',
    'applicable_standards',
  ];

  if (req.method === 'GET') {
    const { contract_id, section } = req.query;

    if (!contract_id) {
      return res.status(400).json({ error: 'contract_id is required' });
    }

    const sow = {
      sow_id: `SOW-${contract_id}`,
      contract_id,
      version: '1.0',
      status: 'draft',
      created_at: new Date().toISOString(),
      sections: SOW_SECTIONS.map((s) => ({
        id: s,
        title: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        content: '',
        completed: false,
      })),
      completion_percent: 0,
      approved_by: null,
      approved_at: null,
    };

    if (section) {
      const found = sow.sections.find((s) => s.id === section);
      if (!found) {
        return res.status(404).json({
          error: `Section not found. Valid sections: ${SOW_SECTIONS.join(', ')}`,
        });
      }
      return res.status(200).json({ success: true, sow_id: sow.sow_id, section: found });
    }

    return res.status(200).json({ success: true, sow });
  }

  if (req.method === 'POST') {
    const { contract_id, title, agency, period_of_performance, sections } = req.body || {};

    if (!contract_id || !title || !agency) {
      return res.status(400).json({ error: 'contract_id, title, and agency are required' });
    }

    const sow_id = `SOW-${contract_id}-${Date.now()}`;

    return res.status(201).json({
      success: true,
      sow_id,
      contract_id,
      title,
      agency,
      period_of_performance,
      version: '1.0',
      status: 'draft',
      sections: SOW_SECTIONS.map((s) => ({
        id: s,
        title: s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        content: (sections && sections[s]) || '',
        completed: !!(sections && sections[s]),
      })),
      created_at: new Date().toISOString(),
      message: 'Statement of Work created successfully',
    });
  }

  if (req.method === 'PUT') {
    const { sow_id, section, content, status } = req.body || {};

    if (!sow_id) {
      return res.status(400).json({ error: 'sow_id is required' });
    }

    return res.status(200).json({
      success: true,
      sow_id,
      updated_section: section || null,
      status: status || 'draft',
      updated_at: new Date().toISOString(),
      message: section ? `Section "${section}" updated` : 'SOW updated successfully',
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
