const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Content-Type': 'application/json',
};

function verifyToken(event) {
  const authHeader = event.headers.authorization || event.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.substring(7);
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [username] = decoded.split(':');
    return username === process.env.ADMIN_USERNAME;
  } catch {
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!verifyToken(event)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  // Extract section from path: /.netlify/functions/page-content/<section>
  const pathParts = event.path.split('/').filter(Boolean);
  const section = pathParts[pathParts.length - 1] !== 'page-content' ? pathParts[pathParts.length - 1] : null;

  try {
    // GET /api/content/:section
    if (event.httpMethod === 'GET') {
      if (!section) {
        // Get all sections
        const { data, error } = await supabase
          .from('page_content')
          .select('*')
          .order('section');

        if (error) throw error;
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }

      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('section', section)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data || { section, content: {} }) };
    }

    // PUT /api/content/:section
    if (event.httpMethod === 'PUT' && section) {
      const body = JSON.parse(event.body || '{}');
      const { data, error } = await supabase
        .from('page_content')
        .upsert(
          { section, content: body.content || body, updated_at: new Date().toISOString() },
          { onConflict: 'section' }
        )
        .select()
        .single();

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (error) {
    console.error('Page content error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
