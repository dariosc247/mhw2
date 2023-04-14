const boxes = document.querySelectorAll('.choice-grid div');

let answers = {};

function setBoxStyle(box, styleName) {
    let checkbox;

    /*Funzione che setta i 3 possibili stili del div*/
    switch(styleName) {
        case 'default':
            box.classList.add('box-default');
            box.classList.remove('not-selected');
            box.classList.remove('selected');
            checkbox = box.querySelector('.checkbox');
            checkbox.src = 'images/unchecked.png';
            break;

        case 'selected':
            box.classList.add('selected');
            box.classList.remove('not-selected');
            box.classList.remove('box-default');    
            checkbox = box.querySelector('.checkbox');
            checkbox.src = 'images/checked.png';
            break;

        case 'unselected':
            box.classList.add('not-selected');
            box.classList.remove('selected');
            box.classList.remove('box-default');    
            checkbox = box.querySelector('.checkbox');
            checkbox.src = 'images/unchecked.png';
            break;
    }

}

function getPersonality(answers) {
    let answersOccurrency = {}; /*Creo una mappa di supporto in cui la coppia chiave-valore è formata da choice-occorrenzedellachoice*/
    let max = 0;
    let choice;
    let i = 0;
    
    for(let ans in answers) {
        choice = answers[ans];
        count = answersOccurrency[choice];
        if(count === undefined) {
            count = 0; /*Inizialmente count sarà undefined, quindi lo setto pari a 0*/
        }
        count++;
        answersOccurrency[choice] = count;
    }

    for(let ans in answersOccurrency) {
        if(i === 0 || max < answersOccurrency[ans]) {/*La condizione i===0 serve per la prima iterazione*/
            max = answersOccurrency[ans]; /*Cerco il massimo*/
            choice = ans;
        }
        i++;
    }

    return choice;
}

function printPersonality(choice) {
    title = document.getElementById('personality-title');
    contents = document.getElementById('personality-contents');

    title.textContent = RESULTS_MAP[choice].title;
    contents.textContent = RESULTS_MAP[choice].contents;
}

function processAnswer(questionId, choiceId) {
    let len = 0;
    let finished = false;
    let choice;
    
    answers[questionId] = choiceId;

    for(let count in answers) {
        len++; /*Ricavo "manualmente" la lunghezza della mappa, visto che non dispone di un .length come gli array*/
    }

    if(len === 3) {
        finished = true;
    }

    if(finished === true) {
        choice = getPersonality(answers);
        printPersonality(choice);
        btnRestart.disabled = false; /*Abilito la possibilità di premere il button per effettuare il restart del quiz*/
    }

    return finished;
}

function uncheckOthers(container) {
    const choiceGrid = container.parentNode; /*Uso il parentNode per risalire all'elemento padre del div (ossia la griglia)*/

    const elementsArray = choiceGrid.querySelectorAll('.choice-grid div');

    for(let box of elementsArray) {
        if(box.dataset.choiceId !== container.dataset.choiceId) {
            setBoxStyle(box, 'unselected');
        }
    }
}

function onClick(event) {
    const container = event.currentTarget;

    setBoxStyle(container, 'selected');

    uncheckOthers(container);

    if(processAnswer(container.dataset.questionId, container.dataset.choiceId) === true) {
        for(const box of boxes) {
            box.removeEventListener('click', onClick);
        }
    }

    event.stopPropagation();
}

function restartQuiz(event) {
    const blocks = document.querySelectorAll('.choice-grid div');

    for(block of blocks) {
        setBoxStyle(block, 'default');
    }

    title = document.getElementById('personality-title');
    contents = document.getElementById('personality-contents');
    title.innerHTML = '';
    contents.innerHTML = '';

    answers = {}; /*Nella fase iniziale la mappa deve essere vuota, per poi essere riempita nella processAnswer()*/

    for(const box of boxes) {
        box.addEventListener('click', onClick);
    }

    window.scroll({top: 0, left: 0, behavior: "smooth"});

    event.stopPropagation();
}

/*MAIN*/

const btnRestart = document.getElementById('restart');
btnRestart.addEventListener('click', restartQuiz);
btnRestart.disabled = true;

restartQuiz(null); /*La prima volta restartQuiz() sarà come se fosse startQuiz()*/