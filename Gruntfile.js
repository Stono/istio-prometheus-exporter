require('grunt');
require('mocha');

const config = {
  all: [
    '**/*.ts',
    '!node_modules'
  ],
  test: [
    'test/**/*.ts'
  ]
};

const mochaConfig = {
  stdout: {
    options: {
      reporter: 'spec',
      require: [
        'ts-node/register',
        'tsconfig-paths/register',
        'should'
      ],
      timeout: 1000
    },
    src: config.test
  }
};

const tsConfig = {
  default: {
    options: {
      fast: 'always',
      verbose: true
    },
    tsconfig: './tsconfig.json'
  }
};

const eslintConfig = {
  options: {
    configFile: '.eslintrc.js'
  },
  target: ['lib/**/*.ts']
};

const execConfig = {
  clean: 'rm -rf ./built && rm -rf .tscache',
};

const watchConfig = {
  files: config.all,
  tasks: ['default']
};

const envConfig = {
  dev: {
    src: ".env"
  }
};

/* eslint max-statements: off */
/* eslint strict: off */
module.exports = function(grunt) {
  grunt.initConfig({
    env: envConfig,
    eslint: eslintConfig,
    exec: execConfig,
    mochaTest: mochaConfig,
    ts: tsConfig,
    watch: watchConfig
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-env');

  grunt.registerTask('build', [
    'clean',
    'ts',
  ]);
  grunt.registerTask('clean', [
    'exec:clean'
  ]);
  grunt.registerTask('test', [
    'env:dev',
    'mochaTest'
  ])
  grunt.registerTask('lint', [
    'eslint'
  ]);
  grunt.registerTask('ci', [
    'lint',
    'test',
    'build'
  ]);
  grunt.registerTask('default', [
    'lint',
    'test'
  ]);
}
