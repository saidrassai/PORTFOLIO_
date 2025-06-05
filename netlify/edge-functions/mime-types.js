export default async (request, context) => {
  const response = await context.next();
  const url = new URL(request.url);
  
  // Set correct MIME type for JavaScript files
  if (url.pathname.endsWith('.js') || url.pathname.includes('.js')) {
    response.headers.set('Content-Type', 'application/javascript; charset=utf-8');
  }
  
  // Set correct MIME type for ES modules
  if (url.pathname.endsWith('.mjs')) {
    response.headers.set('Content-Type', 'application/javascript; charset=utf-8');
  }
  
  return response;
};

export const config = {
  path: "/assets/*"
};
