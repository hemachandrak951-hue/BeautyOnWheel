const fs = require('fs');
const path = require('path');

const rawApiBaseUrl = process.env.VERCEL_API_BASE_URL;

if (!rawApiBaseUrl) {
  console.error('Missing VERCEL_API_BASE_URL. Set it to your deployed Spring Boot API base URL, for example: https://api.example.com/api/v1');
  process.exit(1);
}

const apiUrl = rawApiBaseUrl.replace(/\/$/, '');
const environmentFile = path.join(__dirname, '..', 'src', 'environments', 'environment.prod.ts');
const fileContents = `export const environment = {
  production: true,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(environmentFile, fileContents);
console.log(`Using production API URL: ${apiUrl}`);
