const fs = require('fs');
const { resolve } = require('path');
const superagent = require('superagent')

const readFilePro = file => {
    return new Promise((resolve, reject ) => {
        fs.readFile( file, 'utf-8', (err, data) => {
            if (err) return reject({
                message: "File not found"
            })
            resolve(data)
        })
    })
}

const writeFilePro = (file, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(file, data , err => {
            if (err) return reject('error')
            resolve('success')
        })
    })
}

function abc() {
    return "hi";
}

//async function automatically returns a promise
const dog = async() => {
    try{
        const data = await readFilePro('./dog.txt');

        //store all the promises
        const res1 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res2 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        const res3 =  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
        
        const all = await Promise.all([res1, res2, res3])

        const img = all.map(e => e.body.message);
        console.log(img);
        await writeFilePro('./dog-img.txt', img.join('\n'));
    } catch (err) {
        // console.log(err.message)
        throw(err); //to reject promise
    }
    return "3. async function"
}

(
    async() => {
        try{
            console.log(1)
            const x = await dog();
            console.log(x);
            console.log(3)

        }catch (err) {
            console.log( err.message )
        }
    } 
)();

// console.log("1")

// dog().then( x => {
//     console.log('2')
//     console.log(x)
// }).catch( err => {
//     console.log( err.message)
// });


// fs.readFile('./dog.txt', 'utf-8', (err, data) => {
//     console.log(data)
//     console.log( abc() );

//     //a pending promise is made when get is called. Then will handle the data returned by the api
//     //then handle fufilled promises
//     superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).then(res => {
//         console.log(res.body)

//         fs.writeFile('dog-img.txt', res.body.message, err => {
//             console.log('saved to file')
//         })
//     } ).catch( err => {
//         console.log(err.message)
//     })

   
// })

