import type { Recipe } from "../../shared/content.ts";
import { recipe as arrozConPolloBeans } from "./arroz_con_pollo_beans.ts";
import { recipe as atsuageGingerSaute } from "./atsuage_ginger_saute.ts";
import { recipe as beefBeanChili } from "./beef_bean_chili.ts";
import { recipe as beefBroccoliMicrowave } from "./beef_broccoli_microwave.ts";
import { recipe as beefBulgogi } from "./beef_bulgogi.ts";
import { recipe as beefKabochaSimmer } from "./beef_kabocha_simmer.ts";
import { recipe as beefKomatsunaUdon } from "./beef_komatsuna_udon.ts";
import { recipe as beefLemonSauteSalad } from "./beef_lemon_saute_salad.ts";
import { recipe as beefMeatballsTomato } from "./beef_meatballs_tomato.ts";
import { recipe as beefMinceBibimbap } from "./beef_mince_bibimbap.ts";
import { recipe as beefPepperStirFry } from "./beef_pepper_stir_fry.ts";
import { recipe as beefPhoRiceNoodles } from "./beef_pho_rice_noodles.ts";
import { recipe as beefPotatoTomatoStew } from "./beef_potato_tomato_stew.ts";
import { recipe as beefShabuLemonSoy } from "./beef_shabu_lemon_soy.ts";
import { recipe as beefShimejiBowl } from "./beef_shimeji_bowl.ts";
import { recipe as beefSteakPotatoes } from "./beef_steak_potatoes.ts";
import { recipe as boiledChickenNegiSalt } from "./boiled_chicken_negi_salt.ts";
import { recipe as boiledEggPotatoSalad } from "./boiled_egg_potato_salad.ts";
import { recipe as chickenBreastSoupCurry } from "./chicken_breast_soup_curry.ts";
import { recipe as chickenBreastTomatoSimmer } from "./chicken_breast_tomato_simmer.ts";
import { recipe as chickenBroccoliStirFry } from "./chicken_broccoli_stir_fry.ts";
import { recipe as chickenChickpeaLemonStew } from "./chicken_chickpea_lemon_stew.ts";
import { recipe as chickenCoconutCurry } from "./chicken_coconut_curry.ts";
import { recipe as chickenLemonHerbGrill } from "./chicken_lemon_herb_grill.ts";
import { recipe as chickenMapoTofu } from "./chicken_mapo_tofu.ts";
import { recipe as chickenOyakodon } from "./chicken_oyakodon.ts";
import { recipe as chickenSteamedChinese } from "./chicken_steamed_chinese.ts";
import { recipe as chickenThighKaraage } from "./chicken_thigh_karaage.ts";
import { recipe as chickenThighTeriyaki } from "./chicken_thigh_teriyaki.ts";
import { recipe as codHerbCrust } from "./cod_herb_crust.ts";
import { recipe as codVegetableHotPot } from "./cod_vegetable_hot_pot.ts";
import { recipe as edamameTofuFriedRice } from "./edamame_tofu_fried_rice.ts";
import { recipe as eggDropChineseNoodles } from "./egg_drop_chinese_noodles.ts";
import { recipe as eggTomatoStirFry } from "./egg_tomato_stir_fry.ts";
import { recipe as eggWhiteBeansRanchero } from "./egg_white_beans_ranchero.ts";
import { recipe as eggsTomatoPepperBake } from "./eggs_tomato_pepper_bake.ts";
import { recipe as horseMackerelSaltGrill } from "./horse_mackerel_salt_grill.ts";
import { recipe as koyaTofuSimmerRice } from "./koya_tofu_simmer_rice.ts";
import { recipe as mackerelCanTomatoSalad } from "./mackerel_can_tomato_salad.ts";
import { recipe as mackerelSaltGrillDaikon } from "./mackerel_salt_grill_daikon.ts";
import { recipe as nattoColdSoba } from "./natto_cold_soba.ts";
import { recipe as nattoEggWhiteOmelette } from "./natto_egg_white_omelette.ts";
import { recipe as nattoTofuRiceBowl } from "./natto_tofu_rice_bowl.ts";
import { recipe as piperradaEggWhites } from "./piperrada_egg_whites.ts";
import { recipe as poachedEggSpinachToast } from "./poached_egg_spinach_toast.ts";
import { recipe as porkFilletAvocadoSalsa } from "./pork_fillet_avocado_salsa.ts";
import { recipe as porkFilletCurryRice } from "./pork_fillet_curry_rice.ts";
import { recipe as porkFilletMustardSaute } from "./pork_fillet_mustard_saute.ts";
import { recipe as porkFilletPaprikaGrill } from "./pork_fillet_paprika_grill.ts";
import { recipe as porkFilletSweetPotato } from "./pork_fillet_sweet_potato.ts";
import { recipe as porkFilletTomatoZucchini } from "./pork_fillet_tomato_zucchini.ts";
import { recipe as porkFilletTonkatsu } from "./pork_fillet_tonkatsu.ts";
import { recipe as porkLarb } from "./pork_larb.ts";
import { recipe as porkLegSproutGarlic } from "./pork_leg_sprout_garlic.ts";
import { recipe as porkLegTonjiruRice } from "./pork_leg_tonjiru_rice.ts";
import { recipe as porkLegVegetablesMicrowave } from "./pork_leg_vegetables_microwave.ts";
import { recipe as porkLoinGinger } from "./pork_loin_ginger.ts";
import { recipe as porkShabuSalad } from "./pork_shabu_salad.ts";
import { recipe as saladChickenMicrowave } from "./salad_chicken_microwave.ts";
import { recipe as salmonCabbageMicrowave } from "./salmon_cabbage_microwave.ts";
import { recipe as salmonMisoGrill } from "./salmon_miso_grill.ts";
import { recipe as salmonTempura } from "./salmon_tempura.ts";
import { recipe as salmonTomatoPasta } from "./salmon_tomato_pasta.ts";
import { recipe as salmonYogurtCucumber } from "./salmon_yogurt_cucumber.ts";
import { recipe as sasamiLemonSalad } from "./sasami_lemon_salad.ts";
import { recipe as shrimpChawanmushiRice } from "./shrimp_chawanmushi_rice.ts";
import { recipe as shrimpCornLimeRice } from "./shrimp_corn_lime_rice.ts";
import { recipe as shrimpEggWhiteStirFry } from "./shrimp_egg_white_stir_fry.ts";
import { recipe as shrimpGarlicBroccoli } from "./shrimp_garlic_broccoli.ts";
import { recipe as softEggOatmealBowl } from "./soft_egg_oatmeal_bowl.ts";
import { recipe as soyMilkUdonTofu } from "./soy_milk_udon_tofu.ts";
import { recipe as squidRedPepperStirFry } from "./squid_red_pepper_stir_fry.ts";
import { recipe as sundubuTofuSoup } from "./sundubu_tofu_soup.ts";
import { recipe as swordfishLemonHerb } from "./swordfish_lemon_herb.ts";
import { recipe as swordfishTeriyaki } from "./swordfish_teriyaki.ts";
import { recipe as tacoRicePork } from "./taco_rice_pork.ts";
import { recipe as tofuEdamameDryCurry } from "./tofu_edamame_dry_curry.ts";
import { recipe as tofuEggChampuru } from "./tofu_egg_champuru.ts";
import { recipe as tofuGarlicChiveStirFry } from "./tofu_garlic_chive_stir_fry.ts";
import { recipe as tofuKomatsunaAnkakeBowl } from "./tofu_komatsuna_ankake_bowl.ts";
import { recipe as tofuSasamiSteamed } from "./tofu_sasami_steamed.ts";
import { recipe as tofuSteakMushroomSauce } from "./tofu_steak_mushroom_sauce.ts";
import { recipe as tortillaEspanola } from "./tortilla_espanola.ts";
import { recipe as tunaChickpeaSalad } from "./tuna_chickpea_salad.ts";
import { recipe as tunaTofuBowl } from "./tuna_tofu_bowl.ts";
import { recipe as vegetableOmeletteBread } from "./vegetable_omelette_bread.ts";/** The 20 Phase 0 validation recipes (docs/IMPLEMENTATION_PLAN.md "Phase 0", item 4). */
export const validationRecipes: readonly Recipe[] = [
  chickenLemonHerbGrill,
  boiledChickenNegiSalt,
  chickenBroccoliStirFry,
  chickenThighTeriyaki,
  chickenThighKaraage,
  porkFilletMustardSaute,
  porkFilletTonkatsu,
  porkShabuSalad,
  porkLoinGinger,
  beefSteakPotatoes,
  beefShimejiBowl,
  salmonCabbageMicrowave,
  salmonTomatoPasta,
  salmonTempura,
  codHerbCrust,
  tunaTofuBowl,
  tofuEggChampuru,
  chickenMapoTofu,
  tortillaEspanola,
  poachedEggSpinachToast,
];

