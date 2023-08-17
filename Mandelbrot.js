const canvas = document.getElementById("canvas");
const width = canvas.width;
const height = canvas.height;
const scalingFactor = width/4;
const graphics = canvas.getContext("2d");

const button = document.getElementById("button");
const num = document.getElementById("num");

let translatedX = 0;
let translatedY = 0;

let mouseX = 0;
let mouseY = 0;

let scale = 1;

let imageData = graphics.createImageData(width, height);

canvas.addEventListener("click", (mouse) => {
	mouseX = (mouse.offsetX-width/2)/(width/4);
	mouseY = (mouse.offsetY-height/2)/(height/4);

	translatedX += mouseX/scale;
	translatedY += mouseY/scale;

	scale *= 2;

	mandelbrotDraw(num.value);
});

function hslToRgb(h, s, l) {
  let r, g, b;

  	if (s === 0) {
    	r = g = b = l;
  	} else {
    	let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    	let p = 2 * l - q;

    	r = Math.round(255 * (q < 1 ? q * q * 6 : (q - 1) * (q - 1) * 6 + 1));
    	g = Math.round(255 * (p < 1 ? p * p * 6 : (p - 1) * (p - 1) * 6 + 1));
    	b = Math.round(255 * (q < 1 ? (1 - q) * q * 6 : (1 - q) * (1 - q) * 6 + 1));
  	}

  	return [r, g, b];
}

const mandelbrotDraw = (iterations) => {
	graphics.clearRect(0, 0, width, height);
	//multiply by 4 in order to get the scaling right
	for (let i = 0; i <= width; i++) {
		for (let j = 0; j <= height; j++) {
			const re = ((i-width/2)/scalingFactor)/scale + translatedX;
			const im = ((j-height/2)/scalingFactor)/scale + translatedY;

			let x = 0;
			let y = 0;
			let x2 = 0;
			let y2 = 0;
			let k = 0;

			while (x2 + y2 <= 4 && k < iterations) {
			    y = 2 * x * y + im;
			    x = x2 - y2 + re;
			    x2 = x * x;
			    y2 = y * y
			    k++;
			}

			if (k < iterations) {
				let index = (i + j * imageData.width) * 4;

				let rgb = hslToRgb((k/iterations*360)**1.5%360, 50, k/iterations*100);
				
				imageData.data[index] = rgb[2];
				imageData.data[index+1] = rgb[0];
				imageData.data[index+2] = rgb[1];
				imageData.data[index+3] = k;
			} else {
				let index = (i + j * imageData.width) * 4;

				imageData.data[index] = 255;
				imageData.data[index+1] = 255;
				imageData.data[index+2] = 255;
				imageData.data[index+3] = 255;
			}
		}
	}

	graphics.putImageData(imageData, 0, 0);
}

mandelbrotDraw(num.value);