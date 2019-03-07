This is the README for the liftknockoff assignemnt 2. For this assignment, I made
a minor knock of version of lyft. To do this, I retrieved data by making an XMLHTTP
request. This data either consisted of a list of passengers or a list of drivers.
For this assignment, I wrote code to determine what the list consisted of (drivers
or passengers) and parsed through it to create icons for each item in the list. 
 To create and display these icons on a map, I used the Google Maps API. One aspect
of this project that didn't funciton as planed was the distance user is to the nearest
"weinermobile". I wrote an algorithm that calculated the nearerst distance, but 
I ran into an issue with trying to display the info in the info window of the user.

Citaiton:
I used code from this cite to calculate the distance between two locations:
    https://jsperf.com/haversine-salvador/8