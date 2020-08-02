module.exports = {
    server : ()=>{
        let express = require('express');
        var cors = require('cors');
        let app = express();
        app.use(cors());
        app.use(express.json())
        app.use(express.urlencoded({ extended: true }))
        
        app.listen(5000, function () {
            console.log('Express server listening on port 5000');
        });

        return app;
    }
};