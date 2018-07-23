var baseConfig = require('./karma.conf.js');

module.exports = function(config){
  // Load base config
  baseConfig(config);

  // Override base config
  config.set({
    singleRun: true,
    autoWatch: false,
    reporters: ['junit'],
    junitReporter: {
      outputDir: '../target/surefire-reports'
      //,
      //outputFile: 'test-results.xml'
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-phantomjs-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-junit-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    browsers: ['PhantomJS'], /* add PhatomJS here */
  });
};
