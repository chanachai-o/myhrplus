import { Prefix } from './prefix.model';
import { Fundtable } from './fund.model';

/**
 * Tax model
 */
export interface Tax {
  idtax: string;
  statmarry: string;
  marryregister: string;
  prefix_spouse: Prefix;
  fname_spouse: string;
  lname_spouse: string;
  idspousetax: string;
  idspouse: string;
  inc_spouse: string;
  id_people_spouse: string;
  child_domestic: string;
  child_abroad: string;
  child: string;
  insurance: string;
  insurance_spouse: string;
  interest: string;
  gbk: string;
  rmf: string;
  ssf: string;
  ltf: string;
  hospitalDonation: string;
  politicalDonation: string;
  iscripple: string;
  is_cripple: string;
  donation: string;
  edudonation: string;
  sportdonation: string;
  fthyn: string;
  fthidcard: string;
  ins_fat: string;
  mthyn: string;
  mthidcard: string;
  ins_mot: string;
  fthmryyn: string;
  fthmryidcard: string;
  ins_fat_spouse: string;
  mthmryyn: string;
  mthmryidcard: string;
  ins_mot_spouse: string;
  calpvf: string;
  fundtablem: Fundtable;
  fundtablec: Fundtable;
  child1_edu: string;
  child2_edu: string;
  child3_edu: string;
  child1_idpeople: string;
  child2_idpeople: string;
  child3_idpeople: string;
  travel_in_country: string;
  totalCripple: string;
  crippleAllowance: string;
  childbirth: string;
  otop: string;
  buyEducationSport: string;
  bookEbook: string;
  savings: string;
  healthInsurance: string;
  buyCctv: string;
  debitCardFee: string;
  investStartup: string;
  songkranFestival: string;
  buyRubber: string;
  buyEbook: string;
  buyInCountry: string;
  homeRepair2: string;
  carRepair2: string;
  ssfSpecial: string;
}

