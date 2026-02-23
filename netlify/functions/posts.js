const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

  const pathParts = event.path.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1] !== 'posts' ? pathParts[pathParts.length - 1] : null;

  // Public GET requests (no auth required for reading published posts)
  if (event.httpMethod === 'GET') {
    try {
      // GET all published posts (public)
      if (!id) {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        return { statusCode: 200, headers, body: JSON.stringify(data) };
      }
      
      // GET single post by ID (public)
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .eq('status', 'published')
        .single();

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
    }
  }

  // All other methods require authentication
  if (!verifyToken(event)) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  try {
    // Admin GET all (authenticated - includes drafts)
    if (event.httpMethod === 'GET' && !id) {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // GET one
    if (event.httpMethod === 'GET' && id) {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // POST create
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { data, error } = await supabase
        .from('posts')
        .insert([{ ...body, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return { statusCode: 201, headers, body: JSON.stringify(data) };
    }

    // PUT update
    if (event.httpMethod === 'PUT' && id) {
      const body = JSON.parse(event.body || '{}');
      const { data, error } = await supabase
        .from('posts')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify(data) };
    }

    // DELETE
    if (event.httpMethod === 'DELETE' && id) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  } catch (error) {
    console.error('Posts error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: error.message }) };
  }
};
