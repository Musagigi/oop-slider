class SliderImage {
	
	index = 0

	constructor(images, removeAddSelector) {
		
		this.images = images
		this.removeAddSelector = removeAddSelector
	}

	slider(number) {

		let imageCurrent = this.getImageCurrent(number)
		
		this.sliderToggle(imageCurrent, this.images[this.index], this.	removeAddSelector)
	}

	getImageCurrent(number) {	

		let imageCurrent = this.images[this.index]
		this.index += number;

		if (this.index < 0) {
			this.index = this.images.length - 1
		}
		if (this.index >= this.images.length) {
			this.index = 0
		}

		return imageCurrent
	}

	sliderToggle(imgCurrent, imgNext, removeAddSelector) {

		imgCurrent.classList.remove(removeAddSelector)
		imgNext.classList.add(removeAddSelector)
	}
}


class SliderImageAnimated extends SliderImage {
	
	#isStop = false

	#imgMoveToLeft = [
		{ transform: 'translateX(0) scale(1)' },
		{ transform: 'translateX(-100%) scale(0.8)' }
	]
	#imgMoveToRight = [
		{ transform: 'translateX(0) scale(1)' },
		{ transform: 'translateX(100%) scale(0.8)' },
	]

	constructor(images, removeAddSelector) {
		super(images, removeAddSelector)
	}

	sliderAnimate(number) {
		
		if(this.#isStop)  {
			return
		}

		let imageCurrent = super.getImageCurrent(number)
		let isNext = number > 0

		this.#sliderToggleAnimate(imageCurrent, this.images[this.index], this.removeAddSelector, isNext)
	}

	#sliderToggleAnimate(imgCurrent, imgNext, removeAddSelector, isNext) {		

		this.#isStop = true
		super.sliderToggle(imgCurrent, imgNext, removeAddSelector)

		imgCurrent.animate(isNext ? this.#imgMoveToLeft : this.#imgMoveToRight, { duration: 500 })
		let anim = imgNext.animate(isNext ? this.#imgMoveToRight : this.#imgMoveToLeft, { duration: 500, direction: 'reverse' })

		anim.addEventListener('finish', () => {
			this.#isStop = false
		})
	}
}


class SliderImageAutoScroll extends SliderImageAnimated {
	
	#auto = null

	constructor(images, removeAddSelector) {
		super(images, removeAddSelector)
	}
	
	autoScroll(number, delay, animate = null) {

		this.#auto = setInterval(() => {
			animate ? super.sliderAnimate(number) : super.slider(number)
		}, delay);
	}

	stopAutoScroll() {
		clearInterval(this.#auto)
	}
}

window.addEventListener('load', function () {

	//СЛАЙДЕР №1
	let bntPrev = document.querySelector('.gallery-1 .buttons .prev')
	let bntNext = document.querySelector('.gallery-1 .buttons .next')
	let images = document.querySelectorAll('.gallery-1 .photos img')

	let test = new SliderImageAnimated(images, 'showed')

	bntPrev.addEventListener('click', function () {
		test.sliderAnimate(-1)
	})
	bntNext.addEventListener('click', function () {
		test.sliderAnimate(1)
	})

	//СЛАЙДЕР №2
	let btnPrev2 = document.querySelector('.gallery-2 .buttons .prev')
	let btnNext2 = document.querySelector('.gallery-2 .buttons .next')
	let images2 = document.querySelectorAll('.gallery-2 .photos img')

	let test2 = new SliderImage(images2, 'showed')

	btnPrev2.addEventListener('click', function () {
		test2.slider(-1)
	})
	btnNext2.addEventListener('click', function () {
		test2.slider(1)
	})

	// let test3 = new SliderImageAutoScroll(images, 'showed')
	// test3.autoScroll(1, 1000, 'animate')

	// let test4 = new SliderImageAutoScroll(images2, 'showed')
	// test4.autoScroll(1, 1000)

	// setTimeout(() => {
	// 	test3.stopAutoScroll()
	// }, 3000);
});
