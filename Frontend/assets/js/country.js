window.onload = () => {
    let x = window.location.search

    urlParams = undefined
    if (x)
        urlParams = new URLSearchParams(x);

    if (urlParams && urlParams.has('name')) {
        let name = urlParams.get('name')
        get_country(name)
    }
    else {
        document.getElementById('search-btn').onclick = search_countries
    }
}

search_countries = async () => {
    text = document.getElementById('input-tb').value;

    URL = `http://localhost:8081/country/search?name=${text}`

    $.get(URL, (data, status) => {
        resultHtml = ''

        if (data.length > 0) {
            
            data.forEach(element => {
                let url = './Country.html?name=' + encodeURIComponent(`${element.country}`)
                let elementHtml = `<button onclick="document.location= '${url}'" class="resultBtn">${element.country}</button>`
                    // `<a href=${url}>${element.country}</a><br>`
                resultHtml += elementHtml
            });
            
        } 
        else {
            resultHtml = `No countries found starting with ${text}`
        }

        document.getElementById('result').innerHTML = resultHtml;

    })
}

get_country = async (name) => {
    URL = `http://localhost:8081/country?name=${name}&includeCities=true`

    $.get(URL, (data, status) => {
        resultHtml = ''
        document.getElementById('result').innerHTML = JSON.stringify(data);
        document.getElementById('country-name').innerHTML = name;
    })
        $.get(URL, (data, status) => {
        resultHtml = ''

        if (data.length > 0) {
            data.forEach(element => {
                // let elementHtml = `<a href=./City.html?id=${element._id}>${element.city}</a><br>`
                let elementHtml = `<button onclick="document.location= './City.html?id=${element._id}'" class="resultBtn">${element.city}</button>`
                resultHtml += elementHtml
            });
        }

        document.getElementById('result').innerHTML = resultHtml;
        document.getElementById('country-name').innerHTML = name;
    })
}