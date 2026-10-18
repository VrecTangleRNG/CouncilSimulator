import { Assets, BitmapFont } from 'pixi.js';

export async function load()
{
	await Assets.load
	([

		// Textures
		{ alias: "title", src: "assets/textures/title.png"},
		{ alias: "checkmark", src: "assets/textures/checkmark.png"},
		{ alias: "line", src: "assets/textures/line.png"},
		{ alias: "taskPoint", src: "assets/textures/taskPoint.png"},

		// Difficulties
		{ alias: "policyHeader", src: "assets/textures/diffSelectHeader.png"},
		{ alias: "easyHeader", src: "assets/textures/ezHeader.png"},
		{ alias: "mediumHeader", src: "assets/textures/medHeader.png"},
		{ alias: "hardHeader", src: "assets/textures/hardHeader.png"},
		{ alias: "wniHeader", src: "assets/textures/wniHeader.png"},

		// Cards
		{ alias: "infrastructureCard", src: "assets/textures/infrastructureCard.png"},
		{ alias: "educationCard", src: "assets/textures/educationCard.png"},
		{ alias: "safetyCard", src: "assets/textures/safetyCard.png"},
		{ alias: "servicesCard", src: "assets/textures/servicesCard.png"},
		{ alias: "environmentCard", src: "assets/textures/environmentCard.png"},
		{ alias: "legislativesCard", src: "assets/textures/legislativesCard.png"},
		{ alias: "financeCard", src: "assets/textures/financeCard.png"},
		{ alias: "socialsCard", src: "assets/textures/socialsCard.png"},

		// UI butttons
		{ alias: "playBtn", src: "assets/textures/playBtn.png"},
		{ alias: "quitBtn", src: "assets/textures/quitBtn.png"},
		{ alias: "smallBackBtn", src: "assets/textures/smallBackBtn.png"},
		{ alias: "smallNextBtn", src: "assets/textures/smallNextBtn.png"},
		{ alias: "smallRandBtn", src: "assets/textures/smallRandBtn.png"},
		{ alias: "policiesBtn", src: "assets/textures/policiesBtn.png"},
		{ alias: "incomeBtn", src: "assets/textures/incomeBtn.png"},
		{ alias: "pauseBtn", src: "assets/textures/pauseBtn.png"},
		{ alias: "allocateBtn", src: "assets/textures/allocateBtn.png"},

		// HUD
		{ alias: "playHUD", src: "assets/textures/playHUD.png"},
		{ alias: "currencyIcon", src: "assets/textures/currencyIcon.png"},
		{ alias: "timeIcon", src: "assets/textures/timeIcon.png"},
		{ alias: "trustPointIcon", src: "assets/textures/trustPointIcon.png"},
		{ alias: "textbox", src: "assets/textures/textbox.png"},
		{ alias: "bar", src: "assets/textures/bar.png"},

		// Panels
		{ alias: "confirmationPanel", src: "assets/textures/confirmationPanel.png"},
		{ alias: "pausePanel", src: "assets/textures/pausePanel.png"},
		{ alias: "settingsPanel", src: "assets/textures/settingsPanel.png"},
		{ alias: "warningPanel", src: "assets/textures/warningPanel.png"},

		// Fonts
		{
			alias: "terminess",
			src: "assets/fonts/TerminessNerdFontMono-Regular.ttf",
			data:
			{
				family: "terminess",
			}
		}
	]);

	// Bitmap fonts
	BitmapFont.install
	({
		name: "terminessBMP",
		style:
		{
			fontFamily: "terminess",
			fontSize: 32,
			fill: 0xffffff,
		}
	});
}

//export class sounds {}
