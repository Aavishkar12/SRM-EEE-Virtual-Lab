const fs = require('fs');
const path = require('path');
const files = [
  'app/team/page.tsx',
  'app/settings/page.tsx',
  'app/quizzes/page.tsx',
  'app/page.tsx',
  'app/experiments/[id]/page.tsx',
  'app/experiments/page.tsx',
  'app/about/page.tsx'
];
files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('Library,') && !content.includes(', Library') && !content.includes('{ Library')) {
    content = content.replace(/import\s+\{([^}]+)\}\s+from\s+["']lucide-react["']/, (match, p1) => {
      return `import { ${p1.trim()}, Library } from "lucide-react"`;
    });
  }
  const expItem = '{ title: "Experiments", icon: <BookOpen className="h-full w-full text-neutral-300" />, href: "/experiments" },';
  const studyRoomItem = '    { title: "Study Room", icon: <Library className="h-full w-full text-neutral-300" />, href: "/study-room" },';
  if (content.includes(expItem) && !content.includes('title: "Study Room"')) {
    content = content.replace(expItem, `${expItem}\n${studyRoomItem}`);
  }
  fs.writeFileSync(filePath, content);
});
console.log('Updated 7 files');
