import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2026-03-25.dahlia',
  appInfo: {
    name: 'DevJobs.br SaaS',
    version: '0.1.0'
  }
});
