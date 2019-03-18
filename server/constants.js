// Define a bunch of variables split by environment

const envs = {
  production: {
    APP_URL: 'https://glitch.com',
    API_URL: 'https://api.glitch.com/',
    EDITOR_URL: 'https://glitch.com/edit/',
    CDN_URL: 'https://cdn.glitch.com',
    GITHUB_CLIENT_ID: 'b4cb743ed07e20abf0b2',
    FACEBOOK_CLIENT_ID: '660180164153542',
    PROJECTS_DOMAIN: 'glitch.me',
  },
  staging: {
    APP_URL: 'https://staging.glitch.com',
    API_URL: 'https://api.staging.glitch.com/',
    EDITOR_URL: 'https://staging.glitch.com/edit/',
    CDN_URL: 'https://cdn.staging.glitch.com',
    GITHUB_CLIENT_ID: '65efbd87382354ca25e7',
    FACEBOOK_CLIENT_ID: '1858825521057112',
    PROJECTS_DOMAIN: 'staging.glitch.me',
  },
  development: {
    APP_URL: 'https://glitch.development',
    API_URL: 'https://api.glitch.development/',
    EDITOR_URL: 'https://glitch.development/edit/',
    CDN_URL: 'https://s3.amazonaws.com/hyperdev-development',
    GITHUB_CLIENT_ID: '5d4f1392f69bcdf73d9f',
    FACEBOOK_CLIENT_ID: '1121393391305429',
    PROJECTS_DOMAIN: 'glitch.development',
  },
};

const sources = {
  scripts: [
    "'sha256-c64cb7effc0937def691aaa6e7cbaaf181a41feef8fa040a680f78b07d18ff4e='",
    'blob:',
    'cdn.segment.com',
    'ajax.googleapis.com',
    '*.glitch.com',
    'apis.google.com',
    'cdnjs.cloudflare.com',
    'api.segment.io',
    '*.woopra.com',
    'fast.wistia.com',
  ],
  styles: ['*.webtype.com', 'cdn.glitch.com', 'cdn.gomix.com'],
  images: ['*.glitch.com', '*.gomix.com', 'cdn.hyperdev.com', 's3.amazonaws.com', '*.webtype.com', 'fast.wistia.com', 'culture-zine.glitch.me', '*.akamaihd.net'],
  fonts: ['data:', '*.webtype.com', 'fonts.gstatic.com'],
  connect: ['api.glitch.com', 'api.segment.io', '*.wistia.com', '*.litix.io', '*.akamaihd.net'],
  frames: ['glitch.com', '*.glitch.me', 'fast.wistia.com'],
  media: ['fast.wistia.net'],
};

// in the backend, just switch between staging and production
const currentEnv = process.env.RUNNING_ON === 'staging' ? 'staging' : 'production';
module.exports = {
  ...envs,
  sources,
  current: envs[currentEnv],
  currentEnv,
};
