const botaoRadio = document.querySelector('#botao-description-radio');
const botaoHemo = document.querySelector('#botao-description-hemo');
const botaoUltra = document.querySelector('#botao-description-ultra');

botaoRadio.addEventListener('click', function() {
    const description = document.querySelector('#description-radio');
    description.classList.toggle('display-none');
});
botaoHemo.addEventListener('click', function() {
    const description = document.querySelector('#description-hemo');
    description.classList.toggle('display-none');
});
botaoUltra.addEventListener('click', function() {
    const description = document.querySelector('#description-ultra');
    description.classList.toggle('display-none');
});

function openPopup() {
    document.getElementById("popup").style.display = "block";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}

window.onclick = function (event) {
    const popup = document.getElementById("popup");
    if (event.target == popup) {
        popup.style.display = "none";
    }
};

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    section.scrollIntoView({ behavior: 'smooth' });
}

const googleMapsAPIKey = 'AIzaSyB7AAKKeGhIshA8IU0j4-3--zP5sdqLm6Q';
const hospitalAddress = "Hospital das Clínicas da Universidade de São Paulo, São Paulo";

function initializeMap(travelMode) {
    const cacheKey = `cache_${travelMode}`;

    const cachedData = localStorage.getItem(cacheKey);

    if (cachedData) {
        const { timestamp, data } = JSON.parse(cachedData);
        if (Date.now() - timestamp < 100 * 60 * 1000) {
            return renderData(travelMode, data);
        }
    }

    navigator.geolocation.getCurrentPosition(function (position) {
        const distanceMatrixService = new google.maps.DistanceMatrixService();
        const destinations = [{ lat: -23.5577989, lng: -46.6698598 }];
        const origins = [{ lat: position.coords.latitude, lng: position.coords.longitude }]

        distanceMatrixService.getDistanceMatrix(
            {
                origins,
                destinations,
                travelMode,
            },
            function (location, status) {
                if (status === 'OK') {
                    const dataToCache = {
                        timestamp: Date.now(),
                        data: location,
                    };

                    renderData(travelMode, location);
                    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));
                } else {
                    throw new Error('Erro ao obter a matriz de distância');
                }
            }
        );
    }
    );
};


function renderData(travelMode, location) {
    const distance = location.rows[0].elements[0].distance.text;
    const duration = location.rows[0].elements[0].duration.text;
    const icon = document.querySelector(`#${travelMode.toLowerCase()}`);
    icon.onclick = null;
    icon.innerHTML = `
        <p class='localite-information transaction'>
            Distância: ${distance} <br>
            Duração: ${duration} <br>
        </p>
        <br>
        <span class='link-map transaction'>
            <a class='localite-information' href="https://www.google.com/maps/dir/?api=1&destination=${encodeURI(hospitalAddress)}&travelmode=${travelMode.toLowerCase()}" target="_blank">
                <img src="./images/map.svg" alt="Link Google Maps" />
            </a>
        </span>
        `;
}

function loadGoogleMaps(span) {
    const travelMode = span.dataset.travelMode;
    span.style.pointerEvents = "none";
    span.innerHTML = "<p class='localite-information'>Carregando...</p>";
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsAPIKey}&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = function () {
        initializeMap(travelMode);
    };
    document.head.appendChild(script);
}

