'use strict';

let key = "rssq2UAgNYGWPwg0D8F7Vq0b3rOAoNJ0EBGicObG";
let url = "https://developer.nps.gov/api/v1/parks";

//Query for use in the url
const queryTemplate = (params) => {
    const items = Object.keys(params)
        .map(key => {
            //Multiple inputs in single field
            if (Array.isArray(params[key])) {
                return splitStateQuery(encodeURIComponent(key), params[key]);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
        });
    return items.join('&');
}

//Split given fields and return as one string for query
const splitStateQuery = (key, states) => {
    console.log(key + " " + states);
    return states.map(state => {
        return `${key}=${state}`
    }).join('&');
}

const displayParks = (responseJson) => {
    console.log(responseJson);
    $(".search-list").empty();
    for (let i = 0; i < responseJson.data.length; i++) {
        $('.search-list').append(
            `<li><h3><a href="${responseJson.data[0].url}">${responseJson.data[i].fullName}</a></h3></li>
            <p>${responseJson.data[i].description}</p>`
        );
    }
}

const getParks = (querySearch, maxResults=10, states) => {
    //Make sure the names and order match the url requirements?
    const params = {
        stateCode: states.split(' '),
        limit: maxResults,
        q: querySearch,
        api_key: key,
    };
    const queryString = queryTemplate(params);
    const searchUrl = url + '?' + queryString;

    console.log(searchUrl);
    //testUrl for default testing; you can also just type in 'yellow' for the search input
    let testUrl = "https://developer.nps.gov/api/v1/parks?stateCode=AK&q=yellow&api_key=rssq2UAgNYGWPwg0D8F7Vq0b3rOAoNJ0EBGicObG";
    fetch(searchUrl)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
        })
        .then(responseJson => displayParks(responseJson))
        .catch(error => {
            console.log("Error occurred");
        });
}

const handleSearchButton = () => {
    $("#park-form").submit(function(event) {
        event.preventDefault();
        const search = $(".search-input").val();
        const max = $(".max-input").val();
        const states = $(".state-input").val();
        getParks(search, max, states);
    });
}

$(handleSearchButton);