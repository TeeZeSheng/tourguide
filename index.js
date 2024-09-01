const fs = require( 'fs' );
const http = require( 'http');
const url = require('url');

const slugify = require('slugify');

//Synchronous way

// const textInput = fs.readFileSync("./texts/fresh.txt", "utf-8");

// console.log(textInput);

// const textOut = "I love avocados" + textInput + "\n Created on " + Date.now();

// fs.writeFileSync('./texts/output.txt', textOut)
// console.log( "file written" );

//asynchronous way
//when reading file, it will move to the next line. It will execute the callback function
//when the file is fully read. 

// fs.readFile("./texts/start.txt", 'utf-8', (err, data) => {
//     console.log(data);
// });
// console.log("will read file");

//Server
//req contains request url
console.log(slugify("ABCd efg", {lower: true}));
const server = http.createServer((req, res ) => {
    const pathName = req.url;
    console.log(url.parse(pathName, true));

    if ( pathName === '/' || pathName === '/overview' ) {
        res.end('Homepage')
    }else if ( pathName === '/product' ) {
        res.end('product page')
    }
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'own-header': 'hello-world',
        })
        res.end('<h1>Page not found</h1>')
    }
    // console.log(req);
    
})

//listens to incoming request. callback function above will execute when there is a request
server.listen(8000, 'localhost', () => {
    console.log("listening on port 8000");
})