/** The library: the validation recipes, then the Phase 5 batches (docs/DECISIONS.md "Stage 5.1 release plan" P2). */
export const recipes: readonly Recipe[] = [
  ...validationRecipes,
  nattoTofuRiceBowl,
  atsuageGingerSaute,
  tofuSteakMushroomSauce,
  soyMilkUdonTofu,
  edamameTofuFriedRice,
  softEggOatmealBowl,
  eggTomatoStirFry,
  eggsTomatoPepperBake,
  eggDropChineseNoodles,
  beefMinceBibimbap,
  beefPepperStirFry,
  beefMeatballsTomato,
  beefLemonSauteSalad,
  beefShabuLemonSoy,
  beefBroccoliMicrowave,
  beefPotatoTomatoStew,
  beefKomatsunaUdon,
  porkLegSproutGarlic,
  porkFilletTomatoZucchini,
  porkLegVegetablesMicrowave,
  porkFilletCurryRice,
  swordfishLemonHerb,
  shrimpGarlicBroccoli,
  squidRedPepperStirFry,
  tofuKomatsunaAnkakeBowl,
  tofuEdamameDryCurry,
  sasamiLemonSalad,
  chickenBreastTomatoSimmer,
  chickenOyakodon,
  chickenBreastSoupCurry,
  porkLegTonjiruRice,
  porkFilletPaprikaGrill,
  mackerelCanTomatoSalad,
  horseMackerelSaltGrill,
  codVegetableHotPot,
  boiledEggPotatoSalad,
  shrimpChawanmushiRice,
  vegetableOmeletteBread,
  nattoColdSoba,
  koyaTofuSimmerRice,
  arrozConPolloBeans,
  beefBeanChili,
  porkFilletAvocadoSalsa,
  shrimpCornLimeRice,
  eggWhiteBeansRanchero,
  tacoRicePork,
  chickenChickpeaLemonStew,
  salmonYogurtCucumber,
  tunaChickpeaSalad,
  chickenCoconutCurry,
  porkLarb,
  beefPhoRiceNoodles,
  tofuGarlicChiveStirFry,
  mackerelSaltGrillDaikon,
  swordfishTeriyaki,
  chickenSteamedChinese,
  tofuSasamiSteamed,
  beefBulgogi,
  sundubuTofuSoup,
  piperradaEggWhites,
  nattoEggWhiteOmelette,
  salmonMisoGrill,
  saladChickenMicrowave,
  beefKabochaSimmer,
  porkFilletSweetPotato,
  shrimpEggWhiteStirFry,
];
