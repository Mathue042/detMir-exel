const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const chalk = require('chalk');
const fs = require("fs");
// require('events').EventEmitter.defaultMaxListeners = Infinity;

const xlsx = require('xlsx')
var wb = xlsx.readFile(process.argv[3])
const newWB = wb
var ws = wb.Sheets['Шаблон для поставщика']

var initWB = xlsx.readFile('initValues.xlsx')
var initWS = initWB.Sheets['Лист1']

var arrayOfChar = ['A','B','C','D','E','F','G','H','I','G',
'K','L','M', 'N', 'O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB',
'AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS',
'AT','AU','AV','AW','AX','AY','AZ']



const LAUNCH_PUPPETEER_OPTS = {
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920x1080'
    ]
  };

  const PAGE_PUPPETEER_OPTS = {
    networkIdle2Timeout: 5000,
    waitUntil: 'networkidle2',
    timeout: 3000000
  };

var site = process.argv[2]
var page = 'page/1'
var toys = []
var finalPrice = 0
var finalOldPrice = 0

var i = 0
var finalContent = ['костыль']
var links = []
var photos = []

var priceClass = 0
var descriptionClass = 0
var toyStatsClass = 0
var nameClass = 0
var artikulClass = 0
var bigLinkClass = 0
var photoLinkClass = 0

async function main(){
    try {
      while((finalContent[finalContent.length -1].includes('https://go.detmir.st/img/044159eb0cc82109e344482810e2e127.svg') != true) || i < 2){
          console.log(page);
          const url = site + page
          const pageContent = await getPageContent(url)
          finalContent.push(pageContent)
          var a = page.split('/')  
          a[1] = (parseInt(a[1]) + 1).toString()
          page = a[0] +'/'+ a[1]
          i++
      }
      finalContent.pop()
      finalContent.pop()
      finalContent.forEach(async (value)=>{
          
        await getHrefCard(value)
      })
      for (var i = 0; i < links.length; i++){
          
          console.log('Продукт ' + i);
        var html = await getPageContent(links[i])
        toysParams(html)
      }
     table()
    } catch (err) {
        console.log(chalk.red('ERROR блять'));
        console.log(err);
    }
}
(async () =>{
await getClassValues(initWS)
main()
})()


async function toysParams(html){
    const $ = cheerio.load(html)
    var n = $(`.${nameClass}`).first().text()
    var na = n.replace(/[0-9]/g, '');
    exceptionDictionary.forEach(el=>{
        if (na.includes(el)){
            na = na.split(el)
            na = na[0]+na[1]
        }
    })
    na = na.replace(/[A-Z]/g, '')
    var name = na
    var pht = []
    $(`img[class='${photoLinkClass}']`).each( function huy(){
        var photoURL = $(this).attr("src")
       pht.push(photoURL)
    })
    photos.push(pht)
    var newArt= artikul.substring(artikul.indexOf("К"), artikul.indexOf("л")+2)
    var price = $(`.${priceClass}`)
    .first()
    .text()
    .replace(/[^,\d]/g, "")
    .replace(",", ".");
    
    
    var NDS = 'Не облагается'
    var comerType = 'мягкая игрушка'
    var toyStats = $(`.${toyStatsClass}`).text()
    var newStats = toyStats.substring(toyStats.indexOf(" x ")-5, toyStats.indexOf(" x ")+14)
    var b = newStats.split(' ')
    b.splice(1,1)
    b.splice(2,1)
    j = 0
    while(j<b.length){
        b[j]= b[j].replace(/\D/g,'')
        j++
    }
    var height = b[0] + '0'
    var toyH = height
    var length = b[1] + '0'
    var width = b[2] + '0'
    var x = toyStats.split('Вес упаковки')
    var preArt = toyStats.split('Артикул')[1]
    console.log(toyStats);
    preArt = preArt.split('Код товара')[0]
    var y = (Math.trunc(parseFloat(x[1].split('кг')[0].replace(/[^,\d]/g,'').replace(/,/g,'.')) * 1000)).toString()
    var weight = y
    if (length == 'undefined0' || width == 'undefined0' || height == 'undefined0' ){
        if (length == 'undefined0'){
            length = 0
        }
        if (width == 'undefined0'){
            width = 0
        }
        if (height == 'undefined0'){
            height = 0
        }
    }
    var xyz = [parseInt(length), parseInt(width), parseInt(height)]
    xyz.sort((a, b)=> b - a)
    var color = 'разноцветный'
    var age = 'для всех возростов'
    var description = $(`.${descriptionClass}`).text()
    ages.forEach(el=>{
        if (description.includes(el)){
            age = 'от '+el+' лет'
        }
    })
    price = round(price)
    exceptionDictionary.forEach(el=>{
        if (description.includes(el)){
            var ind = description.indexOf(el)
            description = description.split(el)
            description = description[0]+description[1]
            // while(description[ind-k]!=' '){
            //     description = description.split(description[ind-k])[0]+description.split(description[ind-k])[1]
            //     k++
            // }
        }
    })
    // contryDictionary.forEach(el=>{
    //     if (description.includes(el)){
    //         var ind = description.indexOf(el)
    //         description = description.split(el)
    //         description = description[0]+description[1]
    //     }
    // })
    // contryDictionary.forEach(el=>{
    //     if (description.includes(el)){
    //         var ind = description.indexOf(el)
    //         description = description.split(el)
    //         description = description[0]+description[1]
    //         // while(description[ind-k]!=' '){
    //         //     description = description.split(description[ind-k])[0]+description.split(description[ind-k])[1]
    //         //     k++
    //         // }
    //     }
    // })
    colors.forEach(el=>{
        if(description.includes(el)){
            color = el
        }else{
            if(name.includes(el)){
                color = el
            }
        }
    })
    var oldPrice = parseInt( finalPrice)
    
    if (oldPrice *0.05 < 750){
        oldPrice = oldPrice + 750
    }else{
        oldPrice = oldPrice * 1.05
    }
    oldPrice = Math.trunc(oldPrice)
    switch(color.substring(0,3)){
        case 'раз':
            color = 'разноцветный'
            break;
        case 'сер':
            case 'Сер':
                color = 'серый'
                break
        case 'гол':
            case 'Гол':
                color = 'голубой'
                break
        case 'роз':
            case 'Роз':
                color = 'розовый'
                break
        case 'кра':
            case 'Кра':
                color = 'красный'
                break
        case 'чер':
            case  'Чер':
                color = 'черный'
                break
        case 'бел':
            case 'Бел':
                color = 'белый'
                break
        case 'син':
            case 'Син':
                color = 'синий'
                break
        case 'жел':
            case 'Жел':
                color = 'желтый'
                break
        case 'зел':
            case 'Зел':
                color = 'зеленый'
                break
        case 'ора':
            case 'Ора':
                color = 'оранжевый'
                break
        case 'фио':
            case 'Фио':
                color = 'фиолетовый'
                break
    }
    toys.push({
        name,
        newArt: '111' + preArt,
        price: finalPrice, 
        NDS,
        comerType,
        description: description.split(toyStats)[0],
        mainPhoto: photos[photos.length -1][0],
        otherPhotos: photos[photos.length -1],
        height: xyz[2].toString(),
        length: xyz[0].toString(),
        width: xyz[1].toString(),
        weight,
        color,
        age,
        oldPrice,
        toyH: (parseInt(toyH)/10).toString()
    })
}


async function table(){
    var exel = {}
arrayOfChar.forEach((value) => {
    if(ws[value + '3'] !== undefined){
        
    switch (ws[value + '3'].v) {
        case 'Цена до скидки, руб.':
            exel.Old = value + '3'
            break
        case 'Ссылка на главное фото*':
            exel.MainPhoto = value + '3'
            break
        case 'Ссылки на дополнительные фото':
            exel.OtherPhotos = value + '3'
            break
        case '№':
            exel.Numb = value + '3'
            break
        case 'Возраст ребенка':
            exel.Age = value + '3'
            break
        case 'Артикул*':
            exel.Artik = value + '3'
            break
        case 'Название товара':
            exel.Name = value + '3'
            break
        case 'Цена, руб.*':
            exel.Price = value + '3'
            break
        case 'НДС, %*':
            exel.NDS = value + '3'
            break
        case 'Коммерческий тип*':
            exel.KomType = value + '3'
            break
        case 'Вес в упаковке, г*':
            exel.Weigth = value + '3'
            break
        case 'Ширина упаковки, мм*':
            exel.Width = value + '3'
            break
        case 'Высота упаковки, мм*':
            exel.Higth = value + '3'
            break
        case 'Длина упаковки, мм*':
           
            exel.Length = value + '3'
            break
        case 'Название модели*':
            exel.ModelName = value + '3'
            break
        case 'Тип*':
            exel.Type = value + '3'
            break
        case 'Бренд*':
            exel.Brand = value + '3'
            break
        case 'Аннотация':
            exel.Descrip = value + '3'
            break
        case 'Цвет товара':
            exel.Color = value + '3'
            break
        case 'Высота игрушки, см':
            exel.ToyH = value + '3'
            break
    }
}
})

const newWS = ws



for (var i = 1; i <= toys.length; i++){
    if(exel.Old){
        if(exel.Old[2]){
            newWS[exel.Old[0] + exel.Old[1] + `${i + 3}`] = {v: 'пизда'}
        }else{
            newWS[exel.Old[0] + `${i + 3}`] = {v: 'пизда'}
        }
    }

    if(exel.Price){
        if(exel.Price[2]){
            newWS[exel.Price[0] + exel.Price[1] + `${i + 3}`] = {v: toys[i -1].price}
        }else{
            newWS[exel.Price[0] + `${i + 3}`] = {v: toys[i -1].price}
        }
    }

    if(exel.Artik){
        if(exel.Artik[2]){
            newWS[exel.Artik[0] + exel.Artik[1] + `${i + 3}`] = {v :toys[i - 1].newArt}
        }else{
            newWS[exel.Artik[0] + `${i + 3}`] = {v :toys[i - 1].newArt}
        }
    }
    
    if (exel.Name) {
        if(exel.Name[2]){
            newWS[exel.Name[0] + exel.Name[1] + `${i + 3}`] = {v :toys[i - 1].name}
        }else{
            newWS[exel.Name[0] + `${i + 3}`] = {v :toys[i - 1].name}
        }
    }
    
    if (exel.NDS) {
        if(exel.NDS[2]){
            newWS[exel.NDS[0] + exel.NDS[1] + `${i + 3}`] = {v: toys[i -1].NDS}
        }else{
            newWS[exel.NDS[0] + `${i + 3}`] = {v :toys[i - 1].NDS}
        }
    }
    
    if (exel.Weigth) {
        if(exel.Weigth[2]){
            newWS[exel.Weigth[0] + exel.Weigth[1] + `${i + 3}`] = {v :toys[i - 1].weight}
        }else{
            newWS[exel.Weigth[0] + `${i + 3}`] = {v :toys[i - 1].weight}
        }
    }
    
    if (exel.Width) {
        if(exel.Width[2]){
            newWS[exel.Width[0] + exel.Width[1] + `${i + 3}`] = {v :toys[i - 1].width}
        }else{
            newWS[exel.Width[0] + `${i + 3}`] = {v :toys[i - 1].width}
        }
    }
    
    if (exel.Higth) {
        if(exel.Higth[2]){
            newWS[exel.Higth[0] + exel.Higth[1] + `${i + 3}`] = {v :toys[i - 1].height}
        }else{
            newWS[exel.Higth[0] + `${i + 3}`] = {v :toys[i - 1].height}
        }
    }
    
    if (exel.ToyH) {
        if(exel.ToyH[2]){
            newWS[exel.ToyH[0] + exel.ToyH[1] + `${i + 3}`] = {v :toys[i - 1].toyH}
        }else{
            newWS[exel.ToyH[0] + `${i + 3}`] = {v :toys[i - 1].toyH}
        }
    }
    
    if (exel.ModelName) {
        if(exel.ModelName[2]){
            newWS[exel.ModelName[0] + exel.ModelName[1] + `${i + 3}`] = {v :toys[i - 1].newArt}
        }else{
            newWS[exel.ModelName[0] + `${i + 3}`] = {v :toys[i - 1].newArt}
        } 
    }
    
    if (exel.Descrip) {
        if(exel.Descrip[2]){
            newWS[exel.Descrip[0] + exel.Descrip[1] + `${i + 3}`] = {v :toys[i - 1].description}
        }else{
            newWS[exel.Descrip[0] + `${i + 3}`] = {v :toys[i - 1].description}
        }
    }
    
    if (exel.Color) {
        if(exel.Color[2]){
            newWS[exel.Color[0] + exel.Color[1] + `${i + 3}`] = {v :toys[i - 1].color}
        }else{
            newWS[exel.Color[0] + `${i + 3}`] = {v :toys[i - 1].color}
        } 
    }
    
    if (exel.KomType) {
        if(exel.KomType[2]){
            newWS[exel.KomType[0] + exel.KomType[1] + `${i + 3}`] = {v :toys[i - 1].comerType}
        }else{
            newWS[exel.KomType[0] + `${i + 3}`] = {v :toys[i - 1].comerType}
        }  
    }
    
    if (exel.Age) {
        if(exel.Age[2]){
            newWS[exel.Age[0] + exel.Age[1] + `${i + 3}`] = {v :toys[i - 1].age}
        }else{
            newWS[exel.Age[0] + `${i + 3}`] = {v :toys[i - 1].age}
        }
    }
    
    if (exel.Length) {
        if(exel.Length[2]){
            newWS[exel.Length[0] + exel.Length[1] + `${i + 3}`] = {v :toys[i - 1].length}
        }else{
            newWS[exel.Length[0] + `${i + 3}`] = {v :toys[i - 1].length}
    }
    }
    if (exel.Numb) {
        if(exel.Numb[2]){
            newWS[exel.Numb[0] + exel.Numb[1] + `${i + 3}`] = {v :i}
        }else{
            newWS[exel.Numb[0] + `${i + 3}`] = {v :i}
    }
    }
    if (exel.MainPhoto) {
        if(exel.MainPhoto[2]){
            newWS[exel.MainPhoto[0] + exel.MainPhoto[1] + `${i + 3}`] = {v :toys[i - 1].mainPhoto}
        }else{
            newWS[exel.MainPhoto[0] + `${i + 3}`] = {v :toys[i - 1].mainPhoto}
    }
    }
    if (exel.OtherPhotos) {
        if(exel.OtherPhotos[2]){
            newWS[exel.OtherPhotos[0] + exel.OtherPhotos[1] + `${i + 3}`] = {v :toys[i - 1].otherPhotos}
        }else{
            newWS[exel.OtherPhotos[0] + `${i + 3}`] = {v :toys[i - 1].otherPhotos}
    }
    }
    
}
console.log(newWS['B5'].v + 'ПИЗДА');
xlsx.utils.book_append_sheet(newWB, newWS)
xlsx.writeFile(newWB, "finalTable.xlsx")

}

