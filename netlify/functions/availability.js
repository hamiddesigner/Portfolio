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

const AVAILABILITY_ID = 'default';

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!verifyToken(event)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    // GET /api/availability
    if (event.httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('availability')
        .select('*')
        .eq('id', AVAILABILITY_ID)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      // Return default structure if none saved yet
      const result = data || {
        id: AVAILABILITY_ID,
        weekly_schedule: {},
        specific_dates: [],
        meeting_settings: {},
        timezone: 'UTC',
      };

      return { statusCode: 200, headers, body: JSON.stringify(result) };
    }

    // PUT /api/availability
    if (event.httpMethod === 'PUT') {
      const body = JSON.parse(event.body || '{}');
      const { data, error } = await supabase
        .from('availability')
        .upsert(
          { id: AVAILABILITY_ID, ...body, updated_at: new Date().toISOString() },
          { onConflict: 'id' }
        )
        .select()
        .single();

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (error) {
    console.error('Availability error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
