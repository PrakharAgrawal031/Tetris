document.addEventListener('DOMContentLoaded', () =>{
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const gridSpacing = 10
    const scoreDisplay = document.querySelector('#score')
    const startbtn = document.querySelector('#startbtn')
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
      'orange',
      'red',
      'purple',
      'green',
      'blue'
    ]
    //defining the shapes of the tetriminos
    const ltetrimino = [
        [1, gridSpacing+1, gridSpacing*2+1, 2],
        [gridSpacing, gridSpacing+1, gridSpacing+2, gridSpacing*2+2],
        [1, gridSpacing+1, gridSpacing*2+1, gridSpacing*2],
        [gridSpacing, gridSpacing*2, gridSpacing*2+1, gridSpacing*2+2]
    ]
    const zTetromino = [
        [0,gridSpacing,gridSpacing+1,gridSpacing*2+1],
        [gridSpacing+1, gridSpacing+2,gridSpacing*2,gridSpacing*2+1],
        [0,gridSpacing,gridSpacing+1,gridSpacing*2+1],
        [gridSpacing+1, gridSpacing+2,gridSpacing*2,gridSpacing*2+1]
      ]
    
      const tTetromino = [
        [1,gridSpacing,gridSpacing+1,gridSpacing+2],
        [1,gridSpacing+1,gridSpacing+2,gridSpacing*2+1],
        [gridSpacing,gridSpacing+1,gridSpacing+2,gridSpacing*2+1],
        [1,gridSpacing,gridSpacing+1,gridSpacing*2+1]
      ]
    
      const oTetromino = [
        [0,1,gridSpacing,gridSpacing+1],
        [0,1,gridSpacing,gridSpacing+1],
        [0,1,gridSpacing,gridSpacing+1],
        [0,1,gridSpacing,gridSpacing+1]
      ]
    
      const iTetromino = [
        [1,gridSpacing+1,gridSpacing*2+1,gridSpacing*3+1],
        [gridSpacing,gridSpacing+1,gridSpacing+2,gridSpacing+3],
        [1,gridSpacing+1,gridSpacing*2+1,gridSpacing*3+1],
        [gridSpacing,gridSpacing+1,gridSpacing+2,gridSpacing+3]
      ]

      const tetriminos = [ltetrimino, zTetromino, oTetromino, tTetromino, iTetromino]

      let currentPosition = 4
      let currentRotation = 0

      //randomly select tetrimino
      let random = Math.floor(Math.random()*tetriminos.length)
      let tetrimino = tetriminos[random][currentRotation]

      //drawing tetrimino 
      function drawTetrimino(){
        tetrimino.forEach(block => {
            squares[currentPosition+block].classList.add('tetrimino')
            squares[currentPosition + block].style.backgroundColor = colors[random]
        })
      }
      drawTetrimino()
      //removing tetrimino 
      function undrawTetrimino(){
        tetrimino.forEach(block => {
            squares[currentPosition+block].classList.remove('tetrimino')
            squares[currentPosition + block].style.backgroundColor = ''
        })
      }

      //Making tetrimino go down
      // timerId = setInterval(moveDown,600)


      //assign functions to keycodes
      function control(e){
        if(e.keyCode === 37) moveLeft()
        else if(e.keyCode === 39) moveRight()
        else if(e.keyCode === 40) moveDown()
        else if(e.keyCode === 38) rotate()
      }
      document.addEventListener('keyup',control)
      //move down using undraw and draw 
      function moveDown(){undrawTetrimino()
      currentPosition += gridSpacing
      drawTetrimino()
      freeze()
    }


      //freeze function
      function freeze(){
        if(tetrimino.some(block => squares[currentPosition +block +gridSpacing].classList.contains('taken'))){
          tetrimino.forEach(block => squares[currentPosition + block].classList.add('taken'))
          //new tetrimino starts falling
          random = nextRandom
          nextRandom = Math.floor(Math.random()*tetriminos.length)
          tetrimino = tetriminos[random][currentRotation]
          currentPosition = 4
          drawTetrimino()
          displayShape()
          addScore()
          gameOver()
        }
      }

      //move tetrimino to left 
      function moveLeft(){
        undrawTetrimino()
        const isAtLeftEdge = tetrimino.some(block=>(currentPosition+block)%gridSpacing==0)

        if(!isAtLeftEdge) currentPosition-=1
        if(tetrimino.some(block=>squares[currentPosition+block].classList.contains('taken'))){
          currentPosition+=1
        }
        drawTetrimino()
      }

      //move tetrimino to right
      function moveRight(){
        undrawTetrimino()
        const isAtRightEdge = tetrimino.some(block=>(currentPosition+block)%gridSpacing==gridSpacing-1)

        if(!isAtRightEdge) currentPosition+=1
        if(tetrimino.some(block=>squares[currentPosition+block].classList.contains('taken'))){
          currentPosition-=1
        }
        drawTetrimino()
      }

      //move down
      function moveDown(){
        undrawTetrimino()
        currentPosition += gridSpacing
        drawTetrimino()
        freeze()
      }

      //rotate tetrimino 
      function rotate(){
        undrawTetrimino()
        currentRotation++
        if(currentRotation==tetrimino.length) currentRotation = 0
        tetrimino = tetriminos[random][currentRotation]
        drawTetrimino()
      }

      //show next shape

      const displaySquares = document.querySelectorAll('.mini-grid div')
      const displayWidth = 4
      let displayIndex = 0


      //Tetrimino without rotation

      const upNextTetriminoes = [[1, displayWidth+1, displayWidth*2+1, 2]//ltetrimino
      , [0,displayWidth, displayWidth+1, displayWidth*2+1]//ztetrimino
      ,[1, displayWidth, displayWidth+1, displayWidth+2]//tTetrimino
      , [0,1, displayWidth, displayWidth+1]//otetrimino
      ,[1, displayWidth+1, displayWidth*2+1, displayWidth*3+1]//itetrimino
      ]

      //function to display shape in mini grrid

      function displayShape(){
        
        displaySquares.forEach(square => {square.classList.remove('tetrimino')
        square.style.backgroundColor = ''
        })
        
        upNextTetriminoes[nextRandom].forEach(index=>{
          displaySquares[displayIndex + index].classList.add('tetrimino')
          displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })
      }

      startbtn.addEventListener('click',() => {
        if(timerId){
          clearInterval(timerId)
          timerId = null
        }
        else {
          drawTetrimino()
          timerId = setInterval(moveDown, 600)
          nextRandom = Math.floor(Math.random()*tetriminos.length)
          displayShape()

        }
      })

      //add score

      function addScore() {
        for (let i = 0; i < 199; i +=gridSpacing) {
          const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]
    
          if(row.every(index => squares[index].classList.contains('taken'))) {
            score +=10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
              squares[index].classList.remove('taken')
              squares[index].classList.remove('tetrimino')
              squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, gridSpacing)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
          }
        }
      }

      //game over function
      function gameOver(){
        if(tetrimino.some(block => squares[currentPosition + block].classList.contains('taken'))){
          clearInterval(timerId)
          alert('Game Over! Your Score is: '+score)
          scoreDisplay.innerHTML = 0
        }
      }
      

})