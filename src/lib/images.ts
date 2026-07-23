// Les images restent embarquées dans l'app ; la base ne stocke qu'une clé.
const MAP: Record<string, any> = {
  imgJuicePineapple: require('../../assets/images/imgJuicePineapple.png'),
  imgJuicePassion: require('../../assets/images/imgJuicePassion.png'),
  imgJuiceMango: require('../../assets/images/imgJuiceMango.png'),
  imgJuiceCherry: require('../../assets/images/imgJuiceCherry.png'),
  imgRiceBag: require('../../assets/images/imgRiceBag.png'),
  imgNoodleCutout: require('../../assets/images/imgNoodleCutout.png'),
  imgNoodleChicken: require('../../assets/images/imgNoodleChicken.png'),
  imgPalletJuice25: require('../../assets/images/imgPalletJuice25.png'),
  imgPalletJuice50: require('../../assets/images/imgPalletJuice50.png'),
  imgPalletJuice100: require('../../assets/images/imgPalletJuice100.png'),
  imgPalletRice: require('../../assets/images/imgPalletRice.png'),
  imgPalletRice100: require('../../assets/images/imgPalletRice100.png'),
};

export function imageFor(key: string | null | undefined): any {
  return (key && MAP[key]) || MAP.imgJuicePassion;
}
