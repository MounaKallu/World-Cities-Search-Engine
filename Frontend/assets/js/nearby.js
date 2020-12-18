window.onload = () => {
    document.getElementById('search-btn').onclick = search
}

search = () => {
    lat = document.getElementById('lat-tb').value;
    lng = document.getElementById('lng-tb').value;
    maxDistance = document.getElementById('max-tb').value;
    minDistance = document.getElementById('min-tb').value;

    get_nearby(lat, lng, minDistance, maxDistance)
}

get_nearby = (lat, lng, minDistance, maxDistance) => {
    URL = `http://localhost:8081/nearby?maxDistance=${maxDistance}&minDistance=${minDistance}&lat=${lat}&lng=${lng}`

    $.get(URL, (data, status) => {
        resultHtml = ''

        if (data.length > 0) {
            data.forEach(element => {
                let elementHtml = `<button onclick="document.location= './City.html?id=${element._id}'" class="resultBtn">${element.city}</button>`
                    // `<a href=./City.html?id=${element._id}>${element.city}</a><br>`
                resultHtml += elementHtml
            });
        }
        else {
            resultHtml = `No nearby cities found.`
        }

        document.getElementById('result').innerHTML = resultHtml;
    })
}