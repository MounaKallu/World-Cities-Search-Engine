window.onload = () => {
    let x = window.location.search

    var urlParams = new URLSearchParams(x);

    // city
    if (urlParams && urlParams.has('id')) {
        let id = urlParams.get('id')
        get_city(id)
        document.getElementById('submit-btn').onclick = () => {
            add_comment(id)
        }
    }
    // city search
    else {
        document.getElementById('search-btn').onclick = search_cities;
    }
}

search_cities = async () => {
    text = document.getElementById('input-tb').value;

    URL = `http://localhost:8081/city/search?name=${text}`

    $.get(URL, (data, status) => {
        resultHtml = ''

        if (data.length > 0) {
            data.forEach(element => {
                // let elementHtml = `<a href=./City.html?id=${element._id}>${element.city}</a><br>`
                let elementHtml = `<button onclick="document.location= './City.html?id=${element._id}'" class="resultBtn">${element.city}</button>`
                resultHtml += elementHtml
            });
        }
        else {
            resultHtml = `No cities found starting with ${text}`
        }
        
        document.getElementById('result').innerHTML = resultHtml;
    })
}

get_city = async (id) => {
    URL = `http://localhost:8081/city/${id}`

    $.get(URL, (data, status) => {

        // For city search
        if (data.length > 0) {
            resultHtml = ''
            data.forEach(element => {
                // let elementHtml = `<a href=./City.html?id=${element._id}>${element.city}</a><br>`
                let elementHtml = `<button onclick="document.location= './City.html?id=${element._id}'" class="resultBtn">${element.city}</button>`
                resultHtml += elementHtml
            });

            document.getElementById('result').innerHTML = resultHtml;
        }
        // For city xyz
        else {
            document.getElementById('city-name').innerHTML = data.city;
            document.getElementById('country-name').innerHTML = data.country;
            document.getElementById('lat-val').innerHTML = data.lat;
            document.getElementById('lng-val').innerHTML = data.lng;
            document.getElementById('pop-val').innerHTML = data.population;
            document.getElementById('iso2-val').innerHTML = data.iso2;
            document.getElementById('iso3-val').innerHTML = data.iso3;
            document.getElementById('comment-val').innerHTML = JSON.stringify(data.comments);
        }

        
    })
    $.get(URL, (data, status) => {
        document.getElementById('city-name').innerHTML = data.city;
        document.getElementById('country-name').innerHTML = data.country;
        document.getElementById('lat-val').innerHTML = data.lat;
        document.getElementById('lng-val').innerHTML = data.lng;
        document.getElementById('pop-val').innerHTML = data.population;
        document.getElementById('iso2-val').innerHTML = data.iso2;
        document.getElementById('iso3-val').innerHTML = data.iso3;
        // if (data.comment != null) {
            document.getElementById('comment-val').innerHTML = JSON.stringify(data.comments);
        // }
    })
    get_nearby(id)
}

get_nearby = async (id) => {
    URL = `http://localhost:8081/nearby/${id}?maxDistance=50000`

    $.get(URL, (data, status) => {
        resultHtml = ''

        if (data.length > 0) {
            data.forEach(element => {
                let elementHtml = `<button onclick="document.location= './City.html?id=${element._id}'" class="resultBtn">${element.city}</button>`
                resultHtml += elementHtml
            });
        }
        else {
            resultHtml = `No nearby cities found.`
        }

        document.getElementById('nearby-cities-content').innerHTML = resultHtml;
    })
}



add_comment = async (id) => {
    let comment = document.getElementById('update-tb').value;

    URL = `http://localhost:8081/comment/city/update/${id}?comment=${encodeURIComponent(comment)}`

    $.ajax({
        url: URL,
        type: 'PUT',
        success: (data, status) => {
            location.reload()
        }
    });

}

