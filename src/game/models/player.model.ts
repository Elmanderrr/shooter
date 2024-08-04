export enum PrimarySkill {
  AUTO_GUN = 'AUTO_GUN',
  LASER = 'LASER',
}
export enum SecondarySkill {
  GRENADE = 'GRENADE',
  TELEPORT = 'TELEPORT',
}

export interface SkillsSet {
  primary: PrimarySkill;
  secondary: SecondarySkill;
}
