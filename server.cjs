const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 8086;
const DIR = path.join(__dirname, 'dist', 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

let mentors = [
  { id: 'm-1', name: 'Dr. Tariq Mansour', specialization: 'Machine Learning & Neural Architectures', rating: 4.95, studentsCount: 420, hourlyRate: '$85', isActive: true },
  { id: 'm-2', name: 'Eng. Reem Al-Khatib', specialization: 'Fullstack Monorepo Engineering & Drizzle ORM', rating: 4.98, studentsCount: 650, hourlyRate: '$95', isActive: true },
  { id: 'm-3', name: 'Dr. Ziad Taha', specialization: 'High-Performance Algorithmic Systems', rating: 5.0, studentsCount: 890, hourlyRate: '$120', isActive: true }
];

let courses = [
  { id: 'c-1', title: 'Advanced Fullstack TypeScript & Drizzle ORM', category: 'Backend Architecture', duration: '8 Weeks', enrolledStudents: 310, level: 'Advanced' },
  { id: 'c-2', title: 'Zero-Downtime Microservices & Distributed Caching', category: 'Cloud Infrastructure', duration: '6 Weeks', enrolledStudents: 245, level: 'Staff Level' }
];

let students = [
  { id: 's-1', name: 'Karim Youssef', enrolledCourses: ['c-1'], progressPercent: 82, mentorId: 'm-2', status: 'active' },
  { id: 's-2', name: 'Laila Mahmoud', enrolledCourses: ['c-1', 'c-2'], progressPercent: 94, mentorId: 'm-3', status: 'honors' }
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const reqPath = parsedUrl.pathname;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Handle tRPC and REST API calls
  if (reqPath.startsWith('/api/') || reqPath.startsWith('/trpc/')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    if (reqPath.includes('auth.me')) {
      return res.end(JSON.stringify({ result: { data: { id: 'usr-1', name: 'EduPro Admin', email: 'admin@edupro.edu', role: 'admin' } } }));
    }
    if (reqPath.includes('mentors') || reqPath.includes('mentors.list')) {
      return res.end(JSON.stringify({ result: { data: mentors } }));
    }
    if (reqPath.includes('users') || reqPath.includes('users.list') || reqPath.includes('students')) {
      return res.end(JSON.stringify({ result: { data: { items: students, total: students.length } } }));
    }
    if (reqPath.includes('courses') || reqPath.includes('categories')) {
      return res.end(JSON.stringify({ result: { data: courses } }));
    }
    if (reqPath.includes('learningGuide')) {
      return res.end(JSON.stringify({
        result: {
          data: {
            recommendation: 'Based on your profile, we recommend starting with Advanced Fullstack TypeScript with Eng. Reem Al-Khatib.',
            suggestedMentors: ['m-2', 'm-3']
          }
        }
      }));
    }

    return res.end(JSON.stringify({ success: true, result: { data: { mentors, courses, students } } }));
  }

  // Static files / SPA routing
  let file = path.join(DIR, reqPath === '/' ? 'index.html' : reqPath);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    file = path.join(DIR, 'index.html');
  }
  if (!fs.existsSync(file)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
    return;
  }
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('EduPro Fullstack App & tRPC API listening at http://localhost:' + PORT);
});
