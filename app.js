const form = document.querySelector('#add-cafe-form');
const cafeRows = document.querySelector('#cafe-row')

// create element & render cafe
function renderCafe(doc){
    let name = document.createElement('p');
    let city = document.createElement('p');
    let cross = document.createElement('button');

    let rows = document.createElement('div');

    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    cross.textContent = 'Delete';

    rows.setAttribute('data-id', doc.id)
    rows.setAttribute('class', 'col-xl-4 col-lg-4 col-md-12 col-sm-12 col-xs-12')

    rows.appendChild(name);
    rows.appendChild(city);
    rows.appendChild(cross);


    cafeRows.appendChild(rows);

    // deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    });
}

// saving data
form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});

// real-time listener
db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        console.log(change.doc.data());
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed'){
            let rows = cafeRows.querySelector('[data-id=' + change.doc.id + ']');
            cafeRows.removeChild(rows);
        }
    });
});
