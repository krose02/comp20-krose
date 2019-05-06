/*****************************************************************    
 * Filename: index.js
 * 
 * Part of: Comp20 Spring 2019 Final Project                                           
 *                                                                                                                                                                                  
 * Purpose: Server implementation for Hungrindr
 *                                                                    
 *****************************************************************/

var express = require('express')
var app =  express();
var unirest = require('unirest')
const path = require('path')
var bodyParser = require('body-parser')
const PORT = process.env.PORT || 8080

// app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'client', 'src')));

// pug views setup
app.set('views', path.join(__dirname, 'client', 'src'));
app.set('view engine', 'pug');

// GET METHOD - user inputs a list of ingredients, 
// return a list of recipes with relevant information to PUG
app.get('/results', function(request, response){
    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "X-Requested-Width")

    //Get ingredients from request body
    var ingredients = ""
    var ing_list = request.query.ings

    console.log("ing list" + ing_list)

    var i

    for(i = 0; i < ing_list.length; i++){
        ingredients+=ing_list[i]
        if(i != ing_list.length -1){
            ingredients+= ","
        }
    }

    console.log("ingredients string: " + ingredients)

    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/findByIngredients?number=10&ranking=1&ignorePantry=false&ingredients="+ingredients)
        .header("X-RapidAPI-Host", "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com")
        .header("X-RapidAPI-Key", "6e0acf1d99msh36ac8bb3356c7f2p16ced9jsnb7106465f735")
        .end(function (result) {

            var toReturn = {};
            var recipes_array = result.body
            var results = []
            var i = 0
            var j = 0
            var req_ings = []
            
            toReturn["req_ings"] = ing_list

            //iterate through recipes array to populate results array with each
            //recipe's relevant information
            for(i = 0; i < recipes_array.length; i++){
                var recipeInfo = {}
                var miss_ings = []
                var used_ings = []
                var match
        
                recipeInfo["name"] = recipes_array[i].title
                recipeInfo["id"] = recipes_array[i].id
                recipeInfo["photo"] = recipes_array[i].image

                //sub-array of used ingredients (only need name)
                for (j = 0; j < recipes_array[i].usedIngredients.length; j++) {  
                    used_ings[j] = recipes_array[i].usedIngredients[j].name
                }

                //sub-array of missing ingredients (only need name)
                for (j = 0; j < recipes_array[i].missedIngredients.length; j++) {
                    miss_ings[j] = recipes_array[i].missedIngredients[j].name
                }

                recipeInfo["miss_ings"] = miss_ings
                recipeInfo["match_ings"] = used_ings
                
                //PERCENT MATCH = used ingredients / total ingredients
                match = (used_ings.length/(miss_ings.length+ used_ings.length)*100)
                match = Math.round(match)
                recipeInfo["match"] = match
                results[i] = recipeInfo

                recipeInfo["likes"] = recipes_array[i].likes
            }

            toReturn["results"] = results

            // response.send(toReturn)
            response.render("results", toReturn)
        });
});

// GET METHOD - user inputs a recipe ID (on click), 
// return information about specific recipe
app.get('/recipe', function(request, response){

    response.header("Access-Control-Allow-Origin", "*")
    response.header("Access-Control-Allow-Headers", "X-Requested-Width")
    var id = request.query.id
    var mi = request.query.mi
    if (mi === undefined) {
        mi = ['dummy'];
    }

    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/" + id + "/information?includeNutrition=true")
    .header("X-RapidAPI-Key", "6e0acf1d99msh36ac8bb3356c7f2p16ced9jsnb7106465f735")
    .end(function (result) {

        //Looking at the wireframe these are the attributes that we want to render as HTML
        // var recipe_name = result.body.title
        // var URL = result.body.sourceUrl
        // var source = result.body.sourceName
        // var likes = result.body.aggregateLikes
        // var imageURL = result.body.imageURL
        // var servings = result.body.servings
        // var cookTime = result.body.readyInMinutes
        // var instructions = result.body.instructions

        //This makes each sentence of the instruction a different array element
        // instructions = instructions.match( /[^\.!\?]+[\.!\?]+/g );

        // var data = {"recipe":recipe_name, "URL":URL, "source":source, "likes":likes, 
        // "image":imageURL, "servings":servings, "cookTime":cookTime, "instructions":instructions};

        var recipeRes = result.body;
        var recipeData = {
            recipe : {
                name : recipeRes.title,
                photo : recipeRes.image,
                source : recipeRes.sourceUrl,
                sourceName : recipeRes.sourceName,
                ings : [
                    {
                        ing : "",
                        miss : false
                    }
                ],
                steps : recipeRes.instructions,
                nutri_info : {
                    calories : Math.ceil(recipeRes.nutrition.nutrients[0].amount),
                    carbs : Math.ceil(recipeRes.nutrition.nutrients[3].amount),
                    fat : Math.ceil(recipeRes.nutrition.nutrients[1].amount),
                    protein : Math.ceil(recipeRes.nutrition.nutrients[7].amount)
                },
                servings : recipeRes.servings
            }
        }

        recipeRes.extendedIngredients.forEach(function(ing, i) {
            recipeData.recipe.ings[i] = {}
            recipeData.recipe.ings[i].ing = `${ing.amount} ${ing.unit} ${ing.name}`;
            recipeData.recipe.ings[i].miss = mi.includes(ing.name);
        })

        response.render('recipe', recipeData);  
    });
});

