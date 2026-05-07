import { AppDataSource } from '../dataSource.js';
import { Quote } from '../entities/Quote.js';

const quoteRepository = AppDataSource.getRepository(Quote);

// Helps to go by 50s
function calculateGroutIncrements(squareFeet: number): number {
  return Math.ceil(squareFeet / 50);
}

// Helps to go by 70s
function calculateThinSetIncrements(squareFeet: number): number {
  return Math.ceil(squareFeet / 70);
}

// Help to get area if area not provided
function calculateSquareFeet(W: number, L: number): number {
  return W * L;
}

// update functions
async function updatedemolition(quoteId: string, newdemolition: boolean): Promise<Quote | null> {
  const quote = await quoteRepository.findOne({ where: { quoteId } });

  if (!quote) {
    return null;
  }

  quote.demolition = newdemolition;
  return quoteRepository.save(quote);
}

async function updategrout(quoteId: string, newgrout: boolean): Promise<Quote | null> {
  const quote = await quoteRepository.findOne({ where: { quoteId } });

  if (!quote) {
    return null;
  }

  quote.grout = newgrout;
  return quoteRepository.save(quote);
}

async function updatepickup(quoteId: string, newpickup: boolean): Promise<Quote | null> {
  const quote = await quoteRepository.findOne({ where: { quoteId } });

  if (!quote) {
    return null;
  }

  quote.pickup = newpickup;
  return quoteRepository.save(quote);
}

async function updatethin_set(quoteId: string, newthinset: boolean): Promise<Quote | null> {
  const quote = await quoteRepository.findOne({ where: { quoteId } });

  if (!quote) {
    return null;
  }

  quote.thin_set = newthinset;
  return quoteRepository.save(quote);
}

async function updatefeet_width(quoteId: string, newWidth: number): Promise<Quote | null> {
  const quote = await quoteRepository.findOne({ where: { quoteId } });

  if (!quote) {
    return null;
  }

  quote.feet_width = newWidth;
  return quoteRepository.save(quote);
}

async function updatefeet_length(quoteId: string, newLength: number): Promise<Quote | null> {
  const quote = await quoteRepository.findOne({ where: { quoteId } });

  if (!quote) {
    return null;
  }

  quote.feet_length = newLength;
  return quoteRepository.save(quote);
}

async function updatesqr_feet(quoteId: string, newArea: number): Promise<Quote | null> {
  const quote = await quoteRepository.findOne({ where: { quoteId } });

  if (!quote) {
    return null;
  }

  quote.sqr_feet = newArea;
  return quoteRepository.save(quote);
}

async function getquote_total(
  quoteId: string,
  feet_length: number,
  feet_width: number,
  sqr_feet: number,
  demolition: boolean,
  grout: boolean,
  pickup: boolean,
  thin_set: boolean,
): Promise<Quote | null> {
  const quote = await quoteRepository.findOne({ where: { quoteId } });

  if (!quote) {
    return null;
  }

  let sum = 0;

  // Calculate area
  let area = sqr_feet;
  if (area === 0 && feet_length > 0 && feet_width > 0) {
    area = calculateSquareFeet(feet_width, feet_length);
  }

  if (area > 0) {
    // Base cost: $4 per square foot
    sum += area * 4;

    // Demolition fee: $100 flat
    if (demolition) {
      sum += 100;
    }

    // Grout: $4 per 50 sq ft increment
    if (grout) {
      sum += calculateGroutIncrements(area) * 4;
    }

    // Pickup: $100 flat
    if (pickup) {
      sum += 100;
    }

    // Thin set: $25 per 70 sq ft increment
    if (thin_set) {
      sum += calculateThinSetIncrements(area) * 25;
    }

    quote.quote_total = sum;
    await quoteRepository.save(quote);
  }

  return quote;
}

export {
  updatedemolition,
  updategrout,
  updatepickup,
  updatethin_set,
  updatefeet_width,
  updatefeet_length,
  updatesqr_feet,
  getquote_total,
};
