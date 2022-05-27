const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

// ======
const cd = $('.cd');
const btnPlay = $('.btn-toggle-play');
const player = $('.player');
const heading = $('header h2');
const CDthumb = $('.cd-thumb');
const audio = $('#audio');
const progress = $('#progress')
const btnNext = $('.btn-next')
const btnBack = $('.btn-prev')
const btnRepeat = $('.btn-repeat')
const btnRandom = $('.btn-random')
const playList = $('.playlist')
// ======
const app = {
    isPlaying: false,
    isRandom: false,
    currentIndex: 0,
    songs: [
      {
        name: "Nevada",
        singer: " Boom shakalaka",
        path: "./assets/music/Nevada - Vicetone_ Cozi Zuehlsdorff.mp3",
        image:
          "http://data.chiasenhac.com/data/cover/60/59344.jpg"
      },
      {
        name: "Unstoppable",
        singer: "Sia",
        path: "./assets/music/Unstoppable-Sia-4312901.mp3",
        image: "https://avatar-nct.nixcdn.com/singer/avatar/2017/02/21/1/e/4/2/1487651633819.jpg"
      },
      {
        name: "Beautiful In White",
        singer: "Shane Filan",
        path: "./assets/music/BeautifulInWhite-ShaneStevenFilan_368jp.mp3",
        image:
          "https://avatar-nct.nixcdn.com/singer/avatar/2016/01/25/4/1/1/7/1453717213703.jpg"
      },
      {
        name: "Girl like you",
        singer: "Maroon 5",
        path: "./assets/music/GirlsLikeYou-Maroon5CardiB-5519390.mp3",
        image:"https://avatar-nct.nixcdn.com/song/2018/05/31/2/c/5/d/1527763105053.jpg"
      }
      ],
    // render thông tin bài hát
    render: function() {
      _this = this;
      const htmls = this.songs.map(function(song, index) {
        return `
            <div class="song ${index === _this.currentIndex ? 'active' : ''} data-index = ${index}">
              <div class="thumb" 
                  style="background-image: url('${song.image}')">
              </div>
              <div class="body">
                  <h3 class="title">${song.name}</h3>
                  <p class="author">${song.singer}</p>
              </div>
              <div class="option">
                  <i class="fas fa-ellipsis-h"></i>
              </div>
            </div>
        `
      })
      $('.playlist').innerHTML = htmls.join('')
    },

    // define properties 
    // defineProperties: function() {
    //   Object.defineProperty(this,'currentSong', {
    //     get: function() {
    //       return this.songs[this.currentIndex]
    //     }
    //   })
    // },
    handleEvents: function() {
      _this = this;
      const cdWidth = cd.offsetWidth;

    // xử lý cuộn
      document.onscroll = function() {
        const scrolltop = window.scrollY || document.documentElement.scrollTop;

        const newCDwidth = cdWidth - scrolltop;

        cd.style.width = newCDwidth > 0 ? newCDwidth + 'px' : 0;
        cd.style.opacity = newCDwidth / cdWidth;
      }
      
      // play music
      btnPlay.onclick = function() {
        if(!app.isPlaying){
          audio.play();
        }
        else{
          audio.pause();
        }
      }
      //whel
      const CDthumbAnimate = CDthumb.animate([
        {transform: 'rotate(360deg)'}
      ], {
        duration: 10000,
        iterations: Infinity
      })
      CDthumbAnimate.pause();
      //event play on
      audio.onplay = function() {
        player.classList.add('playing')
        _this.isPlaying = true;
        CDthumbAnimate.play();
      }
      // event pause 
      audio.onpause = function() {
        _this.isPlaying = false;
        player.classList.remove('playing');
        CDthumbAnimate.pause();
      }

      // tua nhạc
      audio.ontimeupdate = function() {
        if(audio.duration){
          const progressPercent = audio.currentTime / audio.duration * 100;
          progress.value = progressPercent;
        }
        
      }

      progress.onchange = function() {
        audio.currentTime = progress.value / 100 * audio.duration;
      }
      //ended
      audio.onended = function() {
        btnNext.click();
      }
      //choose song
      playList.onclick = function(e) {
        const playElement = e.target.closest('.song:not(.active)')
        if(playElement || e.target.closest('.option'))
          if(playElement) {
            _this.currentIndex = playElement.dataset.index;
            _this.loadCurrentSong();
            _this.render();
            audio.play();
          }
      }
      //next song
      btnNext.onclick = function() {
        if(_this.isRandom)
          _this.randomSong();
        _this.nextSong();
        audio.play();
        _this.render();
        _this.scrollActivesong();
      }

      // back song
      btnBack.onclick = function() {
        _this.backSong();
        audio.play();
        _this.render();
        _this.scrollActivesong();
      }

      //repeat
      btnRepeat.onclick = function() {
        audio.currentTime = 0;
      }

      //random song
      btnRandom.onclick = function () {
        if(!_this.isRandom){
          btnRandom.classList.add('active')
          _this.isRandom = true;
        }else{
          btnRandom.classList.remove('active')
          _this.isRandom = false;
        }
      }
      
      
    },
    
    getCurrentSong: function() {
      return this.songs[this.currentIndex]
    },
    
    loadCurrentSong: function() {
      heading.textContent = this.getCurrentSong().name
      CDthumb.style.backgroundImage = `url('${this.getCurrentSong().image}')`
      audio.src = this.getCurrentSong().path
    },

    scrollActivesong: function() {
      setTimeout(function() {
        $('.song.active').scrollIntoView({
          behavior: 'smooth',
          inline: 'nearest'
        }) 
      },500) 
    },

    randomSong: function() {
      do{
        var newcurrentIndex = Math.floor(app.songs.length * Math.random());
      }while(newcurrentIndex == this.currentIndex)
      this.currentIndex = newcurrentIndex;
      this.loadCurrentSong();
    },

    //next
    nextSong: function() {
      this.currentIndex++;
      if(this.currentIndex >= this.songs.length)
        this.currentIndex = 0
      this.loadCurrentSong();
    },

    backSong: function() {
      this.currentIndex--;
      if(this.currentIndex < 0)
        this.getCurrentSong() = 0
      this.loadCurrentSong();
    },

    start: function() {
      // this.defineProperties();
      this.handleEvents();
      this.loadCurrentSong();
      this.render();
    },
}
app.start();


