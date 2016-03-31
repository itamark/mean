var Post = require('./models/post');
module.exports = function (app) {
// get all posts
    app.get('/api/posts', function (req, res) {

        // use mongoose to get all posts in the database

        Post.find(function (err, posts) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(posts); // return all posts in JSON format
        }).sort('-created');
    });

    app.get('/api/posts/:id', function (req, res) {

        // use mongoose to get all posts in the database

        Post.findById(req.params.id, function (err, posts) {

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err);

            res.json(posts); // return all posts in JSON format
        }).sort('-created');
    });


    // create post and send back all posts after creation
    app.post('/api/posts', function (req, res) {

        // create a post, information comes from AJAX request from Angular
        Post.create({
            content: req.body.content,
            date: req.body.date,
            done: false
        }, function (err, post) {
            if (err){
                res.send(err);
            } else {
                res.send(post);
            }

            //// get and return all the posts after you create another
            //Post.find(function (err, posts) {
            //    if (err)
            //        res.send(err);
            //    res.json(posts);
            //});
        });

    });

    // delete a post
    app.delete('/api/posts/:_id', function (req, res) {
        Post.remove(req.params, function (err, post) {
            if (err)
                res.send(err);

            // get and return all the posts after you create another
            Post.find(function (err, posts) {
                if (err)
                    res.send(err);
                res.json(posts);
            });
        });
    });








// application -------------------------------------------------------------
//    app.get('*', function (req, res) {
//        res.sendfile('./public1/index.html'); // load the single view file (angular will handle the page changes on the front-end)
//    });
};