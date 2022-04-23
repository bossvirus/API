const express = require("express");
const app = express();
const importData = require("./data.json");
const fs = require("fs-extra");
const { resolve } = require("path");
const cheerio = require("cheerio")
const axios = require("axios");
const { loadImage, createCanvas} = require('canvas');
let port = process.env.PORT || 3000;
app.use(express.static("public"));
app.set('json spaces', 4)
app.get("/", (req, res) => {
res.send("xin chao");
});
app.get("/nguyenhuuloi", (req, res) => {
res.send(importData);
});
app.listen(port, () => {
    console.log(`testing http://localhost:${port}`);
});
function tiktok(link){
	return new Promise((resolve, reject) => {
		let config = {
			'url': link, 
			'token': "fd644ebbbb3407f851ed440d42676a3ca07f7a0c41f7661789075fac5909662e" 
		}
		let headerss = 	{ //đây sao
			"sec-ch-ua": '" Not A;Brand";v="99", "Chromium";v="96", "Google Chrome";v="96"',
			"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36",
			"Cookie": '_ga=GA1.2.1974581858.1639440728; _gid=GA1.2.121087607.1639440728; PHPSESSID=16qh50jcdic0t48c66v451agcf; popCookie=1'
		}
		
	axios('https://ttdownloader.com/req/',{
			method: 'POST',
			data: new URLSearchParams(Object.entries(config)), 
			headers: headerss
		})
	.then(({ data }) => {
		const $ = cheerio.load(data)
		let NoWatermark = $("#results-list > div:nth-child(2) > div.download > a.download-link").attr("href")
		let Audio = $("#results-list > div:nth-child(4) > div.download > a.download-link").attr("href")
		resolve({
			NoWatermark: NoWatermark,
			Audio: Audio
		})
	}).catch(reject)
	})
}
app.get("/tiktok", async (req, res) => {     
    let url = req.query.url;
        if(!url && !req.query.type) return res.json({ Data : "/tiktok?url=https://www.tiktok.com/@_951213_/video/7030022935297527041&type=video || audio"});
        
try{
        switch (req.query.type) {
            case "video": {
                const idimg = Math.floor(Math.random() * 2);
                const path = resolve(__dirname, `${idimg}.mp4`);
            const getUrl = await tiktok(url)
            const getVideo = (await axios.get(getUrl.NoWatermark, {responseType: "arraybuffer"})).data
            fs.writeFileSync(path, Buffer.from(getVideo, 'utf-8'));
            res.sendFile(path, () => fs.unlinkSync(path))	
            }
            case "audio": {
            const idimg = Math.floor(Math.random() * 3);
            const path1 = resolve(__dirname, `${idimg}.m4a`);
            const getUrl = await tiktok(url)
            const getAudio = (await axios.get(getUrl.Audio, {responseType: "arraybuffer"})).data
            fs.writeFileSync(path1, Buffer.from(getAudio, 'utf-8'));
            res.sendFile(path1, () => fs.unlinkSync(path1))
            }
        }
		}catch (e) { res.json({Data:e});
	}
});
app.get("/cccd", async (req, res) => {
	var img = "https://i.imgur.com/0GGvN83.png";   
    let hoten = req.query.hoten;
	let ngaysinh = req.query.ngaysinh;
	let gioitinh = req.query.gioitinh;
	let quequan = req.query.quequan;
	let ntt = req.query.ntt;
	let avt = req.query.avt;
	var pathcc = __dirname + `a.png`;

if(!hoten && !ngaysinh && !gioitinh && !quequan && !ntt && !avt) return res.json({ Data : "err"});
let link = (await loadImage(img));
 let canvas = createCanvas(link.width,link.height);
var ctx = canvas.getContext("2d");
ctx.drawImage(link,0,0,canvas.width,canvas.height);
ctx.font = "21pt Arial";
ctx.fillStyle = '#2a2927';
ctx.shadowBlur = 1;
ctx.shadowColor = "black";
ctx.rotate(-1.09 * Math.PI / 180);
ctx.drawImage(await loadImage(avt), 127, 291, 223, 270);
ctx.fillText(hoten,485,330.42);
ctx.fillText(ngaysinh,601,400);
ctx.fillText(gioitinh,476,450);
ctx.fillText(quequan,483,490);
ctx.fillText(ntt,529,554);
const fimg = canvas.toBuffer();
fs.writeFileSync(pathcc, fimg);
res.sendFile(pathcc, () => fs.unlinkSync(pathcc))
});
