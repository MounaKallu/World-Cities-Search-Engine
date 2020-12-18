window.onload = () => {
    let x = window.location.search

    urlParams = undefined


        document.getElementById('submit-btn').onclick = update_comment;
    
}

update_comment = async () => {
    let id = urlParams.get('id')
    let comment = document.getElementById('update-tb').value;
    URL = `http://localhost:8081/comment/city/update/${id}?comment=encodeURIComponent(\`${comment}\`)`
    $.put(URL, (data, status) => {
        // resultHtml = ''
        // document.getElementById('update-tb').innerHTML = resultHtml;
    })
}