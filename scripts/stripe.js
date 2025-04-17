// eslint-disable-next-line @typescript-eslint/no-require-imports
const Stripe = require('stripe');
const stripe = new Stripe('');

(async () => {
  const accounts = await stripe.accounts.list({
    limit: 100,
  });
	for (const account of accounts.data) {
		if (account.id === 'acct_1REluT2Uy4Maz77u') {
			continue;
		}
		const deleted = await stripe.accounts.del(account.id);
		console.log(deleted);
	}
})();