// Netlify function to handle analytics requests silently
// This prevents 404 errors from analytics calls

exports.handler = async (event, context) => {
  // Accept all analytics requests without processing
  // This is a silent endpoint to prevent 404s
  
  return {
    statusCode: 204, // No Content
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Cache-Control': 'no-cache'
    },
    body: ''
  };
};
