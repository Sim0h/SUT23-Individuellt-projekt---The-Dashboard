
document.addEventListener('DOMContentLoaded', function() {

    function updateTimeAndDate() {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric' });
        document.querySelector('.time').textContent = time;
        document.querySelector('.date').textContent = date;
    }

    setInterval(updateTimeAndDate, 1000);
    updateTimeAndDate();


    function addRemoveLinkHandlers() {
        const removeButtons = document.querySelectorAll('.remove-link');
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const listItem = this.parentElement;
                const linkName = listItem.querySelector('a').innerText;
                const links = JSON.parse(localStorage.getItem('links')) || [];
                const updatedLinks = links.filter(link => link.name !== linkName);
                localStorage.setItem('links', JSON.stringify(updatedLinks));
                listItem.remove();
                if (quickLinks.childElementCount < 5) {
                    addLinkBtn.style.display = 'inline-block';
                }
            });
        });
    }

    addRemoveLinkHandlers();

    const addLinkBtn = document.querySelector('.add-link-btn');
    const quickLinks = document.querySelector('.quick-links');

    addLinkBtn.addEventListener('click', function() {
        if (quickLinks.childElementCount < 5) {
            const url = prompt('Ange URL för din nya länk:');
            if (url) {
                const linkName = prompt('Ange namn för din nya länk:');
                if (linkName) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${url}" target="_blank">${linkName}</a><i class="fas fa-minus-circle remove-link"></i>`;
                    quickLinks.appendChild(li);
                    addRemoveLinkHandlers();
                    if (quickLinks.childElementCount >= 5) {
                        addLinkBtn.style.display = 'none';
                    }
                    saveLinkToLocalStorage({url, name: linkName});
                } else {
                    alert('Namn för länken måste anges.');
                }
            } else {
                alert('URL för länken måste anges.');
            }
        } else {
            alert('Du kan inte lägga till fler än 5 länkar.');
        }
    });

    function saveLinkToLocalStorage(link) {
        let links = JSON.parse(localStorage.getItem('links')) || [];
        links.push(link);
        localStorage.setItem('links', JSON.stringify(links));
    }

    function loadLinksFromLocalStorage() {
        const links = JSON.parse(localStorage.getItem('links'));
        if (links) {
            quickLinks.innerHTML = '';
            links.forEach(link => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="${link.url}" target="_blank">${link.name}</a><i class="fas fa-minus-circle remove-link"></i>`;
                quickLinks.appendChild(li);
            });
            addRemoveLinkHandlers(); 
            if (quickLinks.childElementCount >= 5) {
                addLinkBtn.style.display = 'none';
            }
        }
    }
    loadLinksFromLocalStorage();
    

    // Väderdata från SMHI
    const weatherUrl = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/12.2561/lat/57.1058/data.json';

    function getWeatherData() {
        fetch(weatherUrl)
            .then(response => response.json())
            .then(data => {
                const weatherIcons = {
                    1: 'fa-sun',
                    2: 'fa-cloud-sun',
                    3: 'fa-cloud',
                    4: 'fa-cloud',
                    5: 'fa-cloud',
                    6: 'fa-smog',
                    7: 'fa-cloud-rain',
                    8: 'fa-bolt',
                    9: 'fa-cloud-rain',
                    10: 'fa-cloud-rain',
                    11: 'fa-cloud-showers-heavy',
                    12: 'fa-bolt',
                    13: 'fa-snowflake',
                    14: 'fa-snowflake',
                    15: 'fa-snowflake',
                    16: 'fa-snowflake'
                };
    
                const currentWeather = data.timeSeries[0].parameters.find(param => param.name === 'Wsymb2').values[0];
                const forecastTomorrow = data.timeSeries[13].parameters.find(param => param.name === 'Wsymb2').values[0];
                const forecastDayAfter = data.timeSeries[25].parameters.find(param => param.name === 'Wsymb2').values[0];
    
                const temperatureCurrent = data.timeSeries[0].parameters.find(param => param.name === 't').values[0] + '°C';
                const temperatureTomorrow = data.timeSeries[13].parameters.find(param => param.name === 't').values[0] + '°C';
                const temperatureDayAfter = data.timeSeries[25].parameters.find(param => param.name === 't').values[0] + '°C';
    
                const weatherIconCurrent = weatherIcons[currentWeather];
                const weatherIconTomorrow = weatherIcons[forecastTomorrow];
                const weatherIconDayAfter = weatherIcons[forecastDayAfter];
    
                document.getElementById('temperature-current').textContent = temperatureCurrent;
                document.getElementById('weather-icon-current').classList.add('fas', weatherIconCurrent);
    
                document.querySelector('.temperature-tomorrow').textContent = temperatureTomorrow;
                document.querySelector('.weather-icon-tomorrow').classList.add('fas', weatherIconTomorrow);
    
                document.querySelector('.temperature-dayafter').textContent = temperatureDayAfter;
                document.querySelector('.weather-icon-dayafter').classList.add('fas', weatherIconDayAfter);
    
                
                const today = new Date();
                
                const dayAfterTomorrow = new Date(today);
                dayAfterTomorrow.setDate(today.getDate() + 2);
                
                const weekdays = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
                const weekday = weekdays[dayAfterTomorrow.getDay()];
                
                document.querySelector('.weekday-dayafter').textContent = weekday;
    
            })
            .catch(error => {
                console.error('Error fetching weather data from SMHI:', error);
            });
    }
    
    getWeatherData();


    function saveTextToLocalStorage() {
        const text = document.getElementById('noteArea').value;
        localStorage.setItem('savedText', text);
    }
    
    document.getElementById('noteArea').addEventListener('input', saveTextToLocalStorage);
    
    loadTextFromLocalStorage();
    
    function loadTextFromLocalStorage() {
        const savedText = localStorage.getItem('savedText');
        if (savedText) {
            document.getElementById('noteArea').value = savedText;
        }
    }

    let clientID = "Ue1v2qrciapajR3O06joSwmYBAtB0NLg79Di9iI_vzI";
    let endPoint = `https://api.unsplash.com/photos/random/?client_id=${clientID}`;
    let bodyElement = document.querySelector("body");
    let imageButton = document.querySelector("#unsplashedImage");



    function setBackgroundImage() {
        fetch(endPoint) 
            .then(function (response) {
                return response.json();
            })
            .then(function (jsonData){
                bodyElement.style.backgroundImage = `url('${jsonData.urls.regular}')`;
            })
            .catch(function(error) {
                console.log('Error fetching random image:', error);
            });
    }
    imageButton.addEventListener('click', setBackgroundImage);
    setBackgroundImage();


    function fetchNewsPrograms() {
        const apiUrl = 'http://api.sr.se/api/v2/news/episodes?format=json&programid=128';
    
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                const episodes = data.episodes;
    
               
                episodes.forEach(episode => {
                    const programName = episode.program.name;
    
                    
                    if (programName === 'P4 Halland') {
                        const title = episode.title;
                        const description = episode.description;
                        const programUrl = episode.url;
    
                        const episodeElement = document.createElement('div');
                        episodeElement.innerHTML = `
                            <h4>${title}</h4>
                            <p>${description}</p>
                            <a href="${programUrl}" target="_blank">Läs mer</a>
                        `;
                        document.querySelector('.SRnews').appendChild(episodeElement);
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching news programs:', error);
            });
    }
    
    fetchNewsPrograms();
    document.addEventListener('DOMContentLoaded', fetchNewsPrograms);



});



