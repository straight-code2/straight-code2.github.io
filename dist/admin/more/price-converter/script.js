let App = {
	apiKey: "6ca45cfe9c7f953695418d03311adf10060032e0cea8cf7ff8647bcf67e89f04", //Free Account Api Key
	selectElement: document.getElementById("cryptoList"),
	myMoney: document.getElementById("myMoney"),
	showMoney: document.getElementById("showMoney"),
	cryptoPrice: document.getElementById("cryptoPrice"),
	exchangeResult: document.getElementById("exchangeResult"),
	moneyValue: null,
	setUi: function () {
		let options = {
			currencySymbol: "$",
			decimalCharacter: ",",
			digitGroupSeparator: "."
		};
		this.moneyValue = new AutoNumeric(App.myMoney, options);

		fetch(
			"https://min-api.cryptocompare.com/data/blockchain/list?api_key=" +
				this.apiKey
		)
			.then((response) => response.json())
			.then((data) => {
				for (let crypto of Object.keys(data.Data)) {
					var symbol = data.Data[crypto].symbol;
					let option = document.createElement("option");
					option.innerHTML = symbol.replace("0X", "");
					option.value = symbol.replace("0X", "");
					App.selectElement.appendChild(option);
				}
			})
			.catch(console.error);
	},
	showLoading: function (status) {
		let app = document.getElementsByClassName("app");
		return status == true
			? app[0].classList.add("loading")
			: app[0].classList.remove("loading");
	},
	getCoinDetail: function (callback) {
		let uri =
			"https://min-api.cryptocompare.com/data/all/coinlist?fsym=" +
			this.selectElement.value +
			"&api_key=" +
			this.apiKey;
		fetch(uri)
			.then((response) => response.json())
			.then((data) => {
				for (let crypto of Object.keys(data.Data)) {
					let icon = document.getElementById("cryptoIcon");
					icon.src = "https://cryptocompare.com/" + data.Data[crypto].ImageUrl;
				}
			});
		return callback();
	},
	updateMath: function () {
		let selected = App.selectElement.value;
		if (selected != 0) {
			App.showLoading(true);
			let icon = document.getElementById("cryptoIcon");
			icon.src = "https://media2.giphy.com/media/3oEjI6SIIHBdRxXI40/200w.gif";
			let uri =
					"https://min-api.cryptocompare.com/data/price?fsym=_XXXXX_&tsyms=USD&api_key=" +
					this.apiKey,
				newUri = uri.replace("_XXXXX_", selected);
			fetch(newUri)
				.then((response) => response.json())
				.then((data) => {
					let result = App.moneyValue.rawValue / data["USD"];
					App.cryptoPrice.innerHTML = "$" + data["USD"];
					App.showMoney.innerHTML = App.moneyValue.getFormatted();
					App.exchangeResult.innerHTML = selected + " " + result.toFixed(4);
					App.getCoinDetail(function () {
						App.showLoading(false);
					});
				});
		}
	},
	setEvt: function () {
		this.selectElement.addEventListener("change", this.updateMath);
		this.myMoney.addEventListener("change", this.updateMath);
	},
	init: function () {
		this.setUi();
		this.setEvt();
	}
};
/**/
App.init();