import type { Recipe } from "../../shared/content.ts";
import { recipe as beefShimejiBowl } from "./beef_shimeji_bowl.ts";
import { recipe as beefSteakPotatoes } from "./beef_steak_potatoes.ts";
import { recipe as boiledChickenNegiSalt } from "./boiled_chicken_negi_salt.ts";
import { recipe as chickenBroccoliStirFry } from "./chicken_broccoli_stir_fry.ts";
import { recipe as chickenLemonHerbGrill } from "./chicken_lemon_herb_grill.ts";
import { recipe as chickenMapoTofu } from "./chicken_mapo_tofu.ts";
import { recipe as chickenThighKaraage } from "./chicken_thigh_karaage.ts";
import { recipe as chickenThighTeriyaki } from "./chicken_thigh_teriyaki.ts";
import { recipe as codHerbCrust } from "./cod_herb_crust.ts";
import { recipe as poachedEggSpinachToast } from "./poached_egg_spinach_toast.ts";
import { recipe as porkFilletMustardSaute } from "./pork_fillet_mustard_saute.ts";
import { recipe as porkFilletTonkatsu } from "./pork_fillet_tonkatsu.ts";
import { recipe as porkLoinGinger } from "./pork_loin_ginger.ts";
import { recipe as porkShabuSalad } from "./pork_shabu_salad.ts";
import { recipe as salmonCabbageMicrowave } from "./salmon_cabbage_microwave.ts";
import { recipe as salmonTempura } from "./salmon_tempura.ts";
import { recipe as salmonTomatoPasta } from "./salmon_tomato_pasta.ts";
import { recipe as tofuEggChampuru } from "./tofu_egg_champuru.ts";
import { recipe as tortillaEspanola } from "./tortilla_espanola.ts";
import { recipe as tunaTofuBowl } from "./tuna_tofu_bowl.ts";

/** Validation recipes for Phase 0 (docs/IMPLEMENTATION_PLAN.md "Phase 0", item 4). */
export const recipes: readonly Recipe[] = [
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
