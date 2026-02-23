const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Extract path - handle both /api/auth/* and /.netlify/functions/auth/*
  let path = event.path;
  if (path.includes('/.netlify/functions/auth')) {
    path = path.replace('/.netlify/functions/auth', '');
  } else if (path.includes('/api/auth')) {
    path = path.replace('/api/auth', '');
  }
  
  // Default to /login if no path
  if (!path || path === '') {
    path = '/login';
  }

  console.log('Auth function - Path:', path, 'Method:', event.httpMethod);

  try {
    // Login
    if (event.httpMethod === 'POST' && path === '/login') {
      const { username, password } = JSON.parse(event.body);

      console.log('Login attempt - Username:', username);
      console.log('Expected username:', process.env.ADMIN_USERNAME);

      // Check credentials against environment variables
      if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        // Generate a simple session token (in production, use JWT)
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token,
            user: { username }
          })
        };
      } else {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid credentials' })
        };
      }
    }

    // Logout
    if (event.httpMethod === 'POST' && path === '/logout') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    // Verify token
    if (event.httpMethod === 'GET' && path === '/verify') {
      const authHeader = event.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'No token provided' })
        };
      }

      const token = authHeader.substring(7);
      
      try {
        // Decode and verify token (basic verification)
        const decoded = Buffer.from(token, 'base64').toString();
        const [username] = decoded.split(':');

        if (username === process.env.ADMIN_USERNAME) {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ valid: true, user: { username } })
          };
        }
      } catch (err) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Invalid token' })
        };
      }

      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: 'Invalid token' })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };

  } catch (error) {
    console.error('Auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
