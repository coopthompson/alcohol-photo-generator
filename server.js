const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// Hardcoded mapping of alcohol names to Imgur URLs
const alcoholImages = {
    "vodka": "https://i.imgur.com/gVgm7gt.jpg", // 1 
    "whiskey": "https://i.imgur.com/3nubMN1.jpg", //2
    "cognac": "https://i.imgur.com/hqZj1KQ.jpg", //3
    "scotch": "https://i.imgur.com/AofbDVk.jpg", //4
    "bourbon": "https://i.imgur.com/qPKiy5O.jpg", //5
    "absinthe": "https://i.imgur.com/bIueECF.jpg", //6
    "tequila": "https://i.imgur.com/BNIIKrE.jpg", //7
    "rum": "https://i.imgur.com/FNHwUZp.jpg", //8
    "vermouth": "https://i.imgur.com/3WZ0WMm.jpg", //9 
    "brandy": "https://i.imgur.com/vvFnNXc.jpg", //10
    "gin": "https://i.imgur.com/Q1WhAPK.jpg", //11
    "beer": "https://i.imgur.com/PnchNZP.jpg", //12 
    "schnapps": "https://i.imgur.com/nNAjJsW.jpg", //13
    "mezcal": "https://i.imgur.com/5V90BnO.jpg", //14
    "heineken": "https://i.imgur.com/y6846EY.jpg", //15
    "guinness": "https://i.imgur.com/3YIIc3r.jpg", //16
    "corona": "https://i.imgur.com/Ik1Bl9r.jpg", //17
    "miller": "https://i.imgur.com/90CugZx.jpg", //18
    "samuel adams": "https://i.imgur.com/1R9UwqD.jpg", //19
    "budweiser": "https://i.imgur.com/2uclRxG.jpg", //20
    "modelo": "https://i.imgur.com/OEHlw62.jpg", //21
    "coors": "https://i.imgur.com/LYrnAyY.jpg", //22
    "dos equis": "https://i.imgur.com/BFkDN6M.jpg", //23
    "pabst": "https://i.imgur.com/bU0XpAM.jpg", //24 
    "white claw": "https://i.imgur.com/jug6GNi.jpg", //25
    "cider": "https://i.imgur.com/Pu2ARmJ.png", //26
    "ipa": "https://i.imgur.com/RCDRs1m.jpg", //27
    "fireball": "https://i.imgur.com/TXuZo8Q.jpg", //28
    "smirnoff": "https://i.imgur.com/9jvHCKq.jpg", //29
    "tito's": "https://i.imgur.com/fpmKLE3.jpg", //30
    "crown royal": "https://i.imgur.com/CSWFKzM.jpg", //31
    "jack daniel's": "https://i.imgur.com/obSxonw.jpg", //32
    "bacardi": "https://i.imgur.com/6geOY5M.jpg", //33
    "captain morgan": "https://i.imgur.com/fRy9MV6.jpg", //34
    "malibu": "https://i.imgur.com/ZvWyyfe.jpg", //35
    "white wine": "https://i.imgur.com/KRmQzHJ.jpg", //36
    "red wine": "https://i.imgur.com/FHUAcXP.jpg", //37
    "champagne": "https://i.imgur.com/lJtrskC.jpg", //38
    "baileys": "https://i.imgur.com/nByoxXa.jpg", //39
    "kaluha": "https://i.imgur.com/r9huEcZ.jpg", //40
    "don julio": "https://i.imgur.com/QnQVgsa.jpg", //41
    "johnnie walker": "https://i.imgur.com/LnyUa76.jpg", //42
    "casamigos": "https://i.imgur.com/QI9EiTt.jpg", //43
    "jameson": "https://i.imgur.com/69uLQng.jpg", //44
    "grey goose": "https://i.imgur.com/rLj8Hhw.jpg", //45
    "bud light": "https://i.imgur.com/VXLur9p.jpg", //46
    "maker's mark": "https://i.imgur.com/VbvnVFN.jpg", //47
    "gordon's": "https://i.imgur.com/BszYNvB.jpg", //48
    "sake": "https://i.imgur.com/CGnMHTi.jpg", //49
    "soju": "https://i.imgur.com/G5GBZN2.jpg" //50
};

