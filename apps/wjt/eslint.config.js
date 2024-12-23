const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    // Add or extend configuration here
    ignores: [
      '**/*.js', // Add your local ignores
      ...(baseConfig.find(cfg => cfg.ignores)?.ignores || []), // Merge with base ignores if they exist
    ],
  },
];
