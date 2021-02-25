module.exports = {
    css: {
        loaderOptions: {
            sass: {
                prependData: `
                @import "../frontend/src/scss/_variables.scss";
                @import "../frontend/src/scss/_styles.scss";`
            }
        }
    }
};