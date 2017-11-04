/*
**   © Arthur Guiot 2017
**         Glottologist
*/

class Glottologist {
  assign(name, object) {
  	let obj = {}
  	obj[name] = object
  	this.data = Object.assign(this.data, obj)
  }
  async autoGen(name, array) {
  	let obj = {}
  	for (let i of array) {
  		const translated = await this.t(name, i)
  		obj[i] = translated;
  	}
  	this.assign(name, obj)
  }
  constructor() {
  	this.data = {};
  	this.lang = navigator.language || navigator.userLanguage; 
  }
  get(name, lang="auto", obj={}) {
  	let data = {}
  	if(typeof lang == 'object') {
  		data = lang
  		lang = typeof obj == 'string' ? obj : "auto"
  	}
  	const result = lang == "auto" ? this.data[name][new String(this.lang).split("-")[0]] : this.data[name][lang]
  
  	return eval("\`"+ result +"\`")
  }
  import(url) {
  	return new Promise((resolve, reject) => {
  		fetch(url).then(res => {
  			res.json().then(data => {
  				this.data = Object.assign(this.data, data)
  				resolve(data)
  			}).catch(e => {
  				reject(e)
  			})
  		}).catch(e => {
  			reject(e)
  		})
  	})
  }
  render(el, lang="auto") {
  	el = el instanceof NodeList ? el : document.querySelectorAll(str);
  	el.forEach(element => {
  		element.innerHTML = this.get(element.innerHTML, lang)
  	})
  }
  t(phrase, lang="en", source="auto") {
  	return new Promise((resolve, reject) => {
  		const url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl="
  	            + source + "&tl=" + lang + "&dt=t&q=" + encodeURI(phrase);
  		fetch(url).then(res => {
  			res.json().then(data => {
  				resolve(data[0][0][0])
  			}).catch(e => {
  				reject(e)
  			})
  		}).catch(e => {
  			reject(e)
  		})
  	})
  }
}
// Browserify / Node.js
if (typeof define === "function" && define.amd) {
  define(() => new Glottologist());
  // CommonJS and Node.js module support.
} else if (typeof exports !== "undefined") {
  // Support Node.js specific `module.exports` (which can be a function)
  if (typeof module !== "undefined" && module.exports) {
    exports = module.exports = new Glottologist();
  }
  // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
  exports.Glottologist = new Glottologist();
} else if (typeof global !== "undefined") {
  global.Glottologist = new Glottologist();
}