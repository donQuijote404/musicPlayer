const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const progress = $('.progress');

const playBtn = $('.btn-toggle-play');
const prevBtn = $('.prev-btn');
const nextBtn = $('.next-btn');
const randomBtn = $('.fa-shuffle');
const repeatBtn = $('.fa-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Im Not Angry Anymore",
            singer: "Astronaut",
            path: "./asset/music/Astronaut x Somebody That I Used To Know x Im Not Angry Anymore .mp3",
            image: "./asset/img/i am not angry anymore.jpg"
        },
        {
            name: "Jar of Hearts",
            singer: "Christina Perri",
            path: "./asset/music/Jar of Hearts remix lofi  Fasetya.mp3",
            image:"./asset/img/jar of hearts.jpg"
        },
        {
            name: "Leave A Light On",
            singer: "Tom Wallker",
            path: "./asset/music/Tom Walker  Leave a Light On.mp3",
            image: "./asset/img/leave a light on.jpg"
        },
        {
            name: "Cheap Thrills",
            singer: "Sia",
            path: "./asset/music/Cheap Thrills  Sia.mp3",
            image: "./asset/img/sia cheap thrills.jpg"
        },
        {
            name: "Umber Island",
            singer: "Umbella",
            path: "./asset/music/Umbrella  Ember Island  Matte Remix.mp3",
            image: "./asset/img/umber island.jpg"
        },
        {
            name: "Why Not Me",
            singer: "Enrique Iglesias",
            path: "./asset/music/Why Not Me  Enrique Iglesias.mp3",
            image: "./asset/img/Why not me.jpg"
        },
    ],

    /**
     *  Render danh sách bài hát
     */
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song" data-index="${index}">
                    <div class="thumb" 
                        style="background-image: url('${song.image}')">
                        </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fa-solid fa-circle-ellipsis-vertical"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    /**
     * @returns      {currentSong}
     * Định nghĩa thuộc tính currentSong cho object
     */
    defineProperties: function() {
        Object.defineProperty(this, "currentSong", {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    /**
     * Lắng nghe / xử lý các sự kiện (Dom events)
     */
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth;
        
        // Xử lý quay CD
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10 seconds
            iterations : Infinity
        })
        cdThumbAnimate.pause();

        // Xử lý thu phóng CD
        document.onscroll = function() {
            const scrolltop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrolltop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Xử lý click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        }

        // Xử lý Tua bài hát và thanh progess
        audio.ontimeupdate = function() {
            if (audio.duration) {
                const progressPresent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPresent;
            }
        }
        progress.onchange =  function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Xử lý các nút next, random và lặp lại
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong();
            }
            audio.play();
        }
        prevBtn.onclick = function() {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong();
            }
            audio.play();
        }
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active');
        }

        playlist.onclick = function(e) {
            let songNode = e.target.closest('.song:not(.active)');
            let isOption = e.target.closest('.option');
            if (songNode || isOption) {
                if(songNode) {
                    _this.currentIndex = songNode.dataset.index;
                    _this.loadCurrentSong();
                    audio.play();
                }
                if (isOption) {

                }
            }
        }
    },

    /**
     * Tải thông tin bài hát đầu tiên vào UI khi ứng dụng chạy
     */
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();
    },
    randomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * (this.songs.length - 1));
        } while (newIndex === this.curre)
        this.currentIndex = newIndex; 
        this.loadCurrentSong();
    },
    start: function() {
        this.handleEvents();
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
    },
}

app.start();