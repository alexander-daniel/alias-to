const fs = require('fs');
const { send } = require('micro');
const redirect = require('micro-redirect');
const { parse, format } = require('url');
const { router, get } = require('microrouter');
const kvs = require('keyvalue-xyz');
const { promisify } = require('util');
const createToken = promisify(kvs.createToken);
const getValueForKey = promisify(kvs.getValueForKey);
const setValueForKey = promisify(kvs.setValueForKey);
const KEY = 'alias-to';

module.exports = router(
  get('/shorten', async (req, res) => {
    const url = parse(req.query.url);
    url.slashes = true;
    if (!Boolean(url.protocol)) url.protocol = 'https';

    // Create a token with keyvalue-xyz service
    const token = await createToken(KEY);

    // We will store the full url using the token.
    await setValueForKey(token, KEY, format(url));

    send(res, 200, { url: `https://${process.env.DOMAIN_NAME}/${token}` });
  }),

  get('/:token', async (req, res) =>
    redirect(res, 302, (await getValueForKey(req.params.token, KEY)))
  ),

  get('/', async (_, res) =>
    send(res, 200, fs.readFileSync(`${__dirname}/index.html`, 'utf8'))
  )
)
