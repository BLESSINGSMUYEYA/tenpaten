import bcrypt from 'bcryptjs';
const hashes = [
  { name: 'director@malawi.com', hash: '$2b$10$MtCh4r2lxlcT8lK1KI3jae7J/QmUzL1Sofo1jE67VwtGUfh6oTdiy' },
  { name: 'davidchilembo99@gmail.com', hash: '$2b$10$lwOBbQF9klQH1XqFDHAhPub2gVFw2kpS1sHB5mBa/.Y0e5ewxbuuK' },
  { name: 'jailosimercusphiri@gmail.com', hash: '$2b$10$5pb2S4wvNbqvlVoWRSANDe6cL30huQ5MAM/38skjVIy4o6Ft9U4uu' }
];

for (const h of hashes) {
  const matches = bcrypt.compareSync('password123', h.hash);
  console.log(`${h.name} matches 'password123': ${matches}`);
}
