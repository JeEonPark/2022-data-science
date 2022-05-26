const axios = require("axios");
const cheerio = require("cheerio");
var fs = require('fs');

var data = fs.readFileSync('html/1.html', 'utf-8');

var $ = cheerio.load(data);

var totalData = new Array();

var rank = [];
var overallScore = [];
var graphicsScore = [];
var physicsScore = [];
var cpu = [];
var gpu = [];
var maxClock = [];
var coreClock = [];
var memClock = [];
var user = [];
var date  = [];


$('.rank').each(function(){
    rank.push($(this).text());
})

$('.overallScore').each(function(){
    overallScore.push($(this).text());
})

$('.graphicsScore').each(function(){
    graphicsScore.push($(this).text());
})

$('.physicsScore').each(function(){
    physicsScore.push($(this).text());
})

$('.cpu').each(function(){
    cpu.push($(this).text());
})

$('.gpu').each(function(){
    gpu.push($(this).text());
})

$('.maxClock').each(function(){
    maxClock.push($(this).text());
})

$('.coreClock').each(function(){
    coreClock.push($(this).text());
})

$('.memClock').each(function(){
    memClock.push($(this).text());
})

$('.user').each(function(){
    user.push($(this).text());
})

$('.date').each(function(){
    date.push($(this).text());
})

for (var i = 0; i < 100; i++) {
    var temp = new Object();
    
    temp.rank = (rank[i]);
    temp.overallScore = (overallScore[i]);
    temp.graphicsScore = (graphicsScore[i]);
    temp.physicsScore = (physicsScore[i]);
    temp.cpu = (cpu[i]);
    temp.gpu = (gpu[i]);
    temp.maxClock = (maxClock[i]);
    temp.coreClock = (coreClock[i]);
    temp.memClock = (memClock[i]);
    temp.user = (user[i].replace("," , ""));
    temp.date = (date[i]);
    
    totalData.push(temp);
}

const csv_string = jsonToCSV(totalData);

console.log(csv_string);

fs.writeFileSync('data.csv', csv_string);


function jsonToCSV(json_data) {

    // 1-1. json 데이터 취득
    const json_array = json_data;
    // 1-2. json데이터를 문자열(string)로 넣은 경우, JSON 배열 객체로 만들기 위해 아래 코드 사용
    // const json_array = JSON.parse(json_data);
    

    // 2. CSV 문자열 변수 선언: json을 csv로 변환한 문자열이 담길 변수
    let csv_string = '';


    // 3. 제목 추출: json_array의 첫번째 요소(객체)에서 제목(머릿글)으로 사용할 키값을 추출
    const titles = Object.keys(json_array[0]);

    
    // 4. CSV문자열에 제목 삽입: 각 제목은 컴마로 구분, 마지막 제목은 줄바꿈 추가
    titles.forEach((title, index)=>{
        csv_string += (index !== titles.length-1 ? `${title},` : `${title}\r\n`);
    });


    // 5. 내용 추출: json_array의 모든 요소를 순회하며 '내용' 추출
    json_array.forEach((content, index)=>{
        
        let row = ''; // 각 인덱스에 해당하는 '내용'을 담을 행

        for(let title in content){ // for in 문은 객체의 키값만 추출하여 순회함.
            // 행에 '내용' 할당: 각 내용 앞에 컴마를 삽입하여 구분, 첫번째 내용은 앞에 컴마X
            row += (row === '' ? `${content[title]}` : `,${content[title]}`);
        }

        // CSV 문자열에 '내용' 행 삽입: 뒤에 줄바꿈(\r\n) 추가, 마지막 행은 줄바꿈X
        csv_string += (index !== json_array.length-1 ? `${row}\r\n`: `${row}`);
    })

    // 6. CSV 문자열 반환: 최종 결과물(string)
    return '\ufeff' + csv_string;
}