// wK w_8
async function round(number, pezda = false){
    number = parseInt(number)
   
    if (number < 1000)
    {        number = number*2.35
          
        number = Math.round(number) + 175
        if(pezda === true){
            beautyNum(number, true)
        }else{
        beautyNum(number)
        }
    }else{
        if(number<5000){
            number = (Math.round(number * 2.3))
            if(pezda === true){
                beautyNum(number, true)
            }else{
            beautyNum(number) 
            }
        }else{
            number = Math.round(number * 2.2)
            if(pezda === true){
                beautyNum(number, true)
            }else{
            beautyNum(number)
            }
        }
    }
}

async function beautyNum(number, jopa = false){
    number = parseInt(number)
        while(Math.trunc((number % 100) / 10) != 9){
            number++
        }
        if(number % 10 != 0){
        while((number % 10 != 9)){
            number ++
        }
    }
    if(jopa){
        finalOldPrice = number.toString()
    }else{
    finalPrice = number.toString()
    }
   
}

async function getHrefCard(html){
    const $ = cheerio.load(html)
    $(`a[class='${bigLinkClass}']`).each( function huy(){
       
        var link = $(this).attr("href")
       if(links.includes(link)){
       }else{
        links.push(link)
       }
     
       
    })
}


async function getPageContent(uri){
    const browser = await puppeteer.launch(LAUNCH_PUPPETEER_OPTS)
    const lilPage = await browser.newPage(PAGE_PUPPETEER_OPTS)
    await lilPage.goto(uri, PAGE_PUPPETEER_OPTS)
    const content = await lilPage.content()
    browser.close()
        return content;
}

async function getClassValues(ws){
  const link = ws['A2'].v
  const nameToy = ws['B2'].v
  const artikul = 'Артикул'
  const photoLink = ws['D2'].v
  var price = ws['E2'].v
  const bigLink =ws['G2'].v
  const description = ws['H2'].v
  
  var bigContent = await getPageContent(bigLink)

  var bigLinkClass1 = bigContent.split(link)[2]
  bigLinkClass = bigLinkClass1.split(`"`)[2]

  var content = await getPageContent(link)

  var nameClass1 = content.split(nameToy)[content.split(nameToy).length - 2]
  nameClass = nameClass1.split(`"`)[nameClass1.split(`"`).length - 2]

  var toyStatsClass1 = content.split('Страна-производитель')[0]
  toyStatsClass = toyStatsClass1.split(`"`)[toyStatsClass1.split(`"`).length - 6]


  var photoLinkClass1 = content.split(photoLink)[content.split(photoLink).length-2]
  photoLinkClass = photoLinkClass1.split(`"`)[photoLinkClass1.split(`"`).length - 3]

  price = price.toString()
  if (price.length > 3){
      var tok = price[price.length - 3] 
  }
  price =  price.split(tok)[0]+' '+ tok+price.split(tok)[1]
  var priceClass1 = content.split(price)[0].split(`"`)[content.split(price)[0].split(`"`).length -2]
  priceClass = priceClass1

  
  var descriptionClass1 = content.split(description)[0]
  descriptionClass = descriptionClass1.split(`"`)[descriptionClass1.split(`"`).length - 2]
  
}