// GET /results for trying out pug
// app.get('/results', function (request, response) {
//     var toReturn = {
//         req_ings : ['bread', 'sugar', 'oil', 'flour'],
//         results: [
//             {
//                 name : 'Recipe 1',
//                 id: 123456,
//                 photo : 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
//                 source : 'taste.com',
//                 match : 90,
//                 match_ings : [
//                     'bread',
//                     'sugar',
//                     'flour'
//                 ],
//                 miss_ings: [
//                     'oil'
//                 ],
//             },
//             {
//                 name : 'Recipe 2',
//                 id: 654321,
//                 photo : 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/6/0/FN_snapchat_coachella_wingman%20.jpeg.rend.hgtvcom.616.462.suffix/1523633513292.jpeg',
//                 source : 'foodnetwork.com',
//                 match : 70,
//                 match_ings : [
//                     'bread',
//                     'oil'
//                 ],
//                 miss_ings: [
//                     'sugar',
//                     'flour'
//                 ],
//             }, {
//                 name : 'Recipe 1',
//                 id: 123456,
//                 photo : 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
//                 source : 'taste.com',
//                 match : 90,
//                 match_ings : [
//                     'bread',
//                     'sugar',
//                     'flour'
//                 ],
//                 miss_ings: [
//                     'oil'
//                 ],
//             },
//             {
//                 name : 'Recipe 2',
//                 id: 654321,
//                 photo : 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/6/0/FN_snapchat_coachella_wingman%20.jpeg.rend.hgtvcom.616.462.suffix/1523633513292.jpeg',
//                 source : 'foodnetwork.com',
//                 match : 70,
//                 match_ings : [
//                     'bread',
//                     'oil'
//                 ],
//                 miss_ings: [
//                     'sugar',
//                     'flour'
//                 ],
//             }, {
//                 name : 'Recipe 1',
//                 id: 123456,
//                 photo : 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
//                 source : 'taste.com',
//                 match : 90,
//                 match_ings : [
//                     'bread',
//                     'sugar',
//                     'flour'
//                 ],
//                 miss_ings: [
//                     'oil'
//                 ],
//             },
//             {
//                 name : 'Recipe 2',
//                 id: 654321,
//                 photo : 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/6/0/FN_snapchat_coachella_wingman%20.jpeg.rend.hgtvcom.616.462.suffix/1523633513292.jpeg',
//                 source : 'foodnetwork.com',
//                 match : 70,
//                 match_ings : [
//                     'bread',
//                     'oil'
//                 ],
//                 miss_ings: [
//                     'sugar',
//                     'flour'
//                 ],
//             }
//         ]
//     }
//     response.render("results", toReturn);
// });


// app.get('/results', function (request, response) {

//     var toReturn = {

//         req_ings : ['bread', 'sugar', 'oil', 'flour'],
//         results: [
//             {
//                 name : 'Recipe 1',
//                 id: 123456,
//                 photo : 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg',
//                 source : 'taste.com',
//                 match : 90,
//                 match_ings : [
//                     'bread',
//                     'sugar',
//                     'flour'
//                 ],
//                 miss_ings: [
//                     'oil'
//                 ],
//             },
//             {
//                 name : 'Recipe 2',
//                 id: 654321,
//                 photo : 'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2018/6/0/FN_snapchat_coachella_wingman%20.jpeg.rend.hgtvcom.616.462.suffix/1523633513292.jpeg',
//                 source : 'foodnetwork.com',
//                 match : 70,
//                 match_ings : [
//                     'bread',
//                     'oil'
//                 ],
//                 miss_ings: [
//                     'sugar',
//                     'flour'
//                 ],
//             }
//         ]
//     }
//     response.render("results", toReturn);
// });

/*
resuls render json
var toReturn{
    req_ings : [],
    results: [
        {
            name : ,
            id: ,
            photo : ,
            source : ,
            match : ,
            match-ings : [],
            miss-ings: [],
        },
        {
            name : ,
            id: ,
            photo : ,
            source : ,
            match : ,
            match-ings : [],
            miss-ings: [],
        },
        ...
    ]
}
res.render('results', toReturn);
*/
app.get('/recipe-test', function(req, res) {
    var recipeRender = {
        recipe : {
            name : "Italian Lemonade with Vodka, Gin and Orange Liqueur",
            photo : "https://spoonacular.com/recipeImages/629640-556x370.jpg",
            source : "http://www.creative-culinary.com/italian-lemonade-with-vodka-gin-and-orange-liqueur/",
            sourceName : "Creative Culinary",
            ings : [
                '0.5 oz gin',
                '4 oz lemonade',
                '0.5 oz orange liqueur',
                '0.5 oz sparkling water',
                '0.75 oz vodka'
            ],
            steps: "Fill a Collins glass with ice. Fill a shaker with ice and add everything but the soda water. Shake 10-15 times and strain it over the ice in the glass. Top with soda water and stir.Garnish with a lemon wheel.",
            nutri_info : {
                calories : 738,
                carbs : 56,
                fat : 95,
                protein: 14
            },
            servings : 4
        }
    }   
    res.render('recipe', recipeRender)
})
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))