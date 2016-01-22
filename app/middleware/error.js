/**
 * Module dependencies.
 */

module.exports = error;
function error() {

    return function *error(next) {
        try {
            yield next;
        } catch (err) {
            this.status = err.status || 500;
            this.app.emit('error', err, this);
            if (this.status === 401) {
                return this.redirect('/');
            }
            if (this.status === 500) {
                console.error(err);
            }
            switch (this.accepts('html', 'text', 'json')) {
                case 'text':
                    this.body = err.message;
                    break;
                case 'json':
                    this.body = {error: err.message};
                    break;
                case 'html':
                    this.render(this.status);
                    break;
            }
        }
    }
}
