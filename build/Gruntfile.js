module.exports = function( grunt )
{
var root = '../';
var dest = '../release/<%= pkg.name %> <%= pkg.version %>/';

grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        eslint: {
            options: {
                configFile: root + '.eslintrc.json'
            },
            target: [ root + 'js' ]
        },

            // delete the destination folder
        clean: {
            options: {
                force: true
            },
            release: [
                dest
            ]
        },

            // copy the necessary files
        copy: {
            release: {
                expand: true,
                cwd: root,
                src: [
                    'images/*.png',
                    'libraries/**',
                    'maps/**',
                    'sound/**',
                    'index.html',
                    'background.js',
                    'manifest.json'
                ],
                dest: dest
            }
        },

            // minimize js/css
        useminPrepare: {
            html: root + 'index.html',
            options: {
                dest: dest
            }
        },

            // update the html to point at the minimized js/css
        usemin: {
            html: dest + 'index.html'
        }
    });


    // load the plugins
grunt.loadNpmTasks( 'grunt-eslint' );
grunt.loadNpmTasks( 'grunt-contrib-clean' );
grunt.loadNpmTasks( 'grunt-contrib-copy' );
grunt.loadNpmTasks( 'grunt-contrib-concat' );
grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
grunt.loadNpmTasks( 'grunt-contrib-uglify' );
grunt.loadNpmTasks( 'grunt-usemin' );

    // tasks
grunt.registerTask( 'default', [ 'eslint', 'clean', 'copy', 'useminPrepare', 'concat:generated', 'cssmin:generated', 'uglify:generated', 'usemin' ] );
};
