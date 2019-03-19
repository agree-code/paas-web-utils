var gulp = require("gulp");
var babel = require("gulp-babel"); // 用于ES6转化ES5

gulp.task("toes5", function () {
    return gulp.src("src/**/*.js") // ES6 源码存放的路径
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest("./")); //转换成 ES5 存放的路径
});


gulp.task("build", ['toes5'])