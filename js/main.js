let app = new Vue({
  el: '.main',
  data: {
    showMain: true,
    showSocial: false,
    showAchivments: false,
    showQuestions: false,
    showResult: false,
    number: 0,
    score: {
      'obl': 0,
      'ork': 0,
      'witcher': 0,
      'gow': 0,
      'got': 0,
    },
    totalGame: localStorage.getItem('sc2TotalGame') ? JSON.parse(localStorage.getItem('sc2TotalGame')) : {
      'obl': 0,
      'ork': 0,
      'witcher': 0,
      'gow': 0,
      'got': 0,
      'secret': 0,
      'simple': 0,
    },
    totalGames: localStorage.getItem('sc2TotalGames') ? localStorage.getItem('sc2TotalGames') : 0,
    questions: questions,
    results: results,
    resultRace: 'secret',
  },
  methods: {
    goToMain() {
      this.showMain = true
      this.showSocial = false
      this.showAchivments = false
      this.showQuestions = false
      this.showResult = false
    },
    goToSocial() {
      this.showMain = false
      this.showSocial = true
      this.showAchivments = false
      this.showQuestions = false
      this.showResult = false
    },
    goToAchivments() {
      if(this.totalGames > 0) {
        this.showMain = false
        this.showSocial = false
        this.showAchivments = true
        this.showQuestions = false
        this.showResult = false
      } else {
        this.goToQuestions()
      }
    },
    goToQuestions() {
      this.score = {
        'obl': 0,
        'ork': 0,
        'witcher': 0,
        'gow': 0,
        'got': 0,
      }
      this.showMain = false
      this.showSocial = false
      this.showAchivments = false
      this.showQuestions = true
      this.showResult = false
    },
    goToResult(race) {
      this.showMain = false
      this.showSocial = false
      this.showAchivments = false
      this.showQuestions = false
      this.showResult = true
      this.resultRace = race
    },
    nextQuestions(answer) {
      if(this.number == 24) {
        this.number = 0
        this.endGame();
      } else {
        this.number++
      }
      eval(answer)
    },
    endGame() {
      this.totalGames++;
      localStorage.setItem('sc2TotalGames', this.totalGames)
      // Стражник
      if(this.score.obl > this.score.witcher && this.score.obl > this.score.got && this.score.ork < 8 && Math.abs(this.score.witcher - this.score.obl) > 3) {
        this.goToResult('obl')
        this.totalGame.obl++
      }
      // Орк
      else if (this.score.ork > this.score.witcher && 
      this.score.ork > this.score.got && 
      this.score.ork == 8) { 
        this.goToResult('ork')
        this.totalGame.ork++
      }
      // Ведьмак
      else if (this.score.witcher > this.score.obl && 
      this.score.witcher > this.score.got && 
      this.score.gow < 5 && 
      Math.abs(this.score.witcher - this.score.obl) > 3) { 
        this.goToResult('witcher')
        this.totalGame.witcher++
      } 
      // Кратос
      else if (this.score.witcher > this.score.obl && 
      this.score.witcher > this.score.got && 
      this.score.gow == 5) { 
        this.goToResult('gow')
        this.totalGame.gow++
      }
      // Безымянный
      else if (this.score.got > this.score.obl && 
      this.score.got > this.score.witcher) { 
        this.goToResult('got')
        this.totalGame.got++
      }
      // Работяга
      else if (Math.abs(this.score.witcher - this.score.obl) <= 3) { 
        this.goToResult('simple')
        this.totalGame.simple++
      } 
      // Секретный
      else { 
        this.goToResult('secret')
        this.totalGame.secret++
      }
      localStorage.setItem('sc2TotalGame', JSON.stringify(this.totalGame))
    }
  },
  computed: {
    totalScore() {
      let score=0
      for(let i in this.totalGame) {
        score+=(this.totalGame[i]*results[i].points)
      }
      return score
    },
    openRaces() {
      let count=0
      for(let i in this.totalGame) {
        if(this.totalGame[i]>0) count++
      }
      return count
    },
    favoriteRace() {
      let max='obl'
      for(let i in this.totalGame) {
        if(this.totalGame[i]>this.totalGame[max]) {
          max=i
        }
      }
      return results[max].name
    },
    showResultRace() {
      return {
        'obl': this.totalGame.obl > 0 ? true : false,
        'ork': this.totalGame.ork > 0 ? true : false,
        'witcher': this.totalGame.witcher > 0 ? true : false,
        'gow': this.totalGame.gow > 0 ? true : false,
        'got': this.totalGame.got > 0 ? true : false,
        'secret': this.totalGame.secret > 0 ? true : false,
        'simple': this.totalGame.simple > 0 ? true : false,
      }
    }
  }
})

// Звуковое сопровождение

let audio = new Audio('audio/fisherMix.mp3') 
let audio_btn = document.querySelector('.btn__sound')
let audio_icon = document.querySelector('.btn__sound i')

audio.muted = true;
audio.autoplay = true;
audio.volume = 0.2;

// Запуск трека с рандомного места
// audio.addEventListener('loadedmetadata', function() {
//   audio.currentTime = 0 + Math.random() * (audio.duration + 1 - 0)
// })

audio_btn.addEventListener('click', function() {
  if (audio.muted) {
    audio.muted = false;
    audio_icon.classList.add('fa-volume-up')
    audio_icon.classList.remove('fa-volume-off')
  } else if (!audio.muted) {
    audio.muted = true;
    audio_icon.classList.add('fa-volume-off')
    audio_icon.classList.remove('fa-volume-up')
  } 
})
