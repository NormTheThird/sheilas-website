# To do

One list for both of us. Claude reads this at the start of every session and
after every pull, and tells whoever it is working with what is on their list.
This repo is public, so keep passwords, tracking numbers, tax IDs and
addresses out of this file.

**Rules for Claude:**
- Ask who you are working with (Trey or Sheila) if it is not clear.
- Read out that person's items first, then anything under Waiting on others.
- When something is done, delete it. When something needs the other person,
  add it under their name, then commit, `git pull --rebase`, and push so it
  shows up on their computer.

Last updated 2026-11-14 (Sheila's push from her computer now works).

## For Trey

- [ ] Close the now-empty GoDaddy account, from 2026-11-15 afternoon on (the
      domain left GoDaddy on 2026-11-14 and GoDaddy asks for 24 hours). The
      close page needs his own click. Optional first: export the receipts.
- [ ] Flywheel: reply to the Billing Team's email about cancelling the Yes Yoga
      One plan, then check the subscription moved to Cancelled. A 30-day
      notice applies, so one more monthly charge is expected.
- [ ] Flywheel/WP Engine: watch the second login's inbox for their reply
      confirming the unused login is deleted.
- [ ] Decide what to do with the `/v2/` beginner-friendly concept (dev
      server only for now): keep, change, or drop.

- [ ] Add Stripe payments (decided: Stripe Payment Links, not custom code; the
      site already shows a Book / Pay button when a service has a link in
      `content/services.json`). Blocked on Sheila's LLC, EIN, bank account
      and her own Stripe account. Neither existing Stripe account fits: one
      belongs to another business, the other is a payout-only account from a
      marketplace. Meanwhile build the service cards and the Book / Pay
      buttons on the redesign (hidden services need prices first), and a
      products section if wanted. Bookkeeping plan: Stripe for checkout, Wave
      for books, with a monthly payout import.

## For Sheila

- [ ] Texas LLC (YesYogaOne, LLC): check My Submissions on the Secretary of
      State portal for approval. When approved: get the EIN from the IRS, open
      a business bank account, file the assumed name "Yes Yoga One" if wanted.
- [ ] Send Trey the list of services and products with prices and durations
      (all four services are still hidden for lack of these).
- [ ] Rewrite the bio for Corpus Christi (`bio` in `content/about.json`; it
      still describes Sioux Falls).
- [ ] After the LLC, EIN and bank account exist: create her own Stripe account
      (never the Furnishedfinder or Swimply ones). Only she enters the bank,
      identity and tax details.

## Waiting on others

- Texas Secretary of State: approval of the LLC filing, submitted 2026-11-14.
- Flywheel Billing Team: cancellation of the hosting plan.

## Ready to build as soon as the above lands

- Service cards with a Book / Pay button for each service, and a products
  section if wanted (needs prices and Stripe Payment Links).
- Formspree form ID for the contact form (Trey or Sheila signs up; the ID goes
  in `content/site.json`).
