'use strict';

module.exports = function(grunt) {

  grunt.initConfig({

    jst: {
      compile: {
        files: {
          "js/templates.js": [
            "templates/*.html"
          ]
        }
      }
    },

    cssmin: {
      "photoPickr.min.css": [
        "css/webcam.css"
      ]
    },

    uglify: {
      all: {
        files: {
          "photoPickr.min.js": [
            "js/templates.js",
            "js/photoPickr.js"
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jst');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  grunt.registerTask('default', ['jst', 'uglify', 'cssmin']);
};