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
const backwardBtn = $('.backward');
const forwardBtn = $('.forward');



const app = {
    currentIndex: 0,
    isPlaying: false,
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
        const htmls = this.songs.map(song => {
            return `
                <div class="song">
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

        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add('playing');
        }
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove('playing');
        }

        audio.ontimeupdate = () => {
            if (audio.duration) {
                const progressPresent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPresent;
            }
        }

        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
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
    start: function() {
        this.handleEvents();
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
    },
}

app.start();