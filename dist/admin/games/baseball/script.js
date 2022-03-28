const gc = document.querySelector('#game_console')
const ss = document.querySelector('#start_screen')
const ball = document.querySelector('#ball')
const batter = document.querySelector('#batter')
const pitcher = document.querySelector('#pitcher')
const bp = document.querySelector('#ballpark')
const homers = document.querySelector('#homeruns')
const outss = document.querySelector('#outs')
const sb = document.querySelector('#scoreboard')
const backingTrack = document.querySelector('#back_sound')
const hitBall = document.querySelector('#bat_hit')
const clapping = document.querySelector('#clapping')

var thrown = false;
const hr = [6,7,8,14,15,16,22,23,24]
var homeruns = 0
var outs = 0

var b_loc = ball.getBoundingClientRect()
var x = b_loc.x
const start_x = b_loc.x 
var y = b_loc.y
const start_y = b_loc.y


function throwPitch() {
  if(thrown){
    bp.removeEventListener('click', throwPitch)
    batter.classList.add('swing')
    var bp_loc = bp.getBoundingClientRect()
    var b_loc = ball.getBoundingClientRect()
    var dist = Math.round(Math.hypot(0, (bp_loc.y + bp_loc.height) - (b_loc.y + (b_loc.height*.5))))
    // console.log(dist)

    if(dist <= 30) {
      hitBall.play()
      ball.style.transition = '2s'
      ball.classList.add('hit_ball')
      bp.classList.add('alt_bp')

      if(hr.includes(dist)) {
        clapping.play()
        homeruns++
        homers.innerHTML = homeruns
        sb.innerHTML = 'HOME<br>RUN'
        gc.classList.add('hr_sparkle')
        if([22,23,24].includes(dist)) {
          ball.style.left = (30 - dist) / 4 * 100 + '%'
          ball.style.top = '-600px'
        }
        if([14,15,16].includes(dist)) {
          ball.style.left = '800px'
          ball.style.top = '-400px'
        }
        if([6,7,8].includes(dist)) {
          ball.style.left = '1000px'
          ball.style.top = 100 - (dist / 4 * 100) + '%'
        }    
      } else {
        if(dist >= 17) {
          ball.style.left = ((30 - dist) * 11.11) + 1 + '%'
          ball.style.top = Math.random() < .5 ? -Math.random()*100 + '%' : -Math.random()*100 + '%';
        }
        if(dist <= 13) {
          ball.style.left = Math.random()*150 + 50 + '%'
          ball.style.top = 99 - (dist * 11.11) + '%'
        }    
      }
      if(!hr.includes(dist)) {
        outs++
        outss.innerHTML = outs
        sb.innerHTML = 'OUT'
      }
    }

    setTimeout(function(){
      if(outs == 3) {
        ss.style.display = 'block'
        bp.classList.remove('alt_bp')
        ball.classList.remove('hit_ball')
        ball.style.transition = ''
        ball.style.left = '43%'
        ball.style.top = '58.5%'
        batter.classList.remove('swing')
        gc.classList.remove('hr_sparkle')
      } else {
        thrown = false
        bp.addEventListener('click', throwPitch)
        bp.classList.remove('alt_bp')
        ball.classList.remove('hit_ball')
        ball.style.transition = ''
        ball.style.left = '43%'
        ball.style.top = '58.5%'
        batter.classList.remove('swing')
        gc.classList.remove('hr_sparkle')
      }     
    }, 2500)
  }

  if(!thrown) {
    thrown = true
    var speed = Math.random() + 1.25
    ball.style.transition = speed + 's'
    ball.style.left = '-58px'
    ball.style.top = 'calc(100% + 50px)'
    clapping.pause()
    clapping.currentTime = 0
  }
  // console.log(speed)
}

ss.addEventListener('click', function(){
  ss.style.display = 'none'
  bp.addEventListener('click', throwPitch)
  homeruns = 0
  outs = 0
  outss.innerHTML = outs
  homers.innerHTML = homeruns
  thrown = false
  back_sound.volume = .025
  back_sound.play()    
})

function updateBall() {
  if(thrown) {
     x--
     y++
     ball.style.left = x + 'px'
     ball.style.top = y + 'px'
     }
  
  setTimeout(updateBall,1000/10)
}