var vv = `5.10.15
TM
Штучки, к которым тянутся ручки
luffy 
luffy mily
ТМ Fluffy
4Moms
1TOY
101 Dalmatians
101 Далматинец
7DAYS
44 Котенка
2K Beauty
0 eight
1st Choice
8in1
137 Degrees
3M
2018 FIFA World Cup Russia TM
50 Fifty Concepts
1C-SoftClub
3D-Bags
4M
7 DAYS
3DLightFx
7 Морей
1 ALL SYSTEM
20 копеек
28 копеек
0 калорий
7 морeй
4SEASON
9месяцев 9дней
4M Industrial
_PlayToday_
Attivio
Aquabeads
Aurora
Antarctica
Animazzle
Amarobaby
Acoola
alilo
Artie
AQA baby
Adbor
ABC
Adamex
Antilopa
Aroteam
Alis
Angelcare
Alatoys
Actrum
Aristocats
AUTOGRAND
ACANA
Animal
ArtBerry
AURORASTAR
Alex Junis
Awesome Blossems
Attack
Aricare
Aquafresh
Avengers
Attipas
Arden Grange
Alpex
Alcatel
ASTREL
Ariel
Acarento
ASI
Arau baby
Aprica
Akella
AQA dermika
aTech nutrition
Aveeno
ARDO
All About Nature
Atopic
AQUAEL
Airyvest
ADC
AURA Antibacterial
Aquatory
Adora
Ankur
Alpro
Altacto
Adel
AROMADOG
Avenir
ALWAYS
ALPINO
AquaLighter
AZETAbio
Ali pia story
ALMO NATURE
AvtoTink
Actifruit
AWARE MOMMY
aPUMP
ANIMONDA
Akos
Amateg
Apicenna
AQUAELLE
Animal Play
AlpenHof
Abtoys
ANTEPRIMA
Arjelli
Affenzahn
Auldey Toy Industry
ASE-SPORT
Achromin
Angry Birds
Autotime
ANTI MOS by VILENTA
ATLANTA
Amazing Zhus
ASCENDENT SYNTHETIC CORP
Arnetta Disney
Arnetta Mattel
ARGETA
ARCHOS
Angel Clay
Angel Sand
Angeleare
ALL OUT
Ameurop
Adventure Time
ANAGRAM
Animal Planet
ArtRain
Alpen Gold
AXENTIA
All Kids Coloring
AGU
AUTOMOBLOX
Asmodee
Arctic Force
Angry Bubbles
AVC
A.Y.ZAK
AB GO
ARMO URON
ARTCRAFT LTD
Artsgreat Co., Ltd
AUSINI
ANIMAGIC
Avionaut
ARTI
ANNA CLUB PLUSH
Aquakids
Andy
Api-San
AND
Anamalz
Animonda Integra
Associated Electronic
Arctic Goose
Altabebe
ARYA
Adam Stork
AAmaro
Amico
Armtoys
Abero
Aquaelle medical
Adiri
Adaptil
ADAPTIL JUNIOR
AVESE
ARGUS
ART PUZZLE
ARAU
Alsoft R
Allure
ART STYLE
ALPIKA-BRAND
Afi Design
Arnebia
Aqua Slime
Arabia Finland
Angel Like Me
ADDIC
ATTITUDE
AltraNatura
Allini
AilliN
Apple Toys
Air Hogs
Arias
Amazing Toys
Action
Arsenal
Animal Zone
Active Kids
Akai
ANG
Able Star
Activision
A4TECH
Atari
Arnetta
ALEX
Ascendent Synthetic
Alpen Gaudi
Any Kids
Alfare
Andanines
ADAGIO
Babyline
Bubchen
Bright Starts
Babyton
Britax Roemer
Baby Go
Barbie
Britax
Baby Go Trend
Baby Gо
Blue Seven
Bakugan
Bruder
Bebi
Bossa Nova
Betsy
BioMio
B.
Ben10
Bestway
BeyBlade
Bebizaro
Babyhit
Bambinizon
BabyBjorn
Bella baby Happy
Boom Baby
Bugaboo
Brit
BertToys
Bebetto
Baby Balance
BAUER
BRADEX
Baby Elite
Bombbar
BABOO
Bebble
Button Bluе
Babycollection
Bottilini
Burti Baby
Bodo
BabyCare
Batman
Bondibon
Bebivita
BEABA
Baby Nice
BBurago
BabyEdel
Bumbleride
Battat
Baykar
Berten
Baby Jogger
BIC
BALIO
Baffy
Baby Safe
BeSafe
Beurer
Babyzen
Babies
Bartek
Bionova
Baramba
Baby Anabelle
BioTela
Be Happy
Belashoff KIDS
Babysafe
Baby Street
Bella
Berkley
Belle-Bell
Baibian
Bebi Premium
B&H
Ball Masquearde
Baby Alive
Bio-Oil
Bornsoon
Baby-Vac
Baltex
Black Box Trees
Babystep
BIC Kids
BUDI BASA
BeBe-mobile
Babyono
Baby Land
BabySwimmer
Beckmann
BERLINGO
Bugstop
Biopharma
Boom!
Baby Speci
BSD
Barilla
Bluesea
BELMIL
BENBAT
BranQ
BATTLETIME
Bumprider
Busy Lizzy
Baby Patent
BOBINI
Beaphar
Bob Snail
BALLU
Biosaurus
Brevi
Baby Ktan
Bildo
B kids
BaseBar
Biolane
BB Allegro
B&B
BIFF
Bionergy
Bifrut
Buckle-Down
Boehringer Ingelheim
BAYER
Bertolli
Balerina dreamer
BochArt
Bibi
Ben and Holly
Banpresto
Boom City Racers
BURTI
Blizzard
Beeztees
Binky
BOTAVIKOS
Bizzy Bubs
Baby Art
Balbi
Biokats
BonaVita
BOOM
Bloom collection
BABY STYLE
BabyFrank
Bush Baby world
BioTerra
Babys JOY
BodyBar
BIO-GROOM
Botva
Biogance
Boomtrix
BSP bio spa
Bio Up
Brio
Bob the Builder
Bbuddieez
Baby Trend
Bullyland
Bambino
Bebelot
Bratz
Battroborg Fighting Robots
BASSO
Bebeton
Blend-a-med
BOLEY
Baby Frank
BIOMED
BOUNTY
Bioniq
BelVita
Biomecanics
Btc
B. Kokkinos S.A.
Bugatti
Baby Memory Prints
Baby Collection
BREAK
Baby Friend
Bonaqua
Belle
Bart-Plast
Bambi
Barbie by Глюк\`oZa
Beauty and the beast
Bewinner
Babybol
Belle Epoque
Biore
Baby Sun Love
Baby Sun Care
BONToys
BATH THERAPY
Baby Delight
BWT
Baseus
BAGI
BrainBox
BIOFOODLAB
BabyGo (Rosin)
BOTAS
BabyGo (Mandarin)
Babycoccole
BLACK PANTHER
Betty Spaghetty
Bliss
Build-a-Bear
Bunch O Balloons
BLOCO TOYS INC
B Dot
Bratzillaz
BRICK
Barking Heads
Bandai
Baier Kindersitz
Best Dinner
BAMBOOLA
Bambino Mio
Bambolinа
Bioni
BABY BORN
Boxy Girls
B.Well
BIOTech
Bionit
Be Plus
Biola
Binland
Boreal
Bloc
Bresser
Bizhon
BUBLELAND
Bonny
Banana Republic
Big Hero 6
Bobostello
Baofeng
Bebe Confort
Bonikka
BC Import & Export CO
Baby Mom
Bamboobrush
Beauty Style
BOSSTOYS
Bellavia
BendClub
Baby Code
BabyBunny
Bioretto
Bralisa
Babyruler
babylux
BIOHELPY
Bioteq
babypol
BABYSTORE
Beka
Brabantia
Belive
BIO-TEXTILES
Beyond time
BAOLI
Bonjour Bebe
Boiz
BOOL-BOOL
BOOL-BOOL for baby
Beadery
Botti
Bojeux
BBT
Bebelino
Black&Decker
Bel Baby
BAO TOYS
Button Blue
BOON
BabyMoov
Biba Toys
Banbao
BuzzBee
Best Learning
BMX
B-O-B
Born free
BeeAngel
Boomco
Beboy
Bristle Blocks
Baboum
Bolz
Beatrix
Bolichin
Bethesda Softworks
Baby Expert
Bambolina
BIG
Big Figures
Baciuzzi
BabyDam
Chuggington
Clever
Chicco
Camarelo
Canpol Babies
Cave Club
Clementoni
Cosmodrome Games
Cybex
Coccodrillo
Cloudees
Cherubino
Chi Chi Love
Cars
Cool Maker
CIC
Crockid
CAM
Candylocks
Crosby
Colgate
Cat Step
CBX
Comazo
Comsafe
Clash of Gears
Cat Chow
Candy Corn
CB SKY
Capsule chix
Chappi
Chikalab
Crayola
CHOCO-BOY
Clippasafe
CBX by Cybex
Cutie Stix
Coloma Y Pastor
CORNY
Carrera
Canagan
CHICKS WITH WIGS
CoLLar
Cats Best
Cliny
CyberCode
Catsan
Cesar
CARIOCA
Ceba baby
Catseido
Chap Mei
Carnilove
CyberToy
Cleanelly
CATERPILLAR
Clan
CAT
Chicopee
Colief
Coconessa
Cullinan
Cupсake Bears
Chabaa
Cavallino
Casa Kubana
Collezione
Chikoroff
Country Farms
Carapelli
Clicformers
Chaokoh
Catit
CELLO
Centrum
CiciCat
City life kids
CitoDerm
COOLINDA
Centropen
CERAMED
Catzone
Comix
Chiaus
Cars 3
CEVA
Cyber Take a Bite
Colorio
Cutie Cars
Cars Party Favors
Chessford
Color Me Mine
Clay Buddies
Color Code
CORVINA
Clek
Cassidy Brothers
CLAME MOVOIL SH
Chipicao
Cut The Rope
CANOE
CarrybOo
COTICO
Coca-Cola
Chi Siamo
Casdon
CUPPATINIS
CJ LION
CHUCK & FRIENDS
CBSKY
Care Bears
Cupcake
Citizen
Casio
Christmas House
Chapmei
Cicciobello
Cars Formula
COSMOS
Caretto
Cuten Clever
Chocolate Egg Surprise Maker
COROLLE
Cheng Kuo Ltd
China Focus
CareFresh
Canvit
Crazy Clamp
CaribSea
Ching Ching
Cubika
CakePop Cuties
Chubby Puppies
Cilek
Caretero
Cheeky Chompers
CSL
CRAZY PAWS
Cheetos
CoviDez
Cheris
Cerave
Care
Chiccо
Cubby
Coockoo
CartonHouse
Cоюзмультфильм
CRYSTAL BOOK
Clarks
Chillafish
Cestal Plus
Cestal Cat Chew
Cardalis
CurliGirls
CASY HOME
Caketime
Cleanic
CRETACOLOR
COLORINO
CHAMELEON
Creature Cups
ChocoLatte
Cascatto
CUTEKINS
Cult me
Calzini
Crystal Puzzle
Colibri and Lilly
COMFORMA
China Dans
Cozy N Safe
Changzou Limeng
Capella
Creative designs international
China Bright Pacific
Caring Corners
Cubicfun
Chicos
Combat Creatures
CDI
Confeccoes
Cockatoo
Chillfactor
Croods
Concord
Charming Sport
Cow
Cloud b
Christmas Wonderland
Carline
CHAMPION
CROCS
Cozy
Casualplay
CHOY HING
Dr Brown's
DohVinci
Demi Star
Disney
Duracell
Day and Night
Disney baby
Disney Frozen
Disney Princess
Demar
Dickie
Dragons
Depend
DreamMakers
Dragon
Dolphin
Dog Chow
Doona
Disney Doorables
Dolce Bambino
Driven
DREAM MAKERS
Dentinale natura
Decorata Party
DR.TUTTELLE
DOC McStuffins
D-Dart
Deli
DAVICI
Devik
Dumbo
DADE toys
DC
Decoris
Dakababy
Dong Huan
doJoy
DiDi
DogGoneSmart
DR.SAFE
Djeco
Diono
Diva kids
Dreamies
Dendy
DogFest
Deonica
DECOFEST
Deex
DrKorner
DUVO+
Dolce
Devik Toys
Daisy Design
Dodo
Darling
Diet formula
DAJANA
Doglike
Dantoy
DISCEEZ
Drivetoys
DiYes
Darsi
DreamWorks
DrDias
DOMIE
Discreet
DiaDar
Despicable me
Dentalife
DariBar
Dr Vistong
Dog Extreme
DISGUISE
DAS
Deloras
DOOG
DOUXO S3
Dine Trin
DeLIGHT
Dolly Moda
Dinosaur
DoggyMan
Decoretto
Diamant
DIZAO
DRACCO
DEMA-STIL
Dentale
Droga Kolinska
Dea Mia
Dandino
Delti
DIRKJE
DJ Dutchjeans
DOVE
Donat Mg
Dido
Di&Di
Dave Toy
Dory
DESIGN MASTERS
DeLune
Dolly Toy
Dobriy Pulpy
Deglingos
Dr.Steve
D-LEX
DANIEL-RAY
DC Hero Girls
D&M
DRIVE
DISCOVERY
DOCA
DeskPets
Disney-Детский мир
Dr.Agua
Demi Anime
DESCENDANTS
DIZZY DANCERS
Dr.Alders
Dr.Clauders
Diva
Disney Феи
Disney-Cinderella
Donalduck
DesignaFriend
Dr.Elsey’s
D.I.E.S
DaiichiEizai
Dora
DRY DAY
Deluxe
Dota 2
Doppel Hertz
DrAntiseptoff
Disney Villains
DeLIGHT Rose
Drift
Driver
Daisy
Devoted
DeCuevas
Douxo Care
Dial-Export
Dr.Drops
Doness
Dalin
deppa
DrLuigi
Dentalpik
De Agostin
Dream Time
Danhson
Darissa Kids
Darvish
Dondolandia
Dino
Doremi
Daesung toys
Diaper Champ
Dragon Models
Demi Fashion
DMG
DX
Demi Girl
Double Eigle
Digo
Dollsworld
Dolu
Day&Night
Disney Interactive Studios
Domenech
Disney Infinity
Duetto
Dolls World
Divertoys
Danone
ELC
Enchantimals
Erhaft
Erich Krause
EVERGREAT
Exost
Ecotex
EMU Australia
EVO
Educa
Eco cover
EZVIZ
EstaBella
Evi
ELARI
EVER CLEAN
EziKIDS
Estel Professional
EarthPet
Eheim
ENERGON
Edel Cat
Eco Wood Art (EWA)
Elisir
Easywalker
Evian
Elanco
ECOCRAFT
Eztec
Ekinia
Ego
Entertoyment
Evis
Everyday
Elleair
Evi Professional
Eukanuba
EcoSpace
Elibell
Evolutor
Eva Sun
Everyday baby
Elite
Emotion Pets
Edison Giocattoli
Edel Dog
EBI
EVERTS
Eureka
EFKO
Eliott
Eolo Sport
Exogini
EggStars
Edi Limited
Etch-A-Sketch
Electrolux
Europe-Flower
Education Line
Emote
EXEQ
EXPRESSIONS
Emerts
Exit
Engino
Edu Play
Expel
EaSyGO
Elmers
Evashoes
Edelbloom
Eurographics
ElBascoToys
Effort
Ezilita Home
Exo Terra
Elis Сlinics
Egg
Efeet Collection
Ebulobo
ElderJoy
Evaline
EDX Education
EMSON
ERGOFORMA
ERGOPOWER
Edu Toys
Eastcolight
Erpa
Enfamil
Eichhorn
Edushape
Euron
Ergobag
Eagle Gifts
Edison
Ever After High
Evermore Enterprise
Electronic Arts
ECOIFFIER
ELEGAMI
FurReal Friends
Fleur Alpine
Futurino
Fila
Futurino Cool
Friso
Futurino Fashion
Fisher Price
Futurino Sport
Farmina
Funko
Futurino Mama
Fest
FRESH-TREND
Favarini
FUNTASTIQUE
Fast and Furious
Frutto Rosso
Fuzion Max
Frozen
Fancy
Fingerlings
FunnyLon
FUNSKOOL
Ferplast
FRESH STEP
Freds Swim Academy
Flexi
Famosa
Feltrica
Friskies
Fiory
Felix
FD Design
Fairy
Floofies
Fit Fruits
Faber Castell
Fjallraven
FANCY BABY
Funky Toys
Fengchengjia toys
FUNNY BUNNY
Fit Parad
Fortnite
Fizz N Surprise
Fa
FURMINATOR
Fart Ninjas
FAUNA
Funny ducks
Ferrari
Fortevit
Fit-Rx
Filly
FitActive
FLUFFY HEART
Fliptopia Baby
Fashion Angels
FOODTOBEGOOD
FitFeel
Fluffy Family
For you
FUNVILLE
FANCY DOLLS
FLAIR
Faro
Frutty
Florale
Funrise
Flyber
FreshPet
Funny Line
Fitness
Fiolento
Fireman Sam
Forever Friends
Fixiki
FUSION TOYS
FD-Design
Futurino by Oksana Fedorova
Frau Schmidt
Frogs
Fanclastic
Fanta
FUJIFILM
Frosch
Free Age
Futurino (Rosin)
Fidget Its
Frisolac
Futurino Fashion (Fashionwell)
Favaretti (Winfree)
FuzeTea
Finding Dory
Fidget Spinner
FIMO
Flush Force
Feisty Pets
Fotorama
Futurino Basic
Flipper
FERETTI
FOSHAN CITY SENHAI SPORTING
Futurino School
FunTun
Futurino Fox and Owl
Feeding Kit
Far out Toys
Fiorellino
Feawny Hiau LTD
FitEffectum
FitDelice
Fitelle
Favorite
Flexy Pharm
Fishka
Fonuters
Feliway
Feliway Friends
Friends
FreizeActive+
FUNGUN
Flossy Style
Flexpocket
Flexfresh
Forzutos
Fluffy Moon
Fresh Cat
FOSTA
Frosterra
Fotografia
Falk
Fun Time
Fada Elektronic
Favaretti
Fly wheels
Falca
Fizzy Moon
Flying Fairy
Five Stars
Fast Lane
Furby
Feber
First Steps
Fantastic
French Toast
Fly n hight
Forum
F.S.Portugal
Frezj
Ferrero
Furry Frenzies
Fenbo
Fydelity
Good Dinosaur
Grizzly
Global Bros
Gotz
Goon
GooJitZu
Gerber
Gonher
Graco
Greentom
Greyhound
Genki
GO
GEOX
GP
Grunberg
Gullivеr
Geuther
Genio Kids
Glitter Girls
Gusti
GIOTTO
Gourmet Gold
GoodHelper
Green Plast
Globber
Gala-Вальс
GAMMA
GiGwi
Ggomoosin
Grand Prix
Glimmies
Genesis
Gardex
Granolife
GB
Glove Blaster
Green Farm
Guca
GROSS
Gimcat
Gulliver
Geoplast
GARNIER
Green Day
GAODA
Good Cat and Dog
Geospace
Girlslife
Goliath
Gift\`ems
GEOBY
Gemini
Giochi Preziosi
GD INDUSTRIAL CO.DVTECH LTD
Grow'n Up
Garvalin
GCI
GEMAR
GLYSOLID
G-balance
GyroFlash
Galaxy Tracker
Greenlab Little
Goldman and Young
Gesslein
Glove-A-Bubbles
Globex
Galileo
Gowi
Gyro Spinner
Goroshek
Gimpet
Gazillion
Glorix
Green Fort
Golosi
GreenFort NEO
Grumblies
Golden horse arts & crafts
Globalvet
GIGI
Godan
Gauss
Glamuriki
Gravity Falls
giaretti
Galastop
Granmulino
Gizmo Riders
Gezatone
Garden Eco
GOONWOO
GemKraft
GHOSTBUSTERS
Grassberg
GrunWelt
Garden story
Geon
Geomag
Geoworld
Galey
GBF.AVC
Grand Step
Gulliver Sonya
Galaxy Defender
Gunther
Greenwich line
Giro
GreenToys
Glos
Grand Soleil Grazioli
Grow-Up
GK
Green Rainbow
Green Toys
Global Kids
GAMES Corporation
Gemenot
GAKKARD
Hasbro
Hasbro Games
Huggies
Hot Wheels
Heinz
Huppa
Hipp
Hairdorables
HILLS
Hobby World
Hatchimals
HK Industries
Harry Potter
Hauck
Herlitz
Hohloon
HTI
Hotenok
Hebei honghahao yillao keji
Hello Kitty
Hellobaby
Helen Harper
Happy Places Shopkins
Hunny Mammy
Hape
HOCO
HARIBO
House of Seasons
Happy Snail
Hopscotch
Hey Clay Залипаки
Hatber
Hush Hush!
Heelys
Happy Dog
Happy Cat
HTI (Roadsterz)
Hobby Day
Hartan
Hevea
Hanbok
Hifold
Happy Monkey
Hapica
Hunter
Hencz Toys
Herbarus
Happy Puppy
Happy Socks
Habibi
HairDooz
Hama
Hateco
Happy Moments
HBR
Holy Corn
Hagen
HANSA
Happy Pet
HIT IMAGINATION
HQ Kombucha
HOPAX
Happycon
HoneyWay
HANAZUKI
Ham bones
Honestly Cute
Humana
Herba Vitae
Honest Fields
Herdmar
HGL
Happy Line
Hog Wild
HONKA PRODUCT
Hearts
Hold Enterprise
Hualian Toys
Happy Loom
Hot Wheels by Глюк\`oZa
Haier
HEROS
HASK
Hexbug
HandyPotty
HAMAX
Handy Home
HOМERTECH
Hovertech
Happy Plant
Hap-p-kid
Hans Novelty
HANGZHOU WUZHOU IMPORT
Hero Eggs
Hasbro(Yellies)
Hoverbot
HappyHop
Happy hands
Hinoki
HPI
HEMAR
HOFFMANN
HASBRO (GAMES)
Hello Baby
Hydromax
Happy Kid
Hiper
Helan
Hearttex
Home Lavka
Happy Crisp
Happy Corn
Happy People
Happy Baby
Halsall
Hebart
Heart4Heart
Hanayama
Honka
Huile Toys
Happy Team
Hebe
Happy Well
Hero Mashers
HARPER HY GIENICS
HEROMASHERS
Inglesina
Infinity Nado
Icepeak
IMAGINEXT
IDEA
INSEENSE
Indigo
I love mum
Italbaby
INFANTINO
IQ 3D PUZZLE
INDOWOODS
IMC Toys
Infinity Kids
Innomat
INSTAX
I LOVE MY HAIR
Ifam
Island Cup
ILG
IMAC
IQ form
IVShoes
ICEPEAK PET
INABA
Intellectico
Iv San Bernard
INNATURE
Inspector
IQ Format
iTrek
Invisibobble
InSummer
Itosui
I'M Toy
Infunt
Idigo
Intertoy
Italtrike
INBLU
Impulse
ISB
iNanny
Innovative Toys
Icoy toys
INJUSA
IVOMED
IDEAL
iBaby
iconBIT
IM TOY
INTERSTAR
IDI
iOffice
Intervet
Invesa
Ironman
Iron Man
Iris
INVICTUS
Ivolia
Ivory
Infante
Ipanema
IQ dress
IronMan
iD Protect
iQ-form
iQ-dress
I.C.Lab Individual cosmetic
I'Coo
Intek
Ingo
Ides
Inter Activ
ISD
InfaPrim
Intex
IMPS-Smurfs
International Toys
ICOO
Jook
Jurassic World
Jomoto
Johnson's
Joonies
Johnshen
Jakks Pacific
Jada
JURONG
Junior Megasaur
Jetem
JCB
JUNAMA
John
JOOVY
Jovi
JR Farm
JRX construction
Just Mom Ulla
JUAN ANTONIO
Jacote
Jack and Lin
Jr Korner
JUNO
Juicy Fruit
Jump!
Joypet
Jersey Lab
Josephin
JUWEL
Justice League
Janod
Jakos
Jumpino
JogDog
Johnny the SkullY
Jordan
Joie
Jozepfin
John Frieda
JOMOTO (W and L)
Jungo
JOМI
Jurassic Park
Jakks Fairies
JIAJUN INDUSTRY
JIANGYAN YONGDA
JOREX
JXD
JAGGER
JUPITER CREATIONS
Jolly Kids
JT
Janett
Jialisheng
Joymat
Junfa Toys
Joerex
Jakks Tollytots
Juicefull
Journey Girls
Joy Toy
JJ Cole
Jake Neverland Pirates
Jake
Jufa Toys Ltd
Kreiss
Kabrita
Kuoma
Kerry
Koko Noko
Kapika
Keddo
Kinder
Klein
Kedini
KOGANKIDS
Kids Harmony
KAKADU
Kinetic Sand
KidKraft
Kisu
Kiddieland
KOOPMAN
Kinderkraft
Kioshi
Kinderline
Kioki
KidWick
Kidfinity
Kribly Boo
Komuello
Konyo Glow
Karolina toys
Kotik
KENKA
Kleenex
KiteKat
KARIGUZ
Koh-I-Noor
Kurt S. Adler
KindiKids
Kloob
KAURY
Kaftan
Kodak
Kidz
KidZlab
KONG
Ketos
KELME
Kodeks
KRKA
KonopLektika
KOTEX
King Island
KLATZ
Kinderspielwaren
Kawaii Mell
K's Kids
Keeeper
Keter
Kidsme
KODKOD
KODZOKI
King Rice Bran oil
KW-Trio
KEYROAD
KUNDER
KUM
KitKat
Knoppers
Korri
Knits Cool
Konfeti
Kingfit Industries Ltd
KOSMOSTARS
Kitties in the cities
KidsWorld
KinderChick
Karolinatoys
KIDS STUFF
KIDSIMSITZ GMBH
Kukumba
KodzokiI Gyro
King Kids
Kruse College
Kitty Club
KON-TIKI
KIDS CARE
Kaemingk
Kao
Kocho
Kudo
Kids Comfort
Kingsport
Knittex
Kids Box
KNOPA
Kindii
Kipod
Kid-Fix
Katlen
KimJoy
Krasatoys
Kaiyu
Kangaru
KiddieArt
KSG
KHW
Kidgalaxy
Katie's House
Kosmos
Kawaii
Kre-O
Korzina
Keel Toys
KidzTech
Konami
K'nex
Komes
Kuso
Keenway
Laffi
Littlest Pet Shop
LEGO
L.O.L. Surprise!
LOL
Lassie
Lassie by Reima
Little Angel
LOVULAR
Lost kitties
Lucky Child
Lubby
Luvabella
Lamaze
Little Live Pets
Little Siberica
Little world of Аlena
LISCIANI
Lionelo
Lynxy
LOVI
Lucky Land
LEMON
Llorens
Luhta
Lori
Lenor
Lorelli
Lucy and Leo
Laica
Learning Resources
Ladys formula
LEO
Lundby
LONEX
Lemmo
LIL SNAP
Little Hero
LUNATOWN
Lansinoh
Lukky(LUCKY)
Lil Secrets Shoppies
Lady and the Tramp
Lysi
LolUno Home baby
Little Tikes
Little One
LittleAngel
Lip Smacker
LACALUT
Little Bird Told Me
LION
LIMONI
LONGA VITA
Loong Kaa
L'Abeille
Laurier
Libero
Levenhuk
LIONMANUFACTORY
Lapikka
Lilli Pet
Landor
Live Extract
Little Big Bites
Luca Lighting
Lil Gleemerz
LISTERINE
Lexibook
LaFitore
Liza Volkova
Listoff
Luxsan
Lishinu
Lorex Stationery
LACTOMED
Lorena Canals
LUXOR
Liker
Lafitel
Le Artis
LORI(колорит)
Lool
Lady Fit
Leksands
Larktale
LOOM TWISTER
LINC
LindoCat
Lyra
Lanard
Lego Ninjago
Libresse
Ledotte
La Donsa
Letto
Laser Pegs
Limpopo
Lauwers Games
Luville Collectables
L Abeille
Lascal
Larsen
Lassig
LORY
Lock Stars
Luxan
Lets Play
Legends of Chima
Laluca
Linom
Legend
Lamborghini
Librederm
Lion Pet
LOSK
Lock and Lock
Life formula
La Nina
La roche posay
LovinDO
Levin Force
Lucky Snaky
Leroux
LillyPet
Love To Dream
Little Peoplе
Lisa Doll
LAPA House
Lamp
LED Effect
Little Friends
LEDcare
loombee
LoveLife
Libertad
Little Fox
LovelyTex
Lactacyd
LOFTime
Little Star
LaLa-Kids
levrana
LITTLE BLOOM
LYL Love your Life SunD3
LivCity
LolUno home Pets
LOVIN DO
LAKO SPORT
Lena
LiXin
Lee chuyn
Leeho
Lyc sac
LIV
Linhai kangli
Little People
LEXX
Looney Tunes
LG
Lee Hing
Lallum Baby
Lalaloopsy
Learning Journey
Let's Sport
Lucas
LaQ
Lilliputiens
Lite Brix
Linas baby
Lumo
Maclaren
MLP Equestria Girls
My Little Pony
Merries
Marian Plast
Moxie
Moony
Monster High
Mobicaro
Monsuno
Mayoral
Monopoly
MANU
Medela
Maman
Mega Bloks
Minnie Mouse
Malamalama
Mattel
Momi
Meine Liebe
Mercedes
Mr Sandman
Metalions
Monster Jam
MaLeK BaBy
Marvel
MONGE
MARINA & PAU
Mickey Mouse
Mepsi
MILI
Munchkin
Moon
Minecraft
Mustela
MAISTO
Mark Formelle
Mighty Megasaur
Miniland
Minions
Manuoki
MAGNETICUS
Mambobaby
Mum's Era
Magellan
Marhatter
Monsters
Maxi-Cosi
MadPax
MIRAROSSI
MPSport
Magformers
Mega Construx
Mobile Kid
MOJO Animal Planet
Mursu
Meglium
Mind
M&MS
Maxval
Magio
Maxleo
Matchbox
Moose
Mimpi Lembut
Mapacha
MOLTO
Moby kids
Machine Maker
Mecard
Muumi
Matopat
Magtaller
MOJO
Molli
Mr.Proper
Mommy Love
Miraculous
Motorola
Multiart
Molina
Mans formula
Mifold
MSD
Mighty Beanz
Mr.Fresh
Minaku
MATERNEA
MAPED
Mehano
MPS
Mega Ten kids sonic
Montida
Midwest
Molang
MARS
Magic Time
Meffert\`s
Mammoet
Moodies
Mein Kleines
Mosaic
Mosquitall
Meiya and Alvin
Microscience
Marimex
Moser
Modarri
Marc&Фиса
Majorette
M-WOOD
Miopharm
MILKY WAY
Magic Home
MILAN
Markwins
Mr.Bruno
MierEdu
My Teddy
Magic Herbs
Mobile
MAMBA
Mekotron
Ms.Kiss
MY ANGEL
Master Uni
MARKO FERENZO
Milord
Miss BIC
MOCHTOYS
Molinea
Micki
Maneki
Maxitoys Dolls
My Dinky Bear
Monkart
Maxitoys
MeLala
Mi-Mi
Maltex
Meller
MultiЛакомки
Markal
Me to You
Maxi Art
McLloyds
MiniMax
MULTI-DIAPERS
MODEL TOYS
Mixels
Mondo
Mezco
Milka
Maxwell
My little
MOTORMAX
Miles
M&C
MORANDUZZO
Moose Enterprise
MAXI Eyes
MaxiLife
MammySize
Mimy
Micuna
Moose Mountain
MAC by Maclaren
Meллер
Military
Mia AND Mi
Microlife
Meccano
Mioshi
Mack and Zack
Mathable
Moana
MARKWINS INTERNATIONAL
MASTER OF THE ARTS
Marmaluzi
Monte
Magic Rain
My Mini Mixiqe's
Milk
Maxi Play
Mr.Smile&Friends
Max Tow Truck
MS KEYBOARD
Mondo Motors
Mega Drive
Mishoo Baby
Mickey Party Favours
Marie the Cat
Marvins Magic
Monstro
Mineez
MAG2000
Moonybaby
Magnetspiele
Mookie
MultiGo
MARTIN FUCHS
MONDO SPA
MCARLO
MELOBO
MAPA
MARCHIORO
Merial
MOONYMAN
Mr.Glatt
My Puppy Parade
Mamelle
Maneki Chibi-neko
Master IQ
Mealux
Mealux-Evo
Micro-Plus
Maretti
My Motto
Malibri
Mandarin
MasterSharpe
Mega Pharma
Moon Light Clay
Mr. Boo!
Manoseptol
ModumMed
MIKIVIKI
Melissa
MON
Meloksidil
Molecola
MOR
Munecas Antonio Juan
MyChoice Nutrition
Mr. Pugman
MATRЁSHKA
My home
MUNGYO
miTOmi
Mary Poppins
METTLE
Matwave
Monkey Wheels
Maksimoff
Mr.Bigzy
Mic-o-mic
MASKBRO
MASKME
Muurla
Memsy
MIOKI
Maisonnette
Megaten
Magic Moments
Magiboard
MAMA COMFORT
Mamalino
Mini Doctor Energy
Molfix
Manley
Modular
Mora
MGA
Marklin
Madam Alexander
MD мил
Motorama
Modular Construction Toys
Me&Dad
Mag Taller
Mojo Pax
Max Steel
Minnie
Milly Tilly
Mansita
MAGNA
Mibb
MQ
Miles Industry & Yongmei
MZ
M-kids
Mountains
Mustang
Moomin
Mishoo by Acoola
Magic Straw
Nutrilon
Nestle
New Bright
Nerf
NAN
Nestogen
Nutrilak
Nuovita
Nuk
Nutricia
N.O.A.
NiKA kids
Na! Na! Na! Surprise
Nota Bene
Nania
ND PLAY
Norveg
Noony
Navystar
Nemoloko
Newsun Toys
Now
Now Fresh
Nebulous Stars
NEON-NIGHT
NOMI
Ninja Turtles(Черепашки Ниндзя)
Nobby
Natures own factory
Noordi
N1
Nordland
Nicotoy
Natures Table
NBML
Nici
NUPPI
Nutella
Nano Gum
NoseFrida
NASA
No Buts
NEW ELEGANT WORLD
Nikko
NHL
Nutvill
NEWTON
Novasweet
NATURELLA
Nerf Dog
Natures Miracle
NECA
Nesquik
Nerf Rebelle
Nivea
Natural House
Nuna
Nicetoys
Nanoblock
Non stop
Nestea
Nose Frida
NATURALIP
NATURALIUM
Novatrack
Nordwey
NAМYSTAR
Nella
Navington
NEW THINKING
NINGBO BRIGHT SOURCE IMPORT
Nicovet
NERF(TVM)
Neoterica
Nita Farm
NATTOU
Ninja bots
Natursutten
Norwegian fish oil
Nordlinger Pro
Natrol
Nella Vitta
Nutraway
Naty
NG designer kids
Naorehi
Nabels
NDCG
Novosvit
NordicBuddies
Newa Nutrtition
Nano Speed
Navigator
Next
Naruto
New Capabie
Novi Stars
Nantong Jiahe
Namco
No name
New Capable
Olsson
Orsolini
Oral-B
ORIGAMI
Owleez
Ocie
Olmi
Offspring
OK BABY
Osann
Oldos
Our Generation
Orange Toys
ORIJEN
Oyster
Overwatch
Oribel
Organic People
Oregon Scientific
Oblicools
OLTEX
Oball
OrganicZone
Oleos
Oonies
Orto.Nik
Optimum System
OZ!Baby
o.b.
ONTO
Oxy Balance
Off the Hook
OOPS
Octonauts
Octa
Organissime
OM NOM
Organique
Original Toys
Oxion
One plus one
OFFICE POINT
Omnio
Ooba
OVERSEAS TOYS CO LTD
Omutsu
OKTkids
OrionPharma
Orby
Oyasumi
Optop
OilDrop
Owl end EarlyBird
ORION TOYS
Ots
Ola!
OLSA
ORTUZZI
OKIKID
OptiMeal
Orb Factory
OgoSport
Polini kids
Pampers
Philips Avent
Play-Doh
Peg-Perego
Pigeon
Puuhtu
PediaSure Малоежка
Premont
Paw Patrol
PlayToday
Pelican
PROPLAN
POLI
PAREMO
Pomsies
Poopsie Slime Surprise!
Plitex
Power Rangers
Peppa Pig
Piatnik
Parklon
Playgro
Pikmi Pops
PERPLEXUS
Peppy Woolton
Present Pets
Prosto toys
Purina Pro Plan Veterinary diets
PRIORITY
PerfectFit
Playgo
Primordial
PAMPERINO
Pondo
Perina
PJ masks
Prime Kraft
PediaSure Здоровейка
Pink Panther
Panini
PAPPAYES
Pulse
Prof Press
Princess
Penaten
PAPER MATE
Proud Mom
Philips
Petreet
Pedigree
Pilotage(Пилотаж)
Playmobil
Proff
Palau Toys
Pi-Pi-Bent
Predo
Palmbaby
Prof-Press
PEQUETREN
Polezzno
POLLY POCKET
Pussy Cat
Primebar
Pet parade
Profit
Party Popteenies
Pentago
Pusheen
Perfectly Cute
PROconnect
PADOVAN
Potette Plus
Pikki
President
Peek-a-boo
PrettyCat
Pecorella
PolToys
Purina One
PlayCircle
PT International
PILOT
Pureluxe
PEZ
Petstages
Pronature
PennPlax
Play
Puller
Post-it
Patrino
PREMIAL
Paw Plunger
PERIOE
POPPOPS Snotz
Plush
Paradontax
Pucci Pups
POPPOPS Pets
PROCOS
PELIKAN
Popi Doli
Poly Kids
Paper Art
Postiron
Palmolive
Polidex
PINKAHOLIC
Pastilata
PARKER
Pokemon
PlaqueOff
Princess Heartstrong
Procon (Asia) Ltd
Palace Pets
PicnMix
Pringles
Petsiki
PIERRE CARDIN
PICNIC
Pure
Playskool
Palmon
Precious Moments
Pororo
Partymania
PRIMIGI
Play Line
Play Smart
Paul Hartmann
PlayLand
PlayLab
POP
PUTTY Peeps
Peptamen
POLLY
Pi-ko-ko
Papa Care
PlayPad
PAULO B
Palmia
PALMER'S
Playmates
Pets on wheels
Playful Mickey
Princess Dreaming
Pony Myths
Persil
Puuhtu teens
PalPlay
Plan Toys
Play Learning
Paola Reina
Paddle Bubble
Powertrains
PetMil
Pretty Cat
PREKOOL
Purina One Mini
Phineas and Ferb
Prolife
Purina Pro Plan
Poppins
POLINI SPORT
Pituso
Poopsie Surprise Unikorn
P.One
Piglette
PetFlex
Polenghi
Pipa
Paterra
Pictionary Air
PomPomWow
Princess Sofia
Protecto
People
Pretty Pet
Piccolo
PARTY MIX
PartyDeco
Prikinder
POLY TEENS
Pix
Premiere Publishing
Pupo
Pilguni
Prime 3D
Pepe Jeans London
Panasonic
Pixo
PERCATO
Panacea
Parfix
POLAR
PULLTONIC
PETIT
PUPPIA
PECHAM
Paulo Carvelli
Pitpoint LTD
Papaton Kids
Poppik
PocketPotty
PlayMais
Power Pux
Paradiso
Potex
Procter&Gamble
Padini
PlayMind
Primo
Plush heart
Plush Apple
Planes
Pop Pixie
Paper FX
Perlina
Puma
Piko
Papaloni
Peppa
Piccolo Angelo
Qwhimsy
Quaps
Qihui
QUERCETTI
Qiao Qiao
Queisser pharma
Queen
QNT
Q-MO
Qunxing
Quinny
Reima
RETRUS
Rastar
Ravensburger
ROYAL CANIN
R.O.C.S.
ROMANA
Run
ROXY-KIDS
Rainbow High
Robot Trains
Ramili
Reike
Riko
Rant
Rubik\`s
Recaro
REXANT
Rubies
RUKKA PETS
Red Castle
Rita Romani
Rhino Construction
Real Caps
Road Rippers
R.A.W.LIFE
ROBLOX
RUBIЕS
Ravesk
RUKKA
RIO
Rainbow Ruby
Rilana
Robotime
Remedia
Rockit
Roi Thai
Relaxivet
REACH
Robofish
RolfClub3D
Rosewood
Redwood 3D
Robocar Poli
Recent Toys
Robud
Ricky Zoom
Rory\`s Story Cubes
RICE UP!
Racionika
Revell
Ritter Sport
RICO
Rusty Rivets
Rio Gold
RADIO FUN
RAINBOW LOOM
Roxy
Roderick
Razor
Resource
RICH
Real Construction
RenArt
Ralf Ringer
Rainbow
REVERY
ROMER
Russian Look
RANGER
Ready2robot
Rudolfs
Raffaello
Rizmo
Rachael Hale
Revlon Professional
Red River
Recarо
Rival
REMAR
Renolux
Raduga Kids
Ripoma
Rubbabu
Rider
RBC
Reflexmaniya
Riko Basic
Russian Superfood
Rolly-Polly
Rip Curl
Richenna
Repost
Rodent kids
RED-N-ROCKS
Rinzo
Red Box
Racing Pro
Rhino Toys
Realtoy
Royal Pups
Rovio
Regalissimi
Runs
Shelcore
Screechers Wild
Sylvanian Families
Staedtler
SLUBAN
Stretch
SYLVANIAN FAMILIES TOWN Series
Similac
Semper
Silverlit
Sela
Spider-man
Smena
Sanosan
Spin Master
Splat
Star Wars
Step Puzzle
SIGER
SOVAlina
Sevillababy
SIMPLICITY
SCHLEICH
SPLASH TOYS
Sky Lake
Scrabble
Synergetic
Sherysheff
Snoopy
Seni
STEP
SHIMMER STARS
Siberica Биберика
Stokke
Super Wings
Scentos
Silwerhof
Silver Cross
Savic
Skip Hop
Sparco
SFM
Summer Infant
Selfie media
STC
Slime Ninja
Shopkins
Selby
Smoby
SmartTravel
STEFFI
Santegra
STURMAN
Swiss Energy
Sambro
Sparkle Girlz
SIKU
Safeguard
Seventeen
Star
Simba (Steffi love)
Sonya Rose
Simba
Sweet box
Sohni-Wicke
Supra VIT
Sheba
Smooshy Mushy
STEM University
SimpleParenting
Street Player
Slimer
Scotch
Schesir
Savarra
S-mala
Say Yes
Schauma
Silca
Spin Racers
SWANNIES
Squishmallows
Spinner Mad
Sachiko
STABILO
SVIP
Spree
Spirograph
Santa Lucia
SPL-Technik
Sentry Baby Products
SCANDIC
SENSO BABY
Samsung
SCRUFFIES
Sponge Bob
Style and Smile
schoolФОРМАТ
Smart Textile
Sweet Baby
SKLZ
Sos Pets
SAVA
Super Fudgio
Schildkroet
SVOBODA Baby
SILCAMED
SNICKERS
Sistema
Secret Life of Pets
Sera
Silver Care
Stuzzy
SPALDING
SuperDesign
Science Time
SKELETOWN
Smartgum
Spring and Summer
STOR
SUNNY DAY
SCHWARZ
SnapStar
Screaming Pals
Schrodel
SIBERRYA
Smile
Sinco Toys
SOJ
Smile care
Sew Cool
STRATEG
SQUIZZ Looping
Ses Creative
Sky
Serrano
Smurfs
Shimmer and Shine
S+S TOYS
Savvi
Soma
Skandia
Space Defender
Skittles
Scarlett
Success
SUM SUM
StriaSan
Superbaby
SHAMTU
Seed
Stingrey
Spong Bob(Губка Боб)
Slinky
Step By Step
Smiley Boy
Street Ball
Smiley Girl
SPL Deck Pets
Smiley Football
Switel
STYLE ME UP!
Suavinex
Sprite
Schweppes
SHINING GALAXY
Soya
Street Doggs
Swimmies
SNOWMEN NEOGIFT ENTERPRISES
Sunny Toys
Sanita
SPROX
Sula
Sochi
Shtorck
Sonic
Sky Ray
Sky Viper
Selecta
SentoSpherE
Spielstabil
Scribble Down
Sticknclick
Sophie la girafe
Snowstorm
Stikbot
Skwooshi
Stack- A-Bubble
SPIELSTAPIL
Smoby Vroom Planet
SHANGHAI EASTERN RESOURCES ART
SHENZHEN SEG HI-TECH INDUSTRIA
SINOTRANS
SpyNet
skintune
Simba (Маша и медведь)
ShoKid
SOAKER
Sabor
Supermario
Scotchi
Sweet pups
Sun Smile
San Marko
Scalibor
Sicce
Silken
Schipper
SLAPlet
Skyrocket
Shnuggle
Star Butterfly
SYMA
Smart Sketcher
Sanipone
Sparcle Bite
Schardt
Starplast
Sky-Watcher
Salto Surprise
SENSO MED
Strobbs
Stillini
Surel
Super cute little babies
Sharpie
SafeheadBABY
Seve
Sleep and Smile
Smile Line
Safety 1st
Scoot and Ride
Small Rider
Swetel
StringArtLab
sunny bunny
ShiShoo
Shaper
Schnucky
SJRC
Swissgear
sfer.tex
SCRUFFS
Sweet sense
Smart Trike
SIGG
SEAGO
SoWash
Salad
Supernova
Salus
Sanatur
Sibella
Swingball
Shusha
Space 7
SNOOGY
SpeedRoll
SUPHERB
Storck
Sprint
SMILE of MISTER
SMILE of MILADY
Scruff-a-Luvs
SmartMax
Shun Feng Lobg
Sun herbal
Snowmen
Shantou
Senhai Sporting
Sunshine Kids
SCS
Smart Kid
Synergy
Skylanders
Stinger Engineering
Sport Equipment
Safari
Safsof
Sonsta Style
Scan2Go
Sonata Style
Sky Rocket
Sic Sport
Spy Gear
Shenzhen Jingyitian Trade
Sony
Sony CEE
Ski Race
Schmidt
SSL
Sofia
Sort Warroirs
Shenma
Smiley
Stellar
Trolls
Tiny Love
Tokka Tribe
Tombi
Tomy
Thomas & Friends
TMNT
Trefl
Transformers
Tapiboo
Tide
Tactic Games
The Lion King
Triol
Treasure X
TITINO
Tom and Jerry
TomToyer
Tiger
Tutek
Take a Bitey
TY
TITBIT
The Mandalorian
Tetra
Take a Bite
Tesoro
TUBIK
Totto
TOCAGO
TOTUM
Toy Story
Top House
TheDerevo
Twisty Petz
Tiny Furries
Tako
ToysLab
Triumph Tree
Terides
TITAN
Thermos
Tic Tac
Taowa
Tatis
Typhoon
Tikiri
TURANICA
The Purple Cow
TRUNKI
TADIWOOD
Thun1794 a.s.
Twistshake
Technok Toys
TropiClean
Take a Slim Bite
TREE TOYS
TWIX
Taiyo
Triumph
Tangle Teezer
TRM
TRATTO
Thai Coco
TIPP-EX
TigerHead (Baby Buppies)
Tena
Toy Target
Take a Cyber Bite
TOYZY
TENERIS
Toys Union
Tommee tippee
Twist the Planеt
Trimensions
Toyota Silica Gel
Telescience
Top Toys
Teddy Pets
Tobbi Kids
TopTrumps
True Dough
The Incredibles 2
The Avengers
Team Tex
The Simpsons
Turtles
Tech Team
TOTO TOYS
Tat Cheong Plastic Mey
TAMPAX
Tablets
Teana
TipToy
Tangle
Toys&Games
Thinkers
Totomosaic
Taf Toys
Tonka
Teplokid
TOPGEAR
Toy Teck
Tsum Tsum Disney
Tool Bench
Tatkraft
Tangled
ToysLab (Bebelino)
Tutis
TP toys
Triumph Nord
TOONSLAND
Torm
Turbo
tom & gerry
THOMES
TRIXIE
Trainer
Takata
Tutti bambini
TVM
Temporary
ToyotaKako
TFK
Tiny Toes
TRAXXAS
TERMICO
Take a Bite Candy
Topicrem
Target
Tobot
Tiny Twinkle
TIGRES
Toffifee
ToySib
Troys
TanyaZ Studio
TRISA
TigerWood
TPLUS
Trendyco kids
Tereza
TRAWA
TOPPERR
Toy Monarch
TipiPets
Teamsterz Micro Motorz
Trekko
Top Cruiser
Trends2com
Tomato
Troll
Toys Lab
Tollytots
Topone Toys
Toy major
Tongde
Tech Deck
TechPet
Tolo Toys
True safari
ToysRUs
Toys&Ctames
Toystate
Trudi
The Childrens Place
Talking Friends
TopGear
TY INC
Thinkfun
Tatty Teddy
Toys & Games
Topsky Toys
Tamagotchi
Tata Pak Industries
TSS Fortune Co.
Tenkai Knights
Trends
Take 2
Tomica
TANK
The Bridge
Tom Tailor
Top That
UNO
UPPAbaby
ULTRAVIT
Ultis
Ugly Dolls
Uviton
Universe
Uniwood
Unnika land
UEK.KIDS
U.S. Polo Assn
UHU
Ulanik
Unitabs
Unico Metall
Unice
Unicharm
Universal
UFC-Velvet
Ulla Kids Fashion
UF
UEFA
Ungrande
UGEARS
ULBA
Unique Creative
UBBI
Up and Go
Unoforce
UNICUM
Unitron
Ubisoft
Valco baby
Vtech
Venom
VPLAB
Valio
V-Baby
Vitime Gummy
Vitime Kidzoo
VoiceBook
Vitanium
Venus
Vita Stars
Versele-Laga
Vulli
Vivere
Vitakraft
VITDAM
Viva Terra
Vilenta
VetЗабота
Veter Models
Vasco
Vertmont
Veda
Vladi Toys
Viyo
VITEK
VK
Value
Vivid
Verossa
Vinayak Int
Vivo
Vita Production Limited
Viva Baby
Vidal
VICAM
Vernel
Varta
Vitaline
Vetoquinol
VIC
VitaPRO
VIKSAN
Vibrac
V-fit
Van Cliff
Vichy
Vela Ricce
Verbena
Vipet
VidiCold
VIRGIN SIBERIA
VATTEN
vipkarmashki
Villaphyta
Von U
Viva Scandinavia
Valemi
Varmax
Vaily
Vaitex
Viking
Villa
Villy-Nilly
Voov
Vip Lex
Winx
WWF
Wappo
WowWee
Winkiki
Windi
Wildluvs
Worlds Apart (Scruff a Luvs)
WinFun
Whiskas
WHO'S YOUR LLAMA
Welldon
WILDWINS
W.sharvel
Wader
Waudog
Wood Trick
WONDER Lab
WOW DOLL
Wenger
Warmies
Womar
Wonder Wheels
WeeBaby
Wild Planet
Wange
Wide Haiter
West Paw
Wanpy
Winning Moves
Wahl
WEIDER
Wabafun
Woody
Wasa
WaterWipes
Whimzees
Wellness
Werthers
Wide Top Ltd
WEAN MACHINE
Wieslaw Suchanek
Weleda
Walkid
Wujiang Chuangyuan Toys
WinMax
Wellery
Waterbabies
Win Goal
Werkhaus
WANGS WORLD GROUP LIMITED
White Whale
WLToys
WINNER
Winnie the Pooh
WL TOYS
WestPaw
WOBALO
WELLMED
Wisenet
WPL
WERE we care
WINSOR and NEWTON
Wild Republic
WOWBOTTLES
White Shark Divers
Wellroom
Woodkit
Winner Toys
Welly
Wonderworld
Winfat
Worx Toys
Wind
White Heart Toys
Wild Pack
Wrebbit
WikiZoo
Word Winder
WB Interactive
Weichao
Well Take
Wehncke
Wargaming
Weina
Wow
X-SHOT 
X-Lander
XPV
Xionghai Toys Factory
X-Бластер
Xtreme Bike
XDrive
XQ
Xbox
x
YokoSun
YCOO
YOOHOO
Yume
yeyebaby
YOULALA
Yasini Toys
YUMMM COOKERY
YoYoFactory
Yatoya
Yelli Kids
YTRO
Yellies
Yako Toys
YIWU ZHOUSIMA
YORIKI
Yashinomi_baby
Yamasa
Y-plus
YOKAI WATCH
YONGKANG CHAOSHUAI ARTS&CRAFTS
YG Sport
YWOW GAMES
Yancheng Baby
Yookidoo
Yo kids
Yo
You&me
Yaki
YK-Plastics
Your World
Zapf Creation
Zebratoys
Zuru
Zebrа
ZLATEK
Zuru 5 surprise
ZERO
ZAZU
Zipit
ZAFFIRO
Zabota2
Zoops
Zolux
Zibos
Zoomer Lollipets
Zilmer
Zoetis
Zormaer
Ziver
Zabiaka
ZEBRA
ZOOB
Zewa
Zoo One
Zauber
Zettek
Zhorya
ZACHEM
Zest
Zoo Express
Z Wind Ups
Zogoflex
Zupo Crafts
ZerO-99
Zatochito
ZENDEN teens
ZENDEN first
ZAKKA
Zing
Zanzoon
ZZ Toys Limited
Zoopy
ZINC
Агуша
Азбукварик
АСТ
Айрис ПРЕСС
Апрель
АЛЬЯНС
Аэлита
Армия России
Альтернатива
Алфавит
Аутфорс
Аленка
АГМ
Алтай-Селигор
АльфаТойс
Акваняня
АБРИКО
Алатойс
Абрау Джуниор
Арктика
Академия Холдинг
АВЗ
Асна
Аквалор
Астрафарм
АРТ Дизайн М
Асепта
А.К.А.
АКВА AirMore
Альпийские луга
Антицарапки
Архызик
АЙДА ГУЛЯТЬ
Альфасорб
АД минус
АВАНТАЖ
Аваль-трейд
Астрель
Авангард
Ам-Ам
Алмаз-Мебель
Альпина Паблишер
Алматыкiтап
АЛИСА
Альфа пластик
Аписан
Ай-да гулять
Агроветзащита
Ася
Аква меню
Алезан
Аленка любит
АЛЬФА-ЮГ
Апоквел
Аптус
Актимель
Аруна
АСТРЕЛЬ
Армавирская Биофабрика
Абис Органик
Аклен
Аквион
Автоград
Артроверон
Алтей
Алфея
АлтайФлора
Атон Мебель
Арт Базар
Астрон
Аванта
Алкой
Агу-Агу
Афалина
Академия Групп
Биокор
Бибиколь
Бабушкино лукошко
Бельмарко
Бак-Сет
Беллакт
Борисоглебский трикотаж
Бэбилита
Белоснежка
Барни
Белый слон
Бюрократ
База Игрушек
Белтея
Биоконтур
Благомакс
Барсик
Беби Ситтер
Барбоски
Биоцентр Чин
Благомин
Богородское
Берёж
Биокей
Баланс калорий
Бионокс
Большой Слон
Белый уголь
Биотех
Бон Пари
Буратино
Банда умников
Бифистим
БАРС
Бабушкин сироп
Баланс долголетия
Бонди Бегемотик
Белка и Стрелка
Батик
Барьер
Биоподушка
Бэтмен против Супермена
Бифидумбактерин
Бификроха
Большая Стирка
Брис-Босфор
Блестящий Серпантин
БЕБИ-СИТТЕР
Биовакс
Боржоми
Бравекто
Буба
Буква-ленд
Биафишенол
БИПЛАНТ
Белорусский лён
Бумбарам
Будь здоров
Бескровная Елена Анатольевна
Би Джи
Белоомутская Фабрика
Белфайн
Витоша
ВитаМишки
Весна
Веселый малыш
Василек
Веселая затея
Веселый ветер
Витамир
Волшебная мастерская
Виталфарм
Винни
Властелин небес
Вспыш
Вырасти меня
ВирусаNET
Вит-Фит
Волжская мебельная фабрика
Веторон
Ветер в травах
Великий кот
Волшебные фокусы
Волшебный песок
Вельгийская бумажная фабрика
Витамин Д3 Максимум
Ветзвероцентр
Висспер
Ветом
Варежка
Врумиз
ВИТА
Время приключений
Весёлые паровозики из Чаггингтона
Владис
Вкуснотеево
Вишнёвый Папа
Вкусная помощь
ВИТАКАР
Верже ИД
Временный брэнд
Вельс
Веселый праздник
ВЕЛОБАЛТ
ВЕЛОМОТОЗАВОД ЯНТАРЬ
ВАКА
Ветзверторг
Вush baby World
Вангард
Вазотоп
Витэкс
Верное средство
Выгодно
Виардо Форте
Владспортпром
Вечернее
Вальс цветов
Великий Пес
ВЫСОКО
Вкусняшки для умняшки
Варенье из шишек
Вистерра
Вешалки.бел
Вако
Вакоша
Важности
Волшебный снег
ВИГВАМиЯ
Воткинск
Витус
Виком
Волшебный Городок
Ведрусс
Властелин дорог
Веселое путешествие
Вираж-Спорт
Войтович
Гандылян
Гамма
Город мастеров
Гонки
Гадкий Я
Гематоша
Гжель
ГербаСтресс
ГудСлип
Грызлик Ам
ГАСТРАРЕКС
Гельминтал
ГЕОДОМ
Городок
Головоломки
Город игр
Гудмэн
Гранд
ГринПласт
Говорящий Том
Грунити
Гелакан
Гама-Маркет
Гриповита имуно
Гоша
ГОСТЕВ ПВ
Гистан
Глицин-ВИС
Гематогенка
Герои света
Грин Пласт
Галантерейщик
Десятое королевство
Дрофа-Медиа
Детский Скороход
Домашки
Детримакс Беби
Детримакс 2000
Деревенские лакомства
Дюна
Деревяшки
Детримакс 1000
Делай с мамой
Дары Памира
Древо Игр
Детримакс Актив
Доброзверики
Диа-Веста
Ди Эм Би
Дельфин
Детский мир
Девилон
Джели
Дракоша
Добрый
ДуRашки
ДИ ЭМ БИ МАРКЕТ
ДЭТА
Доктор перец
Данон
Драконы
ДЕКОРЕТТО
Для Малышей
Дизайнер улиц 
Дикие Скричеры
Дворики
Дарелл
Доктор Зоо
Досенька
Дары Кубани
Дефенсор
Дюфалайт
Дехинел
ДермаКлиник
Дыши
Даджет
Детское Время
Даниловская мануфактура
Древо жизни
Диаркан
Домашний погребок
ДомМой
Детская Вселенная
Даша Путешественница
Дэми
ДиА
для девочки
для мальчика
Ермошка
Еду-Еду
ЕЛАМЕД
Егор Иваныч
Ехидна
Еда На Да
Ешь здорОво
Еватекс
Емельянъ Савостинъ
Едим с пользой
Жирафики
Желтый кот
Живые фрукты
Жидкий уголь
Звезда
Зоогурман
Знаток
Здоровые детки
Зооник
Зеленика
Зоомир
Зверье мое
Зооэкспресс
Зубочистики
Здравландия
Здоровый сон
Звездочка
Здоровые сладости
Затейники
Здрайверы
Золотой Стандарт
Заботливые мишки
ЗАО АГАТ
ЗОНТ
Запорожец
ЗМ
Здравладния
Здоровые вкусы
Золотой Шелк
Задира
Золотой Гусь
Играем вместе
Изготовитель
Играпол
Издательский Дом Мещерякова
ИнтерХит
ИГРАМАМА
Издательство Речь
Издательство Карьера Пресс
ИП Григорьев
ИНАЧЕ
Издательство Детская литература
Издательство Энас-книга
Иванко
Инсектал
Имбирэль
Интеса
Издательский Дом Юлии Фишер
ИНТЕКС
ИОН
ИД Мещерякова
ИВАШКА
ИП Рыбачков Д.Н.
Интерспортгруп
ИП Андреева
Имаджинариум
КЛЕVЕР
КНОПА
Красная Звезда (Можга)
Кошечки-собачки
КотМарКот
Карапуз
Курносики
Котофей
Капризун
Конёк Горбунёк
Космический песок
Когда Я вырасту
КАЛЯКА МАЛЯКА
Капитошка
Крем Детский
КукЛяКук
Котовск
Карамелли
Крошка Я
Космос Наш
Красный Октябрь
Капитошкa
Куби дуби
Колорит
Классики Детства
Квадрат-С
Карнавалия
Кусалочка
КидВит
Кузя
Кря-Кря
КПК
Комсомольская правда
КАНЦ-ЭКСМО
Конфитрейд
Кудесан
Косточка
Крымская Здравница
Качели
КоэнзимQ10
Кенгуру
Креатто
Крымская Стевия
КОМАРОФФ
Компонент
Карбохит
Комета Плюс
Крафт Фудс Рус
Конфаэль
Конфэшн
Конти
Коркунов
КАНЦ-ЭКСМО
КПМ
Концепт Груп
Каррас
Кузя Лакомкин
Красавица и Чудовище
КРИСТАЛЛ
Кристмас
Корнетто
КРЕСЛО М
КомпасГид ИД
Куби-Дуби
Казик
Коняша
Картонный папа
Колбаскин и Мышель
Книгарь
КОВРОВ
КРОХА
Котяра
Консуни
Капля Радуги
Кругозор
Конвения
Канинсулин
Ковинан
Каприз
Купалинка
Кармолис
Карнавалия Чудес
Карнитон
Карнавалофф
КАЛАМИН
Кыштымский трикотаж
КОНТАКТ
Красота в деталях
Клювонос
Калина
Котовские неваляшки
КОМФ-ОРТ
Краснокамская игрушка
Кубаньлесстрой
Клинцы
Крибли Бу
КЗПК
Лапушка
Луч
ЛЕЛЬ
Ла-Кри
Лакомства для здоровья
Липляндия
Леовит
Лакомка
ЛАЙКИ
Луняша
Лапочка
Лена
Лабиринт
ЛЕККЕР
Лесная Диковинка
Лео и Тиг
Лактобаланс
ЛИТО
Лялечка
ЛЕСОВИЧОК
Лактамил
Летний дождь
Ливена
Ладиваль
ЛитТерра
Любимые игрушки
Ложка в ладошке
Липуня
Липецкий Бювет
Лидинг
Логопринт
Лайна
ЛинАква
Леди Баг и Супер Кот
Летофарм
Люми-Зуми
Лапландия
Лебедянский
Лего Аксессуары
Моя Горошинка
Малютка
Мозаика-Синтез
Мульти-Пульти
Малышарики
Махаон
Моё солнышко
Мелонс
МДИ
Малыш
Мир Детства
Мой питомец
Мамуляндия
Мировые тетради
Ми-ми-мишки
Морозко
Мякиши
Милая леди
Маша и Медведь
Магеллан
Мамино Счастье
Мамин Дом
Мнямс
МАГНИКОН
Манюня
Модный Шопинг
Море чудес
Ментос
Мамако
Мой утенок
Мараленок
Малышок
Михайлов
МАЛЕНЬКАЯ ФЕЯ
Мясли
Московская ореховая компания
Мир здоровья
Мишка Кострома
Мегамонстры
Мультибронх
Мексидол-вет
МИНИ-МАЭСТРО
Маэстро
Микро-Плюс
Модница
Менсе
Мастер игрушек
МолиПанц
Мармелад
МАГ 2000
Миромакс
МосУпак
Мой Ангел
Миньоны
Мир игрушки
Малоежка
Мозаика Синтез
МАГНАТ
МАХ
Мамба
Мир пластмассы
Мастер Карло
МЕТЕОР
МАЛЫШИ
Мистер Фреш
Мишкино счастье
Маленькое счастье
Марфлоксин
Милпразон
Мара
Медитэр
Морозпродукт
Мелиген
МОСКОВСКИЙ КОМБИНАТ ИГРУШКИ
Март
МGP
Милая Мелл
Мультидом
Модный кролик
Мудрость народная
Мультозвуки
Мироша
МАЛАВИТ
Маленькая Страна
Мой уютный домик
Малыш и Листик
Мамина радость
Мама Шила
Монополия
Мегабайк
Мстители
Мона Лиза
Маленькие мы
Мама и Я
Нордпласт
Наша Мама
Ника
НутриМа
Непоседа
Нескучные игры
Не один дома
Наш автопром
Наша Марка
Ночной охотник
Ноотроп
НаследникЪ Выжанова
Новый формат
Нетеряшки
Новаторы
Нордик
Новый жемчуг
НД Плэй
Нежный возраст
НЕМО
Ну погоди!
Непоседa
Народная аптека
Нобивак
НАЙТВЕЛЛ
Научные развлечения
Нормотим
НИТ
Невская косметика
Нутритек
Олимпик
Отривин
Орто Пазл
Осьминожка
Ортодон
Огонек
Оргтиум
ОТК
ОлЛайт
Омеганол
Орео
ОС Гель
Орвис
Одним прекрасным утром
Орбит
Облачко
Оранжевый слон
Октопус
ОНТЕКС
Омега Нео
ОМКК
Отоксолан
Оптиммун
Островидки
ОмЗЭТ
ОРТОСИЛА
Орион
Оникс
Оригами
Олимпик-Спорт
Полесье
Пластишка
Пелигрин
Полимербыт
Принцесса
ПИТЕР
Полиен
Полиграф Принт
Проф-Пресс
Протекс
Пластмастер
Пеликан
ПМДК
ПП
Правила Успеха
ПК Лидер
Престиж
Потешка
ПроПорция
Проспер-7
Прегнотон Мама
Погрызухин
Пастилата
Полиграфика
Простое искусство/Easy Art
ПУФФИ
Пиромания
Полипакс
Пазитифчик
Премьер игрушка
Последний богатырь
Простоквашино
Промтекс
Первый снег
ПромТранс
Президент
Поварёнок
Пфайзер
ПРИНТ СЕРВИС
ПЛЮША
Паладинка
Посатекс
Пелёнкино
Полиграфкомбинат
Павлинка
Прегнотон
Поливеркан
Польза есть
Пензенские Кленоварни
Пропеллер
Поморин
Природный элемент
Плейдорадо
Пчелка Майя
Пома
Пантенол
Прогулки с динозаврами
Поезд динозавров
Правильные Игры
Парижская Коммуна
Росмэн
Рыжий кот
Русский стиль
РБ Единорожная Кошка
Росигрушка
Растемка
Родные корма
Рототайка
Рыжий кот Одежда
Радуга
РАВ
Родные места
Ривиера
Расти Большой
Радостин
Рославльская игрушка
Радужки
Речь
Русскарт
РАНОК
РОССИЯ
Растишка
Рио
Рольф Клуб
Русский
Русская игрушка
Раптор
Римадил
Рикарфа
Ромика
Рыжик
Руссаль
Руки помыл
Рантис
Рыбный жир
Речицкий текстиль
Росита
Рэлсиб
Ромашково
РЗМИ
Раскрась и подари
РУЗ Ко
РСН Новгород
Русские продукты
Рузик
Сады Придонья
Стиль жизни
Страна Здравландия
СКВ
Сказочный патруль
Солнце и луна
СПОРТБЭБИ
СовенокЯ
Совенок Дона
Седьмое Небо
Святой Источник
Свинка Пеппа
СВОБОДА
Спаленка
Стрекоза
СЕПТИМА
Степ Пазл
Семушка
Спелёнок
Сибирская кошка
Смешарики
Споки Ноки
Слайм Стекло
Сиб-КруК
Союз
Смолтойс
Снегирь
Сын полка
Счастливые лапки
СТАММ
СМАРТ КЕМИКАЛ
Спейс
Строим вместе счастливое детство
СКФ
СЛАЙМ ТАЙМ
СПЕКТР
Склад уникальных товаров
Солемакс Нейро
Силма
СТАРТ
Стеллар
Сладкий Мир
СТРОМ
СексКонтроль
Сами с усами
Сибуки
Смоленская Чулочная Фабрика
Смоленские фенечки
СМАЙЛЫ
София Прекрасная
Солнечный город
С-Трейд
СПС (Омск) - РС
Сказачное шампанетто
Сказочное шампанетто
СТРЕЛА
СПОРТЗАВОД
САПСАН
Самолеты
Сева
Си Си Кэт
СОРСО-СТР
Сочный фрукт
Свiтанак
СПЛЮША
Серения
Симпарика
Синулокс
Стронгхолд
Силео
Сонца
Сандэй
Сладкая сказка
СавостинЪ
Серебряное сияние
Септима Plus
Спермактин
Сонник
Сперотон
София
Страна карнавалия
СЫКТЫВКАР
САМОДЕЛКИН
Синий трактор
Сладень
Сочный перекус
Севавит
СОиК
СНЕКИ №1
Счастье внутри
Солнышко Арт
Символик
Судокрем
Спивакъ
Сташевское
Серафима
Счастливая малинка
Сибирская клетчатка
Сotico
Сочи 2014
Спортпродукт
Союзмультфильм
Санимобиль
Совтехстром
Смена
Стражи галактики
Снегурочка
Степ пазл
Свитерелла
Столичные штучки
Снег
Тачки
Тайная жизнь домашних животных
Тёма
ТОБОТ
Трансформеры
Технопарк
Томик
Три кота
Тутси
ТПЗ
Технодрайв
Тишин папа
Твой Стиль
Трапеза
ТИК-ТАК
Травинка-Витаминка
Теремок
Талисмед
Технолог
Тролли
ТетраПром
ТОП-ТОП
ТИМСОН
ТЕО
Три Богатыря
Текст
ТПК Группа Товарищей
ТСУЕН ШИНГ
ТРИКОТАЖ ПЛЮС
Топфер
Телазол
Трококсил
Тролли. Мировой тур
Театр теней Истории Гарри
ТСЗ
ТСО
Технок
Турбо Детки
Твой Мир
ТилиБом
То да Сё
Томь-сервис
Твинки
Топотушки
УМка
Умкa
Умница
Умные игры
Умная Рукодельница
Умные сладости
Уютный дом
Умница (книги)
Унипласт
Ути Пути
Уют
Умные Конфеты
Ути Пyти
Умная бумага
Умный чемоданчик
Уси Пуси
Ушастый нянь
Уфимский трикотаж
ФрутоНяня
Фея
Филипок
ФЭСТ
Феникс Премьер
Феникс Презент
Фантазер
Феникс +
Феникс
Фруттелла
Фруктовая Энергия
Фитомуцил
Формула здоровья
Фиксики
Флотилия
Фармакс
Фабрика упаковки
Фабрика театральной косметики
Фитобаланс
Фрутолакс
Фитодок
Фабрика Здоровых Продуктов
Ферреро
ФИТО ФРУТ
Форсаж
ФИКСИКИ (маланькое счастье)
Фиеста
ФАКТОРИЯ
ФРУТИЛАД
Фан Китс
Фруттис
Фармавит Нео
Фитоэлита
Фитомины
Футон
Фрумка
Фелоцел
Фиприст
Фреш Тойз
Фрудоза
ФулФлекс
Фарм групп
Финиксы
Фееринки
Фокус
Фабрика Фантазий
Флексика
ФОТОН мультфонарик
Фотoн
Философия Сна
Фельдшер
Фармакор Продакшн
Форма
ФрутоKids
Филипок и Ко
Фотон
ФОКС
ХэппиДом
Хоммик
Хит-Трейд
Хелвет
Хрумка Лакомка
Химола
Хлопковый Край
ХАТБЕР
Хороший Динозавр
Халеда
Хорошая история
Харвест
Холодное сердце
Холодное сердце II
ХОХЛОМА
Хигиеника
Царь елка
Цеосан
Царевщино
Цветущий Луг
ЦИКЛ
Цистениум
Царский пряник
Цамакс
Цветной
Цветик
Цитромикс
ЦСТ
Чудо-Кроха
Четвероногий Гурман
ЧУПА ЧУПС
Чудо-творчество
ЧАПАЕВ
Чистые лапки
Чистаун
Час Потехи
Чистый хвост
Чистотел
ЧУДДИКИ
Черноголовка
Четыре с хвостиком
Чипа
Чудо детки
Чипита
Чудо-Чадо
Чистые ручки
Чудо
Школьная Книга
Штучки к которым тянутся ручки
Школа Талантов
Шеф-кондитер
Шустрик
Школа будущего
ШВЕТЕКС
Шишкин лес
ШвейОптТорг
Школа Семи Гномов
Шкода
Шампусёнок
ШпионоМания
Щенячий патруль
Эксмо
Эвалар
Эгмонт
Эскимо
Эдельвейс
Эмили
Экко Плюс
ЭКОНОМ Smart
Эконова
Экофермер
Эврики
Экивоки
Экстракт-ВИС
Эластик
ЭДИ
Экзо
Этрол
ЭКСМО-ПРЕСС
ЭФСИ СПОРТ
Экопром
ЭКСПЕРИМЕНТАРИУМ
Экономикус
Экоцид
Энроксил
ЭкоПродукт
Эвисент
Этель
Экономь и Я
ЭРА
ЭКОТЕКС
Элис
Юг-Пласт
ЮБИЛЕЙНОЕ
ЮТОН
Юничел
Юниор
ЯиГрушка
Яндекс
Я РОДИЛСЯ
Якимок
Янсен
Я Самая
Яркое Творчество
Я САМ
Я конструктор
Яркий праздник
Яблоков
Я-художник
Ёбатон`
var countrys = 
`
Австрия
Австрии
Австрию
Австрией
Албания
Албании
Албанию
Албанией
Андорра
Андорры
Андорре
Андорру
Андоррой
Белоруссия
Белоруссии
Белоруссию
Белоруссией
Бельгия
Бельгии
Бельгию
Болгария
Болгарии
Болгарию
Босния и Герцеговина
Боснии и Герцеговины
Боснии и Герцеговине
Боснию и Герцеговину
Ватикан
Ватикана
Ватикану
Ватикан
Великобритания
Великобритании
Великобритании
Венгрия
Венгрии
Венгрию
Германия
Германии
Германию
Греция
Греции
Грецию
Дания
Дании
Данию
Исландия
Исландии
Исландию
Испания
Испании
Испанию
Италия
Италии
Италию
Латвия
Латвии
Латвию
Литва
Литвы
Литве
Литву
Нидерланды
Нидерландов
Нидерландам
Нидерланды
Нидерландах
Норвегия
Норвегии
Норвегию
Польша
Польши
Польше
Польшу
Португалия
Португалии
Португалию
Португалией
Румыния
Румынии
Румынию
Украина
Украины
Украине
Финляндия
Финляндии
Финляндию
Франция
Франции
Францию
Хорватия
Хорватии
Хорватию
Черногория
Черногории
Черногорию
Чехия
Чехии
Чехию
Швейцария
Швейцарии
Швейцарию
Ирландия
Ирландии
Ирландию
Япония
Японии
Японию
Китай
Китая
Китаю
Индия
Индии
Индию
Корея
Кореи
Корею
Корее
США
Канада
Канады
Канаду
Канаде
Казахстан
Казахстана
Казахстану
`
var colors = [
    'розовый','розового','розовому','розовым','розовом','розовые','розовых','розовыми','розовая','розовой','розовую','розовое',
    'черный','черного','черному','черным','черном','черные','черных','черными','черная','черной','черную','черное',
    'белый','белого','белому','белым','белом','белые','белых','белыми','белых','белая','белое','белой','белую',
    'синий','синего','синему','синим','синем','синие','синих','синяя','синими','синей','синюю','синее',
    'желтый','желтого','желтому','желтом','желтые','желтых','желтыми','желтая','желтой','желтую','желтое',
    'красный','красного','красному','красном','красные','красных','красным','красными','красная','красной','красную','красной','красное',
    'зеленый','зеленого','зеленое','зеленому','зеленом','зеленые','зеленых','зеленым','зелеными','зеленая','зеленой','зеленую',
    'оранжевый','оранжевое','оранжевого','оранжевому','оранжевом','оранжевые','оранжевых','оранжевым','оранжевыми','оранжевая','оранжевой','оранжевую',
    'фиолетовый','фиолетовое','фиолетового','фиолетовому','фиолетовым','фиолетовом','фиолетовые','фиолетовых','фиолетовыми','фиолетовая','фиолетовой','фиолетовую',
    'серый','серое','серого','серому','серым','сером','серые','серых','серыми','серая','серой','серую',
    'голубой','голубого','голубое','голубому','голубым','голубом','голубые','голубых','голубыми','голубая','голубую','голубой',
    
    'Розовый','Розового','Розовому','Розовым','Розовом','Розовые','Розовых','Розовыми','Розовая','Розовой','Розовую','Розовое',
    'Черный','Черного','Черному','Черным','Черном','Черные','Черных','Черными','Черная','Черной','Черную','Черное',
    'Белый','Белого','Белому','Белым','Белом','Белые','Белых','Белыми','Белых','Белая','Белое','Белой','Белую',
    'Синий','Синего','Синему','Синим','Синем','Синие','Синих','Синяя','Синими','Синей','Синюю','Синее',
    'Желтый','Желтого','Желтому','Желтом','Желтые','Желтых','Желтыми','Желтая','Желтой','Желтую','Желтое',
    'Красный','Красного','Красному','Красном','Красные','Красных','Красным','Красными','Красная','Красной','Красную','Красной','Красное',
    'Зеленый','Зеленого','Зеленое','Зеленому','Зеленом','Зеленые','Зеленых','Зеленым','Зелеными','Зеленая','Зеленой','Зеленую',
    'Оранжевый','Оранжевое','Оранжевого','Оранжевому','Оранжевом','Оранжевые','Оранжевых','Оранжевым','Оранжевыми','Оранжевая','Оранжевой','Оранжевую',
    'Фиолетовый','Фиолетовое','Фиолетового','Фиолетовому','Фиолетовым','Фиолетовом','Фиолетовые','Фиолетовых','Фиолетовыми','Фиолетовая','Фиолетовой','Фиолетовую',
    'Серый','Серое','Серого','Серому','Серым','Сером','Серые','Серых','Серыми','Серая','Серой','Серую',
    'Голубой','Голубого','Голубое','Голубому','Голубым','Голубом','Голубые','Голубых','Голубыми','Голубая','Голубую','Голубой'
]
var ages = [
    '1-го', '2-х', '3-х', '4-х', '5-ти', '6-ти', '7-ми', '8-ми', '9-ти', '10-ти', '12-ти', '13-ти', '14-ти', '15-ти', '16-ти', '17-ти', '18-ти'
]
var exceptionDictionary = vv.split("\n");
var contryDictionary = countrys.split("\n");