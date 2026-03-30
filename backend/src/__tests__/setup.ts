import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Minden tesztfájl futása előtt: in-memory MongoDB indítása
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Minden egyes teszt után: összes kollekció ürítése (izolált tesztek)
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Minden tesztfájl futása után: kapcsolat lezárása
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
