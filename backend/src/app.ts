import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Instantiate Prisma Client
const prisma = new PrismaClient();

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello');
});






// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
