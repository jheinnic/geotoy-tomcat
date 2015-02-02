module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	var webappDir = '../../../src/main/webapp/';
	var cssDir = webappDir + 'WEB-INF/css/';
	var jsDir = webappDir + 'WEB-INF/js/';
	var imgDir = webappDir + 'WEB-INF/images/';
	var htmlDir = webappDir + 'WEB-INF/html/';

	var dstDir = 'public/';
	var bowerDir = 'bower_components/';
	var dstCssDir = dstDir + 'css/';
	var dstJsDir = dstDir + 'js/';
	var dstImgDir = dstDir + 'images/';

	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		clean : [ dstDir ],
		bower : {
			install : {
				options : {
					targetDir : bowerDir,
					install : true,
					cleanTargetDir : false,
					cleanBowerDir : false,
					layout: 'byType',
					bowerOptions : {}
				}
			}
		},
		copy : {
			images_css : {
				expand : true,
				cwd : cssDir,
				src : [ 'images/*' ],
				dest : dstCssDir
			},
			images : {
				expand : true,
				cwd : imgDir,
				src : [ '**/*' ],
				dest : dstImgDir
			}
		},
		jshint : {
			options : {},
			files : [jsDir + '**/*.js']
		},
		uglify : {
			dist : {
				options : {
					compress : true,
					report : 'min'
				},
				src : [ jsDir + '**/*.js' ],
				dest : dstJsDir + 'all.js'
			}
		},
		less : {
			dist : {
				options : {
					compress : true,
					yuicompress : true,
					report : 'min'
				},
				src : [ cssDir + '**/*.less', cssDir + '**/*.css' ],
				dest : dstCssDir + 'all.css'
			}
		},
		jade : {
			options : {
				reporter : 'spec',
				timeout : '5000'
			},
			full : {
				src : [htmlDir + '**/*.jade', htmlDir + '**/*.html']
			},
			short : {
				options : {
					reporter : 'dot'
				},
				src : [htmlDir + '**/*.jade', htmlDir + '**/*.html']
			}
		},
		exec : {
			assets : {
				command : 'echo assets'
			},
			'assets-force' : {
				command : 'echo assets-force'
			},
			cover : {
				command : 'echo cover'
			}
		},
		watch : {
			files : [],
			tasks : []
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	
	grunt.registerTask('assets', [ 'exec:assets-force' ]);
	grunt.registerTask('test', [ 'jshint', 'exec:assets', 'jade:full' ]);
	grunt.registerTask('cover', 'exec:cover');
	grunt.registerTask('rebuild', ['jshint', 'jade:full']);
	grunt.registerTask('default', [ 'jshint', 'bower', 'uglify', 'less', 'copy', 'jade:full' ]);
};
