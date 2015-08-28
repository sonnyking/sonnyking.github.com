module.exports = {
  verbose: true,
  suites: [
      'dist/bower_components/instagram-panel/test/',
      'app-test.html'
  ],
  plugins: {
    local: {
      browsers: ['chrome', 'firefox']
    }
  },
};
