module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        copy: {
            main: {
                expand: true,
                cwd: 'src',
                src: '**',
                dest: 'C:\\Users\\zapperpro\\AppData\\Local\\Screeps\\scripts\\127_0_0_1___21025\\default'
            },
        },
        watch: {
            js: {
                files: ['src/**'],
                tasks: ['copy'],
                options: {
                    spawn: false,
                },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['watch', 'copy']);
};