const brandAliases = {
    "vodka": [
      "absolut", "absolut vodka", "absolut Elyx", "smirnoff vodka", "smirnoff red",
      "smirnoff citrus", "ketel one", "ketel one botanical", "tito's vodka", "grey goose vodka",
      "grey goose le melon", "grey goose la poire", "belvedere", "stolichnaya", "cîroc vodka",
      "skyy vodka", "svedka vodka", "russian standard vodka", "russian standard platinum", "russian standard gold"
    ],
    "whiskey": [
      "evan williams", "evan williams black label", "irish whiskey", "canadian whiskey", "rye whiskey",
      "american whiskey", "tennessee whiskey", "old forester", "wild turkey", "jack daniel's whiskey",
      "ballantine's whiskey", "bushmills whiskey", "redbreast whiskey", "green spot whiskey", "tullamore dew whiskey",
      "clontarf whiskey", "dimple whiskey", "grant's whiskey", "old crow whiskey", "blended whiskey"
    ],
    "cognac": [
      "hennessy", "remy martin", "martell", "courvoisier", "cognac brandy",
      "camus", "frapin", "delamain", "hine cognac", "pierre ferrand",
      "meukow cognac", "bisquit cognac", "pierre cadet", "royal cognac", "vintage cognac",
      "grand cognac", "extra cognac", "fine cognac", "old cognac", "premium cognac"
    ],
    "scotch": [
      "johnnie walker scotch", "chivas regal", "the macallan", "lagavulin", "balvenie",
      "glenfiddich", "laphroaig", "scotch whisky", "highland park", "talisker",
      "ardbeg", "singleton scotch", "oban", "dewar's scotch", "cutty sark",
      "famous grouse", "old pulteney", "johnny walker", "dalmore scotch", "glengoyne"
    ],
    "bourbon": [
      "jack daniel's bourbon", "maker's mark bourbon", "wild turkey bourbon", "woodford reserve", "bulleit bourbon",
      "four roses", "evan williams bourbon", "knob creek", "elijah craig", "blanton's",
      "buffalo trace", "old grand-dad bourbon", "jim beam", "bourbon whiskey", "1792 bourbon",
      "eagle rare bourbon", "booker's bourbon", "old forester bourbon", "wild turkey 101", "weller bourbon"
    ],
    "absinthe": [
      "absinthe liquor", "la fee", "absenta", "pernod absinthe", "pauillac absinthe",
      "herve absinthe", "grand absinthe", "absinthe verte", "absinthe blanche", "absinthe de vaud",
      "antica absinthe", "absinthe tradition", "old absinthe", "absinthe myth", "artisan absinthe",
      "modern absinthe", "absinthe original", "absinthe classic", "absinthe deluxe", "absinthe premium"
    ],
    "tequila": [
      "patron tequila", "don julio tequila", "casamigos tequila", "herradura", "el jimador",
      "tequila blanco", "reposado tequila", "sauza tequila", "1800 tequila", "milagro tequila",
      "cazadores tequila", "anejo tequila", "espolon tequila", "corazon tequila", "partida tequila",
      "fortaleza tequila", "iso tequila", "extra añejo tequila", "cristalino tequila", "tejano tequila"
    ],
    "rum": [
      "bacardi rum", "captain morgan rum", "malibu rum", "spiced rum", "dark rum",
      "white rum", "aged rum", "rum liquor", "appleton rum", "diplomatico",
      "kraken rum", "plantation rum", "zacapa", "mountain goat rum", "gosling's rum",
      "corazon rum", "foursquare rum", "havana club rum", "rum agricole", "navy rum"
    ],
    "vermouth": [
      "martini vermouth", "noilly prat", "cinzano", "vermouth dry", "sweet vermouth",
      "carpano", "rosso vermouth", "bianco vermouth", "punt e mes", "dolin vermouth",
      "antica vermouth", "italian vermouth", "spanish vermouth", "french vermouth", "vermouth extra dry",
      "vermouth blanc", "vermouth extra sweet", "vintage vermouth", "classic vermouth", "modern vermouth"
    ],
    "brandy": [
      "armagnac", "calvados", "e&j brandy", "st. remy", "brandy cognac",
      "korbel brandy", "metaxa", "asbach brandy", "gardons brandy", "rey brandy",
      "traditional brandy", "vintage brandy", "old brandy", "premium brandy", "gold brandy",
      "silver brandy", "royal brandy", "classic brandy", "modern brandy", "spanish brandy",
      "port brandy"
    ],
    "gin": [
      "gordon's gin", "bombay sapphire", "tanqueray gin", "beefeater", "london dry gin",
      "cullen's gin", "seagram's gin", "monkey 47", "sipsmith", "oxford gin",
      "pontus gin", "whitley stratton gin", "hangar 1 gin", "brooklyn gin", "fin gin",
      "larios gin", "plymouth gin", "boodles gin", "beast gin", "purslane gin"
    ],
    "beer": [
      "budweiser beer", "miller beer", "coors beer", "pabst beer", "modelo beer",
      "dos equis", "corona beer", "heineken beer", "guinness beer", "bud light beer",
      "stella artois", "carlsberg", "blue moon", "hoegaarden", "samuel adams beer",
      "lagunitas", "amstel", "dos equis lager", "red stripe", "paulaner beer"
    ],
    "schnapps": [
      "jagermeister", "peach schnapps", "sour apple schnapps", "butterscotch schnapps", "cinnamon schnapps",
      "mint schnapps", "blue curaçao schnapps", "cherry schnapps", "lemon schnapps", "orange schnapps",
      "raspberry schnapps", "strawberry schnapps", "watermelon schnapps", "coffee schnapps", "hazelnut schnapps",
      "vanilla schnapps", "amaretto schnapps", "pomegranate schnapps", "apricot schnapps", "pineapple schnapps"
    ],
    "mezcal": [
      "del maguey", "montelobos", "illegal mezcal", "osuna mezcal", "el silvo mezcal",
      "pechuga mezcal", "mezcal joven", "mezcal reposado", "mezcal anejo", "mezcal espadin",
      "mezcal joven artesanal", "mezcal del diablo", "mezcal legendario", "mezcal siglo", "mezcal sacramento",
      "mezcal el rey", "mezcal zapata", "mezcal artisan", "mezcal tradicional", "mezcal premium"
    ],
    "miller": [
      "miller light", "miller lite", "miller high life", "miller genuine", "miller genuine draft",
      "miller genuine lager", "miller amber", "miller brew", "miller craft", "miller 64",
      "miller icelandic", "miller malt", "miller pilsner", "miller select", "miller extra",
      "miller original", "miller ultra", "miller classic", "miller premium", "miller non-alcoholic"
    ],
    "samuel adams": [
      "sam adams", "samuel adams beer", "samuel adams lager", "samuel adams boston lager", "samuel adams rebel",
      "samuel adams Octoberfest", "samuel adams winter lager", "samuel adams stout", "samuel adams IPA", "samuel adams saison",
      "samuel adams amber", "samuel adams ale", "samuel adams golden", "samuel adams reserve", "samuel adams old ale",
      "samuel adams pilsner", "samuel adams red ale", "samuel adams extra", "samuel adams classic", "samuel adams craft"
    ],
    "budweiser": [
      "bud", "budweis", "budweiser beer", "budweiser original", "budweiser lager",
      "budweiser light", "budweiser select", "budweiser reserve", "budweiser zero", "budweiser platinum",
      "budweiser classic", "budweiser ultra", "budweiser amber", "budweiser stout", "budweiser IPA",
      "budweiser premium", "budweiser gold", "budweiser red", "budweiser ale", "budweiser extreme",
      "budweiser super"
    ],
    "heineken": [
      "heineken lager", "heineken beer", "heineken original", "heineken light", "heineken 0.0",
      "heineken extra", "heineken premium", "heineken red", "heineken double", "heineken triple",
      "heineken strong", "heineken classic", "heineken bold", "heineken smooth", "heineken crisp",
      "heineken gold", "heineken silver", "heineken spiced", "heineken iced", "heineken brew"
    ],
    "guinness": [
      "guinness stout", "guinness beer", "guinness draught", "guinness original", "guinness extra stout",
      "guinness foreign extra stout", "guinness special stout", "guinness limited edition", "guinness premium stout", "guinness black",
      "guinness double stout", "guinness triple stout", "guinness irish stout", "guinness classic", "guinness robust",
      "guinness elite", "guinness bold", "guinness vintage stout", "guinness extra", "guinness reserve"
    ],
    "corona": [
      "corona extra", "corona lager", "corona beer", "corona extra lager", "corona extra beer",
      "corona light", "corona clara", "corona premium", "corona original", "corona zero",
      "corona amber", "corona gold", "corona silver", "corona classic", "corona nova",
      "corona extra strong", "corona ultra", "corona fiesta", "corona especial", "corona rebel"
    ],
    "white claw": [
      "white claw hard seltzer", "white claw seltzer", "white claw zero", "white claw black", "white claw wild",
      "white claw berry", "white claw lime", "white claw raspberry", "white claw grapefruit", "white claw mango",
      "white claw cranberry", "white claw pineapple", "white claw peach", "white claw pomegranate", "white claw strawberry",
      "white claw watermelon", "white claw tropical", "white claw original", "white claw extra", "white claw plus"
    ],
    "cider": [
      "hard cider", "cider beer", "apple cider", "strong cider", "pear cider",
      "english cider", "craft cider", "organic cider", "dry cider", "sweet cider",
      "sparkling cider", "golden cider", "vintage cider", "local cider", "premium cider",
      "gluten-free cider", "fresh cider", "wild cider", "traditional cider", "artisanal cider"
    ],
    "ipa": [
      "india pale ale", "ipa beer", "session ipa", "double ipa", "imperial ipa",
      "west coast ipa", "east coast ipa", "new england ipa", "hazy ipa", "juicy ipa",
      "balanced ipa", "citrus ipa", "tropical ipa", "robust ipa", "pale ipa",
      "amber ipa", "blonde ipa", "golden ipa", "artisanal ipa", "limited edition ipa"
    ],
    "fireball": [
      "fireball cinnamon whiskey", "fireball whisky", "fireball cinnamon", "fireball spicy cinnamon", "fireball original",
      "fireball extra", "fireball shot", "fireball mini", "fireball smooth", "fireball intense",
      "fireball bold", "fireball flavored", "fireball red", "fireball hot", "fireball ice",
      "fireball spice", "fireball wild", "fireball premium", "fireball classic", "fireball ultimate"
    ],
    "smirnoff": [
      "smirnoff vodka", "smirnoff ice", "smirnoff flavored vodka", "smirnoff red", "smirnoff blue",
      "smirnoff citrus", "smirnoff cranberry", "smirnoff vanilla", "smirnoff peach", "smirnoff raspberry",
      "smirnoff strawberry", "smirnoff cucumber", "smirnoff mint", "smirnoff lemon", "smirnoff lime",
      "smirnoff classic", "smirnoff extra", "smirnoff platinum", "smirnoff pure", "smirnoff ultra"
    ],
    "tito's": [
      "tito's vodka", "titos", "tito's handmade vodka", "tito's original", "tito's silver",
      "tito's platinum", "tito's craft", "tito's premium", "tito's clear", "tito's distilled",
      "tito's authentic", "tito's classic", "tito's extra", "tito's pure", "tito's flavored",
      "tito's red", "tito's blue", "tito's light", "tito's gold", "tito's signature"
    ],
    "crown royal": [
      "crown royal whisky", "crown royal canadian whisky", "crown royal reserve", "crown royal original", "crown royal black",
      "crown royal platinum", "crown royal smooth", "crown royal aged", "crown royal deluxe", "crown royal special",
      "crown royal limited", "crown royal extra", "crown royal premium", "crown royal signature", "crown royal classic",
      "crown royal gold", "crown royal silver", "crown royal bold", "crown royal ultra", "crown royal elite"
    ],
    "jack daniel's": [
      "jack daniels", "jack daniel", "jd", "jack daniel's old no. 7", "jack daniel's whiskey",
      "jack daniel's classic", "jack daniel's silver", "jack daniel's black", "jack daniel's reserve", "jack daniel's barrel",
      "jack daniel's premium", "jack daniel's smooth", "jack daniel's aged", "jack daniel's vintage", "jack daniel's signature",
      "jack daniel's bold", "jack daniel's extra", "jack daniel's original", "jack daniel's craft", "jack daniel's limited"
    ],
    "bacardi": [
      "bacardi superior", "bacardi rum", "bacardi gold", "bacardi white", "bacardi cocktail",
      "bacardi black", "bacardi spiced", "bacardi flavored", "bacardi platinum", "bacardi light",
      "bacardi silver", "bacardi extra", "bacardi classic", "bacardi reserve", "bacardi premium",
      "bacardi rumble", "bacardi bold", "bacardi tropical", "bacardi original", "bacardi ultra"
    ],
    "captain morgan": [
      "captain morgan spiced rum", "captain morgan rum", "captain morgan original", "captain morgan black", "captain morgan legacy",
      "captain morgan white", "captain morgan gold", "captain morgan silver", "captain morgan premium", "captain morgan limited",
      "captain morgan classic", "captain morgan 101", "captain morgan island", "captain morgan tropical", "captain morgan reserve",
      "captain morgan dark", "captain morgan smooth", "captain morgan extra", "captain morgan blue", "captain morgan bold"
    ],
    "malibu": [
      "malibu rum", "malibu coconut", "malibu original", "malibu white", "malibu light",
      "malibu gold", "malibu flavored", "malibu pineapple", "malibu mango", "malibu strawberry",
      "malibu passion", "malibu classic", "malibu premium", "malibu extra", "malibu clear",
      "malibu smooth", "malibu tropical", "malibu reserve", "malibu aged", "malibu blue"
    ],
    "white wine": [
      "dry white wine", "chardonnay", "sauvignon blanc", "pinot grigio", "white wine",
      "riesling", "viognier", "semillon", "white zinfandel", "muscadet",
      "gewurztraminer", "pinot blanc", "gruner veltliner", "fumé blanc", "soave",
      "vermentino", "albarino", "torrontés", "sancerre", "marsanne"
    ],
    "red wine": [
      "cabernet sauvignon", "merlot", "pinot noir", "red wine", "malbec",
      "syrah", "shiraz", "zinfandel", "tempranillo", "sangiovese",
      "barbera", "grenache", "mourvedre", "nebbiolo", "cabernet franc",
      "petite sirah", "rosso", "rosso blend", "old vine red", "winemaking red"
    ],
    "champagne": [
      "brut champagne", "sparkling wine", "prosecco", "champagne", "rosé champagne",
      "vintage champagne", "non-vintage champagne", "extra brut champagne", "demi-sec champagne", "blanc de blancs",
      "blanc de noirs", "cuvée", "prestige champagne", "gold champagne", "silver champagne",
      "classic champagne", "premium champagne", "rare champagne", "artisan champagne", "elegant champagne"
    ],
    "baileys": [
      "baileys irish cream", "baileys", "baileys original", "baileys cream liqueur", "baileys extra",
      "baileys chocolate", "baileys coffee", "baileys mint", "baileys vanilla", "baileys caramel",
      "baileys hazelnut", "baileys strawberry", "baileys double", "baileys rich", "baileys smooth",
      "baileys premium", "baileys classic", "baileys limited", "baileys signature", "baileys deluxe"
    ],
    "kaluha": [
      "kahlua", "coffee liqueur", "kahlua coffee", "kahlua liqueur", "kahlua original",
      "kahlua iced coffee", "kahlua chocolate", "kahlua vanilla", "kahlua mocha", "kahlua caramel",
      "kahlua dark", "kahlua cream", "kahlua flavored", "kahlua extra", "kahlua premium",
      "kahlua classic", "kahlua bold", "kahlua smooth", "kahlua rich", "kahlua signature"
    ],
    "don julio": [
      "don julio tequila", "don julio blanco", "don julio reposado", "don julio anejo", "don julio 1942",
      "don julio 70", "don julio real", "don julio extra anejo", "don julio cristalino", "don julio signature",
      "don julio limited", "don julio gold", "don julio silver", "don julio ultra", "don julio premium",
      "don julio classic", "don julio reserve", "don julio authentic", "don julio heirloom", "don julio traditional"
    ],
    "johnnie walker": [
      "john walker", "johnnie walker scotch", "walker", "johnnie walker red label", "johnnie walker black label",
      "johnnie walker blue label", "johnnie walker green label", "johnnie walker gold label", "johnnie walker platinum", "johnnie walker white label",
      "johnnie walker silver label", "johnnie walker diamond", "johnnie walker signature", "johnnie walker legacy", "johnnie walker classic",
      "johnnie walker special", "johnnie walker reserve", "johnnie walker limited", "johnnie walker extra", "johnnie walker original"
    ],
    "casamigos": [
      "casamigos tequila", "casamigos blanco", "casamigos reposado", "casamigos anejo", "casamigos silver",
      "casamigos gold", "casamigos premium", "casamigos ultra", "casamigos limited", "casamigos classic",
      "casamigos extra", "casamigos authentic", "casamigos signature", "casamigos blue", "casamigos black",
      "casamigos reserve", "casamigos original", "casamigos smooth", "casamigos bold", "casamigos craft"
    ],
    "jameson": [
      "jameson irish whiskey", "jameson", "jameson original", "jameson crested", "jameson black barrel",
      "jameson limited", "jameson reserve", "jameson small batch", "jameson signature", "jameson smooth",
      "jameson classic", "jameson premium", "jameson aged", "jameson extra", "jameson gold",
      "jameson silver", "jameson spiced", "jameson flavored", "jameson bold", "jameson ultra"
    ],
    "grey goose": [
      "grey goose vodka", "grey goose le melon", "grey goose vodka flavored", "grey goose platinum", "grey goose citron",
      "grey goose cucumber", "grey goose raspberry", "grey goose apple", "grey goose peach", "grey goose orange",
      "grey goose tropical", "grey goose classic", "grey goose premium", "grey goose ultra", "grey goose infused",
      "grey goose clear", "grey goose smooth", "grey goose original", "grey goose signature", "grey goose extra"
    ],
    "bud light": [
      "bud light beer", "budlight", "bud light original", "bud light lager", "bud light plus",
      "bud light ultra", "bud light clear", "bud light crisp", "bud light smooth", "bud light premium",
      "bud light extra", "bud light classic", "bud light bold", "bud light select", "bud light reserve",
      "bud light gold", "bud light silver", "bud light zero", "bud light spiked", "bud light extreme"
    ],
    "maker's mark": [
      "makers mark", "maker's mark bourbon", "maker's mark original", "maker's mark hand-crafted", "maker's mark premium",
      "maker's mark limited", "maker's mark reserve", "maker's mark classic", "maker's mark smooth", "maker's mark extra",
      "maker's mark bold", "maker's mark aged", "maker's mark vintage", "maker's mark authentic", "maker's mark signature",
      "maker's mark gold", "maker's mark silver", "maker's mark refined", "maker's mark ultra", "maker's mark distilled"
    ],
    "gordon's": [
      "gordon's gin", "gordons", "gordon's london dry gin", "gordon's classic gin", "gordon's premium",
      "gordon's extra dry", "gordon's signature", "gordon's original", "gordon's smooth", "gordon's reserve",
      "gordon's limited", "gordon's old fashioned", "gordon's flavored", "gordon's silver", "gordon's gold",
      "gordon's authentic", "gordon's bold", "gordon's traditional", "gordon's handcrafted", "gordon's ultra"
    ],
    "sake": [
      "japanese sake", "nihonshu", "seishu", "sake rice wine", "sake premium",
      "sake junmai", "sake ginjo", "sake daiginjo", "sake honjozo", "sake nigori",
      "sake sparkling", "sake clear", "sake traditional", "sake artisanal", "sake classic",
      "sake extra", "sake pure", "sake refined", "sake vintage", "sake authentic"
    ],
    "soju": [
      "korean soju", "soju", "soju original", "soju flavored", "soju premium",
      "soju clear", "soju smooth", "soju extra", "soju light", "soju traditional",
      "soju classic", "soju ultra", "soju authentic", "soju reserve", "soju iced",
      "soju crisp", "soju bold", "soju signature", "soju spiked", "soju natural"
    ]
};
  

