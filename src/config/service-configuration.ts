export default () => ({
  service: {
    node_env: process.env.NODE_ENV,
    name: process.env.SERVICE_NAME,
    port: process.env.CHALLENGE_SERVICE_PORT,
  },
  weather_api: {
    base_url: process.env.WEATHER_API_BASE_URL,
    key: process.env.WEATHER_API_KEY,
  },
  gmail: {
    username: process.env.GMAIL_USERNAME,
    password: process.env.GMAIL_PASSWORD,
  },
});
