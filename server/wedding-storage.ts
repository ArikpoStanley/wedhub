import { ObjectId } from 'mongodb';
import { getRSVPCollection, getGuestCollection, getWeddingEventCollection, getContactCollection } from './mongodb';
import type { RSVP, CreateRSVP, Guest, CreateGuest, WeddingEvent, CreateWeddingEvent, Contact, CreateContact } from '@shared/wedding-schema';

export interface IWeddingStorage {
  // RSVP methods
  createRSVP(rsvp: CreateRSVP): Promise<RSVP>;
  getRSVPById(id: string): Promise<RSVP | null>;
  getRSVPByEmail(email: string): Promise<RSVP | null>;
  updateRSVP(id: string, updates: Partial<CreateRSVP>): Promise<RSVP | null>;
  getAllRSVPs(): Promise<RSVP[]>;
  deleteRSVP(id: string): Promise<boolean>;

  // Guest methods
  createGuest(guest: CreateGuest): Promise<Guest>;
  getGuestById(id: string): Promise<Guest | null>;
  getGuestByEmail(email: string): Promise<Guest | null>;
  updateGuest(id: string, updates: Partial<CreateGuest>): Promise<Guest | null>;
  getAllGuests(): Promise<Guest[]>;
  deleteGuest(id: string): Promise<boolean>;

  // Wedding Event methods
  createWeddingEvent(event: CreateWeddingEvent): Promise<WeddingEvent>;
  getWeddingEventById(id: string): Promise<WeddingEvent | null>;
  updateWeddingEvent(id: string, updates: Partial<CreateWeddingEvent>): Promise<WeddingEvent | null>;
  getAllWeddingEvents(): Promise<WeddingEvent[]>;
  deleteWeddingEvent(id: string): Promise<boolean>;

  // Contact methods
  createContact(contact: CreateContact): Promise<Contact>;
  getContactById(id: string): Promise<Contact | null>;
  getContactByEmail(email: string): Promise<Contact | null>;
  updateContact(id: string, updates: Partial<CreateContact>): Promise<Contact | null>;
  getAllContacts(): Promise<Contact[]>;
  deleteContact(id: string): Promise<boolean>;
}

export class MongoWeddingStorage implements IWeddingStorage {
  // RSVP methods
  async createRSVP(rsvp: CreateRSVP): Promise<RSVP> {
    const collection = getRSVPCollection();
    const now = new Date();
    const rsvpWithDates = {
      ...rsvp,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(rsvpWithDates);
    return {
      ...rsvpWithDates,
      _id: result.insertedId.toString(),
    };
  }

  async getRSVPById(id: string): Promise<RSVP | null> {
    const collection = getRSVPCollection();
    const rsvp = await collection.findOne({ _id: new ObjectId(id) });
    return rsvp ? { ...rsvp, _id: rsvp._id.toString() } : null;
  }

  async getRSVPByEmail(email: string): Promise<RSVP | null> {
    const collection = getRSVPCollection();
    const rsvp = await collection.findOne({ email });
    return rsvp ? { ...rsvp, _id: rsvp._id.toString() } : null;
  }

  async updateRSVP(id: string, updates: Partial<CreateRSVP>): Promise<RSVP | null> {
    const collection = getRSVPCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result ? { ...result, _id: result._id.toString() } : null;
  }

  async getAllRSVPs(): Promise<RSVP[]> {
    const collection = getRSVPCollection();
    const rsvps = await collection.find({}).toArray();
    return rsvps.map(rsvp => ({ ...rsvp, _id: rsvp._id.toString() }));
  }

  async deleteRSVP(id: string): Promise<boolean> {
    const collection = getRSVPCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Guest methods
  async createGuest(guest: CreateGuest): Promise<Guest> {
    const collection = getGuestCollection();
    const now = new Date();
    const guestWithDates = {
      ...guest,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(guestWithDates);
    return {
      ...guestWithDates,
      _id: result.insertedId.toString(),
    };
  }

  async getGuestById(id: string): Promise<Guest | null> {
    const collection = getGuestCollection();
    const guest = await collection.findOne({ _id: new ObjectId(id) });
    return guest ? { ...guest, _id: guest._id.toString() } : null;
  }

  async getGuestByEmail(email: string): Promise<Guest | null> {
    const collection = getGuestCollection();
    const guest = await collection.findOne({ email });
    return guest ? { ...guest, _id: guest._id.toString() } : null;
  }

  async updateGuest(id: string, updates: Partial<CreateGuest>): Promise<Guest | null> {
    const collection = getGuestCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result ? { ...result, _id: result._id.toString() } : null;
  }

  async getAllGuests(): Promise<Guest[]> {
    const collection = getGuestCollection();
    const guests = await collection.find({}).toArray();
    return guests.map(guest => ({ ...guest, _id: guest._id.toString() }));
  }

  async deleteGuest(id: string): Promise<boolean> {
    const collection = getGuestCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Wedding Event methods
  async createWeddingEvent(event: CreateWeddingEvent): Promise<WeddingEvent> {
    const collection = getWeddingEventCollection();
    const now = new Date();
    const eventWithDates = {
      ...event,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(eventWithDates);
    return {
      ...eventWithDates,
      _id: result.insertedId.toString(),
    };
  }

  async getWeddingEventById(id: string): Promise<WeddingEvent | null> {
    const collection = getWeddingEventCollection();
    const event = await collection.findOne({ _id: new ObjectId(id) });
    return event ? { ...event, _id: event._id.toString() } : null;
  }

  async updateWeddingEvent(id: string, updates: Partial<CreateWeddingEvent>): Promise<WeddingEvent | null> {
    const collection = getWeddingEventCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result ? { ...result, _id: result._id.toString() } : null;
  }

  async getAllWeddingEvents(): Promise<WeddingEvent[]> {
    const collection = getWeddingEventCollection();
    const events = await collection.find({}).sort({ date: 1, startTime: 1 }).toArray();
    return events.map(event => ({ ...event, _id: event._id.toString() }));
  }

  async deleteWeddingEvent(id: string): Promise<boolean> {
    const collection = getWeddingEventCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }

  // Contact methods
  async createContact(contact: CreateContact): Promise<Contact> {
    const collection = getContactCollection();
    const now = new Date();
    const contactWithDates = {
      ...contact,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(contactWithDates);
    return {
      ...contactWithDates,
      _id: result.insertedId.toString(),
    };
  }

  async getContactById(id: string): Promise<Contact | null> {
    const collection = getContactCollection();
    const contact = await collection.findOne({ _id: new ObjectId(id) });
    return contact ? { ...contact, _id: contact._id.toString() } : null;
  }

  async getContactByEmail(email: string): Promise<Contact | null> {
    const collection = getContactCollection();
    const contact = await collection.findOne({ email });
    return contact ? { ...contact, _id: contact._id.toString() } : null;
  }

  async updateContact(id: string, updates: Partial<CreateContact>): Promise<Contact | null> {
    const collection = getContactCollection();
    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    return result ? { ...result, _id: result._id.toString() } : null;
  }

  async getAllContacts(): Promise<Contact[]> {
    const collection = getContactCollection();
    const contacts = await collection.find({}).sort({ fullName: 1 }).toArray();
    return contacts.map(contact => ({ ...contact, _id: contact._id.toString() }));
  }

  async deleteContact(id: string): Promise<boolean> {
    const collection = getContactCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount === 1;
  }
}

export const weddingStorage = new MongoWeddingStorage();