function mapInputToBrand(inputName) {
    const lowerCaseInput = inputName.toLowerCase();
  
    // Check for an exact match in alcoholImages.
    if (alcoholImages[lowerCaseInput]) {
      return lowerCaseInput;
    }
  
    // Attempt alias mapping.
    for (const brand in brandAliases) {
      for (const alias of brandAliases[brand]) {
        if (lowerCaseInput.includes(alias)) {
          console.log(`Mapping "${inputName}" to "${brand}"`);
          return brand;
        }
      }
    }

    // If all else fails, check the string if a brand is included in it
    for (const brand in alcoholImages) {
        if (lowerCaseInput.includes(brand)) {
          console.log(`Mapping "${inputName}" to "${brand}" via substring match`);
          return brand;
        }
    }
}

app.get('/image', (req, res) => {
    const name = req.query.name?.toLowerCase();

    console.log(`Searching for ${name}`)

    if (!name) {
        return res.status(400).json({ error: "Missing 'name' query parameter" });
    }

    const brandKey = mapInputToBrand(name);

    if (!brandKey) {
        return res.status(404).json({ error: "Image not found for the given name" });
    }

    const imageUrl = alcoholImages[brandKey];
    if (!imageUrl) {
        return res.status(404).json({ error: "Image not found for the given name" });
    }
    
    console.log(`Returning image for ${name}`)

    res.json({ name, imageUrl });
});

app.listen(PORT, () => {
    console.log(`Alcohol Image API is running on port ${PORT}`);
});
