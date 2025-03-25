const StatsD = require('hot-shots');

const statsd = new StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'myapp.',
  errorHandler: (err) => console.error('StatsD Error:', err)
});

module.exports = statsd;
