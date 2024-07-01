const searchContainer = $('.search-container');
const searchInput = $('#search');
const searchBtn = $('#city-search-btn');


function addPreviousSearch () {
    const searchVal = searchInput.val();
    
    searchContainer.append(`
        <div class="past-search">${searchVal}</div>
        `)
}


function init() {
searchBtn.on('click', addPreviousSearch);

}

init();