initialize()

function initialize() {
    const addCityButton = document.getElementById('add-city-btn')
    if (addCityButton) {
        addCityButton.addEventListener('click', addCity)
    }
    
    const addPlaceButtons = document.querySelectorAll('.add-place-btn')
    if (addPlaceButtons) {
        addPlaceButtons.forEach(element => {
            element.addEventListener('click', addPlace)
        })
    }
    
    const addDayButton = document.querySelector('.add-day-btn')
    if (addDayButton) {
        addDayButton.addEventListener('click', addDay)
    }

    const removePlaceButtons = document.querySelectorAll('.remove-place-btn')
    if (removePlaceButtons) {
        removePlaceButtons.forEach(element => {
            element.addEventListener('click', removePlace)
        })
    }

    const shareTripButtons = document.querySelectorAll('.share-trip-btn')
    if (shareTripButtons) {
        shareTripButtons.forEach(element => {
            element.addEventListener('click', addActionToShareTripForm)
        })
    }
}

function addCity(e) {
    e.preventDefault()

    const num = document.getElementsByClassName('city').length
    const container = document.createElement('div')
    const labelTag = document.createElement('label')
    const inputField = document.createElement('input')
    inputField.type = 'text'
    inputField.name = `cities[${num}][name]`
    inputField.placeholder = 'Name of city'
    inputField.classList.add('form-control', 'city')

    container.appendChild(labelTag)
    container.appendChild(inputField)

    document.querySelector('.city-container').appendChild(container)
}

function addPlace(e) {
    const dayTabContentContainer = e.target.parentElement.parentElement
    const dayNum = dayTabContentContainer.tabIndex
    const placeNum = dayTabContentContainer.children.length-1
    
    const card = document.createElement('div')
    card.classList.add('card', 'mb-3', 'mt-3', 'bg-primary', 'text-white')

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    card.appendChild(cardBody)

    // Add div and input for place to card body
    const divForPlace = document.createElement('div')
    divForPlace.classList.add('mb-1')

    const divForRemoveButton = document.createElement('div')
    divForRemoveButton.classList.add('d-flex', 'justify-content-between')

    const labelforPlace = document.createElement('label')
    labelforPlace.classList.add('form-label')
    labelforPlace.textContent = 'Place'
    divForRemoveButton.appendChild(labelforPlace)

    const removePlaceButton = document.createElement('button')
    removePlaceButton.classList.add('btn-close', 'remove-place-btn')
    removePlaceButton.type = 'button'
    removePlaceButton.setAttribute('aria-label', 'Close')
    removePlaceButton.addEventListener('click', removePlace)
    divForRemoveButton.appendChild(removePlaceButton)

    const inputForPlace = document.createElement('input')
    inputForPlace.classList.add('form-control')
    inputForPlace.type = 'text'
    inputForPlace.placeholder = 'E.g. name of the shop, area and/or city'
    inputForPlace.name = `itinerary[${dayNum}][${placeNum}][location]`
    divForPlace.appendChild(divForRemoveButton)
    divForPlace.appendChild(inputForPlace)
    cardBody.appendChild(divForPlace)

    // Add div and input for time to card body
    const divForTime = document.createElement('div')
    divForTime.classList.add('mb-1')
    const labelforTime = document.createElement('label')
    labelforTime.classList.add('form-label')
    labelforTime.textContent = 'Time'
    const inputForTime = document.createElement('input')
    inputForTime.classList.add('form-control')
    inputForTime.type = 'time'
    inputForTime.name = `itinerary[${dayNum}][${placeNum}][time]`
    divForTime.appendChild(labelforTime)
    divForTime.appendChild(inputForTime)
    cardBody.appendChild(divForTime)

    // Add div and input for note to card body
    const divForNote = document.createElement('div')
    divForNote.classList.add('mb-1')
    const labelforNote = document.createElement('label')
    labelforNote.classList.add('form-label')
    labelforNote.textContent = 'Note'
    const inputForNote = document.createElement('textarea')
    inputForNote.classList.add('form-control')
    inputForNote.rows = '3'
    inputForNote.name = `itinerary[${dayNum}][${placeNum}][note]`
    divForNote.appendChild(labelforNote)
    divForNote.appendChild(inputForNote)
    cardBody.appendChild(divForNote)

    dayTabContentContainer.insertBefore(card, e.target.parentElement)
}

