module.exports = {
  plugins: [
    [
      '@babel/proposal-class-properties',
      {
        loose: true
      }
    ]
  ],
  presets: [
    '@babel/typescript',
    [
      '@babel/env',
      {
        loose: true
      }
    ]
  ]
};
