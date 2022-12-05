// 按下開始遊戲
$('#startBtn').on('click', function () {
  $('#home').hide()
  $('#game').show()
  resetCard()
  point = 0
  $('#point').text(point)
  totalTime = 0
  $('#time').text(totalTime);
  clockOn()
  for (let i = 0; i < 16; i++) {
    $('#gameBox').append(`
    <div class="card card-close">
      <div class="card-front"></div>
      <div class="card-back"></div>
    </div>
  `)
  }
  for (let i = 0; i < $('.card').length; i++) {
    // 決定數字
    const num = i % ($('.card').length / 2)
    $('.card').eq(i).find('.card-front').css('background-image', `url(./images/${num}.jpg)`)
    $('.card').eq(i).attr('data-num', num)

    // 打散
    const target = Math.round(Math.random() * ($('.card').length - 1))
    $('.card').eq(target).insertAfter($('.card').eq(i))
  }
})

let time = 0;
let totalTime = 0
let point = 0

// 開啟計時
clockOn = () => {
  time = setInterval(() => {
    totalTime++;
    $('#time').text(totalTime);
  }, 1000);
}

// 停止計時
clockOff = () => {
  clearInterval(time);
}

// 加分
addPoints = () => {
  point+=3
  $('#point').text(point)
}

// 扣分
deductPoints = () => {
  if (point > 0) point--
  else if (point = 0) point = 0
  $('#point').text(point)
}


// 首頁按鈕
$('.backHome').on('click', function () {
  $('#game').hide()
  $('#tarot').hide()
  $('#home').show()
  clockOff()
  resetCard()
  point = 0
  $('#point').text(point)
})

// 重製遊戲區、塔羅抽取區卡牌
const resetCard = () => {
  $('#gameBox').html('')
  $('#tarotGameBox').html('')
  $('#tarotShow').html('')
}

$('#game').on('click', '.card', function () {
  // 最多一次翻兩張，牌還沒翻開
  if ($('.card:not(.card-close)').length < 2 && $(this).hasClass('card-close') && !$(this).hasClass('card-ok')) {
    $(this).removeClass('card-close')
  }

  // 如果翻兩張了
  if ($('.card:not(.card-close)').length === 2) {
    // 如果數字一樣
    if ($('.card:not(.card-close)').eq(0).attr('data-num') === $('.card:not(.card-close)').eq(1).attr('data-num')) {
      addPoints()
      // 用 card-ok 標記已完成
      $('.card:not(.card-close)').addClass('card-ok')
      $('.card:not(.card-close)').fadeTo(500, 0)
    } else {
      deductPoints()
    }

    // 不管數字一不一樣都將卡片翻回來
    setTimeout(() => {
      $('.card:not(.card-close)').addClass('card-close')
      if ($('.card-ok').length === $('.card').length) {
        clockOff()
        Swal.fire({
          icon: 'succedd',
          title: '恭喜',
          text: `恭喜過關，共花了${totalTime}秒，得分為${point}分！`
        }).then(function () {
          resetCard()
          $('#game').hide()
          $('#home').show()
        });
      }
    }, 500);
  }
})

// 塔羅抽牌區
$('#tarotBtn').on('click', function () {
  $('#home').hide()
  $('#tarot').show()
  resetCard()
  for (let i = 0; i < 22; i++) {
    $('#tarotGameBox').append(`
    <div class="card card-close position" style="left: ${(i + 11) * 2}%;">
    <div class="card-back"></div>
    </div>
  `)

    const num = i % ($('.card').length)
    $('.card').eq(i).find('.card-front').css('background-image', `url(./images/${num}.jpg)`)
    $('.card').eq(i).attr('data-num', num)
  }
})


// 抽卡按鈕
$('#selectCard').on('click', function () {
  $('#tarotShow').html('')
  for (let i = 0; i < 6; i++) {
    $('#tarotShow').append(`
    <div class="card">
      <div class="card-front"></div>
    </div>
  `)
  }

  let randomNum = getRandomNum(22, 6)
  for (let i = 22; i < 28; i++) {
    $('.card').eq(i).find('.card-front').css('background-image', `url(./images/${randomNum[i - 22]}.jpg)`)
  }
})

// 隨機數字
const getRandomNum = (max, num) => {
  let arr = [];
  for (let i = 0; i < num; i++) {
    let number = Math.floor(Math.random() * max);
    if (arr.indexOf(number) === -1) {
      arr.push(number);
    } else {
      i--;
    }
  }
  return arr;
}

// 塔羅牌牌義-滑鼠滑入
$('#tarotShow').on('mouseover', '.card-front', function () {
  for (let i = 0; i < 22; i++) {
    if ($(this).attr('style') === `background-image: url("./images/${i}.jpg");`) {
      $(`#tarotInfo${i}`).show()
    }
  }
})

// 塔羅牌牌義-滑鼠滑出
$('#tarotShow').on('mouseout', '.card-front', function () {
  for (let i = 0; i < 22; i++) {
    if ($(this).attr('style') === `background-image: url("./images/${i}.jpg");`) {
      $(`#tarotInfo${i}`).hide()
    }
  }
})