function addDay(e) {
    const tripTabContainer = document.getElementById('tripTab')
    const tripTabContentContainer = document.getElementById('tripTabContent')
    const dayNum = tripTabContainer.children.length - 1
    
    // Add tab
    const newTab = document.createElement('li')
    newTab.classList.add('nav-item')
    newTab.role = 'presentation'

    const buttonForTab = document.createElement('button')
    buttonForTab.classList.add('nav-link')
    buttonForTab.type = 'button'
    buttonForTab.tabindex = '-1'
    buttonForTab.id = `day${dayNum+1}-tab`
    buttonForTab.setAttribute('data-bs-toggle', 'tab')
    buttonForTab.setAttribute('data-bs-target', `#day${dayNum+1}-tab-pane`)
    buttonForTab.setAttribute('aria-controls', `day${dayNum+1}-tab-pane`)
    buttonForTab.textContent = `Day ${dayNum+1}`
    newTab.appendChild(buttonForTab)

    tripTabContainer.insertBefore(newTab, e.target.parentElement)

    // Add tab content
    const newTabContent = document.createElement('div')
    newTabContent.classList.add('tab-pane', 'fade')
    newTabContent.role = 'tabpanel'
    newTabContent.tabIndex = dayNum
    newTabContent.id = `day${dayNum+1}-tab-pane`
    newTabContent.setAttribute('aria-labelledby', `day${dayNum+1}-tab`)

    
    const card = document.createElement('div')
    card.classList.add('card', 'mb-3', 'mt-3', 'bg-primary', 'text-white')
    newTabContent.appendChild(card)

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')
    card.appendChild(cardBody)

        // Add div and input for place to card body
    const divForPlace = document.createElement('div')
    divForPlace.classList.add('mb-1')

    const divForRemoveButton = document.createElement('div')
    divForRemoveButton.classList.add('d-flex', 'justify-content-between')

    const labelforPlace = document.createElement('label')
    labelforPlace.classList.add('form-label')
    labelforPlace.textContent = 'Place'
    divForRemoveButton.appendChild(labelforPlace)

    const removePlaceButton = document.createElement('button')
    removePlaceButton.classList.add('btn-close', 'remove-place-btn')
    removePlaceButton.type = 'button'
    removePlaceButton.setAttribute('aria-label', 'Close')
    removePlaceButton.addEventListener('click', removePlace)
    divForRemoveButton.appendChild(removePlaceButton)

    const inputForPlace = document.createElement('input')
    inputForPlace.classList.add('form-control')
    inputForPlace.type = 'text'
    inputForPlace.placeholder = 'E.g. name of the shop, area and/or city'
    inputForPlace.name = `itinerary[${dayNum}][0][location]`
    divForPlace.appendChild(divForRemoveButton)
    divForPlace.appendChild(inputForPlace)
    cardBody.appendChild(divForPlace)

        // Add div and input for time to card body
    const divForTime = document.createElement('div')
    divForTime.classList.add('mb-1')
    const labelforTime = document.createElement('label')
    labelforTime.classList.add('form-label')
    labelforTime.textContent = 'Time'
    const inputForTime = document.createElement('input')
    inputForTime.classList.add('form-control')
    inputForTime.type = 'time'
    inputForTime.name = `itinerary[${dayNum}][0][time]`
    divForTime.appendChild(labelforTime)
    divForTime.appendChild(inputForTime)
    cardBody.appendChild(divForTime)

        // Add div and input for note to card body
    const divForNote = document.createElement('div')
    divForNote.classList.add('mb-1')
    const labelforNote = document.createElement('label')
    labelforNote.classList.add('form-label')
    labelforNote.textContent = 'Note'
    const inputForNote = document.createElement('textarea')
    inputForNote.classList.add('form-control')
    inputForNote.rows = '3'
    inputForNote.name = `itinerary[${dayNum}][0][note]`
    divForNote.appendChild(labelforNote)
    divForNote.appendChild(inputForNote)
    cardBody.appendChild(divForNote)

        // Add add place button
    const divForButton = document.createElement('div')
    divForButton.classList.add('mb-3', 'd-flex', 'justify-content-end')
    newTabContent.appendChild(divForButton)

    const addPlaceButton = document.createElement('button')
    addPlaceButton.classList.add('btn', 'btn-outline-primary', 'add-place-btn')
    addPlaceButton.type = 'button'
    addPlaceButton.textContent = 'Add more place'
    addPlaceButton.addEventListener('click', addPlace)
    divForButton.appendChild(addPlaceButton)
    
    tripTabContentContainer.appendChild(newTabContent)

    // Set new tab as active
    Array.from(tripTabContainer.children).forEach((element) => {
        element.firstElementChild.classList.remove('active')
        element.firstElementChild.tabIndex = '-1'
        element.firstElementChild.removeAttribute('aria-selected')
    })

    Array.from(tripTabContentContainer.children).forEach((element) => {
        element.classList.remove('show', 'active')
    })

    buttonForTab.classList.add('active')
    buttonForTab.removeAttribute('tabIndex')
    buttonForTab.setAttribute('aria-selected', 'true')
    
    newTabContent.classList.add('show', 'active')
}

function removePlace(e) {
    const cardForPlace = e.target.parentElement.parentElement.parentElement.parentElement
    const dayTabContentContainer = cardForPlace.parentElement
    const dayNum = dayTabContentContainer.getAttribute('tabindex')

    if (dayTabContentContainer.children.length - 1 > 1) {
        cardForPlace.remove()
        Array.from(dayTabContentContainer.children).forEach((placeElement, cardIdx) => {
            if (!placeElement.classList.contains('card')) {
                return
            }
            Array.from(placeElement.children[0].children).forEach((element) => {
                const splittedFieldName = element.children[1].name.split(/[\]\[]/)
                element.children[1].name = `${splittedFieldName[0]}[${dayNum}][${cardIdx}]${splittedFieldName[splittedFieldName.length-2]}`
            })
        })
    }
}

function addActionToShareTripForm(e) {
    const shareTripForm = document.getElementById('share-trip-form')
    shareTripForm.action = e.target.parentElement.getAttribute('action')
}