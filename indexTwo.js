'use strict';

let key = "rssq2UAgNYGWPwg0D8F7Vq0b3rOAoNJ0EBGicObG";
let url = "https://developer.nps.gov/api/v1/parks";

const getStringQuery = (params) => {
    const items = Object.keys(params)
        .map(key => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
        });
    return items.join('&');
}

const makeListTemplate = (park) => {
    return `<li class="park-list-item">
        <a href="${park.url}"><h3>${park.fullName}</h3></a>
        <p>${park.description}</p>
    </li>`
}

const displayParks = (responseJson) => {
    console.log(responseJson.data);
    const parkList = responseJson.data;
    let fullHtml = parkList.reduce((htmlBuild, park) => {
        return htmlBuild += makeListTemplate(park);
    }, '');
    $('.search-list').html(fullHtml);
}

const runParkSearch = (states, maxResults=10, searchTerm) => {
    let params = {
        stateCode: states,
        api_key: key,
        q: searchTerm,
        limit: maxResults
    };

    let searchQuery = getStringQuery(params);
    let searchUrl = url + '?' + searchQuery;
    console.log(searchUrl);

    fetch(searchUrl)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        })
        .then(responseJson => displayParks(responseJson))
        .catch(error => "Error found");
}

const handleSubmit = () => {
    $('#park-form').on('submit', (event) => {
        event.preventDefault();
        let states = $('.state-input').val();
        let searchTerm = $('.search-input').val();
        let maxResults = $('.max-input').val();
        runParkSearch(states, maxResults, searchTerm);
    });
}

$(handleSubmit);