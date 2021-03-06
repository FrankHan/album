#!/usr/bin/env node

(function() {
    'use strict';
    
    var fs          = require('fs'),
        http        = require('http'),
        
        express     = require('express'),
        mollify     = require('mollify'),
        rendy       = require('rendy'),
        
        DIR         = __dirname + '/../',
        
        album       = require(DIR + 'album'),
        parse       = require(DIR + 'parse'),
        
        app         = express(),
        server      = http.createServer(app),
        
        port        =   process.env.PORT            ||  /* c9           */
                        1337,
        
        ip          =   process.env.IP              ||  /* c9           */
                        '0.0.0.0';
        
        app.get('/', function(req, res) {
            var albums    = parse.generateImgHTML(album);
            
            res.set('Content-Type', 'text/html');
            
            fs.readFile(DIR + 'index.html', 'utf8', function(error, data) {
                
                if (error)
                    res.status(404).send(error.message);
                else
                    res.send(rendy(data, {
                        albums: albums
                    }));
            });
        });
        
        app.use(mollify({
                dir: DIR
            }))
           .use(express.static(DIR));
        
        server.listen(port, ip);
        console.log('url: http://%s:%d', ip, port);
})();
