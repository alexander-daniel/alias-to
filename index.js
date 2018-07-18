const fs = require('fs');
const { send } = require('micro');
const redirect = require('micro-redirect');
const { parse, format } = require('url');
const { router, get } = require('microrouter');
const ShortURL = require('./key-value');

const shortURL = new ShortURL('alias-to');

module.exports = router(
  get('/create', async (req, res) => {
    console.error(req.query.url);
    const url = parse(req.query.url);
    console.error(url);
    url.slashes = true;

    if (!Boolean(url.protocol)) {
      console.error('no protocol, adding https');
      url.protocol = 'https';
    }

    // Format the url the user has passed in
    const formattedURL = format(url);

    // Create a token with keyvalue-xyz service, get back a unique `token`.
    // We will store the full url using this token.
    const token = await shortURL.createToken();
    await shortURL.setValue(token, formattedURL);

    console.error('created', token, formattedURL);

    send(res, 200, { url: `https://${process.env.DOMAIN_NAME}/${token}` });
  }),

  get('/:token', async (req, res) => {
    // User has requested a full URL using a short URL.
    // Ask keyvalue-xyz service for the url we have stored with that token.
    const token = req.params.token;
    const url = await shortURL.getValue(token);

    console.error('redirect', url);

    // Redirect them!
    redirect(res, 302, url);
  }),

  get('/', async (req, res) => {
    const html = fs.readFileSync(`${__dirname}/index.html`, 'utf8');
    send(res, 200, html);
  })
)
