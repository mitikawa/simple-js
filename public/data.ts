interface IWrestler {
  id: number;
  name: string;
  sumoKyoukaiId: string;
  birth: string;
  heya: string;
  side?: string;
  rank?: string;
  position?: number;
}

const sumoWrestlers: IWrestler[] = [
  { id: 1, name: "Terunofuji", sumoKyoukaiId: "3321", birth: "Mongolia", heya: "Isegahama" },
  { id: 2, name: "Takakeisho", sumoKyoukaiId: "3582", birth: "Hyogo", heya: "Tokiwayama" },
  { id: 3, name: "Kirishima", sumoKyoukaiId: "3622", birth: "Mongolia", heya: "Michinoku" },
  { id: 4, name: "Hoshoryu", sumoKyoukaiId: "3842", birth: "Mongolia", heya: "Tatsunami" },
  { id: 5, name: "Daieisho", sumoKyoukaiId: "3376", birth: "Saitama", heya: "Oitekaze" },
  { id: 6, name: "Wakamotoharu", sumoKyoukaiId: "3371", birth: "Fukushima", heya: "Arashio" },
  { id: 7, name: "Kotonowaka", sumoKyoukaiId: "3661", birth: "Chiba", heya: "Sadogatake" },
  { id: 8, name: "Abi", sumoKyoukaiId: "3485", birth: "Saitama", heya: "Shikoroyama" },
  { id: 9, name: "Hokutofuji", sumoKyoukaiId: "3630", birth: "Saitama", heya: "Hakkaku" },
  { id: 10, name: "Asanoyama", sumoKyoukaiId: "3682", birth: "Toyama", heya: "Takasago" },
  { id: 11, name: "Ura", sumoKyoukaiId: "3616", birth: "Osaka", heya: "Kise" },
  { id: 12, name: "Shodai", sumoKyoukaiId: "3521", birth: "Kumamoto", heya: "Tokitsukaze" },
  { id: 13, name: "Meisei", sumoKyoukaiId: "3337", birth: "Kagoshima", heya: "Tatsunami" },
  { id: 14, name: "Takayasu", sumoKyoukaiId: "2775", birth: "Ibaraki", heya: "Tagonoura" },
  { id: 15, name: "Tobizaru", sumoKyoukaiId: "3594", birth: "Tokyo", heya: "Oitekaze" },
  { id: 16, name: "Gonoyama", sumoKyoukaiId: "4079", birth: "Osaka", heya: "Takekuma" },
  { id: 17, name: "Nishikigi", sumoKyoukaiId: "2892", birth: "Iwate", heya: "Isenoumi" },
  { id: 18, name: "Onosho", sumoKyoukaiId: "3434", birth: "Aomori", heya: "Onomatsu" },
  { id: 19, name: "Midorifuji", sumoKyoukaiId: "3743", birth: "Shizuoka", heya: "Isegahama" },
  { id: 20, name: "Shonannoumi", sumoKyoukaiId: "3553", birth: "Kanagawa", heya: "Takadagawa" },
  { id: 21, name: "Takanosho", sumoKyoukaiId: "3265", birth: "Chiba", heya: "Tokiwayama" },
  { id: 22, name: "Hokuseiho", sumoKyoukaiId: "4037", birth: "Hokkaido", heya: "Miyagino" },
  { id: 23, name: "Kinbozan", sumoKyoukaiId: "4112", birth: "Kazakhstan", heya: "Kise" },
  { id: 24, name: "Endo", sumoKyoukaiId: "3464", birth: "Ishikawa", heya: "Oitekaze" },
  { id: 25, name: "Atamifuji", sumoKyoukaiId: "4055", birth: "Shizuoka", heya: "Isegahama" },
  { id: 26, name: "Myogiryu", sumoKyoukaiId: "3206", birth: "Hyogo", heya: "Sakaigawa" },
  { id: 27, name: "Mitakeumi", sumoKyoukaiId: "3620", birth: "Nagano", heya: "Dewanoumi" },
  { id: 28, name: "Ryuden", sumoKyoukaiId: "2890", birth: "Yamanashi", heya: "Takadagawa" },
  { id: 29, name: "Kotoeko", sumoKyoukaiId: "3012", birth: "Miyazaki", heya: "Sadogatake" },
  { id: 30, name: "Sadanoumi", sumoKyoukaiId: "2565", birth: "Kumamoto", heya: "Sakaigawa" },
  { id: 31, name: "Hiradoumi", sumoKyoukaiId: "3705", birth: "Nagasaki", heya: "Sakaigawa" },
  { id: 32, name: "Oho", sumoKyoukaiId: "3844", birth: "Tokyo", heya: "Otake" },
  { id: 33, name: "Tamawashi", sumoKyoukaiId: "2629", birth: "Mongolia", heya: "Kataonami" },
  { id: 34, name: "Takarafuji", sumoKyoukaiId: "3150", birth: "Aomori", heya: "Isegahama" },
  { id: 35, name: "Tsurugisho", sumoKyoukaiId: "3504", birth: "Tokyo", heya: "Oitekaze" },
  { id: 36, name: "Tomokaze", sumoKyoukaiId: "3818", birth: "Kanagawa", heya: "Nishonoseki" },
  { id: 37, name: "Ichiyamamoto", sumoKyoukaiId: "3753", birth: "Hokkaido", heya: "Hanaregoma" },
  { id: 38, name: "Tohakuryu", sumoKyoukaiId: "3969", birth: "Tokyo", heya: "Tamanoi" },
  { id: 39, name: "Churanoumi", sumoKyoukaiId: "3711", birth: "Okinawa", heya: "Kise" },
  { id: 40, name: "Roga", sumoKyoukaiId: "3907", birth: "Russia", heya: "Futagoyama" },
  { id: 41, name: "Nishikifuji", sumoKyoukaiId: "3742", birth: "Aomori", heya: "Isegahama" },
  { id: 42, name: "Kitanowaka", sumoKyoukaiId: "3939", birth: "Yamagata", heya: "Hakkaku" },
  { id: 43, name: "Aoiyama", sumoKyoukaiId: "3208", birth: "Bulgaria", heya: "Kasugano" },
  { id: 44, name: "Kotoshoho", sumoKyoukaiId: "3840", birth: "Chiba", heya: "Sadogatake" },
  { id: 45, name: "Bushozan", sumoKyoukaiId: "3508", birth: "Ibaraki", heya: "Fujishima" },
  { id: 46, name: "Shimazuumi", sumoKyoukaiId: "3404", birth: "Kagoshima", heya: "Hanaregoma" },
  { id: 47, name: "Kagayaki", sumoKyoukaiId: "3255", birth: "Ishikawa", heya: "Takadagawa" },
  { id: 48, name: "Oshoma", sumoKyoukaiId: "4108", birth: "Mongolia", heya: "Naruto" },
  { id: 49, name: "Daiamami", sumoKyoukaiId: "3665", birth: "Kagoshima", heya: "Oitekaze" },
  { id: 50, name: "Mitoryu", sumoKyoukaiId: "3797", birth: "Mongolia", heya: "Nishikido" },
  { id: 51, name: "Onosato", sumoKyoukaiId: "4227", birth: "Ishikawa", heya: "Nishonoseki" },
  { id: 52, name: "Shishi", sumoKyoukaiId: "3990", birth: "Ukraine", heya: "Ikazuchi" },
  { id: 53, name: "Chiyoshoma", sumoKyoukaiId: "3207", birth: "Mongolia", heya: "Kokonoe" },
  { id: 54, name: "Hakuoho", sumoKyoukaiId: "4187", birth: "Tottori", heya: "Miyagino" },
  { id: 55, name: "Daishoho", sumoKyoukaiId: "3431", birth: "Mongolia", heya: "Oitekaze" },
  { id: 56, name: "Tamashoho", sumoKyoukaiId: "3367", birth: "Mongolia", heya: "Kataonami" },
  { id: 57, name: "Chiyomaru", sumoKyoukaiId: "3040", birth: "Kagoshima", heya: "Kokonoe" },
  { id: 58, name: "Tokihayate", sumoKyoukaiId: "3933", birth: "Miyagi", heya: "Tokitsukaze" },
  { id: 59, name: "Takahashi", sumoKyoukaiId: "4164", birth: "Fukushima", heya: "Nishonoseki" },
  { id: 60, name: "Takakento", sumoKyoukaiId: "3505", birth: "Kumamoto", heya: "Tokiwayama" },
  { id: 61, name: "Akua", sumoKyoukaiId: "3312", birth: "Ibaraki", heya: "Tatsunami" },
  { id: 62, name: "Tenshoho", sumoKyoukaiId: "4100", birth: "Mie", heya: "Miyagino" },
  { id: 63, name: "Hitoshi", sumoKyoukaiId: "4095", birth: "Tokyo", heya: "Oitekaze" },
  { id: 64, name: "Hidenoumi", sumoKyoukaiId: "3417", birth: "Tokyo", heya: "Kise" },
  { id: 65, name: "Shimanoumi", sumoKyoukaiId: "3415", birth: "Mie", heya: "Kise" },
  { id: 66, name: "Shiden", sumoKyoukaiId: "3532", birth: "Tokyo", heya: "Kise" },
  { id: 67, name: "Yuma", sumoKyoukaiId: "3556", birth: "Osaka", heya: "Onomatsu" },
  { id: 68, name: "Asakoryu", sumoKyoukaiId: "4101", birth: "Osaka", heya: "Takasago" },
  { id: 69, name: "Chiyosakae", sumoKyoukaiId: "3158", birth: "Kyoto", heya: "Kokonoe" },
  { id: 70, name: "Azumaryu", sumoKyoukaiId: "3144", birth: "Mongolia", heya: "Tamanoi" },
];

const sumoRanks = ['Yokozuna', 'Ozeki', 'Sekiwake', 'Komusubi', 'Maegashira'];

export { sumoWrestlers, sumoRanks, IWrestler }; 