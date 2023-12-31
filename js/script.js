class SliderImage {

	index = 0

	constructor(images, removeAddSelector) {
		this.images = images
		this.removeAddSelector = removeAddSelector
	}

	slide(number) {

		let imageCurrent = this.getImageCurrent(number)

		this.sliderToggle(imageCurrent, this.images[this.index], this.removeAddSelector)
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

	slide(number) {

		if (this.#isStop) {
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


class SliderImageAutoScroll {

	#auto = null
	// в слайдер принимаем экземпляр класса конструктора SliderImage 
	// понятие - внедрение зависимости
	constructor(slider) {
		this.slider = slider
	}

	autoScroll(number, delay) {

		this.#auto = setInterval(() => {
			this.slider.slide(number)
		}, delay);
	}

	stopAutoScroll() {
		clearInterval(this.#auto)
	}
}


window.addEventListener('load', function () {

	function createSlider(imagesSelector, bntPrevSelector, bntNextSelector, removeAddSelector, Class) {

		let images = document.querySelectorAll(imagesSelector)
		let btnPrev = document.querySelector(bntPrevSelector)
		let btnNext = document.querySelector(bntNextSelector)

		let instanceClass = new Class(images, removeAddSelector)

		btnPrev.addEventListener('click', function () {
			instanceClass.slide(-1)
		})
		btnNext.addEventListener('click', function () {
			instanceClass.slide(1)
		})
		return instanceClass;
	}
	// setTimeout(() => {
	// 	test3.stopAutoScroll()
	// }, 3000);


	//СЛАЙДЕР №1
	let simpleSlider = createSlider('.gallery-1 .photos img', '.gallery-1 .buttons .prev', '.gallery-1 .buttons .next', 'showed', SliderImage)

	let simpleAutoScrollSlider = new SliderImageAutoScroll(simpleSlider)
	simpleAutoScrollSlider.autoScroll(1, 1500)


	//СЛАЙДЕР №2
	let animatedSlider = createSlider('.gallery-2 .photos img', '.gallery-2 .buttons .prev', '.gallery-2 .buttons .next', 'showed', SliderImageAnimated)

	let animateAutoScrollSlider = new SliderImageAutoScroll(animatedSlider)
	animateAutoScrollSlider.autoScroll(1, 1000)
});
