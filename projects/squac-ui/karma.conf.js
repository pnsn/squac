// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: "src",
    frameworks: ["jasmine", "@angular-devkit/build-angular"],
    plugins: [
      require("karma-jasmine"),
      require("karma-chrome-launcher"),
      require("karma-jasmine-html-reporter"),
      require("karma-coverage-istanbul-reporter"),
      require("@angular-devkit/build-angular/plugins/karma"),
      require("karma-spec-reporter"),
    ],
    client: {
      jasmine: {},
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require("path").join(__dirname, "../../coverage/squac-ui"),
      reports: ["html", "lcovonly", "text-summary"],
      fixWebpackSourcePaths: true,
    },
    reporters: ["kjhtml", "coverage-istanbul"], //"spec"
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ["Chrome"],
    singleRun: false,
    restartOnFileChange: true,
    failOnFailingTestSuite: false,
    specReporter: {
      maxLogLines: 3,
      suppressPassed: true,
    },
    // browserDisconnectTimeout : 10000, // default 2000
    // browserDisconnectTolerance : 1, // default 0
    // browserNoActivityTimeout : 4*60*1000, //default 10000
    // captureTimeout : 4*60*1000 //default 60000
  });
};
