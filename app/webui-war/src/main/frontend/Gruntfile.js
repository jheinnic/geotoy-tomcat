module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        jshint: {
            options: {
            },
            files: []
        },
        simplemocha: {
            options: {
                reporter: 'spec',
                timeout: '5000'
            },
            full: { src: [] },
            short: {
                options: {
                    reporter: 'dot'
                },
                src: []
            }
        },
        exec: {
            assets: {
                command: 'echo assets'
            },
            'assets-force': {
                command: 'echo assets-force'
            },
            cover: {
                command: 'echo cover'
            }
        },
        watch: {
            files: [],
            tasks: []
        }
    });


    grunt.registerTask('assets', ['exec:assets-force']);
    grunt.registerTask('test', ['jshint', 'exec:assets', 'simplemocha:full']);
    grunt.registerTask('cover', 'exec:cover');
    grunt.registerTask('default', 'test');
};
