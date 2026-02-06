// Date despre planetele Sistemului Solar
export const planets = [
    {
        id: 'mercury',
        name: 'Mercur',
        nameEn: 'Mercury',
        order: 1,
        color: '#b5b5b5',
        orbitRadius: 80,
        size: 20,
        image: '/planet/mercur.png',
        unlocked: true,
        completed: false,
        facts: [
            'Mercur este cea mai mică planetă din Sistemul Solar',
            'O zi pe Mercur durează 59 de zile pământești',
            'Temperatura variază de la -180°C noaptea la +430°C ziua',
            'Mercur nu are sateliți și nici atmosferă'
        ],
        missionName: 'Scutul Solar',
        missionDescription: 'Protejează nava de razele solare, evitând erupțiile!'
    },
    {
        id: 'venus',
        name: 'Venus',
        nameEn: 'Venus',
        order: 2,
        color: '#e6c47a',
        orbitRadius: 110,
        size: 28,
        image: '/planet/venus.png',
        unlocked: true,
        completed: false,
        facts: [
            'Venus este cea mai fierbinte planetă (+465°C)',
            'Venus se rotește în direcția opusă',
            'O zi pe Venus este mai lungă decât un an',
            'Atmosfera este formată din nori denși de acid sulfuric'
        ],
        missionName: 'Prin nori',
        missionDescription: 'Străpunge norii denși ai Venerei!'
    },
    {
        id: 'earth',
        name: 'Pământ',
        nameEn: 'Earth',
        order: 3,
        color: '#3498db',
        orbitRadius: 145,
        size: 30,
        image: '/planet/earth.png',
        unlocked: true,
        completed: false,
        facts: [
            'Pământul este singura planetă cu apă lichidă la suprafață',
            '71% din suprafață este acoperită de oceane',
            'Pământul are un singur satelit natural — Luna',
            'Atmosfera ne protejează de radiațiile cosmice'
        ],
        missionName: 'Deșeuri spațiale',
        missionDescription: 'Ajută la curățarea orbitei de deșeuri spațiale!'
    },
    {
        id: 'mars',
        name: 'Marte',
        nameEn: 'Mars',
        order: 4,
        color: '#e74c3c',
        orbitRadius: 185,
        size: 25,
        image: '/planet/mars.png',
        unlocked: true,
        completed: false,
        facts: [
            'Marte este numită Planeta Roșie din cauza prafului ruginiu',
            'Aici se află Olympus — un vulcan de 3 ori mai înalt decât Everestul!',
            'Marte are doi sateliți: Phobos și Deimos',
            'Ziua marțiană este aproape egală cu cea pământeană — 24,5 ore'
        ],
        missionName: 'Roverul în dune',
        missionDescription: 'Conduce roverul prin dunele marțiene!'
    },
    {
        id: 'jupiter',
        name: 'Jupiter',
        nameEn: 'Jupiter',
        order: 5,
        color: '#d4a574',
        orbitRadius: 240,
        size: 50,
        image: '/planet/jupiter.png',
        unlocked: false,
        completed: false,
        facts: [
            'Jupiter este cea mai mare planetă, de 11 ori mai mare ca Pământul',
            'Marea Pată Roșie este o furtună care durează de 400 de ani',
            'Jupiter are 95 de sateliți cunoscuți',
            'Jupiter este un gigant gazos fără suprafață solidă'
        ],
        missionName: 'Zbor în uragan',
        missionDescription: 'Zboară prin furtunile lui Jupiter, evitând fulgerele!'
    },
    {
        id: 'saturn',
        name: 'Saturn',
        nameEn: 'Saturn',
        order: 6,
        color: '#f4d03f',
        orbitRadius: 300,
        size: 45,
        image: '/planet/saturn.png',
        unlocked: false,
        completed: false,
        facts: [
            'Saturn este celebru pentru inelele sale din gheață și roci',
            'Saturn este atât de ușor încât ar putea pluti pe apă',
            'Saturn are 146 de sateliți — cei mai mulți!',
            'Inelele lui Saturn se întind pe 282.000 km'
        ],
        missionName: 'Dansul inelelor',
        missionDescription: 'Zboară prin inelele lui Saturn, colectând cristale de gheață!'
    },
    {
        id: 'uranus',
        name: 'Uranus',
        nameEn: 'Uranus',
        order: 7,
        color: '#76d7c4',
        orbitRadius: 355,
        size: 35,
        image: '/planet/uranus.png',
        unlocked: false,
        completed: false,
        facts: [
            'Uranus se rotește "culcat pe o parte" — axa sa e înclinată la 98°',
            'Uranus este cea mai rece planetă (-224°C)',
            'Uranus are 27 de sateliți',
            'Atmosfera conține metan, care îi dă culoarea albastră'
        ],
        missionName: 'Labirintul de gheață',
        missionDescription: 'Treci prin labirintul înghețat al lui Uranus!'
    },
    {
        id: 'neptune',
        name: 'Neptun',
        nameEn: 'Neptune',
        order: 8,
        color: '#2980b9',
        orbitRadius: 400,
        size: 34,
        image: '/planet/neptune.png',
        unlocked: false,
        completed: false,
        facts: [
            'Neptun este cea mai îndepărtată planetă din Sistemul Solar',
            'Vânturile pe Neptun ating 2100 km/h — cele mai puternice!',
            'Un an pe Neptun durează 165 de ani pământești',
            'Neptun a fost descoperit datorită calculelor matematice'
        ],
        missionName: 'Vântul furtunos',
        missionDescription: 'Rezistă celor mai puternice vânturi din Sistemul Solar!'
    }
];

export function getPlanetById(id) {
    return planets.find(p => p.id === id);
}

export function getUnlockedPlanets() {
    return planets.filter(p => p.unlocked);
}
