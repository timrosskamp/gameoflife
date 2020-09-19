import { GameOfLife } from './components/GameOfLife'
import { domReady } from './utils/domReady'

domReady(() => {
    const canvas = document.getElementById('gameoflife') as HTMLCanvasElement
    const play = document.getElementById('play')
    const iterate = document.getElementById('iterate')
    const clear = document.getElementById('clear')

    const game = new GameOfLife(canvas)

    play.addEventListener('click', () => {
        if( game.paused ){
            play.classList.add('active')
            game.play()
        }else{
            play.classList.remove('active')
            game.pause()
        }
    })

    iterate.addEventListener('click', () => game.iterate())

    clear.addEventListener('click', () => game.clear())
})