
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /* Get the user-defined OBSIDIAN_PATH from .env file 
           so that we can live reload the theme in the vault */ 
        env : {
            local : {
              src : ".env"
            }
        },

        /* Compile the compressed and uncompressed versions of
        the theme using Sass */ 
        // https://github.com/gruntjs/grunt-contrib-sass
        // 先安装 ruby ，再执行 gem install sass
        // sass: {
        //     unminified: {
        //         files: {
        //             './src/css/main.css' : './src/scss/index.scss'
        //         }
        //     },
        //     dist: {
        //         options: {
        //             style: 'compressed',
        //         },
        //         files: {
        //             './src/css/main.css' : './src/scss/index.scss'
        //         }
        //     }
        // },

        // npm install --save-dev grunt-shell
        shell: {
            listFolders: {
                options: {
                    stdout: true
                },
                command: 'sass src/scss/index.scss src/css/obsidian_orange.css'
            }
        },

        /* Minify theme used for distribution and live reload */
        cssmin: {
            options: {
                advanced: false,
                aggressiveMerging: false,
                mediaMerging: false,
                restructuring: false
            },
            target: {
                files: {
                    //  目标文件                  // 源文件
                    './src/css/main.min.css': 'src/css/obsidian_orange.css'
                }
            }
        },

        // /* Concatenate theme files adding in the commented license, plugin compatibility, 
        //    and Style Settings that would otherwise be removed in compression */
        concat_css: {
            dist: {
                files: {
                  'obsidian_orange.css': ['./src/css/main.min.css','src/css/license.css']
                }
            },
            // unminified: {
            //     files: {
            //       'orange.css': ['./src/css/main.min.css','src/css/license.css']
            //     }
            // }
        },

        // /* Copy the finished distribution file from the working directory to the vault 
        // directory and use correct theme name */ 
        copy: {
            local: { 
                expand: true,
                src: 'obsidian_orange.css',
                // dest: process.env.HOME + process.env.OBSIDIAN_PATH,
                dest:  process.env.OBSIDIAN_PATH,
                rename: function(dest, src) {
                   return dest + 'obsidian_orange.css';
                } 
            }
        },

        // /* Watch for changes, and compile new changes */ 
        watch: {
            css: {
                files: ['./src/**/*.scss','./src/**/*.css'],
                // tasks: ['env','sass:unminified','sass:dist','cssmin','concat_css','copy',]
                tasks: ['env','shell','cssmin','concat_css','copy',]
            }
        }
    });
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-shell');
    grunt.registerTask('loadconst', 'Load constants', function() {
        grunt.config('OBSIDIAN_PATH', process.env.OBSIDIAN_PATH);
    });
    grunt.registerTask('default',['env:local','loadconst','watch']);
    // grunt.registerTask('default',['shell','cssmin']);
}
