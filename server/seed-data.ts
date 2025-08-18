import 'dotenv/config';
import { connectToMongoDB } from './mongodb';
import { weddingStorage } from './wedding-storage';
import type { CreateWeddingEvent } from '@shared/wedding-schema';

const sampleWeddingEvents: CreateWeddingEvent[] = [
  {
    title: "Wedding Ceremony",
    description: "The main wedding ceremony where Esther and Basil will exchange vows",
    date: new Date("2025-08-02T14:00:00"),
    startTime: "14:00",
    endTime: "15:30",
    location: {
      name: "St. Mary's Cathedral",
      address: "123 Church Street, Wedding City, WC 12345",
      coordinates: {
        lat: 40.7128,
        lng: -74.0060
      }
    },
    eventType: "ceremony",
    dressCode: "Formal attire requested",
    isPublic: true
  },
  {
    title: "Cocktail Hour",
    description: "Join us for cocktails and light refreshments",
    date: new Date("2025-08-02T16:00:00"),
    startTime: "16:00",
    endTime: "17:00",
    location: {
      name: "Garden Terrace",
      address: "456 Reception Avenue, Wedding City, WC 12345",
    },
    eventType: "party",
    isPublic: true
  },
  {
    title: "Wedding Reception",
    description: "Dinner, dancing, and celebration",
    date: new Date("2025-08-02T17:00:00"),
    startTime: "17:00",
    endTime: "23:00",
    location: {
      name: "Grand Ballroom",
      address: "456 Reception Avenue, Wedding City, WC 12345",
    },
    eventType: "reception",
    dressCode: "Formal attire requested",
    isPublic: true
  },
  {
    title: "Rehearsal Dinner",
    description: "Private dinner for wedding party and close family",
    date: new Date("2025-08-01T18:00:00"),
    startTime: "18:00",
    endTime: "21:00",
    location: {
      name: "The Garden Restaurant",
      address: "789 Rehearsal Road, Wedding City, WC 12345",
    },
    eventType: "rehearsal",
    isPublic: false
  }
];

export async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await connectToMongoDB();
    
    console.log('Seeding wedding events...');
    for (const event of sampleWeddingEvents) {
      try {
        await weddingStorage.createWeddingEvent(event);
        console.log(`Created event: ${event.title}`);
      } catch (error) {
        console.log(`Event ${event.title} might already exist, skipping...`);
      }
    }
    
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('Seeding finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}