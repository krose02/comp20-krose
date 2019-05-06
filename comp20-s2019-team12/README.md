
# Project Cordon Bleu


## TEAM 12 ##
###Aminata Dieng###
###Kiara Rose###
###Grace Fagan###
###Keisha Mukasa###
###Daniel Jelčić###

__Problem statement:__ <br/>
Often you’ll have a bunch of different ingredients in your fridge but you don’t know what to cook.
How do you solve the problem?

We’re going to create a program that suggests tasty recipes given a user’s ingredients. The user will also be given information about what ingredients they are missing for given recipes

__Features that we’ll implement:__<br/>
* The user will list all the ingredients that they have and the app will give them recipes based on those ingredients
* The app will rank the recipes in order of the amount of ingredients they currently have to make that recipe
* After  a recipe is chosen, the app will list nutrition values for each recipe 
* The user will be able to apply filters i.e. cook time, serving size, dietary restrictions and cuisine to narrow down the type of recipes  they are looking for
For every recipe, the source of the recipe will be provided to the user (using Spoonacular API)
* User accounts (to see meal history, store current ingredients)
* Find the nearest grocery store (using Google Maps API)

__Spoonacular API:__<br/>
The purpose of this API is to provide a database of recipes for the user and match the ingredients that the user has to potential recipes that they can cook. The API includes numerous features including a filter for meals based on the user’s dietary restrictions, nutritional information and ingredient substitutes. The API can also provide the user with similar recipes to a given one.

__API features we will be using:__<br/>
* Search Recipes by Ingredients- this feature performs a “what’s in your fridge” search
* Search Recipes- searches for recipes based on user query (cuisine, dietary restrictions, etc)
* Visualize recipe nutrition
* Get recipe information- returns data from current recipe to be used for the algorithms we develop (to create a shopping list for the user)
* For fun:
* Get wine pairing
* Get random food joke

__Algorithms or special techniques__<br/>
We’re going to create algorithms that do the following:
* Rank the recipes in order of which ones include the most amount of ingredients that the user has
* Rank recipes based on user’s preferred cook time
* Generate shopping lists for all the missing ingredients a user needs to create a certain recipe
* Render location of closest grocery store

__Wireframes__<br/>
An interactive version of these wireframes can also be found using the following link:
https://xd.adobe.com/view/a74c248e-0771-4b30-51b8-bd3f2bdda157-d17d/

Landing Page<br/>
<image src = "wireframes/Landing Page.png">

Options Page<br/>
<image src = "wireframes/Options.png">

Results Page<br/>
<image src = "wireframes/Results Page.png">

Recipe Page<br/>
<image src = "wireframes/Recipe Page.png">

Shopping List Generator<br/>
<image src = "wireframes/Shopping List Generator.png">
  
# Comments by Ming
* I will tell you what I wrote to team 9: while you can do this project, this project will not score well with regards to originality (been there, done that, fall 2017)
* If your design is exactly like that in your wireframes, then go for it.  Careful when your designs look way too nice, now people will be disappointed if the real thing doesn't look like the ones in pic.  
