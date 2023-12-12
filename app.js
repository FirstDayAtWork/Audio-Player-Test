const container = document.querySelector('.container');
const startPlayerButton = document.getElementById('play-btn');
const trackName = document.getElementById('track-name');
const trackTime = document.getElementById('track-time-slider');
const trackCurrentTime = document.getElementById('track-cur-time');
const trackFullTime = document.getElementById('full-track-time');
const audioPlace = document.querySelector('.audio-place');
const trakImg = document.querySelector('.trak-img');
const swapButton = document.querySelector('#swap-btn');
const loopButton = document.querySelector('#loop-btn');



const getDataFromJson = async () => {
    const response = await fetch('songs.json');
    const data = await response.json();
    // console.log(data);
    let compositions = [];
   for(let i = 0; i < data.length; i++){
    compositions.push([new Audio(data[i].title), data[i].img]);
   }
    return compositions
}

// getDataFromJson()
swapButton.addEventListener('click', async arr => {
    arr = await getDataFromJson();
    if(startPlayerButton.classList.contains('stopIt')){
        return
    }
    
    let array = arr.flat().filter((el, indx) => indx % 2 == 0);
    let image = arr.flat().filter((el, indx) => indx % 2 != 0);

        for (let i = arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
        
            // swap elements array[i] and array[j]
            // we use "destructuring assignment" syntax to achieve that
            [array[i], array[j]] = [array[j], array[i]];
            [image[i], image[j]] = [image[j], image[i]];
          }

          if(audioPlace.children){
            audioPlace.innerHTML = '';
            showAudioTrax(array);
            traxAction(array, image);
            
          }
        });


loopButton.addEventListener('click', async arr => {
    arr = await getDataFromJson();
    let array = arr.flat().filter((el, indx) => indx % 2 == 0);
    array.forEach(el => el.loop = true | false);
    console.log('click');
    console.log(array)
})


function trackStartTime (arr) {
    let seconds = (arr.currentTime);

    let hrs = Math.floor(seconds / 3600);
    let mins = Math.floor((seconds - (hrs * 3600)) / 60);
    let secs = Math.floor(seconds % 60);
    
    if (secs < 10) secs = `0${secs}`;
    if (mins < 10) mins = `0${mins}`;
    trackCurrentTime.innerText = `${mins}:${secs}`;
    trackTime.value = Math.floor(arr.currentTime);
}


async function audioPlayer(){
    let musiqe = await getDataFromJson();
    const musicarr = musiqe.flat().filter((el, indx) => indx % 2 == 0);
    const imgarr = musiqe.flat().filter((el, indx) => indx % 2 != 0);
        showAudioTrax(musicarr);
        traxAction(musicarr, imgarr);
    
}


function showAudioTrax(music){

    for(let i = 0; i < music.length; i++){
        const audioElement = document.createElement('div');
        audioElement.classList.add('audio-trak');
        if(music[i][0]){
            audioElement.innerText = music[i][0].src.replace('http://127.0.0.1:5500/music/', '').replace(/%|20|.mp3/g, ' ');
        } else {
            audioElement.innerText = music[i].src.replace('http://127.0.0.1:5500/music/', '').replace(/%|20|.mp3/g, ' ');
        }
        
        audioPlace.appendChild(audioElement);
    }
    
}


function traxAction(musicarr, imgarr){
    const tracks = document.querySelectorAll('.audio-trak');
    const listOfItems = [...tracks];
    let arr = [];


    tracks.forEach(elem => {
        elem.addEventListener('click', (e) => {
            trackName.innerText = elem.innerText;
            trakImg.src = `${imgarr[listOfItems.findIndex(el => el === elem)]}`;
            
            arr.push(listOfItems.findIndex(el => el === elem));
            if(arr.length > 2){
                arr = arr.slice(1)
            };



            musicarr.forEach(t => {
                t.pause();
                if(arr[0] != arr[arr.length-1]){
                    t.currentTime = 0;
                }
                
                // if (timer) {
                //     clearTimeout(timer);
                // }
            });

            
            

            if(startPlayerButton.classList.contains('stopIt')){
                if(arr[0] != arr[arr.length-1]){
                    musicarr[listOfItems.findIndex(el => el === elem)].play();
                    clearTimeout(timer);
                    if(Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration/60) < 10){
                        trackFullTime.innerText = `0${Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration/60)}:${Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration % 60)}`
                    } else {
                        trackFullTime.innerText = `${Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration/60)}:${Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration % 60)}`
                    }
                    trackTime.max = Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration);
                    timer = setInterval(() => {
                        trackStartTime(musicarr[listOfItems.findIndex(el => el === elem)]);
                        console.log('bug2')
                    }, 10);
                    console.log('shiet')
                } else {
                    musicarr[listOfItems.findIndex(el => el === elem)].pause();
                    startPlayerButton.classList.remove('stopIt');
                    startPlayerButton.classList.add('playIt');
                    startPlayerButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
                    startPlayerButton.style.fontSize = '33px';
                    // musiqe[listOfItems.findInd(el => el === elem)].currentTime = 0;
                    clearTimeout(timer);
                    console.log('true')
                }
                
                
                // console.log(arr);
                
            } else if(startPlayerButton.classList.contains('playIt')){

                musicarr[listOfItems.findIndex(el => el === elem)].play();
                startPlayerButton.classList.remove('playIt');
                startPlayerButton.classList.add('stopIt');
                startPlayerButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;
                startPlayerButton.style.fontSize = '33px';
                if(Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration/60) < 10){
                    trackFullTime.innerText = `0${Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration/60)}:${Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration % 60)}`
                } else {
                    trackFullTime.innerText = `${Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration/60)}:${Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration % 60)}`
                }
                trackTime.max = Math.floor(musicarr[listOfItems.findIndex(el => el === elem)].duration);
            
                timer = setInterval(() => {
                    trackStartTime(musicarr[listOfItems.findIndex(el => el === elem)]);
                    console.log('bug')
                }, 10);
            };


            // startPlayerButton.addEventListener('click', () => {
            //         if(startPlayerButton.classList.contains('playIt')){
            //             startPlayerButton.classList.remove('playIt');
            //             startPlayerButton.classList.add('stopIt');
            //             startPlayerButton.innerHTML = `<i class="fa-solid fa-pause"></i>`;
            //             musiqe[listOfItems.findIndex(el => el === elem)].pause();
            //             clearTimeout(timer);
            //         } else if(startPlayerButton.classList.contains('stopIt')){
            //             startPlayerButton.classList.remove('stopIt');
            //             startPlayerButton.classList.add('playIt');
            //             startPlayerButton.innerHTML = `<i class="fa-solid fa-play"></i>`;
            //             musiqe[listOfItems.findIndex(el => el === elem)].play();
            //             timer = setInterval(() => {
            //                 trackStartTime(musiqe[listOfItems.findIndex(el => el === elem)]);
            //                 console.log('bug-again')
            //             }, 10);
            //         }
            //     })
            // console.log(arr)
            

            trackTime.addEventListener('input', () => {
                musicarr[listOfItems.findIndex(el => el === elem)].currentTime = Math.floor(trackTime.value);
                trackStartTime(musicarr[listOfItems.findIndex(el => el === elem)])
                
            });

           


            
        })
       
    })

}


// button things



       

audioPlayer();