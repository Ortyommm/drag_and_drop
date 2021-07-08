const
  $card = document.querySelector('.card'),
  $droppables = document.querySelectorAll('.section__body')
$card.addEventListener('mousedown', onMouseDown)

// function moveAt() {
//   $card.style.left = 
// }


//PageX, PageY - место клика с учетом прокрутки
/* 
offsetWidth — это значение, включающее горизонтальный отступ элемента,
 ширину вертикального скроллбара (если он есть) и CSS ширину
*/
//http://output.jsbin.com/avupid/3/

/* MouseEvent.clientX свойство доступное только для чтения. Это свойство является горизонтальной координатой в пределах клиентской области приложения, 
на которой произошло событие (в отличие от координат внутри страницы)*/
let currentDroppable = null

function onMouseDown(event) {
  // console.log(event.pageX, event.clientX, $card.getBoundingClientRect().left)
  let
    shiftX = event.clientX - $card.getBoundingClientRect().left, //разница левого отступа и текущего положения мыши
    shiftY = event.clientY - $card.getBoundingClientRect().top

  const $cardHolded = $card.cloneNode(true)
  $card.insertAdjacentElement('beforebegin', $cardHolded)
  $cardHolded.style.width = getComputedStyle($card).width
  $card.classList.add('hidden')
  $cardHolded.classList.add('hold')

  moveAt(event.pageX, event.pageY)

  function moveAt(pageX, pageY) {
    $cardHolded.style.left = pageX - shiftX + 'px'
    $cardHolded.style.top = pageY - shiftY + 'px'
  }

  function leaveDroppable(elem) {
    elem.style.backgroundColor = '#fff'
  }

  function enterDroppable(elem) {
    elem.style.backgroundColor = '#eee'
  }

  function onMouseMove(event) {
    $cardHolded.hidden = true
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY)
    $cardHolded.hidden = false
    // console.log(elemBelow)
    if (!elemBelow) return

    let droppableBelow = elemBelow.closest('.section__body')

    if (currentDroppable != droppableBelow) {
      if (currentDroppable) {
        leaveDroppable(currentDroppable)
      }
      currentDroppable = droppableBelow
      if (currentDroppable) {
        enterDroppable(currentDroppable)
      }
    }

    moveAt(event.pageX, event.pageY)
  }

  document.addEventListener('mousemove', onMouseMove)

  $cardHolded.addEventListener('mouseup', onMouseUp)

  function onMouseUp(event) {
    // console.log('remove')
    $cardHolded.hidden = true
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY)
    $cardHolded.hidden = false
    // let elemBelow = $droppables[2]
    console.log(elemBelow)
    document.removeEventListener('mousemove', onMouseMove)
    $cardHolded.remove()
    $card.classList.remove('hidden')
    $droppables.forEach($droppable => $droppable.style.backgroundColor = '#fff')

    if (!elemBelow.classList.contains('section__body')) return
    // console.log($card, elemBelow)
    elemBelow.append($card)
    console.log(elemBelow)

    // $cardHolded.removeEventListener('mouseup', removeMouseMoveListener)
  }

  // $cardHolded.ondragstart = function () {
  //   return false;
  // }
}
