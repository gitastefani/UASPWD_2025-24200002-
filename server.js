const http = require('http');
const fs = require('fs');
const path = require ('path');
const {parse} = require ('querystring');
const mysql = require ('mysql2')

const publicDir = path.join(__dirname, 'public');
const port = 3000;

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'penyewaanalatbersih'
});

db.connect((err)=> {
    if(err){
        console.log("Koneksi database gagal");
        process.exit();
    }

    console.log("Database terhubung!")
});

const server = http.createServer((req, res) => {
    if(req.method === 'GET'){
        const filePath=req.url === '/'?'index.html' : req.url;
        const fullPath = path.join(publicDir, filePath);

        fs.readFile(fullPath, (err, content)=> {
            const ext = path.extname(fullPath);
            const contentType = ext === 'css'?'text/css':
                                ext === '.js'?'text/javascript':
                                ext === '.html'?'text.html':'text/plain';

            res.writeHead(200, {'content-type':contentType});
            res.end(content);
        });
    }else if (req.method ==='POST'&&req.url === '/formpenyewaan'){
        let body ='';
        req.on('data',chunk => body +=chunk);
        req.on('end',()=>{
            const parsed = parse(body);
            const{name,email,item,message} = parsed;

            const sql = 'insert into formpenyewaan (name,email,item, message) value(?,?,?,?)';
            db.query(sql[name,email,item,message], (err) =>{
                if(err){
                    console.log("gagal simpan ke db");
                    res.writeHead(500,{'content-type':'text/plain'});
                    return res.end("gagal simpan ke db");
                }

                res.writeHead(200,{'content-type':'text/palin'});
                return res.end('berhasil simpan ke db');
            });
        });
    }
});

server.listen(port,()=> console.log(`Server running at http://localhost:${port}`));