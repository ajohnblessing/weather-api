// Create a new date instance dynamically with JS
let d = new Date();
let newTime = d.getHours() + " : " + d.getMinutes();
const newDate = d.toDateString();


/* Global Variables */
const generateKey = document.getElementById("generateKey"),
      zip = document.getElementById("zip"),
      feelings = document.querySelector("#feelings"),
      content = document.querySelector("#content"),
      temp = document.querySelector("#temp"),
      date = document.querySelector("#date"),
      city = document.querySelector("#city");


// API Variables
const primaryURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const apiKey = '&appid=8b92e3182d93e4fbe4d7dce0a48316c8&units=imperial';


//Event Listener function for the generate button
generateKey.addEventListener("click", (evt) => {
    evt.preventDefault(); //prevents the form from submitting itself and refreshing the page
    const dynamicURL = `${primaryURL}${zip.value}${apiKey}`; //url generator
    collectData(dynamicURL) //collects the data from the OpenWeatherMap API
        .then((data) => {
            collateData(data) //Callback function that extracts only the required data
                .then((info) => {
                    sendData("/add", info) //Call function that converts the data to JSON and sends it to the server
                        .then(() => {
                            retrieveData("/all") //Callback function that retrieves the data from the server
                                .then((data) => {
                                    updateInterface(data); //Updates the interface with the data asynchronously
                                });
                        });
                });
        });
});

//Async function that collects the data from the OpenWeatherMap API
const collectData = async (url) => {
    try {
        const result = await fetch(url);
        const data = await result.json();
        if (data.cod === 200) {
            return (data);
        }
    }
    catch (err) {
        console.error("Error found : " + err);
    }
}

//Async function that extracts only the required data
const collateData = async (data) => {
    await data;
    try {
        if (data) {
            const icon = data.weather[0].icon;
            const mainWeather = data.weather[0].main;
            const info = {
                date: newDate,
                time: newTime,
                feelings: feelings.value,
                temp: `${Math.round(data.main.temp)}°`,
                weather: data.weather[0].description,
                icon: icon,
                mainWeather: mainWeather,
                humidity: `${data.main.humidity}%`,
                pressure: `${data.main.pressure}pa`,
                wind: `${data.wind.deg}°`,
                name: data.name
            }
            return (info);
        }
        else {
            return data;
        };
    }
    catch (err) {
        console.error("Error found" + err);
    }
};

//Async function that converts the data to JSON and sends it to the server
const sendData = async (url = "", data = {}) => {
    try {
        const value = await fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        return value;
    }
    catch (err) {
        console.error("Error found " + err)
    }
}

//Async function that retrieves data from the server
const retrieveData = async (url) => {
    const data = await fetch(url);
    try {
        const res = await data.json();
        return res;
    }
    catch (err) {
        console.error("Error found " + err);
    }
}

//Async function that updates the browser interface with the data dynamically
const updateInterface = async (data) => {
    try {
        const response = await data;
        if (response.date) {
            const mainWeather = response.mainWeather;
            date.innerText = `${response.time} - ${response.date}`;
            temp.innerText = response.temp;
            content.innerText = response.feelings;
            city.innerText = response.name;
        } else {
            alert("Input Error!\nCheck zip code and try again...")
        }
    }
    catch (err) {
        console.error("Error : " + err);
    }
}

